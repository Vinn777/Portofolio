/* =============================================
   ARIIQ NAWFAL AQILLA - PORTFOLIO JS
   ============================================= */

/* ====== LOADER & ENTRY SEQUENCE ====== */
(function initLoader() {
  const statusMessages = [
    'INITIALIZING SYSTEM',
    'LOADING ASSETS...',
    'BUILDING INTERFACE',
    'COMPILING MODULES',
    'CONNECTING SERVICES',
    'READY'
  ];
  const statusEl = document.getElementById('loader-status-text');
  let msgIdx = 0;

  const interval = setInterval(() => {
    msgIdx = (msgIdx + 1) % statusMessages.length;
    if (statusEl) statusEl.textContent = statusMessages[msgIdx];
  }, 260);

  window.addEventListener('load', () => {
    clearInterval(interval);
    if (statusEl) statusEl.textContent = 'READY';
    setTimeout(() => {
      const loader = document.getElementById('loader');
      if (loader) {
        loader.classList.add('hidden');
        document.body.classList.add('loaded');
      }
    }, 1600);
  });
})();

/* ====== TYPEWRITER EFFECT ====== */
(function initTypewriter() {
  const roles = [
    'Software Engineer',
    'Front-End Developer',
    'UI/UX Designer',
    'Web Developer',
  ];
  const el = document.getElementById('typed-role');
  if (!el) return;

  let roleIdx  = 0;
  let charIdx  = 0;
  let deleting = false;
  let paused   = false;

  function type() {
    if (paused) return;
    const current = roles[roleIdx];

    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        paused = true;
        setTimeout(() => { paused = false; deleting = true; type(); }, 2000);
        return;
      }
      setTimeout(type, 80);
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx  = (roleIdx + 1) % roles.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 45);
    }
  }

  // Start after loader
  setTimeout(type, 1600);
})();

/* ====== CANVAS PARTICLES (ELEGANT NETWORK) ====== */
(function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  
  let mouse = { x: null, y: null, radius: 180 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = randomBetween(0, W);
      this.y  = randomBetween(0, H);
      this.r  = randomBetween(1, 2.5);
      this.vx = randomBetween(-0.15, 0.15); // Slower, more elegant
      this.vy = randomBetween(-0.15, 0.15);
      this.alpha = randomBetween(0.1, 0.4);
      // Use emerald/teal hues (150-170)
      const hue = randomBetween(150, 170);
      this.color = `hsla(${hue}, 70%, 60%, ${this.alpha})`;
    }
    update() {
      this.x += this.vx; 
      this.y += this.vy;
      
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x += (dx / dist) * force * 0.2; // Softer pull
          this.y += (dy / dist) * force * 0.2;
        }
      }

      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  // Adjust count based on screen width for performance and elegance
  const particleCount = W < 768 ? 50 : 100;
  for (let i = 0; i < particleCount; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(16, 185, 129, ${0.1 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
      
      if (mouse.x !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(16, 185, 129, ${0.15 * (1 - dist / mouse.radius)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ====== NAVBAR SCROLL ====== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ====== HAMBURGER MENU ====== */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close menu when link clicked
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('active');
    navLinks?.classList.remove('open');
  });
});

/* ====== ACTIVE NAV LINK ON SCROLL ====== */
const sections = document.querySelectorAll('section[id]');
function updateActiveLink() {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}
window.addEventListener('scroll', updateActiveLink);

/* ====== BACK TO TOP ====== */
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop?.classList.add('show');
  } else {
    backToTop?.classList.remove('show');
  }
});
backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ====== COUNTER ANIMATION ====== */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  if (!target) return;
  let count = 0;
  const step = Math.ceil(target / 40);
  const timer = setInterval(() => {
    count += step;
    if (count >= target) { count = target; clearInterval(timer); }
    el.textContent = count;
  }, 40);
}

/* ====== SKILL BAR ANIMATION ====== */
function animateSkillBars() {
  document.querySelectorAll('.skill-fill').forEach(bar => {
    const width = bar.getAttribute('data-width');
    bar.style.width = width + '%';
  });
}

/* ====== AOS (Animate on Scroll) ====== */
const aosEls = document.querySelectorAll('[data-aos]');
let countersTriggered = false;
let skillsTriggered   = false;

