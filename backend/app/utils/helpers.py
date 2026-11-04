"""
JobPath Backend — Shared Utility Functions.

Common helpers used across scrapers, services, and routers.
"""

from __future__ import annotations

import hashlib
import html as html_lib
import re


def clean_str(text: str | None) -> str:
    """Normalize a string: lowercase, strip, remove non-alphanumeric."""
    if not text:
        return ""
    return re.sub(r"[^a-z0-9]", " ", text.lower().strip())


def normalize_tokens(text: str) -> list[str]:
    """Split a cleaned string into non-empty tokens."""
    return [t for t in clean_str(text).split() if t]


def generate_job_id(company: str, title: str, url: str = "") -> str:
    """Generate a deterministic job ID from company + title + url."""
    raw = f"{company.strip().lower()}|{title.strip().lower()}|{url.strip().lower()}"
    return hashlib.md5(raw.encode()).hexdigest()


def strip_html(text: str | None) -> str:
    """Remove HTML tags and decode entities from a string."""
    if not text:
        return ""
    text = re.sub(r"<[^>]+>", " ", text)
    text = html_lib.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def parse_salary_range(salary_str: str | None) -> tuple[float | None, float | None]:
    """
    Extract min/max salary from a display string.

    Handles formats like:
      "$120K - $180K", "$120,000 - $180,000", "120000-180000"
    Returns (min, max) as floats or (None, None).
    """
    if not salary_str:
        return None, None

    # Find all dollar amounts
    amounts = re.findall(r"\$?\s*([\d,]+\.?\d*)\s*[kK]?", salary_str)
    if not amounts:
        return None, None

    parsed = []
    for amt in amounts:
        val = float(amt.replace(",", ""))
        # If "K" follows in original string, multiply
        if "k" in salary_str.lower() and val < 1000:
            val *= 1000
        parsed.append(val)

    if len(parsed) >= 2:
        return min(parsed[0], parsed[1]), max(parsed[0], parsed[1])
    if len(parsed) == 1:
        return parsed[0], parsed[0]
    return None, None


def format_salary_display(
    salary_min: float | None,
    salary_max: float | None,
    currency: str = "USD",
) -> str:
    """Format salary range for display."""
    if not salary_min and not salary_max:
        return "Competitive"

    def _fmt(val: float) -> str:
        if val >= 1000:
            k = val / 1000
            return f"${k:.0f}K" if k == int(k) else f"${k:.1f}K"
        return f"${val:,.0f}"

    if salary_min and salary_max and salary_min != salary_max:
        return f"{_fmt(salary_min)} – {_fmt(salary_max)}"
    if salary_max:
        return f"Up to {_fmt(salary_max)}"
    if salary_min:
        return f"From {_fmt(salary_min)}"
    return "Competitive"


def is_us_location(location: str) -> bool:
    """Check if a location string refers to a US location."""
    US_INDICATORS = {
        "united states", "usa", "u.s.", "u.s.a.", "us",
        "alabama", "alaska", "arizona", "arkansas", "california",
        "colorado", "connecticut", "delaware", "florida", "georgia",
        "hawaii", "idaho", "illinois", "indiana", "iowa", "kansas",
        "kentucky", "louisiana", "maine", "maryland", "massachusetts",
        "michigan", "minnesota", "mississippi", "missouri", "montana",
        "nebraska", "nevada", "new hampshire", "new jersey", "new mexico",
        "new york", "north carolina", "north dakota", "ohio", "oklahoma",
        "oregon", "pennsylvania", "rhode island", "south carolina",
        "south dakota", "tennessee", "texas", "utah", "vermont",
        "virginia", "washington", "west virginia", "wisconsin", "wyoming",
    }
    STATE_CODES = {
        "al", "ak", "az", "ar", "ca", "co", "ct", "de", "fl", "ga",
        "hi", "id", "il", "in", "ia", "ks", "ky", "la", "me", "md",
        "ma", "mi", "mn", "ms", "mo", "mt", "ne", "nv", "nh", "nj",
        "nm", "ny", "nc", "nd", "oh", "ok", "or", "pa", "ri", "sc",
        "sd", "tn", "tx", "ut", "vt", "va", "wa", "wv", "wi", "wy",
        "dc",
    }
    loc_lower = location.lower()
    if any(state in loc_lower for state in US_INDICATORS):
        return True
    # Check for state code patterns like ", CA" or ", NY"
    parts = [p.strip() for p in loc_lower.replace(",", " ").split()]
    return any(p in STATE_CODES for p in parts)

