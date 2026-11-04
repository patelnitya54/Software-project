"""
JobPath Backend — Profile API Router.

Endpoints for managing candidate profiles.
Profile is stored client-side in localStorage; this endpoint
provides server-side validation and optional persistence.
"""

from __future__ import annotations

from fastapi import APIRouter

from ..models.profile import CandidateProfile

router = APIRouter(prefix="/api/profile", tags=["Profile"])


@router.post("")
def save_profile(profile: CandidateProfile):
    """
    Validate and echo back a candidate profile.

    The frontend stores profiles in localStorage.
    This endpoint validates the schema and can be extended
    to persist profiles in a database.
    """
    return {
        "status": "ok",
        "profile": profile.model_dump(),
    }


@router.post("/validate")
def validate_profile(profile: CandidateProfile):
    """
    Validate a profile and return completeness metrics.

    Useful for the onboarding flow to show progress.
    """
    filled = 0
    total = 0
    checks = {
        "target_roles": bool(profile.target_roles),
        "skills": bool(profile.skills),
        "experience": profile.experience > 0,
        "work_mode": bool(profile.work_mode),
        "employment_type": bool(profile.employment_type),
        "preferred_locations": bool(profile.preferred_locations),
        "industries": bool(profile.industries),
    }
    for field, is_filled in checks.items():
        total += 1
        if is_filled:
            filled += 1

    return {
        "valid": True,
        "completeness": round(filled / total * 100) if total else 0,
        "checks": checks,
    }

