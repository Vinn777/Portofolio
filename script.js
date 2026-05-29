/* =============================================
   ARIIQ NAWFAL AQILLA - PORTFOLIO JS
   ============================================= */

/* ====== LOADER & ENTRY SEQUENCE ====== */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      document.body.classList.add('loaded');
    }
  }, 1500);
});

/* ====== TYPEWRITER EFFECT ====== */
(function initTypewriter() {
  const roles = [
    'Software Engineer',
    'Full-Stack Developer',
    'UI/UX Designer',
    'Laravel Developer',
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

/* ====== CANVAS PARTICLES ====== */
(function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  
  // Interactive Mouse Object
  let mouse = { x: null, y: null, radius: 140 };

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
      this.r  = randomBetween(0.5, 2.5);
      this.vx = randomBetween(-0.3, 0.3);
      this.vy = randomBetween(-0.3, 0.3);
      this.alpha = randomBetween(0.15, 0.6);
      const hue = randomBetween(260, 300);
      this.color = `hsla(${hue}, 80%, 70%, ${this.alpha})`;
    }
    update() {
      this.x += this.vx; 
      this.y += this.vy;
      
      // Smooth particle attraction to mouse cursor
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          // Smooth pull toward pointer coordinates
          this.x += (dx / dist) * force * 0.35;
          this.y += (dy / dist) * force * 0.35;
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

  for (let i = 0; i < 110; i++) particles.push(new Particle());

  // Draw connecting lines between nearby particles and pointer
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      // Connect to other nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(168, 85, 247, ${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
      
      // Connect particle directly to the mouse cursor if close
      if (mouse.x !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(168, 85, 247, ${0.16 * (1 - dist / mouse.radius)})`;
          ctx.lineWidth = 0.6;
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

  // Simulate sending (replace with actual email service like EmailJS/Formspree)
  setTimeout(() => {
    btn.innerHTML = '<i class="bx bx-send"></i> Kirim Pesan';
    btn.disabled = false;
    formSuccess?.classList.add('show');
    contactForm.reset();
    setTimeout(() => formSuccess?.classList.remove('show'), 5000);
  }, 1800);
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
    // Linear interpolation: current = current + (target - current) * dampening
    dotPos.x += (mouse.x - dotPos.x) * 0.3;
    dotPos.y += (mouse.y - dotPos.y) * 0.3;

    auraPos.x += (mouse.x - auraPos.x) * 0.085;
    auraPos.y += (mouse.y - auraPos.y) * 0.085;

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
  const targets = document.querySelectorAll('.btn-primary, .btn-outline, .btn-cv, .btn-hire, .nav-logo');
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouch) return;

  targets.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Soft pull magnet dynamics (translate elements 30% of cursor offset)
      el.style.transform = `translate3d(${x * 0.32}px, ${y * 0.32}px, 0)`;
      el.style.boxShadow = `0 12px 28px rgba(168, 85, 247, 0.45)`;
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
    const glowColor = icon ? getComputedStyle(icon).getPropertyValue('--clr').trim() : 'rgba(168, 85, 247, 0.35)';

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
        card.style.boxShadow = `0 12px 36px rgba(0,0,0,0.5), 0 0 20px rgba(168, 85, 247, 0.22)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = isTouch ? '' : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      card.style.boxShadow = '';
    });
  });
}

/* ------ INTERACTIVE TEXT SCRAMBLE DECODER ------ */
function initTextScramble() {
  const targets = document.querySelectorAll('.section-title, .nav-logo');
  const chars = '!@#$%^&*()_+~`|}{[]:;?><,./-=10';

  function scrambleNode(node, originalText, resolve) {
    if (node.nodeType === Node.TEXT_NODE) {
      const original = originalText || node.textContent;
      if (!original.trim()) {
        resolve();
        return;
      }
      
      let frame = 0;
      // Elegant speed control: total frames is bounded to ensure it feels snappy
      const totalFrames = Math.max(30, original.length * 2.5);

      function animate() {
        // Map frame progress directly to characters solved
        const progress = (frame / totalFrames) * original.length;

        node.textContent = original.split('').map((char, index) => {
          if (index < progress) return original[index];
          if (char === ' ' || char === '\n') return char;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('');

        if (frame < totalFrames) {
          frame++;
          requestAnimationFrame(animate);
        } else {
          node.textContent = original;
          resolve();
        }
      }
      requestAnimationFrame(animate);
    } else {
      // Crawl all text nodes recursively
      let promises = [];
      node.childNodes.forEach(child => {
        promises.push(new Promise(res => scrambleNode(child, null, res)));
      });
      Promise.all(promises).then(resolve);
    }
  }

  targets.forEach(el => {
    // Clone and cache the innerHTML structure to always have a clean copy to reset to
    const originalHTML = el.innerHTML;
    
    el.addEventListener('mouseenter', () => {
      if (el.dataset.scrambling === 'true') return;
      el.dataset.scrambling = 'true';
      
      // Scramble recursively
      scrambleNode(el, null, () => {
        // Restore exact original HTML structure to preserve gradients and tags
        el.innerHTML = originalHTML;
        el.dataset.scrambling = 'false';
      });
    });
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

console.log('%c🚀 Portfolio Ariiq Nawfal Aqilla', 'color:#a855f7;font-size:16px;font-weight:bold;');
console.log('%cSoftware Engineering | Full-Stack Web Developer | UI/UX Designer', 'color:#c084fc;font-size:12px;');

