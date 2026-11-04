"""
JobPath Backend — Data Loader Service.

Loads scraped job data from JSON files into memory at startup.
Provides fast in-memory access with source-based indexing.
"""

from __future__ import annotations

import json
import logging
from pathlib import Path

from ..config import settings
from ..models.job import Job

log = logging.getLogger(__name__)


class JobStore:
    """
    In-memory job store loaded from scraped JSON files.

    Provides O(1) lookup by job_id and filtered iteration
    by source, with pagination support.
    """

    def __init__(self) -> None:
        self._jobs: list[dict] = []
        self._by_id: dict[str, dict] = {}
        self._by_source: dict[str, list[dict]] = {}
        self._loaded: bool = False

    @property
    def total(self) -> int:
        return len(self._jobs)

    @property
    def source_counts(self) -> dict[str, int]:
        return {src: len(jobs) for src, jobs in self._by_source.items()}

    def load(self) -> None:
        """Load all job data from JSON files in the data directory."""
        data_dir = settings.data_path
        if not data_dir.exists():
            log.warning("Data directory not found: %s", data_dir)
            self._loaded = True
            return

        source_files = {
            "greenhouse": ["greenhouse.json", "all_greenhouse_jobs.json"],
            "ashby": ["ashby.json", "ashbyAjobs.json"],
            "awwwards": ["awwwards.json"],
        }

        for source, filenames in source_files.items():
            for filename in filenames:
                filepath = data_dir / filename
                if filepath.exists():
                    self._load_file(filepath, source)
                    break
            else:
                log.info("No data file found for source: %s", source)

        self._loaded = True
        log.info(
            "JobStore loaded: %d total jobs | %s",
            self.total,
            " | ".join(f"{s}: {c}" for s, c in self.source_counts.items()),
        )

    def _load_file(self, filepath: Path, source: str) -> None:
        """Load a single JSON file and index its jobs."""
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                raw = json.load(f)

            if not isinstance(raw, list):
                log.warning("Expected list in %s, got %s", filepath, type(raw).__name__)
                return

            count = 0
            for item in raw:
                if not isinstance(item, dict):
                    continue

                # Ensure source is set
                item.setdefault("source", source)

                # Normalize job_id
                job_id = item.get("job_id") or item.get("dedupe_key") or item.get("id", "")
                if not job_id:
                    continue
                item["job_id"] = str(job_id)

                # Normalize location to list
                loc = item.get("location", [])
                if isinstance(loc, str):
                    item["location"] = [loc] if loc else ["Remote"]

                # Index
                self._jobs.append(item)
                self._by_id[item["job_id"]] = item
                self._by_source.setdefault(source, []).append(item)
                count += 1

            log.info("Loaded %d jobs from %s", count, filepath.name)

        except (json.JSONDecodeError, OSError) as exc:
            log.error("Failed to load %s: %s", filepath, exc)

    def get_by_id(self, job_id: str) -> dict | None:
        """Retrieve a single job by its ID."""
        return self._by_id.get(job_id)

    def get_jobs(
        self,
        *,
        source: str | None = None,
        search: str | None = None,
        page: int = 1,
        page_size: int = 60,
    ) -> tuple[list[dict], int]:
        """
        Get paginated, optionally filtered jobs.

        Returns (jobs_page, total_matching).
        """
        jobs = self._jobs

        # Filter by source
        if source and isinstance(source, str) and source.lower() != "all":
            jobs = self._by_source.get(source.lower(), [])

        # Search filter
        if search and isinstance(search, str):
            query = search.lower()
            jobs = [
                j for j in jobs
                if query in (j.get("job_title", "") or "").lower()
                or query in (j.get("company", "") or "").lower()
                or query in (j.get("industry", "") or "").lower()
                or any(query in s.lower() for s in j.get("required_skills", []))
                or any(query in loc.lower() for loc in j.get("location", []))
            ]

        total = len(jobs)

        # Paginate
        start = (page - 1) * page_size
        end = start + page_size
        return jobs[start:end], total


# Singleton instance
job_store = JobStore()

