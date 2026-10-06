/**
 * ==========================================================================
 * JOBSEEK AUTHENTICATION LOGIC (js/auth.js)
 * Static frontend authentication handling with localStorage
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check if logged in already and update UI pills if needed
  initAuthPills();

  // Setup Login Modal handlers (on landing page or pages with login modal)
  initLoginModal();

  // Setup Sign Up Page Form (on signup.html)
  initSignupForm();

  // Setup Landing Page Search Redirection
  initHeroSearch();
});

/**
 * Update navbar user pill state
 */
function initAuthPills() {
  const isLoggedIn = localStorage.getItem('jobseek_loggedIn') === 'true';
  const savedUserStr = localStorage.getItem('jobseek_user');
  
  if (isLoggedIn && savedUserStr) {
    try {
      const user = JSON.parse(savedUserStr);
      const navActions = document.querySelector('.navbar-actions');
      if (navActions && !document.querySelector('.user-profile-pill')) {
        // Show active user pill if signed in
        const userPill = document.createElement('div');
        userPill.className = 'user-status-pill user-profile-pill';
        userPill.innerHTML = `
          <span class="dot"></span>
          <span>${escapeHtml(user.name || 'User')}</span>
          <a href="#" id="logoutBtn" style="color: var(--accent-error); font-size: 11px; margin-left: 4px; font-weight: 600;">(Logout)</a>
        `;
        navActions.prepend(userPill);

        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem('jobseek_loggedIn');
          window.location.reload();
        });
      }
    } catch (e) {
      console.error('Error parsing user session', e);
    }
  }
}

/**
 * Modal open / close logic for Quick Login
 */
function initLoginModal() {
  const loginBtns = document.querySelectorAll('[data-action="open-login"]');
  const loginModal = document.getElementById('loginModal');
  const closeBtn = document.getElementById('closeLoginModal');
  const loginForm = document.getElementById('modalLoginForm');
  const errorAlert = document.getElementById('loginErrorAlert');

  if (!loginModal) return;

  // Open Modal
  loginBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      loginModal.classList.add('active');
      errorAlert?.classList.add('hidden');
      document.getElementById('loginEmail')?.focus();
    });
  });

  // Close Modal
  closeBtn?.addEventListener('click', () => {
    loginModal.classList.remove('active');
  });

  // Close on backdrop click
  loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      loginModal.classList.remove('active');
    }
  });

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && loginModal.classList.contains('active')) {
      loginModal.classList.remove('active');
    }
  });

  // Handle Login submission
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('loginEmail');
      const passwordInput = document.getElementById('loginPassword');
      const email = emailInput.value.trim();
      const password = passwordInput.value;

      // Validation
      let isValid = true;
      if (!validateEmail(email)) {
        showInputError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearInputError(emailInput);
      }

      if (!password) {
        showInputError(passwordInput, 'Password is required.');
        isValid = false;
      } else {
        clearInputError(passwordInput);
      }

      if (!isValid) return;

      // Check against localStorage
      const savedUserStr = localStorage.getItem('jobseek_user');
      let authenticated = false;
      let matchedName = 'User';

      if (savedUserStr) {
        try {
          const user = JSON.parse(savedUserStr);
          if (user.email.toLowerCase() === email.toLowerCase() && user.password === password) {
            authenticated = true;
            matchedName = user.name;
          }
        } catch (err) {
          console.error(err);
        }
      }

      // Demo fallback credentials for testing convenience
      if (!authenticated && email.toLowerCase() === 'demo@jobseek.com' && password === 'password123') {
        authenticated = true;
        matchedName = 'Demo Explorer';
        localStorage.setItem('jobseek_user', JSON.stringify({
          name: matchedName,
          email: 'demo@jobseek.com',
          password: 'password123'
        }));
      }

      if (authenticated) {
        localStorage.setItem('jobseek_loggedIn', 'true');
        showModalSuccess(loginForm, `Welcome back, ${matchedName}! Redirecting to onboarding...`);
        setTimeout(() => {
          window.location.href = 'onboarding.html';
        }, 800);
      } else {
        if (errorAlert) {
          errorAlert.textContent = savedUserStr 
            ? 'Invalid email or password. Please try again.' 
            : 'Account not found. Please sign up or use demo@jobseek.com / password123.';
          errorAlert.style.display = 'flex';
        }
      }
    });
  }
}

