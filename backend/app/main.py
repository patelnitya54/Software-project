"""
JobPath Backend — FastAPI Application Entry Point.

Sets up CORS, registers routers, and loads job data at startup.
"""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import settings
from .routers import jobs, match, profile
from .services.data_loader import job_store

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: load data on startup, cleanup on shutdown."""
    log.info("Starting JobPath Backend...")
    job_store.load()
    log.info("JobPath Backend ready. %d jobs loaded.", job_store.total)
    yield
    log.info("Shutting down JobPath Backend.")


app = FastAPI(
    title="JobPath API",
    description="Job matching and board API for JobPath",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──
app.include_router(jobs.router)
app.include_router(profile.router)
app.include_router(match.router)


@app.get("/api/health")
def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "jobs_loaded": job_store.total,
        "source_counts": job_store.source_counts,
    }

