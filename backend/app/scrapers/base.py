"""
JobPath Backend — Base Scraper.

Abstract base class with shared HTTP, retry, and circuit-breaker logic
used by both Greenhouse and Ashby scrapers.
"""

from __future__ import annotations

import asyncio
import hashlib
import html as html_lib
import json
import logging
import os
import random
import re
import time
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from typing import Any

import httpx

from ..config import settings

log = logging.getLogger(__name__)


# ── Circuit Breaker ──

class CircuitBreaker:
    """Simple circuit breaker for external API calls."""

    def __init__(
        self,
        failure_threshold: int = settings.breaker_threshold,
        recovery_timeout: int = settings.breaker_cooldown,
    ):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failure_count = 0
        self.state = "closed"
        self.opened_at: float | None = None

    def allow_request(self) -> bool:
        if self.state == "open":
            if self.opened_at and time.time() - self.opened_at >= self.recovery_timeout:
                self.state = "half_open"
                return True
            return False
        return True

    def success(self) -> None:
        self.failure_count = 0
        self.state = "closed"
        self.opened_at = None

    def failure(self) -> None:
        self.failure_count += 1
        if self.failure_count >= self.failure_threshold:
            self.state = "open"
            self.opened_at = time.time()


# ── Data Classes ──

@dataclass
class FetchResult:
    """Result of scraping a single company."""
    company: str
    jobs: list[dict[str, Any]] = field(default_factory=list)


# ── Shared Utility Functions ──

US_STATES = {
    "alabama", "alaska", "arizona", "arkansas", "california", "colorado",
    "connecticut", "delaware", "florida", "georgia", "hawaii", "idaho",
    "illinois", "indiana", "iowa", "kansas", "kentucky", "louisiana",
    "maine", "maryland", "massachusetts", "michigan", "minnesota",
    "mississippi", "missouri", "montana", "nebraska", "nevada",
    "new hampshire", "new jersey", "new mexico", "new york",
    "north carolina", "north dakota", "ohio", "oklahoma", "oregon",
    "pennsylvania", "rhode island", "south carolina", "south dakota",
    "tennessee", "texas", "utah", "vermont", "virginia", "washington",
    "west virginia", "wisconsin", "wyoming", "united states", "usa",
    "u.s.", "u.s.a.", "us",
}

STATE_CODES = {
    "al", "ak", "az", "ar", "ca", "co", "ct", "de", "fl", "ga",
    "hi", "id", "il", "in", "ia", "ks", "ky", "la", "me", "md",
    "ma", "mi", "mn", "ms", "mo", "mt", "ne", "nv", "nh", "nj",
    "nm", "ny", "nc", "nd", "oh", "ok", "or", "pa", "ri", "sc",
    "sd", "tn", "tx", "ut", "vt", "va", "wa", "wv", "wi", "wy",
    "dc", "us", "usa",
}


def clean_html_text(text: str) -> str:
    """Remove HTML tags and decode entities."""
    if not text:
        return ""
    text = html_lib.unescape(text)
    text = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def normalize_company_name(slug: str) -> str:
    """Convert a URL slug to a display name."""
    return slug.replace("-", " ").replace("_", " ").title()


def extract_work_mode(title: str, location: str, description: str) -> str:
    """Detect work mode from job text content."""
    content = f"{title} {location} {description}".lower()
    if re.search(r"\b(remote|wfh|work from home)\b", content):
        return "Remote"
    if re.search(r"\bhybrid\b", content):
        return "Hybrid"
    if re.search(r"\b(onsite|in-office|in office|in-person)\b", content):
        return "Onsite"
    return ""


def extract_salary(text: str, compensation: dict[str, Any] | None = None) -> str:
    """Extract salary information from text or compensation data."""
    compensation = compensation or {}
    salary = (
        compensation.get("compensationTierSummary")
        or compensation.get("scrapeableCompensationSalarySummary")
        or ""
    )
    if salary:
        return salary
    m = re.search(
        r"(?:[\$£€])[\d,]+[kK]?\s*(?:-|to|—|–|&mdash;|&ndash;)\s*(?:[\$£€])?[\d,]+[kK]?"
        r"|(?:[\$£€])[\d,]+[kK]?",
        text,
    )
    return m.group(0) if m else ""


def extract_experience(text: str) -> str:
    """Extract experience requirement from text."""
    m = re.search(
        r"(\d+)\s*(?:-|to|—|–|&mdash;|&ndash;)?\s*(\d+)?\s*(?:\+)?\s*"
        r"(?:years?|yrs?)(?:\s*of)?\s*(?:experience)",
        text,
        re.I,
    )
    return m.group(0) if m else ""


