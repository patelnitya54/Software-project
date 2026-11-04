"""
JobPath Backend — Matching Engine Service.

Port of the client-side matching-engine.js to Python.
Implements the same weighted scoring algorithm for
server-side job ranking.
"""

from __future__ import annotations

import math
import re

from ..models.profile import CandidateProfile
from ..utils.helpers import clean_str, normalize_tokens


# ── Skill Synonyms (subset — extend as needed) ──
SKILL_SYNONYMS: dict[str, list[str]] = {
    "javascript": ["js", "es6", "es2015", "ecmascript"],
    "typescript": ["ts"],
    "python": ["py", "python3"],
    "react": ["reactjs", "react.js"],
    "node": ["nodejs", "node.js"],
    "postgresql": ["postgres", "psql"],
    "mongodb": ["mongo"],
    "amazon web services": ["aws"],
    "google cloud platform": ["gcp"],
    "kubernetes": ["k8s"],
    "machine learning": ["ml"],
    "artificial intelligence": ["ai"],
    "continuous integration": ["ci", "ci/cd"],
    "docker": ["containerization"],
}


def _expand_skill(skill: str) -> set[str]:
    """Return a set of normalized variants for a skill."""
    cleaned = clean_str(skill)
    variants = {cleaned}
    for canonical, synonyms in SKILL_SYNONYMS.items():
        if cleaned == canonical or cleaned in synonyms:
            variants.add(canonical)
            variants.update(synonyms)
    return variants


# ── Scoring Functions ──

def _role_similarity(target_roles: list[str], job_title: str) -> float:
    """Calculate role similarity score (0-100)."""
    if not target_roles or not job_title:
        return 50.0

    job_tokens = set(normalize_tokens(job_title))
    best = 0.0
    for role in target_roles:
        role_tokens = set(normalize_tokens(role))
        if not role_tokens:
            continue
        overlap = len(job_tokens & role_tokens)
        union = len(job_tokens | role_tokens)
        jaccard = (overlap / union * 100) if union else 0
        if clean_str(role) in clean_str(job_title) or clean_str(job_title) in clean_str(role):
            jaccard = max(jaccard, 85)
        best = max(best, jaccard)
    return min(100.0, best)


def _skill_score(
    candidate_skills: list[str],
    required: list[str],
    preferred: list[str],
) -> tuple[float, list[str], list[str]]:
    """Calculate skill match score. Returns (score, matched, missing)."""
    if not candidate_skills:
        return 50.0, [], list(required)

    cand_expanded = set()
    for s in candidate_skills:
        cand_expanded |= _expand_skill(s)

    matched = []
    missing = []
    for skill in required:
        if _expand_skill(skill) & cand_expanded:
            matched.append(skill)
        else:
            missing.append(skill)

    total = len(required) + len(preferred)
    if total == 0:
        return 75.0, matched, missing

    pref_matched = sum(1 for s in preferred if _expand_skill(s) & cand_expanded)
    score = ((len(matched) + pref_matched * 0.5) / max(1, total)) * 100
    return min(100.0, score), matched, missing


def _experience_score(candidate_exp: int | None, job_min: int | None, job_max: int | None) -> float:
    """Score experience fit (0-100)."""
    c_exp = candidate_exp or 0
    j_min = job_min or 0
    if j_min == 0 and not job_max:
        return 80.0
    if c_exp >= j_min:
        if job_max and c_exp > job_max + 3:
            return 70.0  # Overqualified
        return 100.0
    gap = j_min - c_exp
    return max(0.0, float(100 - gap * 20))


def _work_mode_score(candidate_modes: list[str], job_mode: str) -> float:
    """Score work mode compatibility (0-100)."""
    if not candidate_modes or not job_mode:
        return 75.0
    cand_clean = {clean_str(m) for m in candidate_modes}
    job_clean = clean_str(job_mode)
    if job_clean in cand_clean or "any" in cand_clean:
        return 100.0
    if "hybrid" in cand_clean and job_clean in ("remote", "on site"):
        return 60.0
    return 30.0


