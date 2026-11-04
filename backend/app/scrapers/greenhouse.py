"""
JobPath Backend — Greenhouse Scraper.

Scrapes jobs from Greenhouse Boards API.
Refactored from the original greenhouseapi.py.
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
    clean_html_text,
    extract_salary,
    extract_work_mode,
    fetch_json_with_retry,
    generate_dedupe_key,
    load_companies_from_file,
    normalize_company_name,
    save_json_records,
)

log = logging.getLogger(__name__)

_breaker = CircuitBreaker()


def _normalize_job(job: dict[str, Any], company_slug: str) -> dict[str, Any]:
    """Normalize a raw Greenhouse API job into our canonical schema."""
    title = (job.get("title") or "").strip()
    loc_obj = job.get("location") or {}
    location = (loc_obj.get("name") or "").strip() if isinstance(loc_obj, dict) else str(loc_obj).strip()
    desc_html = job.get("content") or ""
    desc_text = clean_html_text(desc_html)
    gh_id = str(job.get("id", ""))

    apply_url = f"https://boards.greenhouse.io/{company_slug}/jobs/{gh_id}"
    if job.get("absolute_url"):
        apply_url = job["absolute_url"]

    salary = extract_salary(desc_text)
    work_mode = extract_work_mode(title, location, desc_text)

    return {
        "job_id": generate_dedupe_key("greenhouse", company_slug, gh_id),
        "ats": "greenhouse",
        "source": "greenhouse",
        "company_slug": company_slug,
        "company": normalize_company_name(company_slug),
        "job_title": title,
        "location": [location] if location else ["Remote"],
        "job_url": apply_url,
        "apply_url": apply_url,
        "application_url": apply_url,
        "description": desc_text[:5000],
        "salary": salary,
        "salary_display": salary or "Competitive • Based on experience",
        "work_mode": work_mode or "Onsite",
        "employment_type": "Full-time",
        "industry": "Technology",
        "company_logo_text": normalize_company_name(company_slug)[:2].lower(),
        "company_logo_bg": "#059669",
        "published_at": job.get("updated_at"),
        "post_age_days": 1,
        "posted_date": "1 d ago",
        "required_skills": title.split()[:3],
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


class GreenhouseScraper:
    """Scrapes jobs from Greenhouse Boards API."""

    def __init__(self, companies: list[str] | None = None):
        if companies is None:
            companies = load_companies_from_file(str(settings.greenhouse_companies_path))
        self.companies = companies

    async def _fetch_company(
        self,
        client: httpx.AsyncClient,
        company: str,
    ) -> FetchResult:
        url = f"https://boards-api.greenhouse.io/v1/boards/{company}/jobs?content=true"

        try:
            data = await fetch_json_with_retry(
                client, url, _breaker,
                retries=settings.retry_count,
                timeout=settings.greenhouse_timeout,
            )
            if not data:
                return FetchResult(company)

            jobs = []
            for job in data.get("jobs", []):
                if not (job.get("title") or "").strip():
                    continue
                jobs.append(_normalize_job(job, company))

            log.info("Greenhouse %s: %d jobs", company, len(jobs))
            return FetchResult(company, jobs)
        except Exception as exc:
            log.exception("Failed %s: %s", company, exc)
            return FetchResult(company)

    async def scrape(self, max_jobs: int = 99999) -> list[dict[str, Any]]:
        """Scrape all Greenhouse companies and return deduplicated job list."""
        semaphore = asyncio.Semaphore(settings.max_concurrent_jobs)

        async def bounded(client: httpx.AsyncClient, company: str):
            async with semaphore:
                result = await self._fetch_company(client, company)
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
                jid = job.get("job_id", "")
                if jid in seen:
                    continue
                seen.add(jid)
                all_jobs.append(job)

        all_jobs.sort(key=lambda x: str(x.get("published_at") or ""), reverse=True)
        return all_jobs[:max_jobs] if max_jobs > 0 else all_jobs

    async def scrape_and_save(self, output_path: str | None = None) -> int:
        """Scrape and save to JSON file."""
        jobs = await self.scrape()
        path = output_path or str(settings.data_path / "greenhouse.json")
        return save_json_records(path, jobs, ("job_id",))