def post_time_to_delta(value: str) -> timedelta | None:
    """Convert a post-time filter string to a timedelta."""
    mapping = {
        "hour": timedelta(hours=1),
        "day": timedelta(days=1),
        "3_days": timedelta(days=3),
        "week": timedelta(weeks=1),
        "month": timedelta(days=30),
        "year": timedelta(days=365),
    }
    return mapping.get((value or "any").lower().strip())


def generate_dedupe_key(ats: str, company: str, job_id: str) -> str:
    """Generate a deterministic deduplication key."""
    raw = f"{ats}:{company}:{job_id}"
    return hashlib.md5(raw.encode()).hexdigest()


def is_us_location(location: str) -> bool:
    """Check if a location string refers to a US location."""
    loc_lower = location.lower()
    if any(state in loc_lower for state in US_STATES):
        return True
    parts = [p.strip() for p in loc_lower.replace(",", " ").split()]
    return any(p in STATE_CODES for p in parts)


# ── HTTP Helpers ──

async def fetch_json_with_retry(
    client: httpx.AsyncClient,
    url: str,
    breaker: CircuitBreaker,
    *,
    retries: int = 3,
    timeout: float = 20.0,
    method: str = "GET",
    json_body: dict | None = None,
) -> dict[str, Any] | None:
    """Fetch JSON with retry, backoff, and circuit breaker."""
    if not breaker.allow_request():
        log.warning("Circuit open, skipping: %s", url)
        return None

    base_delay = 1.0
    for attempt in range(retries):
        try:
            if method == "POST" and json_body is not None:
                resp = await client.post(url, json=json_body, timeout=timeout)
            else:
                resp = await client.get(url, timeout=timeout)

            if resp.status_code == 404:
                breaker.success()
                return None

            if resp.status_code == 429:
                breaker.failure()
                retry_after = resp.headers.get("Retry-After")
                sleep_for = (
                    float(retry_after)
                    if retry_after
                    else base_delay * (2 ** attempt) + random.uniform(0, 0.5)
                )
                log.warning("429 for %s, sleeping %.2fs", url, sleep_for)
                await asyncio.sleep(sleep_for)
                continue

            if resp.status_code in (500, 502, 503, 504):
                breaker.failure()
                if attempt < retries - 1:
                    sleep_for = base_delay * (2 ** attempt) + random.uniform(0, 0.5)
                    await asyncio.sleep(sleep_for)
                    continue
                return None

            resp.raise_for_status()
            breaker.success()
            return resp.json()

        except (httpx.TimeoutException, httpx.ConnectError, httpx.ReadError) as exc:
            breaker.failure()
            if attempt == retries - 1:
                log.warning("Final failure for %s: %s", url, exc)
                return None
            sleep_for = base_delay * (2 ** attempt) + random.uniform(0, 0.5)
            await asyncio.sleep(sleep_for)
        except Exception as exc:
            breaker.failure()
            log.exception("Unexpected error for %s: %s", url, exc)
            return None

    return None


def load_companies_from_file(filepath: str) -> list[str]:
    """Load company slugs from a text file."""
    if not os.path.exists(filepath):
        log.warning("Company file not found: %s", filepath)
        return []
    with open(filepath, "r", encoding="utf-8") as f:
        companies = []
        for line in f:
            slug = line.strip().split()[0] if line.strip() else ""
            if slug and not slug.startswith("#"):
                companies.append(slug.lower())
    return list(dict.fromkeys(companies))


def save_json_records(
    filepath: str,
    records: list[dict[str, Any]],
    key_fields: tuple[str, ...],
) -> int:
    """Merge-save records to a JSON file, deduplicating by key fields."""
    existing: list[dict[str, Any]] = []
    if os.path.exists(filepath):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
            if isinstance(data, list):
                existing = [item for item in data if isinstance(item, dict)]
        except (json.JSONDecodeError, OSError):
            pass

    merged: dict[str, dict[str, Any]] = {}
    for record in existing + records:
        key = next(
            (str(record.get(field) or "").strip() for field in key_fields
             if str(record.get(field) or "").strip()),
            hashlib.sha256(
                json.dumps(record, sort_keys=True, ensure_ascii=False).encode()
            ).hexdigest(),
        )
        merged[key] = record

    tmp_path = filepath + ".tmp"
    with open(tmp_path, "w", encoding="utf-8") as f:
        json.dump(list(merged.values()), f, indent=2, ensure_ascii=False)
        f.write("\n")
    os.replace(tmp_path, filepath)
    log.info("Saved %d records to %s", len(merged), os.path.basename(filepath))
    return len(merged)


HTTP_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
    ),
    "Accept": "application/json, text/plain, */*",
}