function checkAOS() {
  const windowH = window.innerHeight;

  aosEls.forEach(el => {
    const rect  = el.getBoundingClientRect();
    const delay = el.getAttribute('data-aos-delay') || 0;
    if (rect.top < windowH - 60) {
      setTimeout(() => el.classList.add('aos-animate'), parseInt(delay));
    }
  });

  // Counter trigger (hero section)
  if (!countersTriggered) {
    const hero = document.getElementById('hero');
    if (hero && hero.getBoundingClientRect().top < windowH - 100) {
      countersTriggered = true;
      document.querySelectorAll('[data-target]').forEach(el => animateCounter(el));
    }
  }

  // Skill bars trigger
  if (!skillsTriggered) {
    const skillsSection = document.getElementById('skills');
    if (skillsSection && skillsSection.getBoundingClientRect().top < windowH - 100) {
      skillsTriggered = true;
      setTimeout(animateSkillBars, 200);
    }
  }
}

window.addEventListener('scroll', checkAOS);
checkAOS(); // Run on load

/* ====== CONTACT FORM ====== */
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = document.getElementById('send-btn');
  btn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Mengirim...';
  btn.disabled = true;

  // Menggunakan EmailJS untuk mengirim form
  emailjs.sendForm('service_1i7xoq6', 'template_kj2fxof', contactForm)
    .then(() => {
      btn.innerHTML = '<i class="bx bx-send"></i> Kirim Pesan';
      btn.disabled = false;
      formSuccess?.classList.add('show');
      contactForm.reset();
      setTimeout(() => formSuccess?.classList.remove('show'), 5000);
    }, (error) => {
      console.error('FAILED...', error);
      btn.innerHTML = '<i class="bx bx-x"></i> Gagal Mengirim';
      setTimeout(() => {
        btn.innerHTML = '<i class="bx bx-send"></i> Kirim Pesan';
        btn.disabled = false;
      }, 3000);
      alert('Gagal mengirim pesan. Error: ' + (error.text || error.message || JSON.stringify(error)));
    });
});

/* ====== SMOOTH SCROLL FOR ALL ANCHOR LINKS ====== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* =============================================
   PREMIUM UI/UX INTERACTION CONTROLLERS
   ============================================= */

