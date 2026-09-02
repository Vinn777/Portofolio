/* =============================================
   ARIIQ NAWFAL AQILLA - PORTFOLIO JS
   Theme: NeoBrutalism 3D
   ============================================= */

/* ====== LOADER & ENTRY SEQUENCE ====== */
(function initLoader() {
  const statusMessages = [
    'LOADING PORTFOLIO',
    'BUILDING UI...',
    'LOADING 3D...',
    'COMPILING STYLES',
    'INIT ANIMATIONS',
    'READY'
  ];
  const statusEl = document.getElementById('loader-status-text');
  const loader = document.getElementById('loader');
  let msgIdx = 0;

  const interval = setInterval(() => {
    msgIdx = (msgIdx + 1) % statusMessages.length;
    if (statusEl) statusEl.textContent = statusMessages[msgIdx];
  }, 220);

  let isLoaded = false;
  function finishLoader() {
    if (isLoaded) return;
    isLoaded = true;
    clearInterval(interval);
    if (statusEl) statusEl.textContent = 'READY';
    setTimeout(() => {
      if (loader) {
        loader.classList.add('hidden');
        document.body.classList.add('loaded');
        window.dispatchEvent(new CustomEvent('appLoaded'));
      }
    }, 400);
  }

  window.addEventListener('load', finishLoader);
  // Failsafe timeout for mobile network/CDNs
  setTimeout(finishLoader, 2000);
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

/* ====== CANVAS PARTICLES (SUBTLE DOTS — BRUTALIST BG) ====== */
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
  window.addEventListener('orientationchange', () => setTimeout(resize, 100));

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Mobile Touch Support for particles
  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });
  window.addEventListener('touchend', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = randomBetween(0, W);
      this.y  = randomBetween(0, H);
      this.r  = randomBetween(0.8, 1.8);
      this.vx = randomBetween(-0.1, 0.1);
      this.vy = randomBetween(-0.1, 0.1);
      this.alpha = randomBetween(0.05, 0.2);
      // Warm yellow-white tones for brutalist feel
      const hue = Math.random() > 0.7 ? randomBetween(42, 52) : 0;
      this.color = hue > 0
        ? `hsla(${hue}, 100%, 65%, ${this.alpha})`
        : `rgba(255,255,255,${this.alpha})`;
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
          this.x += (dx / dist) * force * 0.15;
          this.y += (dy / dist) * force * 0.15;
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

  const particleCount = W < 768 ? 45 : 80;
  for (let i = 0; i < particleCount; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 214, 10, ${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
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

/* ====== THREE.JS 3D HERO OBJECT — DISABLED (removed per redesign) ====== */
(function initHero3D() {
  // 3D wireframe polyhedron removed per redesign — canvas is now display:none
  return;
  const canvas = document.getElementById('hero-3d-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  function calculateDimensions() {
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    let w, h;
    if (isSmallMobile) {
      w = h = Math.min(Math.round(window.innerWidth * 0.88), 300);
    } else if (isMobile) {
      w = h = Math.min(Math.round(window.innerWidth * 0.85), 360);
    } else if (window.innerWidth <= 1024) {
      w = h = 440;
    } else {
      w = h = 520;
    }
    return { w, h };
  }

  let { w: W, h: H } = calculateDimensions();

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(W, H, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
  camera.position.z = 5;

  // Group to hold all meshes
  const group = new THREE.Group();
  scene.add(group);

  // === MAIN ICOSAHEDRON — wireframe dark purple & violet ===
  const geoMain = new THREE.IcosahedronGeometry(1.5, 1);
  const matWire = new THREE.MeshBasicMaterial({
    color: 0xC084FC,
    wireframe: true,
    transparent: true,
    opacity: 0.75
  });
  const meshMain = new THREE.Mesh(geoMain, matWire);
  group.add(meshMain);

  // === INNER solid — semi-transparent deep purple fill ===
  const matInner = new THREE.MeshBasicMaterial({
    color: 0x7C3AED,
    transparent: true,
    opacity: 0.08
  });
  const meshInner = new THREE.Mesh(geoMain, matInner);
  group.add(meshInner);

  // === OUTER wireframe ring (octahedron) in signature yellow ===
  const geoOuter = new THREE.OctahedronGeometry(2.2, 0);
  const matOuter = new THREE.MeshBasicMaterial({
    color: 0xFFD60A,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const meshOuter = new THREE.Mesh(geoOuter, matOuter);
  group.add(meshOuter);

  // === SMALL orbiting cube in cyan/neon blue ===
  const geoCube = new THREE.BoxGeometry(0.35, 0.35, 0.35);
  const matCube = new THREE.MeshBasicMaterial({
    color: 0x00F2FE,
    wireframe: true,
    transparent: true,
    opacity: 0.85
  });
  const meshCube = new THREE.Mesh(geoCube, matCube);
  meshCube.position.set(2.3, 0, 0);
  group.add(meshCube);

  // === TORUS ring in neon purple ===
  const geoTorus = new THREE.TorusGeometry(2, 0.015, 4, 60);
  const matTorus = new THREE.MeshBasicMaterial({
    color: 0xA855F7,
    transparent: true,
    opacity: 0.4
  });
  const meshTorus = new THREE.Mesh(geoTorus, matTorus);
  meshTorus.rotation.x = Math.PI / 2.5;
  group.add(meshTorus);

  // Mouse & Touch Interactive Parallax
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      targetX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
    }
  }, { passive: true });

  let t = 0;
  function animate3D() {
    requestAnimationFrame(animate3D);
    t += 0.008;

    // Smooth damping
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;

    // Main rotation
    group.rotation.y = t * 0.4 + currentX * 0.45;
    group.rotation.x = t * 0.15 + currentY * 0.25;

    // Outer counter-spin
    meshOuter.rotation.y = -t * 0.6;
    meshOuter.rotation.z = t * 0.3;

    // Orbiting cube
    meshCube.position.x = Math.cos(t * 1.2) * 2.3;
    meshCube.position.y = Math.sin(t * 1.2) * 0.5;
    meshCube.position.z = Math.sin(t * 1.2) * 2.3;
    meshCube.rotation.x += 0.03;
    meshCube.rotation.z += 0.02;

    // Subtle pulse on main mesh opacity
    matWire.opacity = 0.55 + Math.sin(t * 2) * 0.15;

    renderer.render(scene, camera);
  }
  animate3D();

  // Dynamic Resize handler for all phone models & orientations
  function handleResize() {
    const { w: newW, h: newH } = calculateDimensions();
    camera.aspect = newW / newH;
    camera.updateProjectionMatrix();
    renderer.setSize(newW, newH, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  }

  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', () => setTimeout(handleResize, 150));
})();

/* ====== GSAP SCROLL REVEAL ANIMATIONS ====== */
(function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  function triggerHeroEntrance() {
    const isMobile = window.innerWidth <= 768;
    // Hero content entrance
    gsap.fromTo('.hero-content', {
      opacity: 0,
      y: isMobile ? 30 : 50
    }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    });

    gsap.fromTo('.hero-visual', {
      opacity: 0,
      x: isMobile ? 0 : 80,
      y: isMobile ? 25 : 0
    }, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.85,
      ease: 'power3.out'
    });
  }

  window.addEventListener('appLoaded', triggerHeroEntrance);
  if (document.body.classList.contains('loaded')) {
    triggerHeroEntrance();
  }

  // Section tags animate in
  gsap.utils.toArray('.section-tag').forEach(tag => {
    gsap.fromTo(tag, {
      scaleX: 0,
      transformOrigin: 'left center'
    }, {
      scaleX: 1,
      duration: 0.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: tag,
        start: 'top 85%'
      }
    });
  });

  // Section titles
  gsap.utils.toArray('.section-title').forEach(title => {
    gsap.fromTo(title, {
      opacity: 0,
      y: 40
    }, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: title,
        start: 'top 85%'
      }
    });
  });

  // About cards stagger
  gsap.utils.toArray('.about-card').forEach((card, i) => {
    gsap.fromTo(card, {
      opacity: 0,
      y: 50,
      x: i === 0 ? -30 : i === 2 ? 30 : 0
    }, {
      opacity: 1,
      y: 0,
      x: 0,
      duration: 0.6,
      delay: i * 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.about-grid',
        start: 'top 80%'
      }
    });
  });

  // Skill cards stagger
  gsap.utils.toArray('.skill-card').forEach((card, i) => {
    gsap.fromTo(card, {
      opacity: 0,
      y: 30
    }, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      delay: i * 0.06,
      ease: 'back.out(1.5)',
      scrollTrigger: {
        trigger: '.skills-grid',
        start: 'top 80%'
      }
    });
  });

  // Project cards stagger
  gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.fromTo(card, {
      opacity: 0,
      y: 60
    }, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: i * 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.projects-grid',
        start: 'top 80%'
      }
    });
  });

  // Cert cards
  gsap.utils.toArray('.cert-card').forEach((card, i) => {
    gsap.fromTo(card, {
      opacity: 0,
      x: i % 2 === 0 ? -40 : 40
    }, {
      opacity: 1,
      x: 0,
      duration: 0.6,
      delay: i * 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.certs-grid',
        start: 'top 80%'
      }
    });
  });

  // Contact section
  gsap.fromTo('.contact-info', {
    opacity: 0,
    x: -50
  }, {
    opacity: 1,
    x: 0,
    duration: 0.7,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.contact-wrap',
      start: 'top 75%'
    }
  });

  gsap.fromTo('.contact-form', {
    opacity: 0,
    x: 50
  }, {
    opacity: 1,
    x: 0,
    duration: 0.7,
    delay: 0.15,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.contact-wrap',
      start: 'top 75%'
    }
  });
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

