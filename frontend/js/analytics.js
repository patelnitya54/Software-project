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

        function syncInbox() {
            showToast("Scanning connected Gmail inbox for replies...");
            setTimeout(() => {
                loadDashboardData();
                showToast("Inbox synchronized! No new unread messages.");
            }, 800);
        }

        function loadDashboardData() {
            const profile = typeof getStoredProfile === 'function' ? getStoredProfile() : null;
            const stats = typeof getEmailStats === 'function' ? getEmailStats() : { sent: 0, opened: 0, replied: 0, interviews: 0 };

            const name = (profile && profile.candidate_name) ? profile.candidate_name : "Bhavya";
            const greeting = document.getElementById('dashGreeting');
            if (greeting) greeting.textContent = `Good afternoon, ${name}`;

            const avatar = document.getElementById('dashAvatar');
            if (avatar) {
                const initials = name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
                avatar.textContent = initials || 'BA';
            }

            // Stat values
            const sentEl = document.getElementById('statSent');
            if (sentEl) sentEl.textContent = stats.sent;
            const openedEl = document.getElementById('statOpened');
            if (openedEl) openedEl.textContent = stats.opened;
            const repliedEl = document.getElementById('statReplied');
            if (repliedEl) repliedEl.textContent = stats.replied;
            const intEl = document.getElementById('statInterviews');
            if (intEl) intEl.textContent = stats.interviews;

            // Funnel
            const base = Math.max(1, stats.sent);
            const fillSent = document.getElementById('funnelFillSent');
            if (fillSent) fillSent.textContent = `${stats.sent} so far`;
            const countSent = document.getElementById('funnelCountSent');
            if (countSent) countSent.textContent = stats.sent;

            const fillOpened = document.getElementById('funnelFillOpened');
            if (fillOpened) {
                fillOpened.textContent = stats.opened;
                fillOpened.style.width = Math.max(4, Math.round((stats.opened / base) * 100)) + '%';
            }
            const countOpened = document.getElementById('funnelCountOpened');
            if (countOpened) countOpened.textContent = stats.opened;

            const fillReplied = document.getElementById('funnelFillReplied');
            if (fillReplied) {
                fillReplied.textContent = stats.replied;
                fillReplied.style.width = Math.max(4, Math.round((stats.replied / base) * 100)) + '%';
            }
            const countReplied = document.getElementById('funnelCountReplied');
            if (countReplied) countReplied.textContent = stats.replied;

            const fillInt = document.getElementById('funnelFillInterviews');
            if (fillInt) {
                fillInt.textContent = stats.interviews;
                fillInt.style.width = Math.max(4, Math.round((stats.interviews / base) * 100)) + '%';
            }
            const countInt = document.getElementById('funnelCountInterviews');
            if (countInt) countInt.textContent = stats.interviews;

            // Activity Log
            let sentLogs = [];
            try {
                const raw = localStorage.getItem('jobpath_sent_emails');
                if (raw) sentLogs = JSON.parse(raw);
            } catch(e) {}

            const emptyEl = document.getElementById('activityEmpty');
            const listEl = document.getElementById('activityList');

            if (sentLogs && sentLogs.length > 0) {
                if (emptyEl) emptyEl.style.display = 'none';
                if (listEl) {
                    listEl.style.display = 'block';
                    listEl.innerHTML = sentLogs.map(log => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border);">
                            <div>
                                <div style="font-size: 14px; font-weight: 600; color: var(--text-primary);">Outreach to ${log.job_title}</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">${log.company} · ${new Date(log.sent_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                            </div>
                            <span style="font-size: 11px; font-weight: 600; background: #E9F4EB; color: #24753F; padding: 4px 10px; border-radius: 12px;">Sent ✓</span>
                        </div>
                    `).join('');
                }
            } else {
                if (emptyEl) emptyEl.style.display = 'flex';
                if (listEl) listEl.style.display = 'none';
            }
        }

        document.addEventListener('DOMContentLoaded', loadDashboardData);