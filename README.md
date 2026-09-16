# Personalized Job Scraper & Job Matching System

## 📌 Project Overview

The **Personalized Job Scraper & Job Matching System** is a software project designed to help job seekers find relevant job opportunities based on their skills, experience, interests, and career preferences.

The system collects job information from permitted/publicly accessible job sources, analyzes the user's resume and profile, and calculates a **job matching score** for each job.

The project also aims to provide an application assistant that can use the user's structured profile and resume information to help fill job application forms.

---

## 🎯 Project Objective

The main objectives of this project are:

* Allow users to create an account and login securely.
* Collect user career preferences through an onboarding process.
* Allow users to upload their resume.
* Extract useful information from the resume.
* Create a structured user profile from the resume.
* Collect and organize job information from job sources.
* Match jobs with the user's skills and requirements.
* Calculate an understandable matching score.
* Display recommended jobs according to their matching score.
* Allow users to save and track jobs.
* Assist users with job applications using their profile information.
* Use AI to assist with application questions while avoiding invented candidate information.

---

## 🚀 Planned Features

### 1. User Authentication

* User registration
* User login
* Logout
* Protected user pages

### 2. User Onboarding

The onboarding process collects information such as:

* Name
* Location
* Education
* Work experience
* Desired job role
* Technical skills
* Preferred location
* Remote / Hybrid / On-site preference
* Expected salary
* Employment type

### 3. Resume Upload & Parsing

Users will be able to upload their resume.

Supported formats planned:

* PDF
* DOCX

The system will extract information such as:

* Personal information
* Skills
* Education
* Work experience
* Projects
* Certifications

---

## 🧠 User Profile

Resume information will be converted into a structured JSON profile.

Example:

```json
{
  "personal": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91XXXXXXXXXX"
  },
  "skills": [
    "Python",
    "FastAPI",
    "PostgreSQL",
    "React"
  ],
  "experience": [
    {
      "company": "ABC Technologies",
      "role": "Software Developer",
      "years": 2
    }
  ],
  "preferences": {
    "job_roles": [
      "Backend Developer",
      "Software Engineer"
    ],
    "location": "Ahmedabad",
    "work_mode": "Remote"
  }
}
```

This structured profile will be used by the matching and application-assistance modules.

---

## 🔎 Job Scraping

The system will collect job information from selected job sources that permit the required access.

The scraper will collect information such as:

* Job title
* Company
* Location
* Job description
* Required skills
* Experience requirements
* Salary, when available
* Job URL
* Posted date
* Source

The scraper will also perform data cleaning and duplicate detection.

> **Note:** The project will respect applicable website terms, robots rules, rate limits, and access restrictions. It will not attempt to bypass CAPTCHA or anti-bot protections.

---

## 📊 Job Matching Algorithm

Each job will receive a matching score based on the user's profile.

An initial version of the scoring system may consider:

| Factor           | Weight |
| ---------------- | -----: |
| Skills           |    35% |
| Experience       |    20% |
| Job Title        |    15% |
| Location         |    10% |
| Salary           |    10% |
| User Preferences |    10% |

### Example

```text
Job Match Score: 86%

Skills          92%
Experience      80%
Job Title       95%
Location       100%
Salary          70%
Preferences      85%
```

The system will also provide an explanation of the score, such as:

```text
Matched Skills:
✓ Python
✓ FastAPI
✓ PostgreSQL

Potential Skill Gaps:
⚠ AWS
⚠ Kubernetes
```

The initial matching algorithm will use deterministic rules. Semantic matching/embeddings may be explored later.

---

## 💼 Job Dashboard

The dashboard will display recommended jobs based on the matching score.

Planned functionality:

* Recommended jobs
* Search jobs
* Filter jobs
* Sort by matching score
* Sort by date
* Save jobs
* View job details
* Track applications

Example:

```text
Backend Developer
ABC Technologies

Match: 91%

✓ Python
✓ FastAPI
✓ PostgreSQL
⚠ AWS

Bangalore | ₹12–18 LPA

[View Job] [Save]
```

---

## 📝 Application Assistant

The application module will help users complete job application forms using information from their structured profile.

Example:

```text
First Name:       John
Last Name:        Doe
Email:            john@example.com
Phone:            +91XXXXXXXXXX

[ Autofill from Profile ]
```

The system will use the user's existing profile information rather than asking the user to repeatedly enter the same information.

---

## 🤖 AI Application Assistant

An AI module is planned to help answer application questions.

The AI may use:

```text
User Profile
     +
Resume Information
     +
Job Description
     +
Application Question
     ↓
AI Generated Draft
```

Example:

```text
Question:

Why are you interested in this position?

        ↓

AI-generated answer
        ↓

User reviews and edits
```

