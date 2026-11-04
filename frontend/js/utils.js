/**
 * JobPath Frontend — Shared Utility Functions.
 *
 * Common helpers used across all pages.
 * Eliminates duplication of escapeHtml, formatSalary, toast, etc.
 */

const Utils = (() => {
    /**
     * Escape HTML special characters to prevent XSS.
     */
    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(String(str)));
        return div.innerHTML;
    }

    /**
     * Format salary for display.
     */
    function formatSalary(job) {
        const display = (job.salary_display || job.salary || '').trim();
        if (display && display !== 'Competitive') return display;

        const min = job.salary_min;
        const max = job.salary_max;
        if (min && max && min !== max) {
            return '$' + Math.round(min / 1000) + 'K – $' + Math.round(max / 1000) + 'K';
        }
        if (max) return 'Up to $' + Math.round(max / 1000) + 'K';
        if (min) return 'From $' + Math.round(min / 1000) + 'K';
        return display || 'Competitive';
    }

    /**
     * Show a toast notification.
     */
    function showToast(msg, duration = 3000) {
        let toast = document.getElementById('toast-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast-notification';
            toast.style.cssText = `
                position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
                background: #111; color: #fff; padding: 12px 24px; border-radius: 12px;
                font-size: 14px; z-index: 10000; transition: opacity 0.3s; opacity: 0;
                display: none; box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            `;
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.style.display = 'block';
        setTimeout(() => { toast.style.opacity = '1'; }, 10);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => { toast.style.display = 'none'; }, 300);
        }, duration);
    }

    /**
     * Copy text to clipboard and show toast.
     */
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(
            () => showToast('Copied to clipboard!'),
            () => showToast('Copy failed'),
        );
    }

    /**
     * Format a rich job description with sections and bullets.
     */
    function formatRichDescription(rawText) {
        if (!rawText) return '<p style="color: #888;">No description available.</p>';
        let text = rawText
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/?(p|div|h[1-6]|li|ul|ol)[^>]*>/gi, '\n')
            .replace(/<[^>]+>/g, '')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&nbsp;/g, ' ');

        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        let html = '';

        for (const line of lines) {
            if (/^(about|what|who|why|how|our|your|the|key|minimum|preferred|nice|bonus|benefits|requirements|qualifications|responsibilities|job\s+description)/i.test(line)
                && line.length < 100) {
                html += '<h3 style="margin: 20px 0 8px; font-size: 16px; font-weight: 700; color: #111;">'
                    + escapeHtml(line) + '</h3>';
            } else if (/^[\-•●○◆▸▹→\*]\s/.test(line) || /^\d+[\.\)]\s/.test(line)) {
                html += '<li style="margin: 4px 0 4px 20px; color: #444; line-height: 1.6;">'
                    + escapeHtml(line.replace(/^[\-•●○◆▸▹→\*\d\.\)]+\s*/, '')) + '</li>';
            } else {
                html += '<p style="margin: 8px 0; color: #444; line-height: 1.7;">'
                    + escapeHtml(line) + '</p>';
            }
        }
        return html;
    }

    /**
     * Get source badge HTML for a job.
     */
    function getSourceBadge(source) {
        const src = (source || '').toLowerCase();
        const configs = {
            greenhouse: { bg: '#ECFDF5', color: '#059669', border: '#A7F3D0', label: 'Greenhouse' },
            ashby: { bg: '#EEF2FF', color: '#4F46E5', border: '#C7D2FE', label: 'Ashby' },
            awwwards: { bg: '#FFF1F2', color: '#E11D48', border: '#FECDD3', label: 'Awwwards' },
        };
        const c = configs[src];
        if (!c) return '';
        return '<span class="tag" style="background:' + c.bg + '; color:' + c.color
            + '; border-color:' + c.border + '; font-weight:600;">' + c.label + '</span>';
    }

    /**
     * Debounce a function call.
     */
    function debounce(fn, delay = 300) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    /**
     * Generate a match percentage color.
     */
    function matchColor(pct) {
        if (pct >= 70) return '#059669';
        if (pct >= 40) return '#D97706';
        return '#DC2626';
    }

    return {
        escapeHtml,
        formatSalary,
        showToast,
        copyToClipboard,
        formatRichDescription,
        getSourceBadge,
        debounce,
        matchColor,
    };
})();

