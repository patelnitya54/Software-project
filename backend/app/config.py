"""
JobPath Backend — Application Settings.

Loads configuration from environment variables / .env file
using pydantic-settings for validation and type coercion.
"""

from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Centralized application configuration."""

    # ── Server ──
    host: str = "0.0.0.0"
    port: int = 8000
    reload: bool = True
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    # ── Scraper ──
    scrape_country: str = "usa"
    post_time: str = "day"
    max_concurrent_jobs: int = 10
    ashby_timeout: float = 20.0
    greenhouse_timeout: float = 20.0
    retry_count: int = 3
    target_jobs: int = 300
    breaker_threshold: int = 5
    breaker_cooldown: int = 60

    # ── Data Paths ──
    data_dir: str = "data/jobs"
    greenhouse_companies_file: str = "data/greenhouse_companies.txt"
    ashby_companies_file: str = "data/ashby_companies.txt"

    @property
    def cors_origin_list(self) -> list[str]:
        """Parse comma-separated CORS origins into a list."""
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def backend_root(self) -> Path:
        """Absolute path to the backend/ directory."""
        return Path(__file__).resolve().parent.parent

    @property
    def data_path(self) -> Path:
        """Absolute path to the data/jobs/ directory."""
        return self.backend_root / self.data_dir

    @property
    def greenhouse_companies_path(self) -> Path:
        return self.backend_root / self.greenhouse_companies_file

    @property
    def ashby_companies_path(self) -> Path:
        return self.backend_root / self.ashby_companies_file

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()

