# JobPath — Candidate Matching & Direct ATS Job Board

A high-performance job board platform with real-time company ATS scraping (Greenhouse, Ashby, Awwwards) and an intelligent candidate profile matching engine.

---

## Architecture Overview

The project is structured into distinct **Frontend** and **Backend** subsystems following software engineering best practices:

```
jobpath/
├── backend/                       # Python FastAPI Backend
│   ├── app/
│   │   ├── config.py              # Centralized pydantic-settings config
│   │   ├── main.py                # FastAPI app + CORS + lifespan data loading
│   │   ├── models/                # Pydantic schemas (Job, CandidateProfile, etc.)
│   │   │   ├── job.py
│   │   │   └── profile.py
│   │   ├── routers/               # REST API Endpoints
│   │   │   ├── jobs.py            # GET /api/jobs, GET /api/jobs/:id
│   │   │   ├── profile.py         # POST /api/profile/validate
│   │   │   └── match.py           # POST /api/match (ranking engine)
│   │   ├── scrapers/              # Direct ATS Scraping Engine
│   │   │   ├── base.py            # BaseScraper, CircuitBreaker, retry backoff
│   │   │   ├── greenhouse.py      # Greenhouse Boards API scraper
│   │   │   └── ashby.py           # Ashby Public API scraper
│   │   ├── services/
│   │   │   ├── data_loader.py     # In-memory indexed JobStore
│   │   │   └── matching.py        # Semantic role & skill matching engine
│   │   └── utils/
│   │       └── helpers.py         # Text sanitization, salary & location parsing
│   ├── data/                      # Company rosters and scraped datasets (gitignored)
│   │   ├── greenhouse_companies.txt
│   │   ├── ashby_companies.txt
│   │   └── jobs/
│   │       ├── all_greenhouse_jobs.json
│   │       ├── ashby.json
│   │       └── awwwards.json
│   ├── scripts/
│   │   └── scrape.py              # CLI scraper runner
│   ├── requirements.txt           # Pinned dependencies
│   └── .env.example               # Environment variables template
│
├── frontend/                      # Static Web Application
│   ├── index.html                 # Landing page
│   ├── onboarding.html            # Profile creation & question flow
│   ├── jobs-board.html            # Main job board & ATS source filters
│   ├── job-details.html           # Full job view & rich description
│   ├── analytics-dashboard.html   # Campaign & conversion tracking
│   ├── splash-loader.html         # Loading state & matcher transition
│   ├── css/
│   │   ├── base.css               # Design tokens, reset, typography
│   │   ├── components.css         # Buttons, cards, tags, modals, inputs
│   │   ├── layout.css             # Sidebar, search toolbar, job grid
│   │   ├── onboarding.css         # Onboarding question flows & progress
│   │   ├── jobs-board.css         # Job board view & filter drawers
│   │   ├── job-details.css        # Rich detail layout & link actions
│   │   └── analytics.css          # Analytics charts & funnel metrics
│   ├── js/
│   │   ├── api.js                 # Centralized backend REST API client
│   │   ├── utils.js               # escapeHtml, formatSalary, toast, debounce
│   │   ├── state.js               # State management (localStorage sync)
│   │   ├── onboarding.js          # Onboarding controller & suggestions
│   │   ├── jobs-board.js          # Job board pagination, live search & filters
│   │   ├── job-details.js         # Single job loader & rich text renderer
│   │   └── analytics.js           # Funnel metrics & email event logging
│   └── assets/
│       └── images/                # Logos, backgrounds, UI previews
│
├── .gitignore
├── package.json                   # Root development & test runner scripts
└── README.md
```

---

## Getting Started

### Prerequisites
- **Python 3.10+** (with `uv` or `pip`)
- **Node.js 18+**

### 1. Setup Backend
```bash
cd backend

# Create virtual environment
uv venv .venv
# Or: python -m venv .venv

# Install dependencies
uv pip install -r requirements.txt
# Or: pip install -r requirements.txt

# Start backend server
.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```
Backend API will be live at `http://localhost:8000`
Interactive API Docs (Swagger): `http://localhost:8000/docs`

### 2. Setup Frontend
```bash
# In project root or frontend folder
npm run dev:frontend
```
Frontend will be accessible at `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & loaded job count |
| `GET` | `/api/jobs` | Paginated jobs list (`?page=1&page_size=60&source=greenhouse&search=python`) |
| `GET` | `/api/jobs/{job_id}` | Detailed single job listing |
| `POST` | `/api/match` | Run matching engine for a candidate profile |
| `POST` | `/api/profile/validate` | Validate profile completeness score |

---

## Scraping New Jobs

To refresh ATS job postings directly from company endpoints:
```bash
# Scrape all companies
npm run scrape

# Scrape Greenhouse only
npm run scrape:greenhouse

# Scrape Ashby only
npm run scrape:ashby
```

---

## Verification & Testing

Run both test suites to ensure code integrity:
```bash
# Test backend data loading & models
npm run test:backend

# Test frontend JavaScript syntax
npm run test:frontend
```

