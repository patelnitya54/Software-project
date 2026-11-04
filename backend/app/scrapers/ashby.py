"""
JobPath Backend — Ashby Scraper.

Scrapes jobs from Ashby HQ public posting API.
Refactored from the original ashbyboardapi.py.
"""

from __future__ import annotations

import asyncio
import logging
import random
from datetime import datetime, timezone
from typing import Any

import httpx

from ..config import settings
from .base import (
    HTTP_HEADERS,
    CircuitBreaker,
    FetchResult,
    US_STATES,
    STATE_CODES,
    clean_html_text,
    extract_experience,
    extract_salary,
    extract_work_mode,
    fetch_json_with_retry,
    generate_dedupe_key,
    load_companies_from_file,
    normalize_company_name,
    post_time_to_delta,
    save_json_records,
)

log = logging.getLogger(__name__)

_breaker = CircuitBreaker()


def _split_csv(value: str) -> list[str]:
    return [item.strip().lower() for item in value.split(",") if item.strip()] if value else []


def _build_filters(job_profile: str, location: str) -> dict[str, Any]:
    return {
        "profiles": _split_csv(job_profile),
        "location": location.lower().strip() if location else "",
        "max_age": post_time_to_delta(settings.post_time),
    }


def _matches_filters(job: dict[str, Any], filters: dict[str, Any], now_utc: datetime) -> bool:
    title = (job.get("title") or "").strip()
    if not title:
        return False

    job_location = (job.get("location") or "").strip()
    desc_plain = job.get("descriptionPlain") or ""
    desc_html = job.get("descriptionHtml") or ""
    desc_text = desc_plain or clean_html_text(desc_html)

    profiles = filters["profiles"]
    if profiles and not any(p in title.lower() for p in profiles):
        return False

    loc_filter = filters["location"]
    if loc_filter and loc_filter in {"usa", "united states", "us"}:
        loc_lower = job_location.lower()
        if not (
            any(st in loc_lower for st in US_STATES)
            or any(f" {code} " in f" {loc_lower} " for code in STATE_CODES)
            or any(term in loc_lower for term in {"remote", "anywhere", "americas", "north america"})
        ):
            return False

    max_age = filters["max_age"]
    published_at = job.get("publishedAt")
    if max_age and published_at:
        try:
            published = datetime.fromisoformat(published_at.replace("Z", "+00:00"))
            if now_utc - published > max_age:
                return False
        except ValueError:
            pass

    return True


def _normalize_job(job: dict[str, Any], company_slug: str) -> dict[str, Any]:
    title = (job.get("title") or "").strip()
    location = (job.get("location") or "").strip()
    desc_text = clean_html_text(job.get("descriptionHtml", "")) or (job.get("descriptionPlain") or "")
    comp = job.get("compensation") or {}
    job_id = str(job.get("id") or title)

    return {
        "dedupe_key": generate_dedupe_key("ashby", company_slug, job_id),
        "job_id": generate_dedupe_key("ashby", company_slug, job_id),
        "ats": "ashby",
        "source": "ashby",
        "company_slug": company_slug,
        "company": normalize_company_name(company_slug),
        "job_title": title,
        "location": [location] if location else ["Remote"],
        "job_url": job.get("jobUrl") or "",
        "apply_url": job.get("applyUrl") or "",
        "application_url": job.get("applyUrl") or job.get("jobUrl") or "",
        "description": desc_text[:5000],
        "salary": extract_salary(desc_text, comp),
        "salary_display": extract_salary(desc_text, comp) or "Competitive",
        "experience": extract_experience(desc_text),
        "work_mode": extract_work_mode(title, location, desc_text),
        "employment_type": (job.get("employmentType") or "Full-time"),
        "industry": (job.get("department") or "Technology"),
        "company_logo_text": normalize_company_name(company_slug)[:2].lower(),
        "company_logo_bg": "#4F46E5",
        "published_at": job.get("publishedAt"),
        "post_age_days": 1,
        "posted_date": "1 d ago",
        "required_skills": [],
        "preferred_skills": [],
        "experience_min": 2,
        "experience_max": None,
        "company_size": "Medium: 201-500 employees",
        "work_authorization": "Valid work authorization",
        "sponsorship_available": True,
        "timezone": ["North America", "Any timezone"],
        "relocation_required": False,
        "night_shift": False,
        "salary_min": None,
        "salary_max": None,
        "currency": "USD",
    }


class AshbyScraper:
    """Scrapes jobs from Ashby HQ public posting API."""

    def __init__(self, companies: list[str] | None = None):
        if companies is None:
            companies = load_companies_from_file(str(settings.ashby_companies_path))
        self.companies = companies

    async def _fetch_company(
        self,
        client: httpx.AsyncClient,
        company: str,
        filters: dict[str, Any],
    ) -> FetchResult:
        url = f"https://api.ashbyhq.com/posting-api/job-board/{company}?includeCompensation=true"
        now_utc = datetime.now(timezone.utc)

        try:
            data = await fetch_json_with_retry(
                client, url, _breaker,
                retries=settings.retry_count,
                timeout=settings.ashby_timeout,
            )
            if not data:
                return FetchResult(company)

            jobs = []
            for job in data.get("jobs", []):
                if _matches_filters(job, filters, now_utc):
                    jobs.append(_normalize_job(job, company))

            log.info("Ashby %s: %d jobs", company, len(jobs))
            return FetchResult(company, jobs)
        except Exception as exc:
            log.exception("Failed %s: %s", company, exc)
            return FetchResult(company)

    async def scrape(
        self,
        job_profile: str = "",
        location: str = "",
        max_jobs: int = 99999,
    ) -> list[dict[str, Any]]:
        """Scrape all Ashby companies and return deduplicated job list."""
        filters = _build_filters(job_profile, location or settings.scrape_country)
        semaphore = asyncio.Semaphore(settings.max_concurrent_jobs)

        async def bounded(client: httpx.AsyncClient, company: str):
            async with semaphore:
                result = await self._fetch_company(client, company, filters)
                await asyncio.sleep(random.uniform(0.1, 0.3))
                return result

        async with httpx.AsyncClient(
            limits=httpx.Limits(max_connections=100, max_keepalive_connections=20),
            headers=HTTP_HEADERS,
            follow_redirects=True,
        ) as client:
            tasks = [bounded(client, c) for c in self.companies]
            results = await asyncio.gather(*tasks, return_exceptions=True)

        all_jobs: list[dict[str, Any]] = []
        seen: set[str] = set()
        for result in results:
            if isinstance(result, Exception):
                continue
            for job in result.jobs:
                url = job.get("job_url", "")
                if url and url in seen:
                    continue
                if url:
                    seen.add(url)
                all_jobs.append(job)

        all_jobs.sort(key=lambda x: str(x.get("published_at") or ""), reverse=True)
        return all_jobs[:max_jobs] if max_jobs > 0 else all_jobs

    async def scrape_and_save(self, output_path: str | None = None) -> int:
        """Scrape and save to JSON file."""
        jobs = await self.scrape()
        path = output_path or str(settings.data_path / "ashby.json")
        return save_json_records(path, jobs, ("dedupe_key", "job_id"))