def _employment_match(candidate_types: list[str], job_type: str) -> float:
    """Score employment type match (0-100)."""
    if not candidate_types:
        return 75.0
    cand_clean = [clean_str(t) for t in candidate_types]
    job_clean = clean_str(job_type)
    if any(t in job_clean or job_clean in t for t in cand_clean):
        return 100.0
    return 0.0


def _location_score(
    preferred: list[str], relocation: str, job_locations: list[str], job_mode: str,
) -> float:
    """Score location compatibility (0-100)."""
    if clean_str(job_mode) == "remote":
        return 95.0
    if not preferred or not job_locations:
        return 60.0

    pref_clean = {clean_str(p) for p in preferred}
    for loc in job_locations:
        loc_clean = clean_str(loc)
        if any(p in loc_clean or loc_clean in p for p in pref_clean):
            return 100.0
        if "remote" in pref_clean:
            return 90.0

    if relocation and clean_str(relocation) in ("yes", "open"):
        return 60.0
    return 30.0


def _salary_score(min_salary: float | None, job_max: float | None, currency: str = "USD") -> float:
    """Score salary compatibility (0-100)."""
    min_sal = min_salary or 0.0
    j_max = job_max or 0.0
    if min_sal <= 0:
        return 75.0
    if j_max <= 0:
        return 50.0
    # Currency normalization (rough INR<->USD)
    if min_sal > 100000 and j_max < 100000:
        j_max *= 85
    if j_max >= min_sal:
        return 100.0
    ratio = j_max / min_sal
    return max(0.0, ratio * 100)


def _industry_score(candidate_industries: list[str], job_industry: str) -> float:
    """Score industry match (0-100)."""
    if not candidate_industries or not job_industry:
        return 60.0
    job_clean = clean_str(job_industry)
    for ind in candidate_industries:
        ind_clean = clean_str(ind)
        if ind_clean in job_clean or job_clean in ind_clean:
            return 100.0
    return 40.0


def _company_size_score(candidate_sizes: list[str], job_size: str) -> float:
    """Score company size preference (0-100)."""
    if not candidate_sizes or not job_size:
        return 70.0
    job_clean = clean_str(job_size)
    for size in candidate_sizes:
        if clean_str(size) in job_clean or job_clean in clean_str(size):
            return 100.0
    return 40.0


# ── Hard Filters ──

def _evaluate_hard_filters(candidate: CandidateProfile, job: dict) -> tuple[bool, str]:
    """
    Apply deal-breaker filters.

    Returns (pass, reason). If pass is False, the job is excluded.
    """
    deal_breakers = set(candidate.deal_breakers)

    # Salary below minimum
    if "Salary below minimum" in deal_breakers and candidate.minimum_salary > 0:
        job_max = job.get("salary_max") or 0
        min_sal = candidate.minimum_salary
        if min_sal > 100000 and job_max < 100000:
            job_max *= 85
        if job_max and job_max < min_sal:
            return False, "Salary below candidate minimum expectation"

    # On-site work
    if "On-site work" in deal_breakers and clean_str(job.get("work_mode", "")) == "on site":
        return False, "Job requires on-site work (excluded by deal breaker)"

    # Relocation
    if ("Relocation" in deal_breakers or candidate.relocation == "No") and job.get("relocation_required"):
        return False, "Job requires mandatory relocation while candidate is unwilling"

    # Night shifts
    if "Night shifts" in deal_breakers and job.get("night_shift"):
        return False, "Job requires night shifts (excluded by deal breaker)"

    # No sponsorship
    if (
        "No sponsorship" in deal_breakers or candidate.work_authorization == "Requires sponsorship"
    ) and not job.get("sponsorship_available", True):
        return False, "Candidate requires work authorization sponsorship which is unavailable"

    # Employment type
    if candidate.employment_type:
        c_types = [clean_str(t) for t in candidate.employment_type]
        j_type = clean_str(job.get("employment_type", ""))
        if not any(t in j_type or j_type in t for t in c_types):
            return False, f"Employment type ({job.get('employment_type', '')}) not accepted by candidate"

    return True, ""


# ── Main Matching Function ──