The AI should only use information supported by the user's profile/resume and should not invent qualifications, experience, certifications, or other candidate facts.

---

## 📌 Application Tracking

Users will be able to track applications using statuses such as:

```text
Saved
  ↓
Applied
  ↓
Interview
  ↓
Technical Round
  ↓
HR Round
  ↓
Offer / Rejected
```

---

# 🛠️ Technology Stack

The planned technology stack is:

### Frontend

* Next.js
* TypeScript
* Tailwind CSS

### Backend

* Python
* FastAPI

### Database

* PostgreSQL

### Resume Processing

* PyMuPDF
* python-docx

### Web Scraping

* Python
* Requests
* BeautifulSoup
* Playwright (when required and permitted)

### AI

* LLM API

### Version Control

* Git
* GitHub

---

# 📁 Project Structure

The project will gradually follow a structure similar to:

```text
job-scraper/
│
├── frontend/
│   ├── app/
│   ├── components/
│   └── services/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   │
│   └── tests/
│
├── scraper/
│   ├── scrapers/
│   ├── parsers/
│   └── utils/
│
├── matching/
│   ├── scoring.py
│   └── normalization.py
│
├── ai/
│   ├── resume_parser.py
│   └── application_assistant.py
│
├── docs/
│
├── .gitignore
├── README.md
└── LICENSE
```

> The structure may change as development progresses.

---

# 🧪 Current Development Status

### LAB SESSION 06 – Implementation Part 1

Current activities:

* [x] Create GitHub repository
* [x] Setup development environment
* [x] Create initial project structure
* [x] Create initial class/modules
* [ ] Implement basic features
* [ ] Connect frontend and backend
* [ ] Connect database

### Overall Project Progress

```text
Planning              ██████████ 100%
Environment Setup     ██████████ 100%
Authentication        ░░░░░░░░░░   0%
Onboarding            ░░░░░░░░░░   0%
Resume Processing     ░░░░░░░░░░   0%
Job Scraping          ░░░░░░░░░░   0%
Matching Algorithm    ░░░░░░░░░░   0%
Job Dashboard         ░░░░░░░░░░   0%
Application Assistant ░░░░░░░░░░   0%
AI Assistant          ░░░░░░░░░░   0%
Testing               ░░░░░░░░░░   0%
Deployment             ░░░░░░░░░░   0%
```

---

# 📅 Development Roadmap

## Phase 1 – Foundation

* Project setup
* GitHub repository
* Database design
* Authentication
* Basic frontend/backend structure

## Phase 2 – User Profile

* Onboarding
* Resume upload
* Resume parsing
* Structured JSON profile

## Phase 3 – Job Collection

* Job scraper
* Job database
* Data normalization
* Duplicate detection

## Phase 4 – Job Matching

* Skill matching
* Experience matching
* Location matching
* Preference matching
* Match score
* Match explanation

## Phase 5 – Job Dashboard

* Recommended jobs
* Search
* Filters
* Saved jobs
* Job details

## Phase 6 – Application Assistant

* Application form
* Profile-based autofill
* Application tracking

## Phase 7 – AI Features

* AI application question assistance
* Resume/job context
* Fact-based answer generation

## Phase 8 – Testing & Deployment

* Unit testing
* API testing
* Security review
* Performance optimization
* Deployment
* Documentation

---

# 🎓 Academic Purpose

This project demonstrates practical implementation of concepts including:

* Software engineering
* Object-oriented programming
* Web development
* REST APIs
* Database management
* Web scraping
* Natural language processing
* Information extraction
* Recommendation systems
* Algorithm design
* Artificial intelligence
* Git and GitHub
* Software testing

---

# 🔐 Privacy & Security

User resumes and profile information may contain sensitive personal information.

The application should:

* Protect uploaded resumes.
* Avoid exposing user data publicly.
* Store secrets using environment variables.
* Validate uploaded files.
* Implement authentication and authorization.
* Avoid logging sensitive information.
* Restrict access to user-specific data.
* Allow users to review AI-generated application answers before using them.

---

# 📌 Future Enhancements

Possible future improvements include:

* Semantic job matching using embeddings
* Personalized job recommendations
* Preference learning based on saved/applied jobs
* Job freshness ranking
* Advanced analytics
* Email notifications
* Browser-assisted application workflows
* More permitted job sources
* Resume improvement suggestions
* Skill-gap analysis
* Career recommendations

---

# 👨‍💻 Project Status

This project is currently under active development as a **3-month software project**.

Development is being completed incrementally, with each phase tested before moving to the next phase.

---

## 📜 License

This project is created for educational and academic purposes.

License details will be added as the project progresses.