/* ====== HAMBURGER MENU & MOBILE NAV ====== */
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('nav-links');
const navOverlay = document.getElementById('nav-overlay');

function openMobileMenu() {
  hamburger?.classList.add('active');
  navLinks?.classList.add('open');
  navOverlay?.classList.add('active');
  document.body.classList.add('menu-open');
}

function closeMobileMenu() {
  hamburger?.classList.remove('active');
  navLinks?.classList.remove('open');
  navOverlay?.classList.remove('active');
  document.body.classList.remove('menu-open');
}

function toggleMobileMenu(e) {
  if (e) e.stopPropagation();
  const isOpen = navLinks?.classList.contains('open');
  if (isOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

hamburger?.addEventListener('click', toggleMobileMenu);

// Tutup menu saat menekan area backdrop / overlay di sebelah menu
navOverlay?.addEventListener('click', closeMobileMenu);
navOverlay?.addEventListener('touchstart', (e) => {
  e.preventDefault();
  closeMobileMenu();
}, { passive: false });

// Tutup menu saat klik/tap di luar area menu dan hamburger
document.addEventListener('click', (e) => {
  if (navLinks?.classList.contains('open')) {
    if (!navLinks.contains(e.target) && !hamburger?.contains(e.target)) {
      closeMobileMenu();
    }
  }
});

document.addEventListener('touchstart', (e) => {
  if (navLinks?.classList.contains('open')) {
    if (!navLinks.contains(e.target) && !hamburger?.contains(e.target)) {
      closeMobileMenu();
    }
  }
}, { passive: true });

// Tutup menu saat nav link ditekan
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    closeMobileMenu();
  });
});

