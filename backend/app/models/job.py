"""
JobPath Backend — Pydantic Models for Job data.

Defines the canonical Job schema used across the API,
scrapers, and matching engine.
"""

from __future__ import annotations

from pydantic import BaseModel, Field


class Job(BaseModel):
    """Canonical job listing representation."""

    job_id: str = Field(..., description="Unique identifier for the job")
    job_title: str = Field(..., description="Job title / role name")
    company: str = Field(..., description="Company name")
    company_logo_text: str = Field(default="", description="Short text for logo placeholder")
    company_logo_bg: str = Field(default="#059669", description="Hex color for logo background")

    # Classification
    employment_type: str = Field(default="Full-time")
    industry: str = Field(default="Technology")
    source: str = Field(default="", description="Data source: greenhouse, ashby, awwwards")

    # Location & Work Mode
    location: list[str] = Field(default_factory=lambda: ["Remote"])
    work_mode: str = Field(default="Remote")

    # Compensation
    salary: str = Field(default="")
    salary_min: float | None = None
    salary_max: float | None = None
    currency: str = Field(default="USD")
    salary_display: str = Field(default="Competitive")

    # Skills & Experience
    required_skills: list[str] = Field(default_factory=list)
    preferred_skills: list[str] = Field(default_factory=list)
    experience_min: int = Field(default=0)
    experience_max: int | None = None

    # Company Info
    company_size: str = Field(default="Medium: 201-500 employees")

    # Work Authorization
    work_authorization: str = Field(default="Valid work authorization")
    sponsorship_available: bool = True

    # Schedule & Availability
    timezone: list[str] = Field(default_factory=lambda: ["North America", "Any timezone"])
    relocation_required: bool = False
    night_shift: bool = False

    # Posting Info
    posted_date: str = Field(default="1 d ago")
    post_age_days: int = Field(default=1)

    # URLs
    application_url: str = Field(default="")
    apply_url: str = Field(default="")
    job_url: str = Field(default="")

    # Content
    description: str = Field(default="")


class JobListResponse(BaseModel):
    """Paginated job list response."""

    jobs: list[Job]
    total: int
    page: int
    page_size: int
    total_pages: int
    source_counts: dict[str, int] = Field(default_factory=dict)

