/**
 * ==========================================================================
 * JOBSEEK ONBOARDING LOGIC (js/onboarding.js)
 * Multi-step career questionnaire, validation, JSON builder, and export
 * ==========================================================================
 */

// State Object for Onboarding Answers
const onboardingState = {
  currentStep: 1,
  totalSteps: 6, // 1 to 5: questions, 6: review
  answers: {
    user: {
      name: '',
      email: ''
    },
    basicInfo: {
      currentLocation: '',
      preferredLocation: '',
      relocate: true
    },
    experience: {
      years: '',
      level: '',
      lastJobTitle: ''
    },
    skills: [], // Array of { name: string, proficiency: 'Beginner' | 'Intermediate' | 'Expert' }
    preferences: {
      roles: [],
      jobTypes: [],
      salaryRange: '',
      noticePeriod: ''
    },
    education: {
      highest: '',
      field: '',
      careerGoal: '',
      availability: ''
    },
    completedAt: null
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Check auth session
  checkAuthGuard();

  // Initialize UI components and events
  initStepNavigation();
  initOptionCardListeners();
  initSkillsSelector();
  initCustomSkillAdder();
  initFinishAndDownload();

  // Load existing user info
  loadInitialUserInfo();

  // Render initial step
  updateStepView();
});

/**
 * Auth Guard
 */
function checkAuthGuard() {
  const isLoggedIn = localStorage.getItem('jobseek_loggedIn') === 'true';
  const savedUserStr = localStorage.getItem('jobseek_user');

  if (!isLoggedIn || !savedUserStr) {
    // If not logged in, redirect to login/landing page
    // Note: We provide a friendly notification banner if accessed directly
    const guardBanner = document.getElementById('authGuardNotice');
    if (guardBanner) {
      guardBanner.style.display = 'block';
    } else {
      window.location.href = 'index.html';
    }
  }
}

/**
 * Load Initial User Info from localStorage
 */
function loadInitialUserInfo() {
  const savedUserStr = localStorage.getItem('jobseek_user');
  if (savedUserStr) {
    try {
      const user = JSON.parse(savedUserStr);
      onboardingState.answers.user.name = user.name || 'Candidate';
      onboardingState.answers.user.email = user.email || '';

      const userNamePlaceholder = document.getElementById('welcomeUserName');
      if (userNamePlaceholder) {
        userNamePlaceholder.textContent = user.name || 'there';
      }
    } catch (e) {
      console.error(e);
    }
  }
}

/**
 * Step Navigation (Next / Back)
 */
function initStepNavigation() {
  const nextBtn = document.getElementById('nextStepBtn');
  const backBtn = document.getElementById('backStepBtn');

  nextBtn?.addEventListener('click', () => {
    if (validateCurrentStep(onboardingState.currentStep)) {
      if (onboardingState.currentStep < onboardingState.totalSteps) {
        onboardingState.currentStep++;
        updateStepView();
      } else if (onboardingState.currentStep === onboardingState.totalSteps) {
        // From review to completion
        completeOnboarding();
      }
    }
  });

  backBtn?.addEventListener('click', () => {
    if (onboardingState.currentStep > 1) {
      onboardingState.currentStep--;
      updateStepView();
    }
  });
}

/**
 * Update active step view, progress bar, and buttons
 */