/* ------ CUSTOM LIQUID CURSOR AURA (LERP PHYSICS) ------ */
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const aura = document.getElementById('cursor-aura');
  if (!dot || !aura) return;

  let mouse = { x: 0, y: 0 };
  let dotPos = { x: 0, y: 0 };
  let auraPos = { x: 0, y: 0 };

  // Skip rendering on touchscreens
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouch) {
    dot.style.display = 'none';
    aura.style.display = 'none';
    return;
  }
  
  document.body.classList.add('has-custom-cursor');

  // Track pointer movements
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Track hover state for clickable triggers
  const hovers = 'a, button, .project-card, .about-card, .skill-card, .hamburger, .btn-primary, .btn-outline, .btn-cv, .btn-hire';
  
  function updateHovers() {
    document.querySelectorAll(hovers).forEach(el => {
      if (el.dataset.hasCursorBound) return;
      el.dataset.hasCursorBound = 'true';

      el.addEventListener('mouseenter', () => {
        dot.classList.add('hovered');
        aura.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('hovered');
        aura.classList.remove('hovered');
      });
    });
  }
  
  updateHovers();
  setInterval(updateHovers, 1500); // Handle dynamic nodes addition

  function renderCursor() {
    // The dot exactly matches the mouse position without delay
    dotPos.x = mouse.x;
    dotPos.y = mouse.y;

    // The aura softly trails behind using linear interpolation
    auraPos.x += (mouse.x - auraPos.x) * 0.15;
    auraPos.y += (mouse.y - auraPos.y) * 0.15;

    dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0)`;
    aura.style.transform = `translate3d(${auraPos.x}px, ${auraPos.y}px, 0)`;

    requestAnimationFrame(renderCursor);
  }
  renderCursor();
}

/* ------ TOP SCROLL PROGRESS NEON BAR ------ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  function updateProgress() {
    const scrollY = window.scrollY;
    const scrollH = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollH <= 0) return;
    const pct = (scrollY / scrollH) * 100;
    bar.style.width = pct + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
}

/* ------ MAGNETIC PHYSICS BUTTONS ------ */
function initMagneticButtons() {
  const targets = document.querySelectorAll('.btn-primary, .btn-outline, .btn-cv, .btn-hire, .nav-logo, .skills-tab');
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouch) return;

  targets.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Soft pull magnet dynamics (translate elements 30% of cursor offset)
      el.style.transform = `translate3d(${x * 0.32}px, ${y * 0.32}px, 0)`;
      el.style.boxShadow = `0 12px 28px rgba(16, 185, 129, 0.45)`;
    });

    el.addEventListener('mouseleave', () => {
      // Soft elastic reset handled via CSS transitions
      el.style.transform = 'translate3d(0px, 0px, 0)';
      el.style.boxShadow = '';
    });
  });
}

/* ------ 3D TILT CARDS & SPOTLIGHT REFLECTION ------ */
function init3DTiltAndSpotlight() {
  const cards = document.querySelectorAll('.about-card, .project-card, .skill-card');
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  cards.forEach(card => {
    // Dynamically inject card spotlight overlay
    if (!card.querySelector('.card-glow-spotlight')) {
      const spotlight = document.createElement('div');
      spotlight.className = 'card-glow-spotlight';
      card.prepend(spotlight);
    }

    // Capture custom colors (e.g. for skills cards)
    const icon = card.querySelector('.skill-icon');
    const glowColor = icon ? getComputedStyle(icon).getPropertyValue('--clr').trim() : 'rgba(16, 185, 129, 0.35)';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Set CSS coordinates for glass spotlight glow
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      if (!isTouch) {
        // Calculate physics rotation angles
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotX = ((rect.top + centerY - e.clientY) / centerY) * 7; // Max rotation 7deg
        const rotY = ((e.clientX - (rect.left + centerX)) / centerX) * 7; // Max rotation 7deg

        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-5px)`;
      } else {
        card.style.transform = 'translateY(-4px)';
      }

      // Dynamic shadows on hover
      if (card.classList.contains('skill-card')) {
        card.style.boxShadow = `0 12px 36px rgba(0,0,0,0.5), 0 0 25px ${glowColor}3c`;
      } else {
        card.style.boxShadow = `0 12px 36px rgba(0,0,0,0.5), 0 0 20px rgba(16, 185, 129, 0.22)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = isTouch ? '' : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      card.style.boxShadow = '';
    });
  });
}

/* ------ SIMPLE TERMINAL TYPING EFFECT ------ */
function initTextScramble() {
  const targets = document.querySelectorAll('.section-title, .nav-logo');
  
  targets.forEach(el => {
    const originalHTML = el.innerHTML;
    
    const triggerScramble = async () => {
      if (el.dataset.scrambling === 'true') return;
      el.dataset.scrambling = 'true';
      
      // Reset inner HTML to clean state
      el.innerHTML = originalHTML;
      
      // Store original text and clear text nodes
      function clearTextNodes(n) {
        if (n.nodeType === Node.TEXT_NODE) {
          n.originalText = n.textContent;
          n.textContent = '';
        } else {
          n.childNodes.forEach(clearTextNodes);
        }
      }
      clearTextNodes(el);

      // Add terminal prefix
      const prefix = document.createElement('span');
      prefix.innerHTML = '<span style="color: var(--accent-1); font-family: var(--font-mono); font-weight: bold; margin-right: 8px;">></span>';
      el.prepend(prefix);
      
      // Blinking cursor that follows the typing
      const cursor = document.createElement('span');
      cursor.textContent = '_';
      cursor.style.color = 'var(--accent-1)';
      cursor.style.animation = 'cursorBlink 0.8s step-end infinite';
      el.appendChild(cursor);

      // Recursive sequential typing
      async function typeNodes(n) {
        if (n.nodeType === Node.TEXT_NODE) {
          const text = n.originalText;
          if (!text || !text.trim()) return;
          for (let i = 0; i < text.length; i++) {
            n.textContent += text[i];
            await new Promise(r => setTimeout(r, 40)); // Typing speed
          }
        } else if (n !== prefix && n !== cursor) {
          for (let child of Array.from(n.childNodes)) {
            await typeNodes(child);
          }
        }
      }

      await typeNodes(el);
      
      // Finish typing, let cursor blink a few times then cleanup
      setTimeout(() => {
        el.innerHTML = originalHTML;
        el.dataset.scrambling = 'false';
      }, 2000);
    };

    el.addEventListener('mouseenter', triggerScramble);
    el.addEventListener('click', triggerScramble);

    // Trigger automatically when scrolled into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          triggerScramble();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(el);
  });
}

/* ------ HERO BADGES PARALLAX MOUSE EFFECT ------ */
function initHeroParallaxBadges() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const fb1 = hero.querySelector('.fb-1');
  const fb2 = hero.querySelector('.fb-2');
  const fb3 = hero.querySelector('.fb-3');
  const fb4 = hero.querySelector('.fb-4');

  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouch) return;

  window.addEventListener('mousemove', (e) => {
    // Parallax displacement relative to cursor distance from screen center
    const x = (window.innerWidth / 2 - e.clientX) * 0.035;
    const y = (window.innerHeight / 2 - e.clientY) * 0.035;

    // Apply offset translations to each floating badge
    if (fb1) fb1.style.transform = `translate3d(${x * 0.8}px, ${y * 0.8}px, 0)`;
    if (fb2) fb2.style.transform = `translate3d(${x * -1.2}px, ${y * 0.6}px, 0)`;
    if (fb3) fb3.style.transform = `translate3d(${x * 0.5}px, ${y * -0.9}px, 0)`;
    if (fb4) fb4.style.transform = `translate3d(${x * -0.7}px, ${y * -0.7}px, 0)`;
  });

  // Soft elastic bounce reset when mouse leaves screen boundaries
  window.addEventListener('mouseleave', () => {
    const badges = [fb1, fb2, fb3, fb4];
    badges.forEach(b => {
      if (b) {
        b.style.transform = 'translate3d(0px, 0px, 0)';
        b.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
        setTimeout(() => { if (b) b.style.transition = ''; }, 800);
      }
    });
  });
}

/* ------ DEMO "NOT HOSTED" MODAL CONTROLLER ------ */
function initDemoModal() {
  const overlay  = document.getElementById('demo-modal-overlay');
  const closeBtn = document.getElementById('demo-modal-close');
  const contactBtn = document.getElementById('demo-modal-contact-btn');
  if (!overlay) return;

  function openModal() {
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }

  function closeModal() {
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  // Intercept ALL "Live Demo" links that still point to '#'
  document.querySelectorAll('.project-link.primary').forEach(link => {
    if (!link.getAttribute('href') || link.getAttribute('href') === '#') {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    }
  });

  // Close on X button
  closeBtn?.addEventListener('click', closeModal);

  // Close on "Hubungi Saya" — smooth scroll then close
  contactBtn?.addEventListener('click', () => {
    closeModal();
  });

  // Close when clicking the dark overlay backdrop
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

// Safe and robust single-run bootstrapping pattern
function initAll() {
  if (window.hasInitializedAnimations) return;
  window.hasInitializedAnimations = true;

  initCustomCursor();
  initScrollProgress();
  initMagneticButtons();
  init3DTiltAndSpotlight();
  initTextScramble();
  initHeroParallaxBadges();
  initDemoModal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

/* ====== SKILLS TAB TOGGLE ====== */
function switchTab(tab) {
  const panelHard = document.getElementById('panel-hard');
  const panelSoft = document.getElementById('panel-soft');
  const tabHard   = document.getElementById('tab-hard');
  const tabSoft   = document.getElementById('tab-soft');

  if (tab === 'hard') {
    panelHard.style.display = 'block';
    panelSoft.style.display = 'none';
    tabHard.classList.add('active');
    tabSoft.classList.remove('active');

    // Re-animate skill bars when switching back to hard skills
    setTimeout(() => {
      document.querySelectorAll('#panel-hard .skill-fill').forEach(bar => {
        bar.style.width = '0%';
        setTimeout(() => {
          bar.style.width = bar.getAttribute('data-width') + '%';
        }, 50);
      });
    }, 50);

  } else {
    panelHard.style.display = 'none';
    panelSoft.style.display = 'block';
    tabSoft.classList.add('active');
    tabHard.classList.remove('active');

    // Re-trigger AOS for newly visible soft skill cards
    document.querySelectorAll('#panel-soft [data-aos]').forEach(el => {
      el.classList.add('aos-animate');
    });
  }
}

console.log('%c🚀 Portfolio Ariiq Nawfal Aqilla', 'color:#10b981;font-size:16px;font-weight:bold;');
console.log('%cSoftware Engineering | Front-End Web Developer | UI/UX Designer', 'color:#34d399;font-size:12px;');

