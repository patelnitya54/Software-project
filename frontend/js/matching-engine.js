/**
 * JobPath Matching Engine & Job Database
 * Implements the exact Candidate Matching Profile and Weighted Hybrid Matching Algorithm.
 */

// ── Role Semantic Similarity Database ──
const ROLE_TAXONOMY = {
    // Software / IT / AI
    "Software Engineer": ["Backend Engineer", "Frontend Software Engineer", "Full Stack Engineer", "Python Engineer", "Java Engineer", "Golang Engineer", "C/C++ Engineer"],
    "Backend Engineer": ["Full Stack Engineer", "Python Engineer", "Java Engineer", ".Net Engineer", "Golang Engineer", "Backend Developer", "API Engineer"],
    "Frontend Software Engineer": ["Frontend Engineer", "React Developer", "UI/UX Developer", "Web Developer", "UI Designer"],
    "Full Stack Engineer": ["Backend Engineer", "Frontend Software Engineer", "Full Stack Developer", "Software Engineer"],
    "Machine Learning Engineer": ["AI Engineer", "Machine Learning/AI Researcher", "LLM Engineer", "Data Scientist", "Machine Learning, Deep Learning", "Machine Learning, Computer Vision"],
    "AI Engineer": ["Machine Learning Engineer", "LLM Engineer", "Generative AI Engineer", "AI Researcher", "Data Scientist"],
    "Data Scientist": ["Machine Learning Engineer", "Data Analyst", "Data Engineer", "Business/BI Analyst", "Quantitative Analyst/Researcher"],
    "Data Engineer": ["Big Data Engineer", "ETL Developer", "Data Warehouse Engineer", "Backend Engineer"],
    "DevOps": ["Site Reliability Engineer (SRE)", "Cloud Security Engineer", "Systems Engineer", "Infrastructure Engineer", "Network Engineer"],
    "Site Reliability Engineer (SRE)": ["DevOps", "Systems Engineer", "Cloud Engineer"],
    "Cyber Security Analyst": ["Cyber Security Engineer", "Cloud Security Engineer", "Network Security Engineer", "SoC Analyst"],
    "Product Manager": ["Technical Product Manager", "AI Product Manager", "Product Analyst", "Product Manager, B2B/SaaS", "Project/Program Manager"],
    "Technical Product Manager": ["Product Manager", "Engineering Manager", "Solutions Architect"],
    "UI/UX Designer": ["UX Designer", "UI Designer", "Product Designer", "Graphic Designer", "UX Researcher"],
    "Product Designer": ["UI/UX Designer", "UX Designer", "UI Designer"],
    "Account Manager": ["Global Account Manager", "Enterprise Sales", "Sales Manager", "Customer Success Manager"],
    "Global Account Manager [REMOTE]": ["Global Account Manager", "Account Manager", "Enterprise Sales", "Customer Success"],
    "Senior Manager, Security": ["Cyber Security Engineer", "Cloud Security Engineer", "Information Security Manager", "DevOps"],
    "Lead, Internal Audit and SOX Compliance": ["Compliance Specialist", "Risk Analyst", "Auditor", "Controller", "Accountant"],
    "Senior Unqork Engineer": ["Software Engineer", "Solutions Architect", "Full Stack Engineer", "Backend Engineer"],
    "Financial Systems Integration Lead": ["Solutions Architect", "Financial Analyst", "Systems Engineer", "Business Analyst"],
    "Senior Product Designer": ["Product Designer", "UI/UX Designer", "UX Designer", "Lead Designer"],
    "Sr. Strategist": ["Brand Manager", "Marketing Strategist", "Business Strategy Consultant", "Growth Marketing"],
    "Senior Accountant, Solar": ["Accountant", "Auditor", "Controller", "Tax Specialist"],
    "Store Manager - Houston Galleria": ["Store Manager", "Retail Sales", "Operations Manager"],
    "Principal HR Business Partner (R&D)": ["HR Business Partner", "Human Resource Manager/Director", "Recruiter/Sourcer"],
    "CNC Machinist, Deburr (Starship Components)": ["Manufacturing Engineer", "Mechanical Engineer", "Industrial Engineer"],
    "Web Designer": ["UI/UX Designer", "UI Designer", "Product Designer", "Visual Designer", "Graphic Designer", "Creative Developer"],
    "Creative Developer": ["Frontend Software Engineer", "Web Designer", "Frontend Engineer", "UI/UX Developer", "Web Developer"],
    "Senior UI/UX Designer, Ecommerce": ["UI/UX Designer", "Product Designer", "Web Designer", "UI Designer"],
    "Digital Brand Designer": ["Graphic Designer", "Web Designer", "Visual Designer", "UI/UX Designer", "Product Designer"],
    "Senior Shopify Developer": ["Frontend Software Engineer", "Full Stack Engineer", "Web Developer", "Creative Developer"],
    "Design Developer": ["Creative Developer", "Frontend Software Engineer", "Web Designer", "UI/UX Developer"]
};

