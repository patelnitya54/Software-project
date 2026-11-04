"""
JobPath Backend — Match API Router.

Endpoint for running the matching engine server-side.
"""

from __future__ import annotations

from fastapi import APIRouter, Query

from ..models.profile import CandidateProfile
from ..services.data_loader import job_store
from ..services.matching import rank_jobs

router = APIRouter(prefix="/api/match", tags=["Matching"])


@router.post("")
def match_jobs(
    profile: CandidateProfile,
    page: int = 1,
    page_size: int = 60,
    source: str | None = None,
):
    """
    Run the matching engine against all jobs for the given profile.

    Returns ranked jobs sorted by match_percentage descending,
    with pagination support.
    """
    # Get all jobs (optionally filtered by source)
    if source and source != "all":
        all_jobs = job_store._by_source.get(source.lower(), [])
    else:
        all_jobs = job_store._jobs

    result = rank_jobs(profile, all_jobs, page=page, page_size=page_size)
    result["source_counts"] = job_store.source_counts
    return result

