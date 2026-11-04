/**
 * JobPath Frontend — State Manager.
 *
 * Centralized localStorage abstraction for profile, liked jobs,
 * email stats, and other persistent state.
 */

const State = (() => {
    const KEYS = {
        PROFILE: 'jobpath_candidate_profile',
        USER: 'jobpath_user_account',
        RANKED_RESULTS: 'jobpath_matching_results',
        LIKED_JOBS: 'jobpath_liked_jobs',
        SENT_EMAILS: 'jobpath_sent_emails',
        EMAIL_STATS: 'jobpath_email_stats',
        RESUME_DATA: 'jobpath_resume_data',
        LAST_JOB_ID: 'last_selected_job_id',
        INITIAL_SEARCH: 'jobpath_initial_search',
    };

    function _get(key) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.error('[State] Error reading', key, e);
            return null;
        }
    }

    function _set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('[State] Error writing', key, e);
        }
    }

    // ── Profile ──

    function getProfile() {
        return _get(KEYS.PROFILE) || {
            target_roles: ['Full Stack Engineer', 'Python Engineer', 'Backend Engineer'],
            skills: ['Python', 'React', 'JavaScript', 'SQL', 'FastAPI', 'Docker', 'Machine Learning'],
            experience: 3,
            work_mode: ['Remote', 'Hybrid'],
            employment_type: ['Full-time'],
            preferred_locations: ['San Francisco, CA', 'Remote'],
            relocation: 'Maybe',
            industries: ['Software / IT', 'AI / ML', 'FinTech', 'SaaS'],
            company_size: ['Startup: 1-50 employees', 'Small: 51-200 employees', 'Medium: 201-500 employees'],
            minimum_salary: 80000,
            currency: 'USD',
            work_authorization: '',
            remote_timezone: ['Any timezone'],
            availability: 'Within 2 weeks',
            deal_breakers: [],
            career_priorities: ['Salary', 'Career growth', 'Remote / flexible work'],
            job_post_age: 'Last 30 days',
        };
    }

    function saveProfile(profile) {
        _set(KEYS.PROFILE, profile);
    }

    // ── User Account ──

    function getUser() {
        return _get(KEYS.USER);
    }

    function saveUser(user) {
        _set(KEYS.USER, user);
    }

    // ── Liked Jobs ──

    function getLikedJobs() {
        return _get(KEYS.LIKED_JOBS) || [];
    }

    function isJobLiked(jobId) {
        return getLikedJobs().includes(jobId);
    }

    function toggleLikedJob(jobId) {
        const liked = getLikedJobs();
        const idx = liked.indexOf(jobId);
        if (idx >= 0) {
            liked.splice(idx, 1);
        } else {
            liked.push(jobId);
        }
        _set(KEYS.LIKED_JOBS, liked);
        return idx < 0; // returns true if now liked
    }

    // ── Email Stats ──

    function getEmailStats() {
        return _get(KEYS.EMAIL_STATS) || {
            sent: 0, opened: 0, replied: 0, interviews: 0, creditsLeft: 100,
        };
    }

    function recordEmailSent(jobId) {
        const stats = getEmailStats();
        stats.sent += 1;
        _set(KEYS.EMAIL_STATS, stats);

        const sent = _get(KEYS.SENT_EMAILS) || [];
        sent.push({ jobId, sentAt: new Date().toISOString() });
        _set(KEYS.SENT_EMAILS, sent);
    }

    // ── Ranked Results Cache ──

    function getRankedResults() {
        return _get(KEYS.RANKED_RESULTS);
    }

    function saveRankedResults(results) {
        _set(KEYS.RANKED_RESULTS, results);
    }

    // ── Navigation State ──

    function setLastJobId(id) {
        localStorage.setItem(KEYS.LAST_JOB_ID, id);
    }

    function getLastJobId() {
        return localStorage.getItem(KEYS.LAST_JOB_ID) || '';
    }

    function setInitialSearch(query) {
        localStorage.setItem(KEYS.INITIAL_SEARCH, query);
    }

    function getAndClearInitialSearch() {
        const val = localStorage.getItem(KEYS.INITIAL_SEARCH) || '';
        localStorage.removeItem(KEYS.INITIAL_SEARCH);
        return val;
    }

    // ── Clear All ──

    function clearAll() {
        Object.values(KEYS).forEach(key => localStorage.removeItem(key));
    }

    return {
        KEYS,
        getProfile,
        saveProfile,
        getUser,
        saveUser,
        getLikedJobs,
        isJobLiked,
        toggleLikedJob,
        getEmailStats,
        recordEmailSent,
        getRankedResults,
        saveRankedResults,
        setLastJobId,
        getLastJobId,
        setInitialSearch,
        getAndClearInitialSearch,
        clearAll,
    };
})();