// Tutup menu saat tombol Escape ditekan
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks?.classList.contains('open')) {
    closeMobileMenu();
  }
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

/* ------ MAGNETIC PHYSICS BUTTONS (NEOBRUTALISM) ------ */
function initMagneticButtons() {
  const targets = document.querySelectorAll('.btn-primary, .btn-outline, .btn-cv, .btn-hire, .nav-logo, .skills-tab');
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouch) return;

  targets.forEach(el => {
    const origTransform = el.style.transform || '';
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      // Small magnetic pull — NeoBrutalism keeps sharp edges
      el.style.transform = `translate3d(${x * 0.22}px, ${y * 0.22}px, 0)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = origTransform;
    });
  });
}

/* ------ BRUTALIST CARD HOVER EFFECT ------ */
function init3DTiltAndSpotlight() {
  const cards = document.querySelectorAll('.about-card, .project-card, .skill-card, .cert-card');
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (isTouch) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Subtle tilt — less extreme for brutalist feel
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotX = ((rect.top + centerY - e.clientY) / centerY) * 3;
      const rotY = ((e.clientX - (rect.left + centerX)) / centerX) * 3;
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translate(-2px, -2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
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

console.log('%c◆ Portfolio Ariiq Nawfal Aqilla', 'color:#dc2626;font-size:16px;font-weight:900;font-family:Space Grotesk,sans-serif;');
console.log('%cFront-End Developer | UI/UX | Hero Mode Active', 'color:rgba(255,255,255,0.6);font-size:12px;');

/* ================================================================
   HERO MODE — RED BLACK THEME
   Three features:
   1. Canvas full-width lightning (midpoint displacement branching)
   2. Photo hover: glitch → web overlay crossfade + rim-light
   3. JS 3D tilt + scroll parallax
   ================================================================ */

/* ===============================================================
   FEATURE 1 — CANVAS LIGHTNING BACKGROUND
   - Full-width canvas behind hero content
   - Procedural branching lightning via midpoint displacement
   - Fires every 4-7s at random x position, fades out in ~200ms
   =============================================================== */
(function initHeroLightningCanvas() {
  const canvas = document.getElementById('hero-lightning-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // ---- Resize handling ----
  function resizeCanvas() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  // ---- Midpoint displacement to generate a realistic bolt segment ----
  // Returns array of {x,y} points
  function generateBolt(x1, y1, x2, y2, offset, depth) {
    if (depth === 0) return [{ x: x1, y: y1 }, { x: x2, y: y2 }];

    const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * offset;
    const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * offset * 0.3;

    const left  = generateBolt(x1, y1, midX, midY, offset / 2, depth - 1);
    const right = generateBolt(midX, midY, x2, y2, offset / 2, depth - 1);

    // Merge: left ends and right starts at the same mid-point
    return [...left.slice(0, -1), ...right];
  }

  // ---- Optionally add branch forks ----
  function drawBranch(pts, branchProbability) {
    if (pts.length < 4) return;

    // Pick a random segment to branch from
    const startIdx = Math.floor(pts.length * 0.2 + Math.random() * pts.length * 0.5);
    const end = pts[startIdx];

    const bx2 = end.x + (Math.random() - 0.5) * 80;
    const by2 = end.y + (canvas.height - end.y) * (0.3 + Math.random() * 0.4);

    const branchPts = generateBolt(end.x, end.y, bx2, by2, 30, 4);

    ctx.save();
    ctx.globalAlpha *= 0.45;
    ctx.beginPath();
    ctx.moveTo(branchPts[0].x, branchPts[0].y);
    branchPts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.stroke();
    ctx.restore();
  }

  // ---- Draw one full lightning flash ----
  function drawLightning() {
    const W = canvas.width;
    const H = canvas.height;

    // Random x start position (avoid edges)
    const startX = W * 0.1 + Math.random() * W * 0.8;
    const startY = 0;
    const endX   = startX + (Math.random() - 0.5) * W * 0.3;
    const endY   = H * (0.6 + Math.random() * 0.4);

    const pts = generateBolt(startX, startY, endX, endY, 80, 6);

    // Outer glow pass (wider, lower opacity)
    ctx.clearRect(0, 0, W, H);
    ctx.save();

    ctx.shadowBlur  = 12;
    ctx.shadowColor = 'rgba(252, 165, 165, 0.8)';
    ctx.lineWidth   = 2.5;
    ctx.strokeStyle = 'rgba(255, 220, 220, 0.18)';
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.stroke();

    // Core bolt (thinner, brighter)
    ctx.lineWidth   = 1;
    ctx.strokeStyle = 'rgba(252, 165, 165, 0.75)';
    ctx.shadowBlur  = 6;
    ctx.shadowColor = 'rgba(252, 165, 165, 1)';
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.stroke();

    // Random branch
    if (Math.random() > 0.4) drawBranch(pts, 0.5);

    ctx.restore();
  }

  // ---- Animated fade-out after each flash ----
  function flashLightning() {
    drawLightning();

    // Hold for 80-150ms, then fade out
    const holdMs  = 80  + Math.random() * 70;
    const fadeMs  = 120 + Math.random() * 80;
    const steps   = 20;
    const stepMs  = fadeMs / steps;
    let   step    = 0;

    setTimeout(() => {
      const fadeInterval = setInterval(() => {
        step++;
        // Overwrite canvas with semi-transparent black to fade
        ctx.fillStyle = `rgba(10, 10, 10, ${step / steps * 0.9})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (step >= steps) {
          clearInterval(fadeInterval);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }, stepMs);
    }, holdMs);
  }

  // ---- Schedule next flash every 4-7 seconds ----
  function scheduleNext() {
    const delay = 4000 + Math.random() * 3000;
    setTimeout(() => {
      flashLightning();
      scheduleNext();
    }, delay);
  }

  // First flash after a short warm-up delay
  setTimeout(flashLightning, 1500 + Math.random() * 1500);
  scheduleNext();
})();


