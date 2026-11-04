"""
JobPath Backend — Jobs API Router.

Endpoints for browsing, searching, and retrieving jobs.
"""

from __future__ import annotations

import math

from fastapi import APIRouter, HTTPException, Query

from ..services.data_loader import job_store

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])


@router.get("")
def list_jobs(
    page: int = 1,
    page_size: int = 60,
    source: str | None = None,
    search: str | None = None,
):
    """
    List jobs with pagination, optional source filter and search.

    Returns paginated job list with source counts for filter pills.
    """
    if source is not None and not isinstance(source, str):
        source = None
    if search is not None and not isinstance(search, str):
        search = None

    jobs_page, total = job_store.get_jobs(
        source=source,
        search=search,
        page=max(1, int(page)),
        page_size=min(200, max(1, int(page_size))),
    )

    return {
        "jobs": jobs_page,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": math.ceil(total / page_size) if page_size > 0 else 1,
        "source_counts": job_store.source_counts,
    }


@router.get("/{job_id}")
def get_job(job_id: str):
    """Retrieve a single job by its ID."""
    job = job_store.get_by_id(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Job not found: {job_id}")
    return job