// ── Skills Similarity and Synonyms Database ──
const SKILL_SYNONYMS = {
    "javascript": ["js", "es6", "ecmascript"],
    "typescript": ["ts"],
    "python": ["py", "python3"],
    "react": ["reactjs", "react.js"],
    "node.js": ["node", "nodejs"],
    "postgresql": ["postgres", "psql"],
    "mongodb": ["mongo"],
    "c++": ["cpp"],
    "c#": ["csharp", ".net"],
    "golang": ["go"],
    "machine learning": ["ml", "deep learning", "statistical modeling"],
    "artificial intelligence": ["ai", "generative ai", "llm"],
    "aws": ["amazon web services", "cloud"],
    "gcp": ["google cloud platform", "google cloud"],
    "azure": ["microsoft azure"],
    "docker": ["containers", "containerization"],
    "kubernetes": ["k8s", "container orchestration"],
    "sql": ["relational database", "mysql", "postgresql", "sqlite"],
    "ui/ux": ["ux design", "ui design", "figma", "user experience"],
    "product management": ["agile", "scrum", "product strategy", "roadmap"],
    "figma": ["ui/ux", "wireframing", "prototyping", "design systems"],
    "shopify": ["liquid", "ecommerce", "storefront"],
    "three.js": ["webgl", "3d", "creative development", "shaders", "canvas"],
    "webflow": ["nocode", "cms", "frontend"]
};

const CLOSELY_RELATED_SKILLS = {
    "python": ["django", "fastapi", "flask", "pandas", "numpy", "pytorch"],
    "react": ["next.js", "redux", "vue.js", "tailwind", "javascript", "typescript"],
    "node.js": ["express", "nest.js", "javascript", "typescript", "backend"],
    "machine learning": ["python", "pytorch", "tensorflow", "scikit-learn", "nlp", "computer vision"],
    "ai": ["prompt engineering", "openai", "langchain", "rag", "fine-tuning", "machine learning"],
    "backend": ["sql", "rest api", "microservices", "docker", "graphql"],
    "frontend": ["html", "css", "javascript", "react", "responsive design"],
    "devops": ["ci/cd", "terraform", "ansible", "linux", "cloud", "aws", "docker"]
};

// ── Complete Jobs Database Conforming to job_data_required ──
const JOB_DATABASE = [];

// ── Integrate Scraped Ashby, Greenhouse & Awwwards Jobs ──
function loadExternalJobsIntoDatabase() {
    let ashbyList = null;
    let awwwardsList = null;
    let greenhouseList = null;

    // Check window globals
    if (typeof window !== "undefined") {
        if (window.ASHBY_SCRAPED_JOBS && Array.isArray(window.ASHBY_SCRAPED_JOBS)) {
            ashbyList = window.ASHBY_SCRAPED_JOBS;
        }
        if (window.AWWWARDS_JOBS && Array.isArray(window.AWWWARDS_JOBS)) {
            awwwardsList = window.AWWWARDS_JOBS;
        }
        if (window.GREENHOUSE_SCRAPED_JOBS && Array.isArray(window.GREENHOUSE_SCRAPED_JOBS)) {
            greenhouseList = window.GREENHOUSE_SCRAPED_JOBS;
        }
    }

    // Node.js fallback
    if (typeof require !== "undefined") {
        try {
            const fs = require('fs');
            const path = require('path');
            if (!ashbyList) {
                const p = path.join(__dirname, 'ashbyAjobs.json');
                if (fs.existsSync(p)) {
                    const raw = JSON.parse(fs.readFileSync(p, 'utf-8'));
                    if (Array.isArray(raw)) {
                        ashbyList = raw.map((j, idx) => ({
                            job_id: j.dedupe_key || `ashby-${idx+1}`,
                            job_title: j.job_title || 'Role',
                            company: j.company || 'Company',
                            company_logo_text: (j.company || 'Co').slice(0, 2).toLowerCase(),
                            company_logo_bg: '#4F46E5',
                            employment_type: (j.raw_payload && j.raw_payload.employmentType) ? j.raw_payload.employmentType : 'Full-time',
                            industry: (j.raw_payload && j.raw_payload.department) ? j.raw_payload.department : 'Technology',
                            location: j.location ? [j.location] : ['Remote'],
                            work_mode: j.work_mode || 'Remote',
                            salary_min: null,
                            salary_max: null,
                            currency: 'USD',
                            salary_display: j.salary || 'Competitive',
                            required_skills: String(j.skills || j.job_title || '').split(',').map(s => s.trim()).filter(Boolean),
                            preferred_skills: [],
                            experience_min: 2,
                            experience_max: null,
                            company_size: 'Medium: 201-500 employees',
                            work_authorization: 'Valid work authorization',
                            sponsorship_available: true,
                            timezone: ['North America', 'Any timezone'],
                            relocation_required: false,
                            night_shift: false,
                            posted_date: '1 d ago',
                            post_age_days: 1,
                            application_url: j.apply_url || j.job_url || '',
                            description: j.description || '',
                            source: 'ashby'
                        }));
                    }
                }
            }
            if (!awwwardsList) {
                try {
                    awwwardsList = require('./awwwards-jobs-data.js');
                } catch (e) {}
            }
            if (!greenhouseList) {
                const gp = path.join(__dirname, 'all_greenhouse_jobs.json');
                if (fs.existsSync(gp)) {
                    try {
                        const rawGh = JSON.parse(fs.readFileSync(gp, 'utf-8'));
                        if (Array.isArray(rawGh)) {
                            greenhouseList = rawGh.map((j, idx) => ({
                                job_id: j.id || `greenhouse-${idx+1}`,
                                job_title: j.job_title || 'Role',
                                company: j.company || 'Company',
                                company_logo_text: (j.company || 'Co').slice(0, 2).toLowerCase(),
                                company_logo_bg: '#059669',
                                employment_type: 'Full-time',
                                industry: 'Technology',
                                location: j.location ? [j.location] : ['Remote'],
                                work_mode: j.work_mode || 'Remote',
                                salary_min: j.salary_min || null,
                                salary_max: j.salary_max || null,
                                currency: 'USD',
                                salary_display: j.salary || 'Competitive',
                                required_skills: String(j.skills || j.job_title || '').split(',').map(s => s.trim()).filter(Boolean),
                                preferred_skills: [],
                                experience_min: 2,
                                experience_max: null,
                                company_size: 'Medium: 201-500 employees',
                                work_authorization: 'Valid work authorization',
                                sponsorship_available: true,
                                timezone: ['North America', 'Any timezone'],
                                relocation_required: false,
                                night_shift: false,
                                posted_date: '1 d ago',
                                post_age_days: 1,
                                application_url: j.apply_url || j.job_url || '',
                                description: j.description || '',
                                source: 'greenhouse'
                            }));
                        }
                    } catch (e) {}
                }
            }
        } catch (e) {}
    }

    const existingIds = new Set(JOB_DATABASE.map(j => j.job_id));

    // Ingest Awwwards Jobs first so creative web design & dev roles shine
    if (Array.isArray(awwwardsList) && awwwardsList.length > 0) {
        awwwardsList.forEach(awJob => {
            if (!existingIds.has(awJob.job_id)) {
                JOB_DATABASE.unshift(awJob);
                existingIds.add(awJob.job_id);
            }
        });
    }

    // Ingest Ashby Jobs
    if (Array.isArray(ashbyList) && ashbyList.length > 0) {
        ashbyList.forEach(ashbyJob => {
            if (!existingIds.has(ashbyJob.job_id)) {
                JOB_DATABASE.unshift(ashbyJob);
                existingIds.add(ashbyJob.job_id);
            }
        });
    }

    // Ingest Greenhouse Jobs
    if (Array.isArray(greenhouseList) && greenhouseList.length > 0) {
        greenhouseList.forEach(ghJob => {
            if (!existingIds.has(ghJob.job_id)) {
                JOB_DATABASE.unshift(ghJob);
                existingIds.add(ghJob.job_id);
            }
        });
    }
}
loadExternalJobsIntoDatabase();
function loadAshbyJobsIntoDatabase() {
    loadExternalJobsIntoDatabase();
}