/* ===============================================================
   FEATURE 2 — INTERACTIVE PHOTO HOVER
   - mouseenter: glitch CSS animation (0.35s) → crossfade to
     web-overlay canvas + rim-light inset glow
   - mouseleave: crossfade back to normal photo state
   =============================================================== */
(function initHeroPhotoHover() {
  const circle    = document.getElementById('avatar-circle');
  const img       = document.getElementById('profile-img');
  const webCanvas = document.getElementById('avatar-web-canvas');
  if (!circle || !img) return;

  let isHovered  = false;
  let glitchTimer = null;
  let webDrawn   = false;

  // ---- Draw cross-hatch geometric web pattern on canvas ----
  function buildWebOverlay() {
    if (!webCanvas || webDrawn) return;
    const W = webCanvas.width  = circle.offsetWidth  || 300;
    const H = webCanvas.height = circle.offsetHeight || 300;
    const c = webCanvas.getContext('2d');
    c.clearRect(0, 0, W, H);

    const step = 20;

    // Diagonal lines — top-left → bottom-right
    c.strokeStyle = 'rgba(220, 38, 38, 0.5)';
    c.lineWidth   = 0.7;
    for (let i = -H; i < W + H; i += step) {
      c.beginPath(); c.moveTo(i, 0); c.lineTo(i + H, H); c.stroke();
    }
    // Diagonal lines — top-right → bottom-left
    for (let i = -H; i < W + H; i += step) {
      c.beginPath(); c.moveTo(i, H); c.lineTo(i + H, 0); c.stroke();
    }
    // Sparse horizontals
    c.strokeStyle = 'rgba(220, 38, 38, 0.2)';
    c.lineWidth   = 0.4;
    for (let y = 0; y <= H; y += step * 3) {
      c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke();
    }
    // Corner accent triangles
    c.strokeStyle = 'rgba(220, 38, 38, 0.55)';
    c.lineWidth   = 1;
    c.beginPath(); c.moveTo(0, 0); c.lineTo(55, 0); c.lineTo(0, 55); c.closePath(); c.stroke();
    c.beginPath(); c.moveTo(W, H); c.lineTo(W-55, H); c.lineTo(W, H-55); c.closePath(); c.stroke();
    // Center crosshair + circle
    const cx = W/2, cy = H/2, cr = 22;
    c.strokeStyle = 'rgba(220, 38, 38, 0.45)';
    c.lineWidth   = 0.6;
    c.beginPath(); c.moveTo(cx - cr, cy); c.lineTo(cx + cr, cy); c.stroke();
    c.beginPath(); c.moveTo(cx, cy - cr); c.lineTo(cx, cy + cr); c.stroke();
    c.beginPath(); c.arc(cx, cy, cr * 0.5, 0, Math.PI * 2); c.stroke();

    webDrawn = true;
  }

  function onEnter() {
    if (isHovered) return;
    isHovered = true;

    // Phase 1: glitch burst (0.35s)
    img.classList.add('glitching');
    clearTimeout(glitchTimer);

    glitchTimer = setTimeout(() => {
      img.classList.remove('glitching');
      // Phase 2: reveal overlay + rim
      buildWebOverlay();
      circle.classList.add('hovered');
    }, 350);
  }

  function onLeave() {
    if (!isHovered) return;
    isHovered = false;
    clearTimeout(glitchTimer);
    img.classList.remove('glitching');
    circle.classList.remove('hovered');
    // Reset any inline tilt transform on the tilt container
    const tiltEl = document.getElementById('avatar-tilt-container');
    if (tiltEl) tiltEl.style.transform = '';
  }

  circle.addEventListener('mouseenter', onEnter);
  circle.addEventListener('mouseleave', onLeave);
  // Touch toggle
  circle.addEventListener('touchstart', () => {
    isHovered ? onLeave() : onEnter();
  }, { passive: true });
})();


