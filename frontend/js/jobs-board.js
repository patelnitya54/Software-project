/**
 * JobPath Frontend — Jobs Board Page Logic.
 *
 * Handles job listing, filtering, sorting, pagination,
 * and source-based filtering via the backend API.
 */

const JobsBoard = (() => {
    let allJobs = [];
    let currentFilteredJobs = [];
    let currentPage = 1;
    let totalPages = 1;
    let totalJobs = 0;
    let selectedSource = 'all';
    let currentSort = 'Most Recent';
    let sourceCounts = {};
    let isLoading = false;

    // ── Initialization ──

    async function init() {
        setupEventListeners();
        await loadJobs();
        updateDashboardStats();

        // Check for initial search from landing page
        const initialSearch = State.getAndClearInitialSearch();
        const searchInput = document.getElementById('jobSearchInput');
        if (initialSearch && searchInput) {
            searchInput.value = initialSearch;
        }
    }

    function setupEventListeners() {
        const searchInput = document.getElementById('jobSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce(() => {
                currentPage = 1;
                loadJobs();
            }, 300));
        }

        // Close modal on overlay click
        const filterModal = document.getElementById('filter-modal');
        if (filterModal) {
            filterModal.addEventListener('click', function (e) {
                if (e.target === this) closeModal();
            });
        }

        // Slider sync
        setupSliders();
    }

    function setupSliders() {
        const postageSlider = document.getElementById('postage-slider');
        const postageInput = document.getElementById('postage-input');
        if (postageSlider && postageInput) {
            postageSlider.addEventListener('input', function () {
                postageInput.value = this.value;
            });
            postageInput.addEventListener('input', function () {
                let val = parseInt(this.value);
                if (isNaN(val)) val = 30;
                val = Math.max(1, Math.min(30, val));
                postageSlider.value = val;
            });
        }

        const salarySlider = document.getElementById('salary-slider');
        const salaryInput = document.getElementById('salary-input');
        if (salarySlider && salaryInput) {
            salarySlider.addEventListener('input', function () {
                salaryInput.value = this.value;
            });
            salaryInput.addEventListener('input', function () {
                let val = parseInt(this.value);
                if (isNaN(val)) val = 0;
                val = Math.max(0, Math.min(300, val));
                salarySlider.value = val;
            });
        }
    }

    // ── Data Loading ──

    async function loadJobs() {
        if (isLoading) return;
        isLoading = true;

        const searchQuery = (document.getElementById('jobSearchInput')?.value || '').trim();

        try {
            // Try backend API first
            const data = await API.getJobs({
                page: currentPage,
                pageSize: 60,
                source: selectedSource !== 'all' ? selectedSource : undefined,
                search: searchQuery || undefined,
            });

            currentFilteredJobs = data.jobs || [];
            totalJobs = data.total || 0;
            totalPages = data.total_pages || 1;
            sourceCounts = data.source_counts || {};
        } catch (err) {
            console.warn('[JobsBoard] API unavailable, using matching engine fallback:', err.message);
            await loadJobsFallback(searchQuery);
        }

        renderGrid();
        updateSourcePills();
        updateResultsCount();
        isLoading = false;
    }

    async function loadJobsFallback(searchQuery) {
        // Fallback: use client-side matching engine if available
        if (typeof rankAllJobs === 'function') {
            const profile = State.getProfile();
            const matchOutput = rankAllJobs(profile);
            let ranked = (matchOutput.ranked_jobs || []).map(r =>
                Object.assign({}, r.job_data || {}, r)
            );

            // Apply search filter
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                ranked = ranked.filter(job => {
                    const haystack = [
                        job.job_title, job.company, job.industry, job.source,
                        ...(job.required_skills || []),
                        ...(job.location || []),
                    ].join(' ').toLowerCase();
                    return haystack.includes(q);
                });
            }

            // Apply source filter
            if (selectedSource !== 'all') {
                ranked = ranked.filter(j =>
                    (j.source || '').toLowerCase() === selectedSource.toLowerCase()
                );
            }

            currentFilteredJobs = ranked.slice(0, 60);
            totalJobs = ranked.length;
            totalPages = Math.ceil(ranked.length / 60);

            // Calculate source counts
            const all = (matchOutput.ranked_jobs || []).map(r =>
                Object.assign({}, r.job_data || {}, r)
            );
            sourceCounts = {};
            all.forEach(j => {
                const s = (j.source || 'unknown').toLowerCase();
                sourceCounts[s] = (sourceCounts[s] || 0) + 1;
            });
        }
    }

    // ── Rendering ──

    function renderGrid() {
        const grid = document.getElementById('jobsGrid');
        if (!grid) return;

        if (currentFilteredJobs.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #888; font-size: 16px;">
                    No jobs match your active filters. Try clearing some filters.
                </div>`;
            return;
        }

        let html = currentFilteredJobs.map(renderJobCard).join('');

        if (currentPage < totalPages) {
            const remaining = totalJobs - (currentPage * 60);
            html += `
                <div style="grid-column: 1/-1; text-align: center; padding: 32px 0 48px;">
                    <button onclick="JobsBoard.loadMore()" class="btn btn-dark">
                        Load More Jobs (${remaining.toLocaleString()} remaining)
                    </button>
                </div>`;
        }

        grid.innerHTML = html;
    }

    function renderJobCard(job) {
        const logoText = Utils.escapeHtml(job.company_logo_text || (job.company || 'Co').slice(0, 2).toLowerCase());
        const logoBg = job.company_logo_bg || '#059669';
        const matchPct = job.match_percentage !== undefined ? Math.round(job.match_percentage) : '';
        const salaryTag = Utils.formatSalary(job);
        const liked = State.isJobLiked(job.job_id);
        const applyUrl = job.apply_url || job.application_url || job.job_url || '#';

        return `
            <div class="job-card" onclick="JobsBoard.navigateToJob('${Utils.escapeHtml(job.job_id)}')">
                <div class="card-header">
                    <div class="company-logo" style="background: ${logoBg}">${logoText}</div>
                    <div class="card-info">
                        <h3>${Utils.escapeHtml(job.job_title || 'Role')}</h3>
                        <p>${Utils.escapeHtml(job.company || 'Company')}</p>
                    </div>
                    ${matchPct ? `<span class="match-badge" style="background: ${Utils.matchColor(matchPct)}15; color: ${Utils.matchColor(matchPct)}; margin-left: auto;">${matchPct}%</span>` : ''}
                </div>
                <div class="tags">
                    ${Utils.getSourceBadge(job.source)}
                    ${job.industry ? `<span class="tag green">${Utils.escapeHtml(job.industry)}</span>` : ''}
                    ${job.work_mode ? `<span class="tag outline">${Utils.escapeHtml(job.work_mode)}</span>` : ''}
                    ${job.location && job.location.length ? `<span class="tag outline">${Utils.escapeHtml(job.location[0])}</span>` : ''}
                    <span class="tag outline">${salaryTag}</span>
                </div>
                <div class="card-actions" onclick="event.stopPropagation()">
                    <button class="like-btn" onclick="JobsBoard.toggleLike('${Utils.escapeHtml(job.job_id)}', this)"
                        title="${liked ? 'Unlike' : 'Like'}">${liked ? '❤️' : '🤍'}</button>
                    <a href="${Utils.escapeHtml(applyUrl)}" target="_blank" rel="noopener" class="apply-btn"
                        onclick="event.stopPropagation()">Apply ↗</a>
                </div>
            </div>`;
    }

    // ── Filter & Sort ──

    function filterBySource(source, btn) {
        selectedSource = source;
        document.querySelectorAll('.source-pill').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        currentPage = 1;
        loadJobs();
    }

    function updateSourcePills() {
        const total = Object.values(sourceCounts).reduce((a, b) => a + b, 0);
        const setCount = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };
        setCount('pill-all', `All (${total.toLocaleString()})`);
        setCount('pill-greenhouse', `Greenhouse (${(sourceCounts.greenhouse || 0).toLocaleString()})`);
        setCount('pill-ashby', `Ashby (${(sourceCounts.ashby || 0).toLocaleString()})`);
        setCount('pill-awwwards', `Awwwards (${(sourceCounts.awwwards || 0).toLocaleString()})`);
    }

    function updateResultsCount() {
        const el = document.getElementById('resultsCount');
        if (el) el.textContent = `${totalJobs.toLocaleString()} Search results`;
    }

    function submitFilters() {
        currentPage = 1;
        loadJobs();
        closeModal();
        Utils.showToast('Filters applied.');
    }

    function clearAllFilters() {
        const locInput = document.querySelector('#tab-location input');
        if (locInput) locInput.value = '';

        document.querySelectorAll('.modal-scroll-body input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });

        const salInput = document.getElementById('salary-input');
        const salSlider = document.getElementById('salary-slider');
        if (salInput) salInput.value = '0';
        if (salSlider) salSlider.value = 0;

        const postInput = document.getElementById('postage-input');
        const postSlider = document.getElementById('postage-slider');
        if (postInput) postInput.value = '30';
        if (postSlider) postSlider.value = 30;

        const searchInput = document.getElementById('jobSearchInput');
        if (searchInput) searchInput.value = '';

        selectedSource = 'all';
        document.querySelectorAll('.source-pill').forEach(b => b.classList.remove('active'));
        const allPill = document.getElementById('pill-all')?.closest('.source-pill');
        if (allPill) allPill.classList.add('active');

        currentPage = 1;
        loadJobs();
        Utils.showToast('All filters cleared.');
    }

    function setSort(sortBy) {
        currentSort = sortBy;
        // Sort happens server-side in future; for now re-sort client-side
        currentFilteredJobs.sort((a, b) => {
            if (currentSort === 'Most Relevant') {
                return (b.match_percentage || 0) - (a.match_percentage || 0);
            } else if (currentSort === 'Most Recent') {
                return (a.post_age_days || 0) - (b.post_age_days || 0);
            } else if (currentSort === 'Alphabetic') {
                return (a.company || '').localeCompare(b.company || '');
            }
            return 0;
        });
        renderGrid();
    }

    // ── Actions ──

    function navigateToJob(jobId) {
        State.setLastJobId(jobId);
        window.location.href = 'job-details.html?id=' + encodeURIComponent(jobId);
    }

    function toggleLike(jobId, btn) {
        const isNowLiked = State.toggleLikedJob(jobId);
        if (btn) btn.textContent = isNowLiked ? '❤️' : '🤍';
        Utils.showToast(isNowLiked ? 'Job saved!' : 'Job unsaved.');
    }

    function loadMore() {
        currentPage++;
        loadJobs();
    }

    // ── Modal ──

    function openModal(tabId) {
        const modal = document.getElementById('filter-modal');
        if (modal) modal.style.display = 'flex';
        if (tabId) switchTab(tabId);
    }

    function closeModal() {
        const modal = document.getElementById('filter-modal');
        if (modal) modal.style.display = 'none';
    }

    function switchTab(tabId) {
        const tabs = ['match', 'industry', 'salary', 'seniority', 'postAge', 'jobType', 'size', 'location'];
        tabs.forEach(id => {
            const el = document.getElementById('tab-' + id);
            if (el) el.style.display = 'none';
        });
        const selected = document.getElementById('tab-' + tabId);
        if (selected) selected.style.display = 'block';
    }

    // ── Dashboard Stats ──

    function updateDashboardStats() {
        const stats = State.getEmailStats();
        const profile = State.getProfile();
        const name = profile.candidate_name || 'User';

        const greetingEl = document.getElementById('dashGreeting');
        if (greetingEl) greetingEl.textContent = `Hello, ${name}`;

        const avatarEl = document.getElementById('sidebarAvatar');
        if (avatarEl) {
            const initials = name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
            avatarEl.textContent = initials || 'U';
        }
    }

    // ── Public API ──

    return {
        init,
        loadJobs,
        loadMore,
        filterBySource,
        submitFilters,
        clearAllFilters,
        setSort,
        navigateToJob,
        toggleLike,
        openModal,
        closeModal,
        switchTab,
    };
})();

// Window aliases for inline HTML onclick handlers
window.filterBySource = (src, btn) => JobsBoard.filterBySource(src, btn);
window.openModal = (tab) => JobsBoard.openModal(tab);
window.closeModal = () => JobsBoard.closeModal();
window.submitFilters = () => JobsBoard.submitFilters();
window.clearAllFilters = () => JobsBoard.clearAllFilters();
window.loadMoreJobs = () => JobsBoard.loadMore();
window.switchTab = (tab, el) => JobsBoard.switchTab(tab);
window.navigateToJob = (id) => JobsBoard.navigateToJob(id);
window.selectSortOption = (opt) => JobsBoard.setSort(opt);
window.switchView = (view) => {
    const dashPanel = document.getElementById('dashboard-panel');
    const jobPanel = document.getElementById('job-board-panel');
    const navIcons = { home: 'nav-home', grid: 'nav-grid', discover: 'nav-discover', messages: 'nav-messages', docs: 'nav-docs' };
    Object.values(navIcons).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
    });
    if (navIcons[view]) {
        const el = document.getElementById(navIcons[view]);
        if (el) el.classList.add('active');
    }
    if (view === 'home') {
        if (dashPanel) dashPanel.style.display = 'block';
        if (jobPanel) jobPanel.style.display = 'none';
    } else {
        if (dashPanel) dashPanel.style.display = 'none';
        if (jobPanel) jobPanel.style.display = 'block';
    }
};

// Auto-init on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => JobsBoard.init());