function updateStepView() {
  const step = onboardingState.currentStep;
  const total = onboardingState.totalSteps;

  // Update progress bar
  const progressFill = document.getElementById('progressFill');
  const stepNumberText = document.getElementById('stepNumberText');
  const stepLabelText = document.getElementById('stepLabelText');

  const stepLabels = [
    'Basic Information',
    'Experience Level',
    'Core Skills',
    'Role & Preferences',
    'Education & Goals',
    'Review Profile'
  ];

  if (progressFill) {
    const percentage = ((step) / total) * 100;
    progressFill.style.width = `${percentage}%`;
  }

  if (stepNumberText) {
    stepNumberText.textContent = `Step ${step} of ${total}`;
  }

  if (stepLabelText) {
    stepLabelText.textContent = stepLabels[step - 1] || '';
  }

  // Toggle step panels
  document.querySelectorAll('.step-content').forEach((panel) => {
    panel.classList.remove('active');
  });

  const currentPanel = document.getElementById(`stepPanel${step}`);
  if (currentPanel) {
    currentPanel.classList.add('active');
  }

  // Update button texts
  const backBtn = document.getElementById('backStepBtn');
  const nextBtn = document.getElementById('nextStepBtn');

  if (backBtn) {
    backBtn.style.visibility = step === 1 ? 'hidden' : 'visible';
  }

  if (nextBtn) {
    if (step === total) {
      nextBtn.textContent = 'Finish & Save Profile';
      nextBtn.className = 'btn btn-primary';
      renderReviewSummary();
    } else {
      nextBtn.textContent = 'Continue';
      nextBtn.className = 'btn btn-primary';
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Validate each step before advancing
 */
function validateCurrentStep(step) {
  clearStepErrors();

  if (step === 1) {
    const currentLoc = document.getElementById('currentLocationInput')?.value.trim();
    const prefLoc = document.getElementById('preferredLocationInput')?.value.trim();

    if (!currentLoc) {
      showError('currentLocationInput', 'Please provide your current location/city.');
      return false;
    }
    if (!prefLoc) {
      showError('preferredLocationInput', 'Please provide your preferred work location.');
      return false;
    }

    onboardingState.answers.basicInfo.currentLocation = currentLoc;
    onboardingState.answers.basicInfo.preferredLocation = prefLoc;
    return true;
  }

  if (step === 2) {
    if (!onboardingState.answers.experience.years) {
      showErrorAlert('step2Alert', 'Please select your total years of experience.');
      return false;
    }
    if (!onboardingState.answers.experience.level) {
      showErrorAlert('step2Alert', 'Please select your current experience level.');
      return false;
    }
    const lastTitle = document.getElementById('lastJobTitleInput')?.value.trim();
    onboardingState.answers.experience.lastJobTitle = lastTitle || 'Not specified';
    return true;
  }

  if (step === 3) {
    if (onboardingState.answers.skills.length === 0) {
      showErrorAlert('step3Alert', 'Please select or add at least 1 core skill.');
      return false;
    }
    return true;
  }

  if (step === 4) {
    if (onboardingState.answers.preferences.roles.length === 0) {
      showErrorAlert('step4Alert', 'Please select at least one role you are interested in.');
      return false;
    }
    if (onboardingState.answers.preferences.jobTypes.length === 0) {
      showErrorAlert('step4Alert', 'Please select at least one job opportunity type.');
      return false;
    }

    const salarySelect = document.getElementById('salaryRangeSelect')?.value;
    const noticeSelect = document.getElementById('noticePeriodSelect')?.value;

    onboardingState.answers.preferences.salaryRange = salarySelect || 'Flexible';
    onboardingState.answers.preferences.noticePeriod = noticeSelect || 'Immediate';
    return true;
  }

  if (step === 5) {
    const highestEdu = document.getElementById('highestEducationSelect')?.value;
    const fieldStudy = document.getElementById('fieldStudyInput')?.value.trim();
    const careerGoal = document.getElementById('careerGoalInput')?.value.trim();
    const availability = document.getElementById('availabilitySelect')?.value;

    if (!highestEdu) {
      showError('highestEducationSelect', 'Please select your highest level of education.');
      return false;
    }
    if (!careerGoal) {
      showError('careerGoalInput', 'Please share a brief career goal or summary.');
      return false;
    }

    onboardingState.answers.education.highest = highestEdu;
    onboardingState.answers.education.field = fieldStudy || 'General';
    onboardingState.answers.education.careerGoal = careerGoal;
    onboardingState.answers.education.availability = availability || 'Immediate';
    return true;
  }

  return true;
}

/**
 * Handle Option Cards (Radio & Checkbox Selection)
 */
function initOptionCardListeners() {
  document.querySelectorAll('.option-card').forEach((card) => {
    card.addEventListener('click', () => {
      const type = card.getAttribute('data-type'); // 'radio' or 'checkbox'
      const group = card.getAttribute('data-group');
      const val = card.getAttribute('data-value');

      if (type === 'radio') {
        // Deselect siblings in the same group
        document.querySelectorAll(`.option-card[data-group="${group}"]`).forEach((c) => {
          c.classList.remove('selected');
        });
        card.classList.add('selected');

        // Update state
        if (group === 'exp-years') {
          onboardingState.answers.experience.years = val;
        } else if (group === 'exp-level') {
          onboardingState.answers.experience.level = val;
        } else if (group === 'relocate') {
          onboardingState.answers.basicInfo.relocate = val === 'yes';
        }
      } else if (type === 'checkbox') {
        card.classList.toggle('selected');
        const isSelected = card.classList.contains('selected');

        if (group === 'roles') {
          if (isSelected) {
            if (!onboardingState.answers.preferences.roles.includes(val)) {
              onboardingState.answers.preferences.roles.push(val);
            }
          } else {
            onboardingState.answers.preferences.roles = onboardingState.answers.preferences.roles.filter(r => r !== val);
          }
        } else if (group === 'job-types') {
          if (isSelected) {
            if (!onboardingState.answers.preferences.jobTypes.includes(val)) {
              onboardingState.answers.preferences.jobTypes.push(val);
            }
          } else {
            onboardingState.answers.preferences.jobTypes = onboardingState.answers.preferences.jobTypes.filter(t => t !== val);
          }
        }
      }
    });
  });
}

/**
 * Skills Selection & Proficiency Selector
 */
function initSkillsSelector() {
  document.querySelectorAll('.skill-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const skillName = chip.getAttribute('data-skill');
      const isSelected = chip.classList.contains('selected');

      if (isSelected) {
        removeSkill(skillName);
        chip.classList.remove('selected');
      } else {
        addSkill(skillName, 'Intermediate');
        chip.classList.add('selected');
      }
    });
  });
}