// ── Default Mock Resume Data (for AI Resume Parser feature) ──
const DEFAULT_RESUME = {
    source: "AI_resume_parser",
    extracted: {
        name: "Bhavya Amin",
        email: "bhavya.amin@example.com",
        degree: "B.Tech in Computer Science & Engineering",
        college: "Indian Institute of Information Technology",
        cgpa: "8.9 / 10",
        years_of_experience: 3,
        technical_skills: [
            "Python", "React", "JavaScript", "Machine Learning", "FastAPI",
            "SQL", "PostgreSQL", "Docker", "PyTorch", "REST APIs", "Git", "TypeScript"
        ],
        soft_skills: ["Problem Solving", "Collaboration", "Critical Thinking", "Communication"],
        previous_job_titles: ["Full Stack Engineer", "Software Engineer", "AI/ML Developer"],
        previous_companies: ["IgniteBytes", "TechNext Labs"],
        previous_industries: ["Software / IT", "AI / ML", "FinTech"],
        projects: [
            "Smart Business Document Generator (OCR, Python, Document Summarization)",
            "AI Meeting Monitor (AssemblyAI, OpenAI, FastAPI backend, real-time audio transcription)",
            "Autonomous Code Review Bot (Python, LLM, Git Integrations)"
        ],
        certifications: ["AWS Certified Cloud Practitioner", "Deep Learning Specialization - Coursera"],
        achievements: ["Solved over 150 problems on LeetCode", "Hackathon Winner at TechFest 2024"]
    }
};

// ── Helper: String Tokenizer & Normalizer ──
function cleanStr(s) {
    if (!s) return "";
    return s.toString().toLowerCase().trim().replace(/[^a-z0-9]/g, " ");
}

function normalizeTokens(str) {
    return cleanStr(str).split(/\s+/).filter(Boolean);
}

// ── Semantic Role Similarity (0 to 100) ──
function calculateRoleSimilarity(targetRoles, jobTitle) {
    if (!targetRoles || targetRoles.length === 0) return 50; // Neutral if unspecified
    const cleanJob = cleanStr(jobTitle);

    let maxScore = 0;

    for (let role of targetRoles) {
        const cleanTarget = cleanStr(role);

        // 1. Exact match
        if (cleanJob === cleanTarget || cleanJob.includes(cleanTarget) || cleanTarget.includes(cleanJob)) {
            maxScore = Math.max(maxScore, 100);
            continue;
        }

        // 2. Strongly related via Taxonomy
        const related = ROLE_TAXONOMY[role] || [];
        if (related.some(r => cleanJob.includes(cleanStr(r)) || cleanStr(r).includes(cleanJob))) {
            maxScore = Math.max(maxScore, 85);
            continue;
        }

        // 3. Token overlap
        const targetTokens = normalizeTokens(role);
        const jobTokens = normalizeTokens(jobTitle);
        const commonTokens = targetTokens.filter(t => jobTokens.includes(t) && !["engineer", "developer", "senior", "lead", "manager"].includes(t));

        if (commonTokens.length > 0) {
            maxScore = Math.max(maxScore, 65);
        } else if (targetTokens.some(t => jobTokens.includes(t))) {
            maxScore = Math.max(maxScore, 35);
        }
    }

    return maxScore;
}

