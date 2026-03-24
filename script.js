/* ═══════════════════════════════════════
   KELVANTIS, script.js
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
   1. NAVBAR, scroll effect + active links
═══════════════════════════════════════ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('.navbar__link');
  const mobileLinks = document.querySelectorAll('.navbar__mobile-link');

  if (!navbar) return;

  /* Scroll, add glass effect */
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

  /* Dropdown behavior (desktop) */
  const dropdownItems = document.querySelectorAll('.navbar__dropdown-item');
  dropdownItems.forEach(item => {
    document.addEventListener('click', (e) => {
      if (!item.contains(e.target)) item.classList.remove('is-open');
    });
  });

  /* Mobile accordion */
  const accordions = document.querySelectorAll('.navbar__mobile-accordion');
  accordions.forEach(acc => {
    const trigger = acc.querySelector('.navbar__mobile-accordion-trigger');
    trigger?.addEventListener('click', () => acc.classList.toggle('is-open'));
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
   2. SCROLL REVEAL, Intersection Observer
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
   10. MODAL, Intake Form
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
      let errEl = form.querySelector('.form__error-msg');
      if (!errEl) {
        errEl = document.createElement('p');
        errEl.className = 'form__error-msg';
        errEl.style.cssText = 'color:#f87171;font-size:.875rem;margin-top:.75rem;text-align:center;';
        form.appendChild(errEl);
      }
      errEl.textContent = 'Er is iets misgegaan. Mail ons direct: kelvantis.com@gmail.com';
    }
  });
})();

/* ═══════════════════════════════════════
   10b. CONTACT PAGE FORM
═══════════════════════════════════════ */
(function initContactPageForm() {
  const form = document.getElementById('contactPageForm');
  if (!form) return;

  const success = document.getElementById('cp-success');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.form__submit');
    const originalHTML = submitBtn.innerHTML;

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
        if (success) { success.hidden = false; success.focus(); }
      } else {
        throw new Error('Server error');
      }
    } catch {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHTML;
      let errEl = form.querySelector('.form__error-msg');
      if (!errEl) {
        errEl = document.createElement('p');
        errEl.className = 'form__error-msg';
        errEl.style.cssText = 'color:#f87171;font-size:.875rem;margin-top:.75rem;text-align:center;';
        form.appendChild(errEl);
      }
      errEl.textContent = 'Er is iets misgegaan. Mail ons direct: kelvantis.com@gmail.com';
    }
  });
})();

/* ═══════════════════════════════════════
   11. THEME TOGGLE, Dark / Light
═══════════════════════════════════════ */
(function initTheme() {
  const html = document.documentElement;
  const btns = [document.getElementById('themeToggle'), document.getElementById('themeToggleMobile')];
  const icons = [document.getElementById('themeIcon'), document.getElementById('themeIconMobile')];

  const DARK_PATH  = '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>';
  const LIGHT_PATH = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('kelvantis_theme', theme);
    icons.forEach(icon => {
      if (icon) icon.innerHTML = theme === 'dark' ? DARK_PATH : LIGHT_PATH;
    });
  }

  const saved = localStorage.getItem('kelvantis_theme') || 'dark';
  setTheme(saved);

  btns.forEach(btn => {
    btn?.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  });
})();