def calculate_job_match(candidate: CandidateProfile, job: dict) -> dict:
    """
    Calculate the match score between a candidate profile and a job.

    Returns a dict with match_percentage, breakdown, and eligibility info.
    """
    # Step 1: Hard filters
    passed, reason = _evaluate_hard_filters(candidate, job)
    if not passed:
        return {
            "job_id": job.get("job_id", ""),
            "job_title": job.get("job_title", ""),
            "company": job.get("company", ""),
            "eligible": False,
            "match_percentage": 0,
            "deal_breaker_detected": True,
            "deal_breaker_reason": reason,
            "match_breakdown": {},
            "matched_skills": [],
            "missing_required_skills": job.get("required_skills", []),
        }

    # Combine skills
    all_skills = list(set(candidate.skills + candidate.resume_skills))

    # Step 2: Individual scores
    role_sc = _role_similarity(candidate.target_roles, job.get("job_title", ""))
    skill_sc, matched, missing = _skill_score(
        all_skills, job.get("required_skills", []), job.get("preferred_skills", []),
    )
    exp_sc = _experience_score(candidate.experience, job.get("experience_min", 0), job.get("experience_max"))
    wm_sc = _work_mode_score(candidate.work_mode, job.get("work_mode", ""))
    emp_sc = _employment_match(candidate.employment_type, job.get("employment_type", ""))
    loc_sc = _location_score(
        candidate.preferred_locations, candidate.relocation,
        job.get("location", []), job.get("work_mode", ""),
    )
    sal_sc = _salary_score(candidate.minimum_salary, job.get("salary_max"), candidate.currency)
    ind_sc = _industry_score(candidate.industries, job.get("industry", ""))
    size_sc = _company_size_score(candidate.company_size, job.get("company_size", ""))

    # Step 3: Weighted aggregation
    weights = [
        ("role", role_sc, 25, bool(candidate.target_roles)),
        ("skills", skill_sc, 25, bool(all_skills)),
        ("experience", exp_sc, 10, candidate.experience is not None),
        ("work_mode", wm_sc, 10, bool(candidate.work_mode)),
        ("employment_type", emp_sc, 8, bool(candidate.employment_type)),
        ("location", loc_sc, 8, True),
        ("salary", sal_sc, 6, candidate.minimum_salary > 0),
        ("industry", ind_sc, 5, bool(candidate.industries)),
        ("company_size", size_sc, 3, bool(candidate.company_size)),
    ]

    total_weighted = 0.0
    sum_active = 0.0
    breakdown = {}
    for field, score, weight, active in weights:
        breakdown[field] = round(score, 1)
        if active:
            total_weighted += score * weight
            sum_active += weight

    final = round(total_weighted / sum_active, 2) if sum_active > 0 else 75.0
    final = max(0.0, min(100.0, final))

    return {
        "job_id": job.get("job_id", ""),
        "job_title": job.get("job_title", ""),
        "company": job.get("company", ""),
        "eligible": True,
        "match_percentage": final,
        "match_breakdown": breakdown,
        "matched_skills": matched,
        "missing_required_skills": missing,
        "deal_breaker_detected": False,
        "deal_breaker_reason": "",
    }


def rank_jobs(
    candidate: CandidateProfile,
    jobs: list[dict],
    *,
    page: int = 1,
    page_size: int = 60,
) -> dict:
    """
    Rank all jobs for a candidate profile.

    Returns paginated results sorted by match_percentage descending.
    """
    all_results = [calculate_job_match(candidate, job) for job in jobs]

    eligible = []
    excluded = []
    for r in all_results:
        merged = {**jobs[all_results.index(r)], **r} if r["eligible"] else r
        if r["eligible"]:
            eligible.append(merged)
        else:
            excluded.append(merged)

    # Sort by match percentage, then role score, then skill score
    eligible.sort(key=lambda x: (
        x.get("match_percentage", 0),
        x.get("match_breakdown", {}).get("role", 0),
        x.get("match_breakdown", {}).get("skills", 0),
    ), reverse=True)

    total = len(eligible)
    total_pages = math.ceil(total / page_size) if page_size > 0 else 1
    start = (page - 1) * page_size
    end = start + page_size

    return {
        "total_jobs_processed": len(all_results),
        "total_jobs_eligible": total,
        "total_jobs_excluded": len(excluded),
        "ranked_jobs": eligible[start:end],
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    }