// ── Skill Similarity (Exact, Synonym, Closely Related) ──
function calculateSkillScore(candidateSkills, requiredSkills, preferredSkills = []) {
    if (!requiredSkills || requiredSkills.length === 0) {
        return { score: 100, matched: [], missing: [] };
    }

    const cSkillsClean = candidateSkills.map(s => cleanStr(s));
    let totalScore = 0;
    let maxPossibleScore = requiredSkills.length * 1.0 + (preferredSkills.length * 0.5);
    let matchedSkills = [];
    let missingSkills = [];

    // Evaluate required skills (weight 1.0)
    for (let req of requiredSkills) {
        const reqClean = cleanStr(req);
        let bestMatch = 0;
        let matchLabel = "";

        // Check exact
        if (cSkillsClean.includes(reqClean)) {
            bestMatch = 1.0;
            matchLabel = req;
        } else {
            // Check synonyms (0.9)
            const syns = SKILL_SYNONYMS[reqClean] || [];
            if (syns.some(syn => cSkillsClean.includes(cleanStr(syn)))) {
                bestMatch = 0.9;
                matchLabel = req;
            } else {
                // Check closely related (0.7)
                const closely = CLOSELY_RELATED_SKILLS[reqClean] || [];
                if (closely.some(cl => cSkillsClean.includes(cleanStr(cl)))) {
                    bestMatch = 0.7;
                    matchLabel = `${req} (related)`;
                } else {
                    // Check substring / partial (0.4)
                    if (cSkillsClean.some(cs => cs.includes(reqClean) || reqClean.includes(cs))) {
                        bestMatch = 0.4;
                        matchLabel = `${req} (partial)`;
                    }
                }
            }
        }

        totalScore += bestMatch * 1.0;
        if (bestMatch >= 0.7) {
            matchedSkills.push(matchLabel);
        } else {
            missingSkills.push(req);
        }
    }

    // Evaluate preferred skills (weight 0.5)
    for (let pref of preferredSkills) {
        const prefClean = cleanStr(pref);
        let match = 0;
        if (cSkillsClean.includes(prefClean)) {
            match = 0.5;
            matchedSkills.push(pref);
        } else if ((SKILL_SYNONYMS[prefClean] || []).some(s => cSkillsClean.includes(cleanStr(s)))) {
            match = 0.45;
            matchedSkills.push(pref);
        }
        totalScore += match;
    }

    const percentage = Math.min(100, Math.round((totalScore / maxPossibleScore) * 100));
    return { score: percentage, matched: matchedSkills, missing: missingSkills };
}

// ── Experience Match (0 to 100) ──
function calculateExperienceScore(candExp, jobMin, jobMax) {
    if (candExp === undefined || candExp === null) return 80;
    const min = jobMin || 0;
    const max = jobMax || null;

    if (candExp >= min && (max === null || candExp <= max)) {
        return 100;
    }
    if (candExp >= min) {
        return 85;
    }
    // candExp < min
    const diff = min - candExp;
    if (diff <= 1) return 70;
    if (diff <= 2) return 50;
    return 30;
}

// ── Work Mode Match (0 to 100) ──
function calculateWorkModeScore(candModes, jobMode) {
    if (!candModes || candModes.length === 0) return 100;
    const cModesClean = candModes.map(m => cleanStr(m));
    const jModeClean = cleanStr(jobMode);

    if (cModesClean.includes(jModeClean)) return 100;
    if (cModesClean.includes("remote") && jModeClean.includes("hybrid")) return 75;
    if (cModesClean.includes("hybrid") && jModeClean.includes("remote")) return 85;
    if (cModesClean.includes("on-site") && jModeClean.includes("hybrid")) return 70;
    return 30;
}

// ── Employment Type Match (0 to 100) ──
function calculateEmploymentMatch(candTypes, jobType) {
    if (!candTypes || candTypes.length === 0) return 100;
    const cTypesClean = candTypes.map(t => cleanStr(t));
    const jTypeClean = cleanStr(jobType);

    if (cTypesClean.some(t => jTypeClean.includes(t) || t.includes(jTypeClean))) return 100;
    return 40;
}

// ── Location Match (0 to 100) ──
function calculateLocationScore(candLocations, candRelocation, jobLocations, jobWorkMode) {
    if (cleanStr(jobWorkMode) === "remote") return 100;
    if (!candLocations || candLocations.length === 0) return 80;

    const jLocsClean = (jobLocations || []).map(l => cleanStr(l));
    const cLocsClean = candLocations.map(l => cleanStr(l));

    // Direct match
    for (let cl of cLocsClean) {
        if (jLocsClean.some(jl => jl.includes(cl) || cl.includes(jl))) return 100;
        if (cl.includes("anywhere in india") && jLocsClean.some(jl => jl.includes("india") || jl.includes("bengaluru") || jl.includes("mumbai") || jl.includes("delhi"))) return 90;
        if (cl.includes("remote")) return 100;
    }

    // Willingness to relocate
    if (candRelocation === "Yes") return 80;
    if (candRelocation === "Maybe") return 55;
    return 20;
}

// ── Salary Match (0 to 100) ──
function calculateSalaryScore(candMinSalary, jobSalaryMax, currency = "INR") {
    if (!candMinSalary || candMinSalary <= 0) return 100;
    if (!jobSalaryMax) return 70;

    // Normalize comparison: if job has INR field or currency matching
    let candVal = candMinSalary;
    let jobVal = jobSalaryMax;

    // If candidate specified in INR (e.g. 1000000) and job in USD (e.g. 120000), convert roughly 1 USD = 85 INR
    if (candVal > 100000 && jobVal < 100000) {
        jobVal = jobVal * 85;
    } else if (candVal < 10000 && jobVal > 10000) {
        // Candidate in Thousands (e.g. 50K) vs exact (e.g. 50000)
        candVal = candVal * 1000;
    }

    if (jobVal >= candVal) return 100;
    if (jobVal >= candVal * 0.8) return 60;
    return 0;
}