/* ===============================================================
   FEATURE 3 — JS 3D TILT + SCROLL PARALLAX
   - mousemove over avatar-tilt-container: perspective rotateX/Y
     max ±8 degrees, smooth easing
   - scroll: hero lightning canvas moves at 0.5× scroll speed
     (parallax depth effect)
   =============================================================== */
(function initHero3DAndParallax() {
  const tiltEl        = document.getElementById('avatar-tilt-container');
  const lightningCanvas = document.getElementById('hero-lightning-canvas');
  const heroSection   = document.getElementById('hero');
  if (!heroSection) return;

  const MAX_TILT = 8; // degrees

  // ---- 3D Tilt on mousemove ----
  if (tiltEl) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = tiltEl.getBoundingClientRect();
      // Only tilt when cursor is within ~150px of the avatar
      const distX = e.clientX - (rect.left + rect.width / 2);
      const distY = e.clientY - (rect.top  + rect.height / 2);
      const proximity = Math.sqrt(distX * distX + distY * distY);

      if (proximity > 350) {
        // Cursor is far away — ease back to neutral
        tiltEl.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        return;
      }

      // Normalize to [-1, 1] relative to the avatar rect
      const nx = Math.max(-1, Math.min(1, distX / (rect.width  / 2)));
      const ny = Math.max(-1, Math.min(1, distY / (rect.height / 2)));

      const rotX = -(ny * MAX_TILT);
      const rotY =   nx * MAX_TILT;

      tiltEl.style.transform =
        `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      tiltEl.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  }

  // ---- Scroll parallax: bg canvas moves at 0.5× scroll speed ----
  let rafPending = false;
  window.addEventListener('scroll', () => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const heroH   = heroSection.offsetHeight;
      // Only inside the hero viewport
      if (scrollY <= heroH) {
        if (lightningCanvas) {
          // Background canvas slides up slower than the page (parallax depth)
          lightningCanvas.style.transform = `translateY(${scrollY * 0.5}px)`;
        }
      }
      rafPending = false;
    });
  }, { passive: true });
})();
