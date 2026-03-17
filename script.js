/* ═══════════════════════════════════════
   KELVANTIS — script.js
   Vanilla JS, no dependencies
═══════════════════════════════════════ */

'use strict';

/* ─── Utility: throttle ─── */
function throttle(fn, delay) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn.apply(this, args);
    }
  };
}

/* ═══════════════════════════════════════
   1. NAVBAR — scroll effect + active links
═══════════════════════════════════════ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('.navbar__link');
  const mobileLinks = document.querySelectorAll('.navbar__mobile-link');

  if (!navbar) return;

  /* Scroll — add glass effect */
  function onScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  }

  window.addEventListener('scroll', throttle(onScroll, 100), { passive: true });
  onScroll(); // run once on load

  /* Hamburger toggle */
  function closeMobileMenu() {
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Menu openen');
    document.body.style.overflow = '';
  }

  function openMobileMenu() {
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Menu sluiten');
    document.body.style.overflow = 'hidden';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('is-open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  /* Close mobile menu on link click */
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* Close on outside click */
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && mobileMenu.classList.contains('is-open')) {
      closeMobileMenu();
    }
  });

  /* Close on Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMobileMenu();
    }
  });

  /* Active nav link on scroll */
  const sections = ['hero', 'aanpak', 'diensten', 'prijzen', 'faq', 'contact'];

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.remove('navbar__link--active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('navbar__link--active');
          }
        });
      }
    });
  }, {
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0
  });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });
})();

/* ═══════════════════════════════════════
   2. SCROLL REVEAL — Intersection Observer
═══════════════════════════════════════ */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.08
  });

  elements.forEach(el => observer.observe(el));
})();

/* ═══════════════════════════════════════
   3. DASHBOARD TABS
═══════════════════════════════════════ */
(function initDashboard() {
  const tabs = document.querySelectorAll('.dashboard__tab');
  const panels = document.querySelectorAll('.dashboard__panel');
  if (!tabs.length) return;

  let autoTimer = null;
  const tabOrder = ['website', 'ai', 'automations'];
  let currentIndex = 0;

  function activateTab(tabName) {
    // Update tabs
    tabs.forEach(tab => {
      const isActive = tab.dataset.tab === tabName;
      tab.classList.toggle('dashboard__tab--active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });

    // Update panels
    panels.forEach(panel => {
      const isActive = panel.id === 'tab-' + tabName;
      panel.classList.toggle('dashboard__panel--active', isActive);
      panel.hidden = !isActive;
      panel.setAttribute('aria-hidden', String(!isActive));
    });

    // Trigger chart animation when website tab activated
    if (tabName === 'website') {
      const chartLine = document.querySelector('.chart__line');
      const chartArea = document.querySelector('.chart__area');
      if (chartLine) {
        setTimeout(() => {
          chartLine.classList.add('animated');
          if (chartArea) chartArea.classList.add('animated');
        }, 100);
      }
    }

    // Trigger flow animation when automations tab activated
    if (tabName === 'automations') {
      animateFlow();
    }
  }

  /* Auto-cycle tabs */
  function nextTab() {
    currentIndex = (currentIndex + 1) % tabOrder.length;
    activateTab(tabOrder[currentIndex]);
  }

  function startAuto() {
    autoTimer = setInterval(nextTab, 4000);
  }

  function stopAuto() {
    clearInterval(autoTimer);
  }

  /* Tab click */
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      stopAuto();
      const tabName = tab.dataset.tab;
      currentIndex = tabOrder.indexOf(tabName);
      activateTab(tabName);
      // Restart auto after manual interaction
      setTimeout(startAuto, 8000);
    });
  });

  /* Start auto-cycle */
  startAuto();

  /* Initial chart animation */
  setTimeout(() => {
    const chartLine = document.querySelector('.chart__line');
    const chartArea = document.querySelector('.chart__area');
    if (chartLine) chartLine.classList.add('animated');
    if (chartArea) chartArea.classList.add('animated');
  }, 600);
})();

/* ═══════════════════════════════════════
   4. FLOW STEP ANIMATION
═══════════════════════════════════════ */
function animateFlow() {
  const steps = document.querySelectorAll('.flow__step');
  if (!steps.length) return;

  steps.forEach((step, i) => {
    step.style.opacity = '0.4';
    step.classList.remove('flow__step--active');
    setTimeout(() => {
      steps.forEach(s => {
        s.style.opacity = '0.4';
        s.classList.remove('flow__step--active');
      });
      for (let j = 0; j <= i; j++) {
        steps[j].style.opacity = '1';
        steps[j].classList.add('flow__step--active');
      }
    }, i * 500 + 200);
  });
}