// ── Industry Match (0 to 100) ──
function calculateIndustryScore(candIndustries, jobIndustry) {
    if (!candIndustries || candIndustries.length === 0) return 100;
    const cleanCand = candIndustries.map(i => cleanStr(i));
    const cleanJob = cleanStr(jobIndustry);

    if (cleanCand.some(i => i.includes(cleanJob) || cleanJob.includes(i))) return 100;
    // Related
    if ((cleanJob.includes("saas") || cleanJob.includes("software")) && cleanCand.some(i => i.includes("software") || i.includes("ai"))) return 75;
    return 30;
}

// ── Company Size Match (0 to 100) ──
function calculateCompanySizeScore(candSizes, jobSize) {
    if (!candSizes || candSizes.length === 0) return 100;
    const cleanCand = candSizes.map(s => cleanStr(s));
    const cleanJob = cleanStr(jobSize);

    if (cleanCand.some(s => cleanJob.includes(s) || s.includes(cleanJob))) return 100;
    return 50;
}

// ── Career Priority Match (0 to 100) ──
function calculateCareerPriorityScore(candPriorities, jobAttributes = []) {
    if (!candPriorities || candPriorities.length === 0) return 100;
    if (!jobAttributes || jobAttributes.length === 0) return 70;

    const cleanCand = candPriorities.map(p => cleanStr(p));
    const cleanAttr = jobAttributes.map(a => cleanStr(a));

    const matches = cleanCand.filter(p => cleanAttr.some(a => a.includes(p) || p.includes(a)));
    return Math.min(100, Math.round((matches.length / Math.min(3, candPriorities.length)) * 100));
}

// ── Work Authorization Score (0 to 100) ──
function calculateWorkAuthScore(candAuth, jobSponsorshipAvailable) {
    if (!candAuth || candAuth === "Not applicable") return 100;
    if (candAuth === "Requires sponsorship") {
        return jobSponsorshipAvailable ? 100 : 0;
    }
    return 100;
}

// ── Timezone Match (0 to 100) ──
function calculateTimezoneScore(candTimezones, jobTimezones = []) {
    if (!candTimezones || candTimezones.length === 0 || candTimezones.includes("Any timezone")) return 100;
    const cleanCand = candTimezones.map(t => cleanStr(t));
    const cleanJob = jobTimezones.map(t => cleanStr(t));

    if (cleanJob.some(jt => cleanCand.some(ct => jt.includes(ct) || ct.includes(jt)))) return 100;
    return 40;
}

// ── Availability Match (0 to 100) ──
function calculateAvailabilityScore(candAvailability) {
    if (!candAvailability) return 100;
    const a = cleanStr(candAvailability);
    if (a.includes("immediately")) return 100;
    if (a.includes("2 weeks")) return 90;
    if (a.includes("1 month")) return 80;
    return 70;
}

// ── Hard Filter Check (Step 1) ──
function evaluateHardFilters(candidate, job) {
    const dealBreakers = candidate.deal_breakers || [];

    // 1. Deal Breaker: Salary below minimum
    if (dealBreakers.includes("Salary below minimum") && candidate.minimum_salary > 0) {
        let minSal = candidate.minimum_salary;
        let jobMax = job.salary_max_inr || job.salary_max;
        if (minSal > 100000 && job.salary_max < 100000) {
            jobMax = job.salary_max * 85;
        }
        if (jobMax && jobMax < minSal) {
            return { pass: false, reason: "Salary below candidate minimum expectation" };
        }
    }

    // 2. Deal Breaker: On-site work
    if (dealBreakers.includes("On-site work") && cleanStr(job.work_mode) === "on site") {
        return { pass: false, reason: "Job requires on-site work (excluded by deal breaker)" };
    }

    // 3. Deal Breaker: Relocation / Relocation unwilling
    if ((dealBreakers.includes("Relocation") || candidate.relocation === "No") && job.relocation_required) {
        return { pass: false, reason: "Job requires mandatory relocation while candidate is unwilling" };
    }

    // 4. Deal Breaker: Night shifts
    if (dealBreakers.includes("Night shifts") && job.night_shift) {
        return { pass: false, reason: "Job requires night shifts (excluded by deal breaker)" };
    }

    // 5. Deal Breaker: No sponsorship
    if ((dealBreakers.includes("No sponsorship") || candidate.work_authorization === "Requires sponsorship") && !job.sponsorship_available) {
        return { pass: false, reason: "Candidate requires work authorization sponsorship which is unavailable" };
    }

    // 6. Hard Filter: Employment Type
    if (candidate.employment_type && candidate.employment_type.length > 0) {
        const cTypes = candidate.employment_type.map(t => cleanStr(t));
        const jType = cleanStr(job.employment_type);
        if (!cTypes.some(t => jType.includes(t) || t.includes(jType))) {
            return { pass: false, reason: `Employment type (${job.employment_type}) not accepted by candidate` };
        }
    }

    // 7. Deal Breaker: Required skill missing (if none overlap at all)
    if (dealBreakers.includes("Required skill missing") && job.required_skills && job.required_skills.length > 0) {
        const cSkills = (candidate.skills || []).map(s => cleanStr(s));
        const hasAny = job.required_skills.some(r => cSkills.includes(cleanStr(r)));
        if (!hasAny) {
            return { pass: false, reason: "None of the job's mandatory required skills matched candidate skills" };
        }
    }

    return { pass: true, reason: "" };
}

/**
 * ── Main Algorithm: Calculate Candidate Job Match ──
 * Implements Steps 1 through 4 from the specification.
 */