/**
 * Handle Signup Page Form (signup.html)
 */
function initSignupForm() {
  const signupForm = document.getElementById('signupForm');
  if (!signupForm) return;

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('signupName');
    const emailInput = document.getElementById('signupEmail');
    const passwordInput = document.getElementById('signupPassword');
    const confirmPasswordInput = document.getElementById('signupConfirmPassword');
    const alertBox = document.getElementById('signupAlert');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    let isValid = true;

    // Validate Name
    if (name.length < 2) {
      showInputError(nameInput, 'Please enter your full name.');
      isValid = false;
    } else {
      clearInputError(nameInput);
    }

    // Validate Email
    if (!validateEmail(email)) {
      showInputError(emailInput, 'Please enter a valid email address.');
      isValid = false;
    } else {
      clearInputError(emailInput);
    }

    // Validate Password (min 8 chars)
    if (password.length < 8) {
      showInputError(passwordInput, 'Password must be at least 8 characters long.');
      isValid = false;
    } else {
      clearInputError(passwordInput);
    }

    // Validate Confirm Password
    if (password !== confirmPassword) {
      showInputError(confirmPasswordInput, 'Passwords do not match.');
      isValid = false;
    } else {
      clearInputError(confirmPasswordInput);
    }

    if (!isValid) return;

    // Save to localStorage
    // Note: Demo localStorage storage for prototyping
    const userData = {
      name: name,
      email: email,
      password: password, // Frontend demo prototype only
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('jobseek_user', JSON.stringify(userData));
    localStorage.setItem('jobseek_loggedIn', 'true');

    if (alertBox) {
      alertBox.className = 'form-alert form-alert-success';
      alertBox.textContent = 'Account created successfully! Taking you to onboarding...';
      alertBox.style.display = 'flex';
    }

    const submitBtn = signupForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Setting up your profile...';
    }

    setTimeout(() => {
      window.location.href = 'onboarding.html';
    }, 1000);
  });
}

/**
 * Landing Page search interaction
 */
function initHeroSearch() {
  const searchInput = document.getElementById('heroSearchInput');
  const searchBtn = document.getElementById('findJobBtn');
  const tagChips = document.querySelectorAll('.search-tag-chip');

  if (searchInput && searchBtn) {
    const handleRedirect = () => {
      window.location.href = 'signup.html';
    };

    searchBtn.addEventListener('click', handleRedirect);
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleRedirect();
    });

    tagChips.forEach(chip => {
      chip.addEventListener('click', () => {
        searchInput.value = chip.textContent.trim();
        //setTimeout(handleRedirect, 200);
      });
    });
  }
}

/* Helper Utilities */
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showInputError(inputEl, message) {
  inputEl.classList.add('is-invalid');
  const feedback = inputEl.parentElement.querySelector('.invalid-feedback');
  if (feedback) {
    feedback.textContent = message;
    feedback.style.display = 'block';
  }
}

function clearInputError(inputEl) {
  inputEl.classList.remove('is-invalid');
  const feedback = inputEl.parentElement.querySelector('.invalid-feedback');
  if (feedback) {
    feedback.style.display = 'none';
  }
}

function showModalSuccess(form, message) {
  form.innerHTML = `
    <div style="text-align: center; padding: 2rem 0;">
      <div style="width: 48px; height: 48px; background: var(--accent-success-light); color: var(--accent-success); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 24px;">✓</div>
      <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-primary);">${escapeHtml(message)}</h3>
      <p style="font-size: 0.875rem; color: var(--text-muted);">Please wait a moment...</p>
    </div>
  `;
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
