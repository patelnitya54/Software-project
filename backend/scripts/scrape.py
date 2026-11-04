"""
JobPath Backend — Scrape CLI Entry Point.

Usage:
    cd backend
    python -m scripts.scrape              # scrape all sources
    python -m scripts.scrape --source greenhouse
    python -m scripts.scrape --source ashby
"""

from __future__ import annotations

import argparse
import asyncio
import logging
import sys
from datetime import datetime, timezone
from pathlib import Path

# Add parent to path so we can import app
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.config import settings  # noqa: E402
from app.scrapers.ashby import AshbyScraper  # noqa: E402
from app.scrapers.greenhouse import GreenhouseScraper  # noqa: E402

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("scrape")


async def run_greenhouse() -> int:
    """Run the Greenhouse scraper."""
    log.info("Starting Greenhouse scraper...")
    scraper = GreenhouseScraper()
    log.info("Loaded %d Greenhouse companies", len(scraper.companies))
    count = await scraper.scrape_and_save()
    log.info("Greenhouse done: %d jobs saved", count)
    return count


async def run_ashby() -> int:
    """Run the Ashby scraper."""
    log.info("Starting Ashby scraper...")
    scraper = AshbyScraper()
    log.info("Loaded %d Ashby companies", len(scraper.companies))
    count = await scraper.scrape_and_save()
    log.info("Ashby done: %d jobs saved", count)
    return count


async def main(source: str = "all") -> None:
    """Main scrape orchestrator."""
    start = datetime.now(timezone.utc)
    log.info("=" * 60)
    log.info("JobPath Scraper — %s", start.isoformat())
    log.info("Source: %s | Country: %s", source, settings.scrape_country)
    log.info("=" * 60)

    # Ensure data directory exists
    settings.data_path.mkdir(parents=True, exist_ok=True)

    total = 0
    if source in ("all", "greenhouse"):
        total += await run_greenhouse()
    if source in ("all", "ashby"):
        total += await run_ashby()

    elapsed = (datetime.now(timezone.utc) - start).total_seconds()
    log.info("=" * 60)
    log.info("Scraping complete: %d total jobs in %.1fs", total, elapsed)
    log.info("=" * 60)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="JobPath Job Scraper")
    parser.add_argument(
        "--source",
        choices=["all", "greenhouse", "ashby"],
        default="all",
        help="Which source to scrape (default: all)",
    )
    args = parser.parse_args()
    asyncio.run(main(args.source))