function calculateJobMatch(candidate, job) {
    // Step 1: Hard Filters
    const filterResult = evaluateHardFilters(candidate, job);
    if (!filterResult.pass) {
        return {
            job_id: job.job_id,
            job_title: job.job_title,
            company: job.company,
            eligible: false,
            match_percentage: 0,
            deal_breaker_detected: true,
            deal_breaker_reason: filterResult.reason,
            match_breakdown: {},
            matched_skills: [],
            missing_required_skills: job.required_skills || [],
            matched_preferences: [],
            potential_gaps: [filterResult.reason],
            explanation: {
                summary: `Excluded by hard filter: ${filterResult.reason}`,
                why_it_matches: [],
                what_is_missing: [filterResult.reason]
            }
        };
    }

    // Combine candidate skills with resume technical skills
    const allCandSkills = Array.from(new Set([
        ...(candidate.skills || []),
        ...(candidate.resume_skills || [])
    ]));

    // Step 2: Individual Scores
    const roleScore = calculateRoleSimilarity(candidate.target_roles, job.job_title);
    const skillResult = calculateSkillScore(allCandSkills, job.required_skills, job.preferred_skills);
    const expScore = calculateExperienceScore(candidate.experience, job.experience_min, job.experience_max);
    const workModeScore = calculateWorkModeScore(candidate.work_mode, job.work_mode);
    const empScore = calculateEmploymentMatch(candidate.employment_type, job.employment_type);
    const locScore = calculateLocationScore(candidate.preferred_locations, candidate.relocation, job.location, job.work_mode);
    const salScore = calculateSalaryScore(candidate.minimum_salary, job.salary_max_inr || job.salary_max, candidate.currency);
    const indScore = calculateIndustryScore(candidate.industries, job.industry);
    const sizeScore = calculateCompanySizeScore(candidate.company_size, job.company_size);
    const priorityScore = calculateCareerPriorityScore(candidate.career_priorities, job.attributes);
    const authScore = calculateWorkAuthScore(candidate.work_authorization, job.sponsorship_available);
    const tzScore = calculateTimezoneScore(candidate.remote_timezone, job.timezone);
    const availScore = calculateAvailabilityScore(candidate.availability);

    // Weights configuration as specified in matching_algorithm.step_2
    const weightsConfig = [
        { field: "role_match", score: roleScore, weight: 25, active: !!(candidate.target_roles && candidate.target_roles.length > 0) },
        { field: "skill_match", score: skillResult.score, weight: 25, active: !!(allCandSkills.length > 0) },
        { field: "experience_match", score: expScore, weight: 10, active: candidate.experience !== undefined && candidate.experience !== null },
        { field: "work_mode_match", score: workModeScore, weight: 10, active: !!(candidate.work_mode && candidate.work_mode.length > 0) },
        { field: "employment_match", score: empScore, weight: 8, active: !!(candidate.employment_type && candidate.employment_type.length > 0) },
        { field: "location_match", score: locScore, weight: 8, active: true },
        { field: "salary_match", score: salScore, weight: 6, active: !!(candidate.minimum_salary > 0) },
        { field: "industry_match", score: indScore, weight: 5, active: !!(candidate.industries && candidate.industries.length > 0) },
        { field: "company_size_match", score: sizeScore, weight: 3, active: !!(candidate.company_size && candidate.company_size.length > 0) },
        { field: "career_priority_match", score: priorityScore, weight: 3, active: !!(candidate.career_priorities && candidate.career_priorities.length > 0) },
        { field: "work_authorization_match", score: authScore, weight: 5, active: !!candidate.work_authorization },
        { field: "timezone_match", score: tzScore, weight: 3, active: !!(candidate.remote_timezone && candidate.remote_timezone.length > 0) },
        { field: "availability_match", score: availScore, weight: 4, active: !!candidate.availability }
    ];

    // Step 3: Weighted Score & Normalization
    let totalWeighted = 0;
    let sumActiveWeights = 0;

    for (let item of weightsConfig) {
        if (item.active) {
            totalWeighted += item.score * item.weight;
            sumActiveWeights += item.weight;
        }
    }

    const finalPercentage = sumActiveWeights > 0 
        ? Math.round((totalWeighted / sumActiveWeights) * 100) / 100 
        : 75.0;

    // Matched preferences and potential gaps
    const matchedPreferences = [];
    const potentialGaps = [];

    if (roleScore >= 80) matchedPreferences.push(`Strong role alignment with ${job.job_title}`);
    if (workModeScore >= 80) matchedPreferences.push(`Preferred work mode (${job.work_mode})`);
    if (salScore === 100) matchedPreferences.push(`Compensation matches or exceeds salary expectation`);
    if (indScore >= 75) matchedPreferences.push(`Target industry (${job.industry})`);
    if (skillResult.matched.length > 0) matchedPreferences.push(`${skillResult.matched.length} core skills aligned`);

    if (skillResult.missing.length > 0) {
        potentialGaps.push(`Missing preferred/required: ${skillResult.missing.slice(0, 3).join(", ")}`);
    }
    if (expScore < 80) {
        potentialGaps.push(`Requires ${job.experience_min}+ yrs experience (you indicated ${candidate.experience} yrs)`);
    }

    const whyItMatches = [
        `Role similarity score: ${roleScore}% for "${job.job_title}"`,
        `Skill match score: ${skillResult.score}% with key technologies`,
        workModeScore >= 80 ? `Matches your preferred ${job.work_mode} environment` : null,
        salScore === 100 ? `Compensation (${job.salary_display}) meets your threshold` : null
    ].filter(Boolean);

    return {
        job_id: job.job_id,
        job_title: job.job_title,
        company: job.company,
        eligible: true,
        match_percentage: Math.min(100, Math.max(0, finalPercentage)),
        match_breakdown: {
            role: roleScore,
            skills: skillResult.score,
            experience: expScore,
            work_mode: workModeScore,
            employment_type: empScore,
            location: locScore,
            salary: salScore,
            industry: indScore,
            company_size: sizeScore,
            career_priorities: priorityScore,
            work_authorization: authScore,
            timezone: tzScore,
            availability: availScore
        },
        matched_skills: skillResult.matched,
        missing_required_skills: skillResult.missing,
        matched_preferences: matchedPreferences,
        potential_gaps: potentialGaps,
        deal_breaker_detected: false,
        deal_breaker_reason: "",
        explanation: {
            summary: `${finalPercentage}% match based on your target roles, skills, and work preferences.`,
            why_it_matches: whyItMatches,
            what_is_missing: potentialGaps
        },
        job_data: job
    };
}