/* ═══════════════════════════════════════
   5. FAQ ACCORDION
═══════════════════════════════════════ */
(function initFAQ() {
  const questions = document.querySelectorAll('.faq__question');
  if (!questions.length) return;

  questions.forEach(question => {
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      const answerId = question.getAttribute('aria-controls');
      const answer = document.getElementById(answerId);

      if (!answer) return;

      if (isExpanded) {
        // Close
        question.setAttribute('aria-expanded', 'false');
        answer.hidden = true;
      } else {
        // Close all others
        questions.forEach(q => {
          if (q !== question) {
            q.setAttribute('aria-expanded', 'false');
            const otherId = q.getAttribute('aria-controls');
            const other = document.getElementById(otherId);
            if (other) other.hidden = true;
          }
        });

        // Open clicked
        question.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
      }
    });
  });
})();

/* ═══════════════════════════════════════
   6. STATS COUNTER ANIMATION
═══════════════════════════════════════ */
(function initCounters() {
  const numbers = document.querySelectorAll('.stats__number[data-target]');
  if (!numbers.length) return;

  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    const isDecimal = el.dataset.decimal;
    const duration = 1800;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      if (isDecimal) {
        el.textContent = (current / 10).toFixed(1);
      } else {
        el.textContent = current.toLocaleString('nl-NL');
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        numbers.forEach(el => animateCount(el));
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });

  const statsSection = document.querySelector('.stats');
  if (statsSection) observer.observe(statsSection);
})();

/* ═══════════════════════════════════════
   7. CHART REVEAL on scroll
═══════════════════════════════════════ */
(function initChartReveal() {
  const chartLine = document.querySelector('.chart__line');
  const chartArea = document.querySelector('.chart__area');
  if (!chartLine) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          chartLine.classList.add('animated');
          if (chartArea) chartArea.classList.add('animated');
        }, 200);
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const dashboard = document.querySelector('.dashboard');
  if (dashboard) observer.observe(dashboard);
})();

/* ═══════════════════════════════════════
   8. SMOOTH SCROLL for anchor links
═══════════════════════════════════════ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ═══════════════════════════════════════
   9. COOKIE BANNER (AVG/GDPR)
═══════════════════════════════════════ */
(function initCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;

  const stored = localStorage.getItem('kelvantis_cookie_consent');
  if (!stored) {
    // Show banner after short delay so page renders first
    setTimeout(() => banner.classList.add('is-visible'), 1200);
  }

  document.getElementById('cookieAccept')?.addEventListener('click', () => {
    localStorage.setItem('kelvantis_cookie_consent', 'all');
    banner.classList.remove('is-visible');
    // If you add Google Analytics later, initialise it here
  });

  document.getElementById('cookieDecline')?.addEventListener('click', () => {
    localStorage.setItem('kelvantis_cookie_consent', 'minimal');
    banner.classList.remove('is-visible');
  });
})();

/* ═══════════════════════════════════════
   10. MODAL — Intake Form
═══════════════════════════════════════ */
(function initModal() {
  const modal = document.getElementById('contactModal');
  if (!modal) return;

  const overlay   = document.getElementById('modalOverlay');
  const closeBtn  = document.getElementById('modalClose');
  const form      = document.getElementById('contactForm');
  const success   = document.getElementById('formSuccess');
  const successClose = document.getElementById('modalSuccessClose');
  const pakketSelect = document.getElementById('f-pakket');

  /* ── Open / Close ── */
  function openModal(pakket) {
    modal.classList.add('is-open');
    modal.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();

    if (pakket && pakketSelect) {
      pakketSelect.value = pakket;
    }
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* ── Triggers ── */
  document.querySelectorAll('[data-modal="open"]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(trigger.dataset.pakket || '');
    });
  });

  closeBtn?.addEventListener('click', closeModal);
  successClose?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  /* ── Form submit via Formspree ── */
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.form__submit');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Versturen…';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.hidden = true;
        success.hidden = false;
        success.focus();
      } else {
        throw new Error('Server error');
      }
    } catch {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      alert('Er is iets misgegaan. Mail ons direct: hallo@kelvantis.nl');
    }
  });
})();
