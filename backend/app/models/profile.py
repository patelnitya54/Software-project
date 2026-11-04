"""
JobPath Backend — Pydantic Models for Candidate Profile.

Defines the candidate profile schema used by the matching engine
and profile management endpoints.
"""

from __future__ import annotations

from pydantic import BaseModel, Field


class CandidateProfile(BaseModel):
    """Candidate profile for job matching."""

    candidate_name: str = Field(default="")
    candidate_email: str = Field(default="")

    target_roles: list[str] = Field(default_factory=list)
    skills: list[str] = Field(default_factory=list)
    resume_skills: list[str] = Field(default_factory=list)
    experience: int = Field(default=0)

    work_mode: list[str] = Field(default_factory=lambda: ["Remote", "Hybrid"])
    employment_type: list[str] = Field(default_factory=lambda: ["Full-time"])
    preferred_locations: list[str] = Field(default_factory=lambda: ["Remote"])
    relocation: str = Field(default="Maybe")

    industries: list[str] = Field(default_factory=lambda: ["Software / IT"])
    company_size: list[str] = Field(default_factory=list)

    minimum_salary: float = Field(default=0)
    currency: str = Field(default="USD")

    work_authorization: str = Field(default="")
    remote_timezone: list[str] = Field(default_factory=list)
    availability: str = Field(default="")
    deal_breakers: list[str] = Field(default_factory=list)
    career_priorities: list[str] = Field(default_factory=list)
    job_post_age: str = Field(default="Last 30 days")


class MatchResult(BaseModel):
    """Single job match result from the ranking engine."""

    job_id: str
    job_title: str
    company: str
    eligible: bool = True
    match_percentage: float = 0.0
    match_breakdown: dict[str, float] = Field(default_factory=dict)
    matched_skills: list[str] = Field(default_factory=list)
    missing_required_skills: list[str] = Field(default_factory=list)
    matched_preferences: list[str] = Field(default_factory=list)
    potential_gaps: list[str] = Field(default_factory=list)
    deal_breaker_detected: bool = False
    deal_breaker_reason: str = ""
    explanation: dict = Field(default_factory=dict)


class RankingResponse(BaseModel):
    """Full ranking engine output."""

    total_jobs_processed: int
    total_jobs_eligible: int
    total_jobs_excluded: int
    ranked_jobs: list[dict]  # Full job data merged with match results
    page: int = 1
    page_size: int = 60
    total_pages: int = 1