/**
 * ── Step 6: Ranking Engine ──
 * Process all eligible jobs, sort by match_percentage descending with tie-breakers.
 */
function rankAllJobs(candidate, jobList = JOB_DATABASE) {
    const allResults = jobList.map(job => calculateJobMatch(candidate, job));
    
    const eligibleJobs = allResults.filter(r => r.eligible).map(r => Object.assign({}, r.job_data || {}, r));
    const excludedJobs = allResults.filter(r => !r.eligible).map(r => Object.assign({}, r.job_data || {}, r));

    // Sort priority: match_percentage, role_match, skill_match, experience_match
    eligibleJobs.sort((a, b) => {
        if (b.match_percentage !== a.match_percentage) {
            return b.match_percentage - a.match_percentage;
        }
        if ((b.match_breakdown.role || 0) !== (a.match_breakdown.role || 0)) {
            return (b.match_breakdown.role || 0) - (a.match_breakdown.role || 0);
        }
        if ((b.match_breakdown.skills || 0) !== (a.match_breakdown.skills || 0)) {
            return (b.match_breakdown.skills || 0) - (a.match_breakdown.skills || 0);
        }
        return (b.match_breakdown.experience || 0) - (a.match_breakdown.experience || 0);
    });

    const rankingOutput = {
        total_jobs_processed: jobList.length,
        total_jobs_eligible: eligibleJobs.length,
        total_jobs_excluded: excludedJobs.length,
        all_eligible_jobs_ranked: true,
        ranking_order: "100% to 0%",
        ranked_jobs: eligibleJobs,
        excluded_jobs: excludedJobs
    };

    return rankingOutput;
}

// ── LocalStorage State Helpers ──
const STORAGE_KEYS = {
    PROFILE: "jobpath_candidate_profile",
    USER: "jobpath_user_account",
    RANKED_RESULTS: "jobpath_matching_results",
    LIKED_JOBS: "jobpath_liked_jobs",
    SENT_EMAILS: "jobpath_sent_emails",
    EMAIL_STATS: "jobpath_email_stats",
    RESUME_DATA: "jobpath_resume_data"
};

function getStoredProfile() {
    if (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
            if (raw) return JSON.parse(raw);
        } catch (e) {
            console.error("Error reading profile", e);
        }
    }
    // Return default sensible candidate profile
    return {
        target_roles: ["Full Stack Engineer", "Python Engineer", "Backend Engineer"],
        skills: ["Python", "React", "JavaScript", "SQL", "FastAPI", "Docker", "Machine Learning"],
        experience: 3,
        work_mode: ["Remote", "Hybrid"],
        employment_type: ["Full-time"],
        preferred_locations: ["San Francisco, CA", "Bengaluru, India", "Remote"],
        relocation: "Maybe",
        industries: ["Software / IT", "AI / ML", "FinTech", "SaaS"],
        company_size: ["Startup: 1-50 employees", "Small: 51-200 employees", "Medium: 201-500 employees"],
        minimum_salary: 80000,
        currency: "INR",
        work_authorization: "Indian citizen",
        remote_timezone: ["India / IST", "North America", "Any timezone"],
        availability: "Within 2 weeks",
        deal_breakers: [],
        career_priorities: ["Salary", "Career growth", "Remote / flexible work", "Learning"],
        job_post_age: "Last 30 days",
        resume_skills: DEFAULT_RESUME.extracted.technical_skills
    };
}

function saveStoredProfile(profile) {
    if (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') {
        try {
            localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
            // Immediately run matching algorithm and persist ranked results
            const ranking = rankAllJobs(profile);
            localStorage.setItem(STORAGE_KEYS.RANKED_RESULTS, JSON.stringify(ranking));
            return ranking;
        } catch (e) {
            console.error("Error saving profile", e);
            return null;
        }
    }
    return rankAllJobs(profile);
}

function getStoredRankedJobs() {
    if (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.RANKED_RESULTS);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && parsed.ranked_jobs && parsed.ranked_jobs.length > 0) {
                    return parsed;
                }
            }
        } catch (e) {
            console.error("Error reading ranked jobs", e);
        }
    }
    // Calculate and cache defaults if not found
    const profile = getStoredProfile();
    const ranking = rankAllJobs(profile);
    if (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') {
        localStorage.setItem(STORAGE_KEYS.RANKED_RESULTS, JSON.stringify(ranking));
    }
    return ranking;
}

