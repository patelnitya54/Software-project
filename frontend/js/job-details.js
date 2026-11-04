let currentJob = null;
        let candidateProfile = null;
        let matchResult = null;

        function showToast(msg) {
            const toast = document.getElementById('toastNotification');
            if (!toast) return;
            toast.textContent = msg;
            toast.style.display = 'block';
            setTimeout(() => { toast.style.opacity = '1'; }, 10);
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => { toast.style.display = 'none'; }, 300);
            }, 3000);
        }

        function switchDetailTab(tab) {
            const tabFull = document.getElementById('tabFullBtn');
            const tabSummary = document.getElementById('tabSummaryBtn');
            const fullView = document.getElementById('fullVersionView');
            const summaryView = document.getElementById('summaryView');

            if (tab === 'full') {
                tabFull.classList.add('active');
                tabSummary.classList.remove('active');
                fullView.style.display = 'block';
                summaryView.style.display = 'none';
            } else {
                tabFull.classList.remove('active');
                tabSummary.classList.add('active');
                fullView.style.display = 'none';
                summaryView.style.display = 'block';
            }
        }

        function hashString(str) {
            let hash = 0;
            for (let i = 0; i < (str || '').length; i++) {
                hash = ((hash << 5) - hash) + str.charCodeAt(i);
                hash |= 0;
            }
            return hash;
        }

        function getLikedJobs() {
            try {
                const raw = localStorage.getItem('jobpath_liked_jobs');
                return raw ? JSON.parse(raw) : [];
            } catch (e) {
                return [];
            }
        }

        function isJobLiked(id) {
            return getLikedJobs().includes(id);
        }

        function toggleJobLike() {
            if (!currentJob) return;
            let liked = getLikedJobs();
            const btn = document.getElementById('fabLikeBtn');
            const svgPath = btn ? btn.querySelector('svg') : null;
            if (liked.includes(currentJob.job_id)) {
                liked = liked.filter(id => id !== currentJob.job_id);
                if (svgPath) svgPath.style.fill = 'none';
                showToast("Removed from saved jobs.");
            } else {
                liked.push(currentJob.job_id);
                if (svgPath) svgPath.style.fill = '#FF8A1E';
                showToast("Job added to saved list!");
            }
            localStorage.setItem('jobpath_liked_jobs', JSON.stringify(liked));
        }

        function updateLikeBtn() {
            const btn = document.getElementById('fabLikeBtn');
            if (btn && currentJob) {
                const isLiked = isJobLiked(currentJob.job_id);
                const svg = btn.querySelector('svg');
                if (svg) svg.style.fill = isLiked ? '#FF8A1E' : 'none';
            }
        }

        function generatePersonalizedPitch(candidate, job) {
            const cName = candidate.candidate_name || "Bhavya Amin";
            const skillsStr = (candidate.skills || ["Python", "Docker", "AWS"]).slice(0, 4).join(', ');
            const recruiterDomain = (job.company || 'company').toLowerCase().replace(/[^a-z0-9]/g, '');

            return `Subject: ${job.job_title} application - ${cName}

Hi ${job.company} Hiring Team,

I came across the ${job.job_title} position at ${job.company} and was immediately drawn to your mission and team.

With my background in ${skillsStr} and experience building scalable systems, I have delivered high-reliability services that align directly with your technical stack and product needs.

Given ${job.company}'s work in ${job.industry || 'the tech industry'}, I would love to bring my experience to help expand your platform and solve complex challenges.

Attached is my resume for your review. I would appreciate the opportunity for a brief 10-15 minute discussion to explore how my qualifications align with your team's objectives.

Best regards,
${cName}
Email: ${candidate.candidate_email || 'candidate@example.com'}`;
        }

        function cycleStatus(btn) {
            if (btn.classList.contains('sent')) return;
            
            if (btn.classList.contains('generate')) {
                btn.classList.remove('generate');
                btn.classList.add('generating');
                btn.innerHTML = 'Personalizing pitch with AI...';
                btn.style.backgroundColor = '#FFF3E0';
                btn.style.color = '#FF8A1E';

                setTimeout(() => {
                    btn.classList.remove('generating');
                    btn.classList.add('ready');
                    btn.innerHTML = 'Draft Ready ✓';
                    btn.style.backgroundColor = '#E9F4EB';
                    btn.style.color = '#24753F';

                    const textarea = document.querySelector('.draft-textarea');
                    if (textarea && candidateProfile && currentJob) {
                        textarea.value = generatePersonalizedPitch(candidateProfile, currentJob);
                    }
                    const draftModal = document.getElementById('draftModal');
                    if (draftModal) draftModal.style.display = 'flex';
                }, 600);

            } else if (btn.classList.contains('ready')) {
                const draftModal = document.getElementById('draftModal');
                if (draftModal) draftModal.style.display = 'flex';
            }
        }

        function openPreviewModal() {
            const draftContent = document.querySelector('.draft-textarea').value;
            const paragraphs = draftContent.split('\n\n').map(p => {
                const formatted = p.replace(/\n/g, '<br>');
                return `<p style="margin-bottom: 12px;">${formatted}</p>`;
            }).join('');
            
            const previewTextEl = document.querySelector('.preview-text');
            if (previewTextEl) previewTextEl.innerHTML = paragraphs;

            const domain = currentJob ? currentJob.company.toLowerCase().replace(/[^a-z0-9]/g, '') : 'company';
            const nameEl = document.querySelector('.preview-meta-text .name');
            if (nameEl) {
                nameEl.innerHTML = `Recruiting Team &lt;careers@${domain}.com&gt;`;
            }

            const subjectEl = document.querySelector('.preview-subject');
            if (subjectEl) {
                const lines = draftContent.split('\n');
                const subLine = lines.find(l => l.toLowerCase().startsWith('subject:')) || 'Subject: Application Outreach';
                subjectEl.innerHTML = `<span style="background-color: #E5E7EB; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 8px;">Subject:</span> ${subLine.replace(/subject:/i, '').trim()}`;
            }

            document.getElementById('emailPreviewModal').style.display = 'flex';
        }

        function closePreviewModal() {
            document.getElementById('emailPreviewModal').style.display = 'none';
        }

        function sendEmail() {
            closePreviewModal();
            const draftModal = document.getElementById('draftModal');
            if (draftModal) draftModal.style.display = 'none';

            if (currentJob && typeof recordEmailSent === 'function') {
                const cName = candidateProfile ? candidateProfile.candidate_name : "Bhavya Amin";
                recordEmailSent(currentJob.job_id, cName);
            }

            const btn = document.getElementById('generateDraftBtn');
            if (btn) {
                btn.classList.remove('generate', 'generating', 'ready');
                btn.classList.add('sent');
                btn.innerHTML = 'Sent ✓';
                btn.style.backgroundColor = '#E9F4EB';
                btn.style.color = '#24753F';
            }

            showToast(`Outreach email successfully sent to ${currentJob.company} recruiters!`);
        }

        function escapeHtml(text) {
            if (!text) return '';
            return String(text)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        function copyToClipboard(url) {
            if (!url) return;
            navigator.clipboard.writeText(url).then(() => {
                showToast("Link copied to clipboard!");
            }).catch(() => {
                showToast("Could not copy link.");
            });
        }

        function applyJob() {
            if (!currentJob) return;
            const targetUrl = currentJob.application_url || currentJob.apply_url || currentJob.job_url;
            if (targetUrl) {
                window.open(targetUrl, '_blank');
            } else {
                showToast(`Application submitted directly for ${currentJob.job_title} at ${currentJob.company}!`);
            }
        }

        function switchDetailTab(tab) {
            const fullBtn = document.getElementById('tabFullBtn');
            const summaryBtn = document.getElementById('tabSummaryBtn');
            const fullView = document.getElementById('fullVersionView');
            const summaryView = document.getElementById('summaryView');

            if (tab === 'full') {
                if (fullBtn) fullBtn.classList.add('active');
                if (summaryBtn) summaryBtn.classList.remove('active');
                if (fullView) fullView.style.display = 'block';
                if (summaryView) summaryView.style.display = 'none';
            } else {
                if (fullBtn) fullBtn.classList.remove('active');
                if (summaryBtn) summaryBtn.classList.add('active');
                if (fullView) fullView.style.display = 'none';
                if (summaryView) summaryView.style.display = 'block';
            }
        }

        // Close modal on ESC
        document.addEventListener('keydown', function (event) {
            if (event.key === "Escape") {
                closePreviewModal();
            }
        });

        // Close modal on outside click
        document.addEventListener('click', function (event) {
            const previewModal = document.getElementById('emailPreviewModal');
            const draftModal = document.getElementById('draftModal');
            if (event.target === previewModal) closePreviewModal();
            if (event.target === draftModal) {
                draftModal.style.display = 'none';
            }
        });

        // Advanced helper to format raw descriptions into rich sections & bulleted lists
        function formatRichDescription(rawText) {
            if (!rawText) return '<p style="color:#888;">No description provided for this opening.</p>';
            
            // If already HTML markup, strip scripts and return
            if (/<[a-z][\s\S]*>/i.test(rawText)) {
                return rawText.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            }

            let text = rawText.trim();

            // Section headers to identify
            const headers = [
                'about the team', 'about our team', 'about us', 'about the role', 'about the job', 'about the company', 'about us:',
                'the opportunity', 'the role', 'role overview', 'position overview', 'overview',
                'key responsibilities', 'responsibilities', "what you'll do", 'what you will do', 'what you will be doing', "what you'll be doing",
                "what you'll bring", 'what you will bring', 'what we are looking for', "what we're looking for",
                'required qualifications', 'preferred qualifications', 'minimum qualifications', 'basic qualifications', 'key qualifications', 'qualifications',
                'key requirements', 'requirements', 'must haves', 'nice to haves', 'who you are', 'ideal candidate',
                'what we offer', 'benefits and perks', 'benefits & perks', 'benefits', 'compensation & benefits', 'compensation',
                'our mission', 'why join us', 'our values', 'how to apply', 'equal opportunity'
            ];

            headers.forEach(h => {
                const escaped = h.replace(/'/g, "['’]");
                const regex = new RegExp('(?:^|[\\.\\!\\?\\;\\:\\n]\\s*)(?:[\\*#]{1,3}\\s*)?(' + escaped + ')(?:[\\*#]{1,3})?[:\\s]', 'gi');
                text = text.replace(regex, (match, p1) => '\n\n### ' + p1.trim() + '\n\n');
            });

            // Convert collapsed action verbs and qualification starters into bullet points
            const bulletPattern = /(?<=[a-z0-9\.\)])\s+(?=(?:\d+\+?\s+years|Experience\s+(?:in|with|using|reading|working|leading)|Proficiency\s+with|Ability\s+to|Attention\s+to\s+detail|Demonstrated|Strong\s+(?:background|understanding|knowledge|communication|analytical)|Knowledge\s+(?:of|&|and)|Must\s+be|Must\s+have|Must\s+be\s+able|Direct\s+experience|Be\s+fully|Own\s+[a-z]|Serve\s+as|Partner\s+with|Leverage\s+[a-z]|Lead\s+[a-z]|Manage\s+[a-z]|Build\s+[a-z]|Develop\s+[a-z]|Design\s+[a-z]|Create\s+[a-z]|Review\s+[a-z]|Support\s+[a-z]|Assist\s+[a-z]|Ensure\s+[a-z]|Communicate\s+[a-z]|Track\s+[a-z]|Execute\s+[a-z]|Coordinate\s+[a-z]|Oversee\s+[a-z]|Deliver\s+[a-z]|Maintain\s+[a-z]|Implement\s+[a-z]|Analyze\s+[a-z]|Provide\s+[a-z]|Collaborate\s+[a-z]|Train\s+[a-z]|Propose\s+[a-z]))/g;
            text = text.replace(bulletPattern, '\n• ');

            // Detect Unicode bullets
            text = text.replace(/[•‣◦⁃∙]/g, '\n• ');

            const blocks = text.split(/\n\s*\n/);
            let html = '';
            let inList = false;

            blocks.forEach(block => {
                block = block.trim();
                if (!block) return;

                if (block.startsWith('### ')) {
                    if (inList) { html += '</ul>'; inList = false; }
                    const heading = block.replace('### ', '').replace(/[:\s]+$/, '');
                    html += `<h4>${escapeHtml(heading)}</h4>`;
                } else if (block.includes('\n• ') || block.startsWith('• ')) {
                    if (!inList) { html += '<ul>'; inList = true; }
                    const items = block.split(/\n•\s*/);
                    items.forEach(item => {
                        const cleanItem = item.replace(/^•\s*/, '').trim();
                        if (cleanItem) {
                            html += `<li>
                                <span class="bullet-dot">&bull;</span>
                                ${escapeHtml(cleanItem)}
                            </li>`;
                        }
                    });
                } else {
                    if (inList) { html += '</ul>'; inList = false; }
                    if (block.length > 320 && block.includes('. ')) {
                        const sentences = block.split(/(?<=\.\s+)/);
                        let para = '';
                        sentences.forEach((s, i) => {
                            para += s;
                            if ((i + 1) % 3 === 0 || i === sentences.length - 1) {
                                html += `<p>${escapeHtml(para.trim())}</p>`;
                                para = '';
                            }
                        });
                    } else {
                        html += `<p>${escapeHtml(block)}</p>`;
                    }
                }
            });

            if (inList) html += '</ul>';
            return html;
        }

        // Populate Job Data
        async function loadJobDetails() {
            // Force Description tab active by default
            switchDetailTab('full');

            const urlParams = new URLSearchParams(window.location.search);
            let jobId = urlParams.get('id');
            if (!jobId && typeof localStorage !== 'undefined') {
                try {
                    jobId = localStorage.getItem('last_selected_job_id');
                } catch (e) {}
            }

            if (jobId && typeof API !== 'undefined' && typeof API.getJobById === 'function') {
                try {
                    currentJob = await API.getJobById(jobId);
                } catch (err) {
                    console.warn('[API] Job fetch failed, checking fallback:', err);
                }
            }

            if (!currentJob) {
                currentJob = (typeof getJobById === 'function') ? getJobById(jobId) : null;
            }
            if (!currentJob && typeof JOB_DATABASE !== 'undefined' && JOB_DATABASE.length > 0) {
                currentJob = JOB_DATABASE[0];
            }

            candidateProfile = (typeof getStoredProfile === 'function') ? getStoredProfile() : null;
            if (!candidateProfile) {
                candidateProfile = {
                    candidate_name: "Bhavya Amin",
                    target_roles: ["Backend Engineer", "Full Stack Engineer"],
                    skills: ["Python", "Django", "PostgreSQL", "Docker", "AWS", "REST APIs", "Redis"],
                    experience: 4,
                    work_mode: ["Remote", "Hybrid"],
                    employment_type: ["Full-time"],
                    preferred_locations: ["Remote", "Bengaluru"],
                    relocation: "Yes",
                    industries: ["Software / IT", "AI / ML"],
                    minimum_salary: 1800000
                };
            }

            matchResult = (typeof calculateJobMatch === 'function') ? calculateJobMatch(candidateProfile, currentJob) : { match_percentage: 85, explanation: { summary: "Strong match based on role and technical skills.", why_it_matches: ["Core skills match", "Role matches preference"], what_is_missing: [] } };

            const matchPct = Math.round(matchResult.match_percentage || 80);
            let strokeColor = '#10B981';
            if (matchPct < 40) strokeColor = '#EF4444';
            else if (matchPct < 70) strokeColor = '#F59E0B';

            // Update DOM Header
            document.title = `${currentJob.job_title} at ${currentJob.company} | Workin'`;
            document.getElementById('jdCompanyName').textContent = currentJob.company;
            document.getElementById('jdJobTitle').textContent = currentJob.job_title;

            const postAge = currentJob.post_age_days !== undefined ? currentJob.post_age_days : 5;
            document.getElementById('jdPostAge').textContent = `${postAge} d ago`;

            // Logo
            const colors = ['#8B5CF6', '#FF5A00', '#000000', '#2563EB', '#059669', '#DC2626', '#D97706', '#0284C7', '#4F46E5', '#7C3AED'];
            const color = colors[Math.abs(hashString(currentJob.company)) % colors.length];
            const initials = currentJob.company.slice(0, 2).toLowerCase();

            const logoEl = document.getElementById('jdCompanyLogo');
            if (logoEl) logoEl.style.backgroundColor = color;
            const logoSmall = document.getElementById('jdLogoSmall');
            if (logoSmall) logoSmall.style.backgroundColor = color;
            document.getElementById('jdLogoText').textContent = initials;
            if (logoSmall) logoSmall.querySelector('span').textContent = initials;

            // Match Pill
            document.getElementById('jdMatchText').textContent = `${matchPct}% Match`;
            const circle = document.getElementById('jdMatchCircle');
            if (circle) {
                circle.setAttribute('stroke-dasharray', `${matchPct}, 100`);
                circle.style.stroke = strokeColor;
            }

            // Tags
            const expMin = currentJob.experience_min || 0;
            const expMax = currentJob.experience_max;
            let expTagText = expMax ? `${expMin} - ${expMax} yrs exp` : (expMin > 0 ? `${expMin}+ yrs exp` : 'All experience levels');
            document.getElementById('jdExperienceTag').textContent = expTagText;

            document.getElementById('jdRoleTag').textContent = currentJob.job_title;
            const locText = (currentJob.location || []).join(', ') + (currentJob.work_mode ? ` (${currentJob.work_mode})` : '');
            document.getElementById('jdLocationTag').textContent = locText;

            // Exact Salary / Compensation Calculation
            let compStr = (currentJob.salary_display || currentJob.salary || '').trim();
            if (!compStr || compStr.toLowerCase() === 'competitive' || compStr === '$100K or below') {
                if (currentJob.salary_min && currentJob.salary_max) {
                    compStr = `$${Math.round(currentJob.salary_min / 1000)}K - $${Math.round(currentJob.salary_max / 1000)}K / Year`;
                } else if (currentJob.salary_max) {
                    compStr = `Up to $${Math.round(currentJob.salary_max / 1000)}K / Year`;
                } else if (currentJob.salary_min) {
                    compStr = `From $${Math.round(currentJob.salary_min / 1000)}K / Year`;
                } else {
                    compStr = 'Competitive • Based on experience';
                }
            }
            document.getElementById('jdCompValue').textContent = compStr;
            const jdSalaryTag = document.getElementById('jdSalaryTag');
            if (jdSalaryTag) jdSalaryTag.textContent = compStr;

            // Source Branding Tag
            const srcEl = document.getElementById('jdSourceTag');
            const srcLower = (currentJob.source || '').toLowerCase();
            if (srcEl) {
                if (srcLower === 'greenhouse') {
                    srcEl.textContent = 'Greenhouse Verified';
                    srcEl.style.color = '#047857';
                    srcEl.style.background = '#ECFDF5';
                    srcEl.style.borderColor = '#A7F3D0';
                } else if (srcLower === 'ashby') {
                    srcEl.textContent = 'Ashby Live';
                    srcEl.style.color = '#4338CA';
                    srcEl.style.background = '#EEF2FF';
                    srcEl.style.borderColor = '#C7D2FE';
                } else if (srcLower === 'awwwards') {
                    srcEl.textContent = 'Awwwards Curated';
                    srcEl.style.color = '#BE123C';
                    srcEl.style.background = '#FFF1F2';
                    srcEl.style.borderColor = '#FECDD3';
                } else {
                    srcEl.textContent = 'Verified Role';
                    srcEl.style.color = '#1F2937';
                    srcEl.style.background = '#F3F4F6';
                    srcEl.style.borderColor = '#E5E7EB';
                }
            }

            document.getElementById('jdStickyDesc').textContent = `${currentJob.company} is seeking an experienced ${currentJob.job_title} to join their team in ${currentJob.industry || 'Technology'}.`;

            // Application & Job URLs extraction from JSON
            const appUrl = currentJob.application_url || currentJob.apply_url || currentJob.job_url || '';
            const jobUrl = currentJob.job_url || currentJob.application_url || '';
            const isGh = srcLower === 'greenhouse';
            const isAshby = srcLower === 'ashby';
            const isAwwwards = srcLower === 'awwwards';
            const atsName = isGh ? 'Greenhouse' : (isAshby ? 'Ashby' : (isAwwwards ? 'Awwwards' : 'Career Portal'));

            // Construct array of all official links present in the Job JSON
            const allLinks = [];
            if (appUrl) {
                allLinks.push({
                    label: `Direct Application Form`,
                    badge: 'Apply Now',
                    badgeBg: '#ECFDF5',
                    badgeColor: '#047857',
                    url: appUrl,
                    desc: `Official application endpoint from ${escapeHtml(atsName)} JSON dataset`
                });
            }
            if (jobUrl && jobUrl !== appUrl) {
                allLinks.push({
                    label: `Official Job Posting`,
                    badge: 'Job Page',
                    badgeBg: '#EEF2FF',
                    badgeColor: '#4338CA',
                    url: jobUrl,
                    desc: `Official public posting page for ${escapeHtml(currentJob.job_title)}`
                });
            }
            if (currentJob.company_url || currentJob.company_website) {
                const compSite = currentJob.company_url || currentJob.company_website;
                allLinks.push({
                    label: `${escapeHtml(currentJob.company)} Company Website`,
                    badge: 'Website',
                    badgeBg: '#FFFBEB',
                    badgeColor: '#B45309',
                    url: compSite,
                    desc: 'Corporate company home page'
                });
            }

            // Update Sidebar Apply Button
            const sidebarApplyBtn = document.getElementById('sidebarApplyBtn');
            if (sidebarApplyBtn) {
                sidebarApplyBtn.innerHTML = `Apply on ${atsName} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`;
            }

            // Update Floating Action Bar Apply Button
            const fabApplyBtn = document.querySelector('.fab-apply-btn');
            if (fabApplyBtn) {
                fabApplyBtn.textContent = `Apply on ${atsName} ↗`;
            }

            // Populate Links List in Sidebar
            const linksListEl = document.getElementById('jdLinksList');
            if (linksListEl) {
                linksListEl.innerHTML = allLinks.map(lnk => `
                    <div style="background: #FAFAFA; border: 1px solid #E5E7EB; border-radius: 10px; padding: 10px 12px; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                        <div style="overflow: hidden; flex: 1;">
                            <div style="font-size: 10px; font-weight: 700; color: ${lnk.badgeColor}; background: ${lnk.badgeBg}; padding: 2px 6px; border-radius: 4px; display: inline-block; text-transform: uppercase;">${escapeHtml(lnk.badge)}</div>
                            <div style="font-size: 12px; font-weight: 600; color: #111; margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(lnk.label)}">${escapeHtml(lnk.label)}</div>
                            <div style="font-size: 11px; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(lnk.url)}</div>
                        </div>
                        <div style="display: flex; gap: 4px; flex-shrink: 0;">
                            <button onclick="copyToClipboard('${escapeHtml(lnk.url)}')" title="Copy URL" style="background: white; border: 1px solid #D1D5DB; border-radius: 6px; padding: 6px; cursor: pointer; color: #4B5563;">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            </button>
                            <a href="${escapeHtml(lnk.url)}" target="_blank" rel="noopener noreferrer" style="background: #111; color: white; border-radius: 6px; padding: 6px 10px; font-size: 11px; font-weight: 600; text-decoration: none; display: flex; align-items: center; gap: 4px;">
                                Open
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                            </a>
                        </div>
                    </div>
                `).join('');
            }

            // Full Job Description Body (Perfect Formatting)
            const fullBody = document.getElementById('jdFullBody');
            if (fullBody) {
                let sourceBadgeHtml = '';
                if (isGh) {
                    sourceBadgeHtml = `
                        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #E5E7EB;">
                            <div style="display: inline-flex; align-items: center; gap: 8px; background: #ECFDF5; color: #047857; border: 1px solid #A7F3D0; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600;">
                                <span style="width: 8px; height: 8px; border-radius: 50%; background: #059669;"></span>
                                Greenhouse Verified Role (Direct ATS Pipeline)
                            </div>
                            ${appUrl ? `
                            <a href="${escapeHtml(appUrl)}" target="_blank" rel="noopener noreferrer" style="color: #047857; font-size: 13px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
                                Open on Greenhouse Board ↗
                            </a>` : ''}
                        </div>`;
                } else if (isAshby) {
                    sourceBadgeHtml = `
                        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #E5E7EB;">
                            <div style="display: inline-flex; align-items: center; gap: 8px; background: #EEF2FF; color: #4F46E5; border: 1px solid #C7D2FE; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600;">
                                <span style="width: 8px; height: 8px; border-radius: 50%; background: #4F46E5;"></span>
                                Verified Ashby Live Role (Uploaded ${currentJob.posted_date || '1 d ago'})
                            </div>
                            ${appUrl ? `
                            <a href="${escapeHtml(appUrl)}" target="_blank" rel="noopener noreferrer" style="color: #4F46E5; font-size: 13px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
                                View on ${escapeHtml(currentJob.company)} Ashby Board ↗
                            </a>` : ''}
                        </div>`;
                } else if (isAwwwards) {
                    sourceBadgeHtml = `
                        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #E5E7EB;">
                            <div style="display: inline-flex; align-items: center; gap: 8px; background: #FFF1F2; color: #E11D48; border: 1px solid #FECDD3; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600;">
                                <span style="width: 8px; height: 8px; border-radius: 50%; background: #E11D48;"></span>
                                Awwwards Curated Role (Web Designers & Developers)
                            </div>
                            <a href="${escapeHtml(appUrl || 'https://www.awwwards.com/jobs/')}" target="_blank" rel="noopener noreferrer" style="color: #E11D48; font-size: 13px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
                                View on Awwwards / Career Portal ↗
                            </a>
                        </div>`;
                }

                // Summary Strip with Salary and Metadata
                const metaStripHtml = `
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                        <div>
                            <div style="font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase;">Salary / Compensation</div>
                            <div style="font-size: 14px; font-weight: 700; color: #047857; margin-top: 4px;">${escapeHtml(compStr)}</div>
                        </div>
                        <div>
                            <div style="font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase;">Work Mode & Location</div>
                            <div style="font-size: 14px; font-weight: 600; color: #111; margin-top: 4px;">${escapeHtml(currentJob.work_mode || 'Remote')} • ${escapeHtml((currentJob.location || ['Remote'])[0])}</div>
                        </div>
                        <div>
                            <div style="font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase;">Employment Type</div>
                            <div style="font-size: 14px; font-weight: 600; color: #111; margin-top: 4px;">${escapeHtml(currentJob.employment_type || 'Full-time')}</div>
                        </div>
                        <div>
                            <div style="font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase;">ATS Source Platform</div>
                            <div style="font-size: 14px; font-weight: 700; color: #111; margin-top: 4px;">${escapeHtml((currentJob.source || 'Direct').toUpperCase())}</div>
                        </div>
                    </div>`;

                // Prominent In-Page Links Card
                const inPageLinksHtml = `
                    <div style="margin-bottom: 28px; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px; padding: 18px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                            <div style="font-size: 13px; font-weight: 700; color: #111; display: flex; align-items: center; gap: 8px;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF8A1E" stroke-width="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                Official Role & Application Links (${allLinks.length})
                            </div>
                            <span style="font-size: 11px; color: #6B7280; font-weight: 500;">Extracted directly from Job JSON dataset</span>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 10px;">
                            ${allLinks.map(lnk => `
                                <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 10px; padding: 12px; display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                                    <div style="overflow: hidden; flex: 1;">
                                        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                                            <span style="font-size: 10px; font-weight: 700; color: ${lnk.badgeColor}; background: ${lnk.badgeBg}; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">${escapeHtml(lnk.badge)}</span>
                                            <span style="font-size: 12px; font-weight: 700; color: #111; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(lnk.label)}</span>
                                        </div>
                                        <div style="font-size: 11px; color: #6B7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(lnk.url)}</div>
                                    </div>
                                    <div style="display: flex; gap: 6px; flex-shrink: 0;">
                                        <button onclick="copyToClipboard('${escapeHtml(lnk.url)}')" title="Copy Link" style="background: white; border: 1px solid #D1D5DB; border-radius: 6px; padding: 6px 8px; cursor: pointer; color: #4B5563; font-size: 11px; font-weight: 600; display: flex; align-items: center; gap: 4px;">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                        </button>
                                        <a href="${escapeHtml(lnk.url)}" target="_blank" rel="noopener noreferrer" style="background: #FF8A1E; color: white; border-radius: 6px; padding: 6px 12px; font-size: 11px; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 4px;">
                                            Open ↗
                                        </a>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>`;

                let applyCtaHtml = '';
                if (appUrl) {
                    applyCtaHtml = `
                        <div style="margin-top: 40px; padding: 28px; background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
                            <div>
                                <h4 style="font-size: 18px; font-weight: 700; color: #111; margin: 0;">Ready to apply at ${escapeHtml(currentJob.company)}?</h4>
                                <p style="font-size: 14px; color: #6B7280; margin: 6px 0 0 0;">Official application link directly from the job JSON dataset.</p>
                            </div>
                            <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                                <button onclick="copyToClipboard('${escapeHtml(appUrl)}')" style="background: white; border: 1px solid #D1D5DB; color: #374151; padding: 12px 18px; border-radius: 24px; font-size: 14px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                    Copy Link
                                </button>
                                <button onclick="applyJob()" style="background: #FF8A1E; color: white; border: none; padding: 12px 28px; border-radius: 24px; font-size: 14px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(255, 138, 30, 0.25);">
                                    Apply on ${escapeHtml(atsName)}
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                </button>
                            </div>
                        </div>`;
                }

                if (currentJob.description && currentJob.description.trim().length > 60) {
                    fullBody.innerHTML = `
                        ${sourceBadgeHtml}
                        ${metaStripHtml}
                        ${inPageLinksHtml}
                        <div class="job-real-description">
                            ${formatRichDescription(currentJob.description)}
                        </div>
                        ${applyCtaHtml}
                    `;
                } else {
                    fullBody.innerHTML = `
                        ${sourceBadgeHtml}
                        ${metaStripHtml}
                        ${inPageLinksHtml}
                        <div class="job-real-description">
                            <p><b>${escapeHtml(currentJob.company)}</b> is hiring for the role of <b>${escapeHtml(currentJob.job_title)}</b>. This role provides an exceptional opportunity to make high-impact contributions in the <b>${escapeHtml(currentJob.industry || 'Technology')}</b> space.</p>
                            <p>Our work environment supports <b>${escapeHtml(currentJob.work_mode || 'collaborative')}</b> setups across <b>${(currentJob.location || ['Global']).join(', ')}</b>.</p>
                            
                            <h4>Key Requirements &amp; Qualifications:</h4>
                            <ul>
                                <li>
                                    <span class="bullet-dot">&bull;</span>
                                    Professional experience: ${expTagText}.
                                </li>
                                <li>
                                    <span class="bullet-dot">&bull;</span>
                                    Strong background with required core technologies: <b>${(currentJob.required_skills || []).join(', ')}</b>.
                                </li>
                                ${currentJob.preferred_skills && currentJob.preferred_skills.length ? `
                                <li>
                                    <span class="bullet-dot">&bull;</span>
                                    Preferred skills &amp; tools: ${currentJob.preferred_skills.join(', ')}.
                                </li>` : ''}
                                <li>
                                    <span class="bullet-dot">&bull;</span>
                                    Demonstrated ability to drive initiatives, write clean scalable code, and collaborate effectively.
                                </li>
                            </ul>

                            <h4>What We Offer:</h4>
                            <ul>
                                <li>
                                    <span class="bullet-dot">&bull;</span>
                                    Competitive compensation package: <b>${escapeHtml(compStr)}</b>.
                                </li>
                                <li>
                                    <span class="bullet-dot">&bull;</span>
                                    Work-life balance with ${escapeHtml(currentJob.work_mode || 'flexible')} environment flexibility.
                                </li>
                                <li>
                                    <span class="bullet-dot">&bull;</span>
                                    Growth, ownership, and comprehensive benefits.
                                </li>
                            </ul>
                        </div>
                        ${applyCtaHtml}
                    `;
                }
            }

            // Summary View (Algorithm Match Breakdown)
            const matchSummaryText = document.getElementById('jdMatchSummaryText');
            if (matchSummaryText && matchResult.explanation) {
                matchSummaryText.textContent = matchResult.explanation.summary || `Calculated an overall fit of ${matchPct}% using the JobPath hybrid matching algorithm.`;
            }

            const breakdownGrid = document.getElementById('jdScoreBreakdownGrid');
            if (breakdownGrid && matchResult.match_breakdown) {
                const bd = matchResult.match_breakdown;
                const items = [
                    { label: 'Role Fit', val: bd.role },
                    { label: 'Skills Overlap', val: bd.skills },
                    { label: 'Experience', val: bd.experience },
                    { label: 'Work Mode', val: bd.work_mode },
                    { label: 'Location', val: bd.location },
                    { label: 'Salary', val: bd.salary }
                ];
                breakdownGrid.innerHTML = items.map(item => `
                    <div style="background: white; border: 1px solid #E5E7EB; border-radius: 8px; padding: 12px; text-align: center;">
                        <div style="font-size: 11px; color: #888; font-weight: 500; text-transform: uppercase;">${item.label}</div>
                        <div style="font-size: 18px; font-weight: 700; color: #111; margin-top: 4px;">${Math.round(item.val || 0)}%</div>
                    </div>
                `).join('');
            }

            const whyList = document.getElementById('jdWhyItMatchesList');
            if (whyList) {
                const reasons = (matchResult.explanation && matchResult.explanation.why_it_matches && matchResult.explanation.why_it_matches.length) 
                    ? matchResult.explanation.why_it_matches 
                    : [`Role matches your preferred target roles.`, `Experience level aligns with ${expTagText}.`];
                whyList.innerHTML = reasons.map(r => `<li style="margin-bottom: 6px;">${escapeHtml(r)}</li>`).join('');
            }

            const missingList = document.getElementById('jdWhatIsMissingList');
            if (missingList) {
                const gaps = (matchResult.explanation && matchResult.explanation.what_is_missing && matchResult.explanation.what_is_missing.length)
                    ? matchResult.explanation.what_is_missing
                    : ["No critical blockers identified for this role."];
                missingList.innerHTML = gaps.map(g => `<li style="margin-bottom: 6px;">${escapeHtml(g)}</li>`).join('');
            }

            const chipsList = document.getElementById('jdSkillsChipsList');
            if (chipsList) {
                const reqSkills = currentJob.required_skills || [];
                const prefSkills = currentJob.preferred_skills || [];
                const cSkills = (candidateProfile.skills || []).map(s => s.toLowerCase());

                let chipsHtml = '';
                reqSkills.forEach(s => {
                    const hasSkill = cSkills.some(cs => cs.includes(s.toLowerCase()) || s.toLowerCase().includes(cs));
                    chipsHtml += `<span style="background: ${hasSkill ? '#EAF5E5' : '#FEF3C7'}; color: ${hasSkill ? '#2E7D32' : '#B45309'}; border: 1px solid ${hasSkill ? '#BBF7D0' : '#FDE68A'}; border-radius: 16px; padding: 4px 12px; font-size: 13px; font-weight: 500;">${hasSkill ? '✓ ' : '! '}${escapeHtml(s)} (Required)</span>`;
                });
                prefSkills.forEach(s => {
                    const hasSkill = cSkills.some(cs => cs.includes(s.toLowerCase()) || s.toLowerCase().includes(cs));
                    chipsHtml += `<span style="background: #F3F4F6; color: #4B5563; border: 1px solid #E5E7EB; border-radius: 16px; padding: 4px 12px; font-size: 13px;">${hasSkill ? '✓ ' : ''}${escapeHtml(s)}</span>`;
                });
                chipsList.innerHTML = chipsHtml;
            }

            updateLikeBtn();
        }

        document.addEventListener('DOMContentLoaded', loadJobDetails);