function initCustomSkillAdder() {
  const addBtn = document.getElementById('addCustomSkillBtn');
  const customInput = document.getElementById('customSkillInput');

  const handleAdd = () => {
    const val = customInput.value.trim();
    if (val && !onboardingState.answers.skills.some(s => s.name.toLowerCase() === val.toLowerCase())) {
      addSkill(val, 'Intermediate');
      customInput.value = '';
    }
  };

  addBtn?.addEventListener('click', handleAdd);
  customInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  });
}

function addSkill(name, proficiency = 'Intermediate') {
  if (!onboardingState.answers.skills.some(s => s.name.toLowerCase() === name.toLowerCase())) {
    onboardingState.answers.skills.push({ name, proficiency });
    renderSelectedSkillsList();
  }
}

function removeSkill(name) {
  onboardingState.answers.skills = onboardingState.answers.skills.filter(s => s.name.toLowerCase() !== name.toLowerCase());
  // Uncheck chip if present
  document.querySelectorAll(`.skill-chip[data-skill="${name}"]`).forEach(c => c.classList.remove('selected'));
  renderSelectedSkillsList();
}

function renderSelectedSkillsList() {
  const listContainer = document.getElementById('selectedSkillsList');
  if (!listContainer) return;

  if (onboardingState.answers.skills.length === 0) {
    listContainer.innerHTML = '<p style="font-size: 0.875rem; color: var(--text-muted); font-style: italic;">No skills selected yet. Click any skill chip above or add your own.</p>';
    return;
  }

  listContainer.innerHTML = '';
  onboardingState.answers.skills.forEach((skill) => {
    const item = document.createElement('div');
    item.className = 'selected-skill-item';
    item.innerHTML = `
      <span class="selected-skill-name">${escapeHtml(skill.name)}</span>
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div class="proficiency-selector">
          <button type="button" class="proficiency-btn ${skill.proficiency === 'Beginner' ? 'active' : ''}" data-skill="${escapeHtml(skill.name)}" data-level="Beginner">Beginner</button>
          <button type="button" class="proficiency-btn ${skill.proficiency === 'Intermediate' ? 'active' : ''}" data-skill="${escapeHtml(skill.name)}" data-level="Intermediate">Intermediate</button>
          <button type="button" class="proficiency-btn ${skill.proficiency === 'Expert' ? 'active' : ''}" data-skill="${escapeHtml(skill.name)}" data-level="Expert">Expert</button>
        </div>
        <button type="button" class="remove-skill-btn" title="Remove" data-remove="${escapeHtml(skill.name)}">&times;</button>
      </div>
    `;
    listContainer.appendChild(item);
  });

  // Attach proficiency buttons & remove events
  listContainer.querySelectorAll('.proficiency-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sName = btn.getAttribute('data-skill');
      const lvl = btn.getAttribute('data-level');
      const target = onboardingState.answers.skills.find(s => s.name === sName);
      if (target) {
        target.proficiency = lvl;
        renderSelectedSkillsList();
      }
    });
  });

  listContainer.querySelectorAll('.remove-skill-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sName = btn.getAttribute('data-remove');
      removeSkill(sName);
    });
  });
}

/**
 * Render Step 6: Review Summary
 */