function saveStoredRankedJobs(ranking) {
    if (typeof localStorage !== 'undefined') {
        try {
            localStorage.setItem(STORAGE_KEYS.RANKED_RESULTS, JSON.stringify(ranking));
        } catch (e) {}
    }
}

function getJobById(jobId) {
    if (!jobId) return null;
    const cleanId = String(jobId).trim();
    const allDb = (typeof window !== 'undefined' && window.JOB_DATABASE && window.JOB_DATABASE.length > 0) ? window.JOB_DATABASE : JOB_DATABASE;
    
    let dbJob = allDb.find(j => j.job_id === cleanId || (j.dedupe_key && j.dedupe_key === cleanId) || (j.id && j.id === cleanId));

    if (!dbJob && typeof window !== 'undefined') {
        if (window.GREENHOUSE_SCRAPED_JOBS && Array.isArray(window.GREENHOUSE_SCRAPED_JOBS)) {
            dbJob = window.GREENHOUSE_SCRAPED_JOBS.find(j => j.job_id === cleanId || j.id === cleanId);
        }
        if (!dbJob && window.ASHBY_SCRAPED_JOBS && Array.isArray(window.ASHBY_SCRAPED_JOBS)) {
            dbJob = window.ASHBY_SCRAPED_JOBS.find(j => j.job_id === cleanId || j.dedupe_key === cleanId);
        }
    }

    const profile = getStoredProfile();

    if (dbJob) {
        const match = calculateJobMatch(profile, dbJob);
        return Object.assign({}, dbJob, match, { job_data: dbJob });
    }

    // If not found by ID, return the first real scraped job from allDb
    if (allDb && allDb.length > 0) {
        const fallbackJob = allDb[0];
        const match = calculateJobMatch(profile, fallbackJob);
        return Object.assign({}, fallbackJob, match, { job_data: fallbackJob });
    }

    return null;
}

// ── Email and Funnel Metrics Storage ──
function getEmailStats() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.EMAIL_STATS);
        if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
        sent: 0,
        opened: 0,
        replied: 0,
        interviews: 0,
        creditsLeft: 50
    };
}

function recordEmailSent(jobId, jobTitle, company, recipientEmail, subject, body) {
    const stats = getEmailStats();
    stats.sent += 1;
    stats.creditsLeft = Math.max(0, stats.creditsLeft - 1);
    // Simulate natural conversion rate for realism
    if (stats.sent >= 2) stats.opened = Math.floor(stats.sent * 0.75);
    if (stats.sent >= 3) stats.replied = Math.max(1, Math.floor(stats.sent * 0.33));
    if (stats.sent >= 5) stats.interviews = Math.max(1, Math.floor(stats.sent * 0.2));

    localStorage.setItem(STORAGE_KEYS.EMAIL_STATS, JSON.stringify(stats));

    // Save to sent log
    let sentLog = [];
    try {
        sentLog = JSON.parse(localStorage.getItem(STORAGE_KEYS.SENT_EMAILS) || "[]");
    } catch (e) {}

    sentLog.unshift({
        id: "EML-" + Date.now(),
        jobId,
        jobTitle,
        company,
        recipientEmail,
        subject,
        body,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    });

    localStorage.setItem(STORAGE_KEYS.SENT_EMAILS, JSON.stringify(sentLog));
    return stats;
}

// ── AI Resume Parsing Simulator ──
function parseUploadedResume(fileOrName) {
    const fileName = typeof fileOrName === "string" ? fileOrName : fileOrName.name;
    const profile = getStoredProfile();
    
    // Enrich profile with parsed resume metadata
    profile.resume_filename = fileName;
    profile.resume_skills = DEFAULT_RESUME.extracted.technical_skills;
    profile.experience = profile.experience || DEFAULT_RESUME.extracted.years_of_experience;
    
    // Add any skills from resume not already in candidate skills
    profile.skills = Array.from(new Set([...(profile.skills || []), ...DEFAULT_RESUME.extracted.technical_skills]));
    profile.target_roles = Array.from(new Set([...(profile.target_roles || []), ...DEFAULT_RESUME.extracted.previous_job_titles]));

    localStorage.setItem(STORAGE_KEYS.RESUME_DATA, JSON.stringify(DEFAULT_RESUME.extracted));
    saveStoredProfile(profile);

    return {
        fileName,
        extracted: DEFAULT_RESUME.extracted,
        profile
    };
}

// Expose globally for browser HTML scripts and Node.js
if (typeof window !== "undefined") {
    window.JOB_DATABASE = JOB_DATABASE;
    window.ROLE_TAXONOMY = ROLE_TAXONOMY;
    window.SKILL_SYNONYMS = SKILL_SYNONYMS;
    window.DEFAULT_RESUME = DEFAULT_RESUME;
    window.calculateJobMatch = calculateJobMatch;
    window.rankAllJobs = rankAllJobs;
    window.getStoredProfile = getStoredProfile;
    window.saveStoredProfile = saveStoredProfile;
    window.getStoredRankedJobs = getStoredRankedJobs;
    window.getJobById = getJobById;
    window.getEmailStats = getEmailStats;
    window.recordEmailSent = recordEmailSent;
    window.parseUploadedResume = parseUploadedResume;
    window.STORAGE_KEYS = STORAGE_KEYS;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        JOB_DATABASE,
        ROLE_TAXONOMY,
        SKILL_SYNONYMS,
        DEFAULT_RESUME,
        calculateJobMatch,
        rankAllJobs,
        getStoredProfile,
        saveStoredProfile,
        getStoredRankedJobs,
        getJobById,
        getEmailStats,
        recordEmailSent,
        parseUploadedResume,
        STORAGE_KEYS
    };
}