/* ═══════════════════════════════════════
   12. LANGUAGE TOGGLE, NL / EN
═══════════════════════════════════════ */
(function initI18n() {
  const T = {
    nl: {
      nav: { approach: 'Aanpak', forWho: 'Voor wie', packages: 'Pakketten', faq: 'FAQ', cta: 'Gratis gesprek', ctaMobile: 'Gratis gesprek plannen', diensten: 'Diensten', dienstenDropdown: { websites: { name: 'Websites laten maken', desc: 'Conversiegericht, snel en op maat' }, workflow: { name: 'Workflow Automatisering', desc: 'Processen op de achtergrond draaien' }, ai: { name: 'AI Development', desc: 'Claude Code & VS Code maatwerk' }, seo: { name: 'SEO', desc: 'Gevonden worden in Google' } } },
      hero: {
        badge: 'Website · SEO · Workflow Automatisering',
        title: 'Meer resultaat.<br><span class="hero__title-accent">Minder handwerk.</span>',
        subtitle: 'Kelvantis bouwt conversiegerichte websites, SEO-strategieën en workflow automations voor B2B bedrijven. AI zit verwerkt in alles, van copywriting tot lead-opvolging. We build systems that work while you don\'t.',
        ctaPrimary: 'Gratis strategiegesprek',
        ctaSecondary: 'Bekijk aanpak',
        trust: 'Gebouwd voor <strong>B2B bedrijven</strong> in Nederland'
      },
      stat1: { label: 'Meer leads' },
      stat2: { label: 'Actief' },
      stat3: { label: 'Gemiddelde ROI' },
      dash: { visitors: 'Bezoekers', conversion: 'Conversie', leads: 'Leads' },
      ai: { q1: 'Wat zijn jullie openingstijden?', a1: 'We zijn bereikbaar van ma–vr 8:00–18:00. Wil je direct een afspraak plannen?', q2: 'Ja graag, morgen 10:00?', stat1: 'Vragen beantwoord', stat2: 'Gem. responstijd' },
      flow: { step1: 'Lead binnenkomt', step2: 'AI kwalificeert', step3: 'Email verstuurd', step4: 'Afspraak gepland', badge: '47 automations actief' },
      process: {
        label: 'Aanpak',
        title: 'Van gesprek tot groei.<br>In vier stappen.',
        subtitle: 'Geen maandenlange trajecten. Geen vaag advies. Wij bouwen en lanceren snel, zodat jij zo snel mogelijk resultaat ziet.',
        s1: { title: 'Strategiegesprek', desc: 'We starten met een gratis gesprek om jouw situatie te begrijpen, knelpunten te identificeren en de grootste groeikansen bloot te leggen. Geen verplichtingen, wel concrete inzichten.' },
        s2: { title: 'Systeem ontwerp', desc: 'Op basis van jouw doelen ontwerpen we een op maat gemaakt digitaal systeem. Je krijgt een helder plan met exacte tools, koppelingen en verwachte resultaten, voordat we ook maar één regel code schrijven.' },
        s3: { title: 'Bouwen & koppelen', desc: 'We bouwen alles van A tot Z en koppelen alle tools naadloos aan elkaar. Website, AI chatbot, automations, CRM, jij hoeft nergens naar om te kijken. Wij houden je op de hoogte via wekelijkse updates.' },
        s4: { title: 'Live & schaalbaar', desc: 'Jouw systeem gaat live en begint direct voor je te werken. We monitoren de prestaties, optimaliseren waar nodig, en schalen het systeem mee zodra jij klaar bent voor de volgende groeistap.' }
      },
      forwho: {
        label: 'Voor wie',
        title: 'Voor jou, als je<br>dit herkent.',
        subtitle: 'Kelvantis werkt met B2B bedrijven, van startup tot enterprise, die concrete problemen hebben op het vlak van online zichtbaarheid, leadgeneratie of inefficiënte werkprocessen. Herken jij jezelf?',
        c1: { title: '"Leads komen binnen, maar opvolging is een chaos"', desc: 'Aanvragen worden te laat of helemaal niet opgevolgd. Je verliest deals niet omdat het product niet goed is, maar omdat het proces faalt. Wij automatiseren de opvolging volledig.' },
        c2: { title: '"We verliezen uren aan handmatig herhaalwerk"', desc: 'Facturen verwerken, CRM bijhouden, rapportages opstellen, e-mails kopiëren. Werk dat een systeem kan doen terwijl jij bezig bent met wat echt telt.' },
        c3: { title: '"Onze website converteert niet"', desc: 'Bezoekers komen, bekijken en vertrekken zonder te converteren. Je hebt een website die er mooi uitziet, maar die niet verkoopt. Wij bouwen voor conversie, niet voor decoratie.' },
        c4: { title: '"We willen AI integreren maar weten niet hoe"', desc: 'Je ziet het potentieel van AI maar het ontbreekt aan overzicht, richting en iemand die het concreet kan bouwen. Geen hype, geen theorie, wij implementeren wat werkt.' },
        c5: { title: '"We zijn slecht vindbaar in Google"', desc: 'Je concurrenten staan bovenaan en pakken de leads die van jou hadden kunnen zijn. SEO is geen trucje, het is een systeem. Wij bouwen dat systeem en maken het meetbaar.' },
        c6: { title: '"We hebben een complete digitale infrastructuur nodig"', desc: 'Van een verouderde website tot een totale herbouw van je digitale stack. Website, SEO, automations en AI-integraties, wij ontwerpen en bouwen het als één samenhangend systeem.' },
        notfor: { title: 'Niet voor jou als je zoekt naar:', i1: 'Social media beheer', i2: 'Maandelijks ads-beheer', i3: 'Dagelijkse content creatie', i4: 'Uurtje-factuurtje werk' }
      },
      pricing: {
        label: 'Pakketten',
        title: 'Drie pakketten.<br>Één duidelijk systeem.',
        subtitle: 'Geen uurtje-factuurtje, geen verborgen kosten. Vraag een offerte aan en we bespreken samen wat past bij jouw situatie en doelen.',
        footnote: 'Alle pakketten zijn eenmalige investeringen. Advisory is maandelijks opzegbaar. Plan een gratis gesprek, dan bespreken we wat past bij jouw situatie en budget.',
        cta: 'Offerte aanvragen',
        f: { sub: 'Eenmalige investering · Prijs op aanvraag', desc: 'De perfecte start. Een professionele website die presteert, converteert en gevonden wordt door jouw ideale klanten.', f1: 'Conversiegerichte website (t/m 8 pagina\'s)', f2: 'Volledige SEO-optimalisatie', f3: 'Contactformulier met e-mailnotificaties', f4: 'Google Analytics & Search Console', f5: 'Mobiel geoptimaliseerd', f6: 'Core Web Vitals score 90+', f7: 'AI chatbot', f8: 'Marketing automations', f9: 'CRM-koppeling' },
        gs: { badge: 'Meest gekozen', sub: 'Eenmalige investering · Prijs op aanvraag', desc: 'Het complete AI marketing systeem. Van website tot chatbot tot automatisering, alles werkt samen om 24/7 leads voor je te genereren.', f1: 'Alles van Foundation', f2: 'AI chatbot op maat getraind', f3: 'Marketing automation flows', f4: 'CRM-koppeling & lead tracking', f5: 'E-mail nurturing sequenties', f6: 'Real-time analytics dashboard', f7: 'Agenda-integratie voor chatbot', f8: '30 dagen ondersteuning na lancering', f9: 'Prioriteit support' },
        a: { sub: 'Maandelijks opzegbaar · Prijs op aanvraag', desc: 'Directe lijn met je eigen AI marketing strategist. Maandelijkse optimalisaties, analyses en begeleiding voor doorlopende groei.', f1: 'Maandelijks strategiegesprek (60 min)', f2: 'Doorlopende systeem-optimalisatie', f3: 'Maandelijkse prestatierapportage', f4: 'Directe WhatsApp/e-mail toegang', f5: 'Nieuwe automations & A/B tests', f6: 'Prioriteit bij uitbreidingen', f7: 'Inclusief nieuw systeem bouwen', f8: 'Inclusief Foundation website', f9: 'Inclusief AI chatbot setup' }
      },
      faq: {
        label: 'FAQ',
        title: 'Veelgestelde vragen.',
        subtitle: 'Staat jouw vraag er niet tussen? Plan een gratis gesprek en we beantwoorden alles direct.',
        q1: 'Voor wie is Kelvantis geschikt?', a1: 'Kelvantis werkt met B2B bedrijven, van startup tot enterprise, die concrete problemen hebben op het vlak van online zichtbaarheid, leadgeneratie of inefficiënte werkprocessen. Elke bedrijfsgrootte, elke sector, zolang er een helder probleem is dat we kunnen oplossen met een website, SEO of workflow automatisering.',
        q2: 'Hoe lang duurt het om live te gaan?', a2: 'Een Foundation project staat gemiddeld binnen 2 weken live. Een volledig Growth System, inclusief AI chatbot, automations en CRM-koppeling, is gemiddeld binnen 4 tot 6 weken operationeel. We werken gefaseerd en houden je via vaste updates op de hoogte van de voortgang. Geen verrassingen.',
        q3: 'Heb ik technische kennis nodig?', a3: 'Nee, absoluut niet. Wij regelen alles van A tot Z, van het ontwerp en de technische bouw tot aan de koppelingen en training van de AI. Jij hoeft alleen jouw bedrijf goed te kennen en ons te vertellen wat je wilt bereiken. De rest is aan ons.',
        q4: 'Wat is het verschil tussen Foundation en Growth System?', a4: 'Foundation geeft je een professionele, snelle website met SEO en een contactformulier, een solide basis. Growth System gaat verder: je krijgt daar bovenop een AI chatbot, automatische lead nurturing, CRM-koppeling en marketing automations die 24/7 voor je werken. Foundation is perfect als start; Growth System is voor wie maximaal wil groeien op autopilot.',
        q5: 'Kan ik later upgraden van Foundation naar Growth System?', a5: 'Absoluut. Veel klanten starten met Foundation om snel resultaat te zien, en upgraden zodra ze de groei in leads ervaren. De investering van €1.500 in Foundation wordt volledig verrekend bij een upgrade naar Growth System, je betaalt alleen het verschil van €1.500. Zo groei je in jouw eigen tempo.'
      },
      cta: {
        label: 'Klaar om te groeien?',
        title: 'Meer resultaat.<br><span class="cta-section__title-accent">Minder handwerk.</span>',
        subtitle: 'Plan een gratis strategiegesprek en ontdek wat een conversiegerichte website, sterke SEO of slimme workflow automatisering voor jouw bedrijf kan betekenen. We kijken samen naar jouw situatie en de grootste kansen. Geen verplichtingen, wel concrete inzichten.',
        btn: 'Gratis strategiegesprek plannen',
        trust: 'Gratis · Geen verplichtingen · Binnen 24 uur reactie'
      },
      footer: { tagline: 'Meer resultaat. Minder handwerk.', nav: { title: 'Navigatie', pricing: 'Prijzen' }, contact: { title: 'Contact', cta: 'Gratis gesprek plannen' }, social: { title: 'Volg ons' }, copyright: '© 2026 Kelvantis. Alle rechten voorbehouden.', privacy: 'Privacybeleid', terms: 'Algemene voorwaarden' },
      modal: { label: 'Gratis · Geen verplichtingen', title: 'Plan je gratis strategiegesprek', subtitle: 'Vertel kort over je situatie. We nemen binnen 24 uur contact op om een gesprek in te plannen.' },
      form: { name: 'Naam', namePh: 'Jan de Vries', company: 'Bedrijfsnaam', companyPh: 'Jouw Bedrijf BV', email: 'E-mailadres', phone: 'Telefoonnummer', package: 'Pakket interesse', packageOpt0: 'Nog niet zeker', challenge: 'Wat is jouw grootste uitdaging?', challengeOpt0: 'Kies je situatie...', challengeOpt1: 'Te weinig leads en aanvragen', challengeOpt2: 'Website presteert slecht', challengeOpt3: 'Opvolging kost te veel tijd', challengeOpt4: 'Geen inzicht in marketingresultaten', challengeOpt5: 'Concurrentie trekt klanten weg', challengeOpt6: 'Anders', message: 'Vertel kort over je bedrijf', messagePh: 'Bijv: Ik run een installatiebedrijf in Limburg met 5 medewerkers en wil meer aanvragen online genereren.', optional: '(optioneel)', submit: 'Verstuur aanvraag', disclaimer: 'Door te versturen ga je akkoord met ons privacybeleid. We reageren binnen 24 uur.' },
      success: { title: 'Aanvraag ontvangen!', desc: 'We nemen binnen <strong>24 uur</strong> contact met je op om een strategiegesprek in te plannen. Check je inbox, ook je spamfolder.', close: 'Sluiten' },
      results: {
        label: 'Resultaten',
        title: 'Wat klanten bereiken',
        r1: { metric: '+127%', desc: 'meer leads in 60 dagen' },
        r2: { metric: '18 uur', desc: 'per week bespaard op handmatig werk' },
        r3: { metric: '3.2×', desc: 'hogere ROI op marketingbudget' }
      },
      wa: { tooltip: 'App ons direct' },
      cookie: { text: 'Wij gebruiken cookies voor analytics en een betere gebruikerservaring. Lees ons <a href="/privacy">privacybeleid</a>.', accept: 'Accepteren', decline: 'Alleen noodzakelijk' },
      dienstenOverzicht: {
        label: 'Wat we doen',
        title: 'Wat we voor je bouwen',
        c1: { title: 'Websites die converteren', desc: 'Van snelle zakelijke website tot volledig geoptimaliseerde landingspagina. Wij bouwen op maat, snel en conversion-first.', link: 'Bekijk websitediensten' },
        c2: { title: 'Werk slimmer, niet harder', desc: 'Automatiseer repetitieve taken en laat je bedrijfsprocessen op de achtergrond draaien met n8n, Make en AI.', link: 'Bekijk automatisering' },
        c3: { title: 'AI Development op maat', desc: 'Maatwerk AI-oplossingen gebouwd met Claude Code en VS Code. Van AI agents tot volledige integraties in je bedrijfsprocessen.', link: 'Bekijk AI Development' }
      }
    },
    en: {
      nav: { approach: 'Approach', forWho: 'For who', packages: 'Packages', faq: 'FAQ', cta: 'Free call', ctaMobile: 'Schedule a free call', diensten: 'Services', dienstenDropdown: { websites: { name: 'Website development', desc: 'Conversion-focused, fast and custom' }, workflow: { name: 'Workflow Automation', desc: 'Business processes running in the background' }, ai: { name: 'AI Development', desc: 'Claude Code & VS Code custom builds' }, seo: { name: 'SEO', desc: 'Get found on Google' } } },
      hero: {
        badge: 'Website · SEO · Workflow Automation',
        title: 'More results.<br><span class="hero__title-accent">Less manual work.</span>',
        subtitle: 'Kelvantis builds conversion-focused websites, SEO strategies and workflow automations for B2B companies. AI is embedded in everything, from copywriting to lead follow-up. We build systems that work while you don\'t.',
        ctaPrimary: 'Free strategy call',
        ctaSecondary: 'View approach',
        trust: 'Built for <strong>B2B companies</strong> in the Netherlands'
      },
      stat1: { label: 'More leads' },
      stat2: { label: 'Active' },
      stat3: { label: 'Average ROI' },
      dash: { visitors: 'Visitors', conversion: 'Conversion', leads: 'Leads' },
      ai: { q1: 'What are your opening hours?', a1: 'We\'re available Mon–Fri 8:00–18:00. Would you like to schedule a call directly?', q2: 'Yes please, tomorrow at 10:00?', stat1: 'Questions answered', stat2: 'Avg. response time' },
      flow: { step1: 'Lead comes in', step2: 'AI qualifies', step3: 'Email sent', step4: 'Meeting scheduled', badge: '47 automations active' },
      process: {
        label: 'Approach',
        title: 'From conversation to growth.<br>In four steps.',
        subtitle: 'No lengthy projects. No vague advice. We build and launch fast so you see results as quickly as possible.',
        s1: { title: 'Strategy call', desc: 'We start with a free call to understand your situation, identify bottlenecks and uncover the biggest growth opportunities. No obligations, just concrete insights.' },
        s2: { title: 'System design', desc: 'Based on your goals, we design a tailor-made digital system. You get a clear plan with exact tools, integrations and expected results, before we write a single line of code.' },
        s3: { title: 'Build & connect', desc: 'We build everything from A to Z and connect all tools seamlessly. Website, AI chatbot, automations, CRM, you don\'t need to manage anything. We keep you updated with weekly progress reports.' },
        s4: { title: 'Live & scalable', desc: 'Your system goes live and starts working for you immediately. We monitor performance, optimise where needed, and scale the system as soon as you\'re ready for the next growth step.' }
      },
      forwho: {
        label: 'For who',
        title: 'For you, if you<br>recognise this.',
        subtitle: 'Kelvantis works with B2B companies, from startup to enterprise, that have concrete problems with online visibility, lead generation or inefficient work processes. Do you recognise yourself?',
        c1: { title: '"Leads come in, but follow-up is a mess"', desc: 'Requests are followed up too late or not at all. You\'re not losing deals because the product isn\'t good, but because the process fails. We fully automate the follow-up.' },
        c2: { title: '"We\'re losing hours on manual repetitive work"', desc: 'Processing invoices, updating CRM, creating reports, copying emails. Work that a system can do while you focus on what really matters.' },
        c3: { title: '"Our website doesn\'t convert"', desc: 'Visitors come, browse and leave without converting. You have a website that looks good but doesn\'t sell. We build for conversion, not for decoration.' },
        c4: { title: '"We want to integrate AI but don\'t know how"', desc: 'You see the potential of AI but lack overview, direction and someone who can actually build it. No hype, no theory, we implement what works.' },
        c5: { title: '"We rank poorly in Google"', desc: 'Your competitors are at the top and capturing leads that could have been yours. SEO isn\'t a trick, it\'s a system. We build that system and make it measurable.' },
        c6: { title: '"We need a complete digital infrastructure"', desc: 'From an outdated website to a complete rebuild of your digital stack. Website, SEO, automations and AI integrations, we design and build it as one coherent system.' },
        notfor: { title: 'Not for you if you\'re looking for:', i1: 'Social media management', i2: 'Monthly ads management', i3: 'Daily content creation', i4: 'Hourly billing work' }
      },
      pricing: {
        label: 'Packages',
        title: 'Three packages.<br>One clear system.',
        subtitle: 'No hourly billing, no hidden costs. Request a quote and we\'ll discuss together what fits your situation and goals.',
        footnote: 'All packages are one-time investments. Advisory is cancellable monthly. Schedule a free call, we\'ll discuss what fits your situation and budget.',
        cta: 'Request quote',
        f: { sub: 'One-time investment · Price on request', desc: 'The perfect start. A professional website that performs, converts and gets found by your ideal clients.', f1: 'Conversion-focused website (up to 8 pages)', f2: 'Full SEO optimisation', f3: 'Contact form with email notifications', f4: 'Google Analytics & Search Console', f5: 'Mobile optimised', f6: 'Core Web Vitals score 90+', f7: 'AI chatbot', f8: 'Marketing automations', f9: 'CRM integration' },
        gs: { badge: 'Most popular', sub: 'One-time investment · Price on request', desc: 'The complete AI marketing system. From website to chatbot to automation, everything works together to generate leads 24/7.', f1: 'Everything from Foundation', f2: 'Custom-trained AI chatbot', f3: 'Marketing automation flows', f4: 'CRM integration & lead tracking', f5: 'Email nurturing sequences', f6: 'Real-time analytics dashboard', f7: 'Calendar integration for chatbot', f8: '30 days support after launch', f9: 'Priority support' },
        a: { sub: 'Cancel anytime · Price on request', desc: 'Direct line with your own AI marketing strategist. Monthly optimisations, analyses and guidance for ongoing growth.', f1: 'Monthly strategy call (60 min)', f2: 'Ongoing system optimisation', f3: 'Monthly performance report', f4: 'Direct WhatsApp/email access', f5: 'New automations & A/B tests', f6: 'Priority for expansions', f7: 'Includes building new system', f8: 'Includes Foundation website', f9: 'Includes AI chatbot setup' }
      },
      faq: {
        label: 'FAQ',
        title: 'Frequently asked questions.',
        subtitle: 'Can\'t find your question? Schedule a free call and we\'ll answer everything directly.',
        q1: 'Who is Kelvantis for?', a1: 'Kelvantis works with B2B companies, from startup to enterprise, that have concrete problems with online visibility, lead generation or inefficient work processes. Any company size, any sector, as long as there\'s a clear problem we can solve with a website, SEO or workflow automation.',
        q2: 'How long does it take to go live?', a2: 'A Foundation project is typically live within 2 weeks. A full Growth System, including AI chatbot, automations and CRM integration, is operational within 4 to 6 weeks on average. We work in phases and keep you updated with fixed progress reports. No surprises.',
        q3: 'Do I need technical knowledge?', a3: 'No, absolutely not. We handle everything from A to Z, from design and technical build to integrations and AI training. You only need to know your business well and tell us what you want to achieve. The rest is on us.',
        q4: 'What\'s the difference between Foundation and Growth System?', a4: 'Foundation gives you a professional, fast website with SEO and a contact form, a solid foundation. Growth System goes further: you also get an AI chatbot, automatic lead nurturing, CRM integration and marketing automations working 24/7. Foundation is perfect to start; Growth System is for those who want to grow on autopilot.',
        q5: 'Can I upgrade from Foundation to Growth System later?', a5: 'Absolutely. Many clients start with Foundation to see results quickly, and upgrade once they experience the growth in leads. The Foundation investment is fully credited toward a Growth System upgrade, you only pay the difference. Grow at your own pace.'
      },
      cta: {
        label: 'Ready to grow?',
        title: 'More results.<br><span class="cta-section__title-accent">Less manual work.</span>',
        subtitle: 'Schedule a free strategy call and discover what a conversion-focused website, strong SEO or smart workflow automation can mean for your business. We\'ll look at your situation and the biggest opportunities together. No obligations, just concrete insights.',
        btn: 'Schedule free strategy call',
        trust: 'Free · No obligations · Response within 24 hours'
      },
      footer: { tagline: 'More results. Less manual work.', nav: { title: 'Navigation', pricing: 'Pricing' }, contact: { title: 'Contact', cta: 'Schedule a free call' }, social: { title: 'Follow us' }, copyright: '© 2026 Kelvantis. All rights reserved.', privacy: 'Privacy policy', terms: 'Terms & conditions' },
      modal: { label: 'Free · No obligations', title: 'Schedule your free strategy call', subtitle: 'Tell us briefly about your situation. We\'ll contact you within 24 hours to schedule a call.' },
      form: { name: 'Name', namePh: 'John Smith', company: 'Company name', companyPh: 'Your Company Ltd', email: 'Email address', phone: 'Phone number', package: 'Package interest', packageOpt0: 'Not sure yet', challenge: 'What is your biggest challenge?', challengeOpt0: 'Choose your situation...', challengeOpt1: 'Not enough leads and requests', challengeOpt2: 'Website performs poorly', challengeOpt3: 'Follow-up takes too much time', challengeOpt4: 'No insight into marketing results', challengeOpt5: 'Competition is taking clients', challengeOpt6: 'Other', message: 'Tell us about your business', messagePh: 'E.g.: I run a B2B services company with 10 employees and want to generate more leads online.', optional: '(optional)', submit: 'Send request', disclaimer: 'By submitting you agree to our privacy policy. We respond within 24 hours.' },
      success: { title: 'Request received!', desc: 'We\'ll contact you within <strong>24 hours</strong> to schedule a strategy call. Check your inbox, including your spam folder.', close: 'Close' },
      results: {
        label: 'Results',
        title: 'What clients achieve',
        r1: { metric: '+127%', desc: 'more leads in 60 days' },
        r2: { metric: '18 hrs', desc: 'saved per week on manual work' },
        r3: { metric: '3.2×', desc: 'higher ROI on marketing budget' }
      },
      wa: { tooltip: 'Message us directly' },
      cookie: { text: 'We use cookies for analytics and a better user experience. Read our <a href="/privacy">privacy policy</a>.', accept: 'Accept', decline: 'Essential only' },
      dienstenOverzicht: {
        label: 'What we do',
        title: 'What we build for you',
        c1: { title: 'Websites that convert', desc: 'From a fast business website to a fully optimised landing page. We build custom, fast and conversion-first.', link: 'View website services' },
        c2: { title: 'Work smarter, not harder', desc: 'Automate repetitive tasks and let your business processes run in the background with n8n, Make and AI.', link: 'View automation' },
        c3: { title: 'Custom AI Development', desc: 'Bespoke AI solutions built with Claude Code and VS Code. From AI agents to full integrations in your business processes.', link: 'View AI Development' }
      }
    }
  };

  function getKey(obj, path) {
    return path.split('.').reduce((acc, k) => acc?.[k], obj);
  }

  function applyLang(lang) {
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('kelvantis_lang', lang);

    const labels = [document.getElementById('langLabel'), document.getElementById('langLabelMobile')];
    labels.forEach(el => { if (el) el.textContent = lang === 'nl' ? '🇬🇧' : '🇳🇱'; });

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const val = getKey(T[lang], el.dataset.i18n);
      if (val !== undefined) el.textContent = val;
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const val = getKey(T[lang], el.dataset.i18nHtml);
      if (val !== undefined) el.innerHTML = val;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const val = getKey(T[lang], el.dataset.i18nPlaceholder);
      if (val !== undefined) el.setAttribute('placeholder', val);
    });

    // Page-specific translations (for service pages)
    if (window.PAGE_T && window.PAGE_T[lang]) {
      document.querySelectorAll('[data-page-i18n]').forEach(el => {
        const val = getKey(window.PAGE_T[lang], el.dataset.pageI18n);
        if (val !== undefined) el.textContent = val;
      });
      document.querySelectorAll('[data-page-i18n-html]').forEach(el => {
        const val = getKey(window.PAGE_T[lang], el.dataset.pageI18nHtml);
        if (val !== undefined) el.innerHTML = val;
      });
    }
  }

  const btns = [document.getElementById('langToggle'), document.getElementById('langToggleMobile')];
  const saved = localStorage.getItem('kelvantis_lang') || 'nl';
  applyLang(saved);

  btns.forEach(btn => {
    btn?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('lang');
      applyLang(current === 'nl' ? 'en' : 'nl');
    });
  });
})();