function renderReviewSummary() {
  const container = document.getElementById('reviewSummaryContainer');
  if (!container) return;

  const { basicInfo, experience, skills, preferences, education } = onboardingState.answers;

  const skillsText = skills.map(s => `${s.name} (${s.proficiency})`).join(', ') || 'None';
  const rolesText = preferences.roles.join(', ') || 'Open to all';
  const jobTypesText = preferences.jobTypes.join(', ') || 'Any';

  container.innerHTML = `
    <div class="review-block">
      <div class="review-block-header">
        <span class="review-block-title">1. Location & Mobility</span>
        <button type="button" class="review-edit-btn" onclick="goToStep(1)">Edit</button>
      </div>
      <div class="review-block-value">
        ${escapeHtml(basicInfo.currentLocation)} → Preferred: ${escapeHtml(basicInfo.preferredLocation)}
        <span style="color: var(--text-muted); font-size: 0.8rem;"> (${basicInfo.relocate ? 'Willing to relocate' : 'Not relocating'})</span>
      </div>
    </div>

    <div class="review-block">
      <div class="review-block-header">
        <span class="review-block-title">2. Experience</span>
        <button type="button" class="review-edit-btn" onclick="goToStep(2)">Edit</button>
      </div>
      <div class="review-block-value">
        ${escapeHtml(experience.level)} · ${escapeHtml(experience.years)} Experience
        ${experience.lastJobTitle ? `<div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px;">Last title: ${escapeHtml(experience.lastJobTitle)}</div>` : ''}
      </div>
    </div>

    <div class="review-block">
      <div class="review-block-header">
        <span class="review-block-title">3. Skills (${skills.length})</span>
        <button type="button" class="review-edit-btn" onclick="goToStep(3)">Edit</button>
      </div>
      <div class="review-block-value" style="line-height: 1.6;">
        ${escapeHtml(skillsText)}
      </div>
    </div>

    <div class="review-block">
      <div class="review-block-header">
        <span class="review-block-title">4. Job Preferences</span>
        <button type="button" class="review-edit-btn" onclick="goToStep(4)">Edit</button>
      </div>
      <div class="review-block-value">
        <div><strong>Roles:</strong> ${escapeHtml(rolesText)}</div>
        <div><strong>Job Types:</strong> ${escapeHtml(jobTypesText)}</div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">
          Expected Salary: ${escapeHtml(preferences.salaryRange)} | Notice: ${escapeHtml(preferences.noticePeriod)}
        </div>
      </div>
    </div>

    <div class="review-block">
      <div class="review-block-header">
        <span class="review-block-title">5. Education & Goal</span>
        <button type="button" class="review-edit-btn" onclick="goToStep(5)">Edit</button>
      </div>
      <div class="review-block-value">
        <div>${escapeHtml(education.highest)} ${education.field ? `in ${escapeHtml(education.field)}` : ''}</div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">"${escapeHtml(education.careerGoal)}"</div>
      </div>
    </div>
  `;
}

window.goToStep = function(stepNum) {
  onboardingState.currentStep = stepNum;
  updateStepView();
};

/**
 * Complete Onboarding & Save JSON
 */
function completeOnboarding() {
  onboardingState.answers.completedAt = new Date().toISOString();

  // Save to localStorage
  localStorage.setItem('jobseek_onboarding', JSON.stringify(onboardingState.answers, null, 2));

  // Hide questionnaire panels and action bar
  document.getElementById('onboardingFormPanel').style.display = 'none';
  document.getElementById('onboardingActionsBar').style.display = 'none';
  document.querySelector('.onboarding-progress-header').style.display = 'none';

  // Show completion screen
  const completionScreen = document.getElementById('completionScreen');
  if (completionScreen) {
    completionScreen.style.display = 'block';
  }

  // Populate formatted JSON preview
  const jsonPreview = document.getElementById('jsonPreviewBlock');
  if (jsonPreview) {
    jsonPreview.textContent = JSON.stringify(onboardingState.answers, null, 2);
  }
}

/**
 * Handle Download JSON button
 */
function initFinishAndDownload() {
  const downloadBtn = document.getElementById('downloadJsonBtn');
  downloadBtn?.addEventListener('click', () => {
    const dataStr = JSON.stringify(onboardingState.answers, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jobseek-onboarding-answers.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

/* Helper UI Error Alerts */
function showError(inputId, msg) {
  const el = document.getElementById(inputId);
  if (el) {
    el.classList.add('is-invalid');
    const fb = el.parentElement.querySelector('.invalid-feedback');
    if (fb) {
      fb.textContent = msg;
      fb.style.display = 'block';
    }
  }
}

function showErrorAlert(alertId, msg) {
  const al = document.getElementById(alertId);
  if (al) {
    al.textContent = msg;
    al.style.display = 'flex';
  }
}

function clearStepErrors() {
  document.querySelectorAll('.form-control').forEach(el => el.classList.remove('is-invalid'));
  document.querySelectorAll('.invalid-feedback').forEach(fb => fb.style.display = 'none');
  document.querySelectorAll('.form-alert-error').forEach(al => al.style.display = 'none');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
