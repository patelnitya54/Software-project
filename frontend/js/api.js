/**
 * JobPath Frontend — API Client Module.
 *
 * Centralized fetch wrapper for all backend API calls.
 * Replaces the old approach of loading 28MB JS data files.
 */

const API = (() => {
    const BASE_URL = window.JOBPATH_API_URL || 'http://localhost:8000';

    /**
     * Generic fetch wrapper with error handling.
     */
    async function request(endpoint, options = {}) {
        const url = `${BASE_URL}${endpoint}`;
        const config = {
            headers: { 'Content-Type': 'application/json' },
            ...options,
        };

        try {
            const resp = await fetch(url, config);
            if (!resp.ok) {
                const error = await resp.json().catch(() => ({ detail: resp.statusText }));
                throw new Error(error.detail || `HTTP ${resp.status}`);
            }
            return await resp.json();
        } catch (err) {
            console.error(`[API] ${options.method || 'GET'} ${endpoint} failed:`, err);
            throw err;
        }
    }

    // ── Jobs ──

    async function getJobs({ page = 1, pageSize = 60, source, search } = {}) {
        const params = new URLSearchParams({ page, page_size: pageSize });
        if (source && source !== 'all') params.set('source', source);
        if (search) params.set('search', search);
        return request(`/api/jobs?${params}`);
    }

    async function getJobById(jobId) {
        return request(`/api/jobs/${encodeURIComponent(jobId)}`);
    }

    // ── Matching ──

    async function matchJobs(profile, { page = 1, pageSize = 60, source } = {}) {
        const params = new URLSearchParams({ page, page_size: pageSize });
        if (source && source !== 'all') params.set('source', source);
        return request(`/api/match?${params}`, {
            method: 'POST',
            body: JSON.stringify(profile),
        });
    }

    // ── Profile ──

    async function validateProfile(profile) {
        return request('/api/profile/validate', {
            method: 'POST',
            body: JSON.stringify(profile),
        });
    }

    // ── Health ──

    async function healthCheck() {
        return request('/api/health');
    }

    return {
        getJobs,
        getJobById,
        matchJobs,
        validateProfile,
        healthCheck,
        BASE_URL,
    };
})();

// Export for module and non-module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
}

