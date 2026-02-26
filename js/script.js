// =====================
// LOADING SCREEN
// =====================
const loader = document.getElementById('loader');

window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('loader-done');
    setTimeout(() => loader.remove(), 800);
  }, 1800);
});

// =====================
// CUSTOM CURSOR
// =====================
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

const magnetTargets = document.querySelectorAll(
  'a, button, .project-card, .skill-card, .exp-item, .contact-link'
);

magnetTargets.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorRing.classList.add('cursor-hover');
    cursorDot.classList.add('cursor-hover');
  });
  el.addEventListener('mouseleave', () => {
    cursorRing.classList.remove('cursor-hover');
    cursorDot.classList.remove('cursor-hover');
    el.style.transform = '';
  });
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.1;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.1;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
    el.style.transition = 'transform 0.15s ease';
  });
});

// =====================
// NAV
// =====================
const header = document.getElementById('site-header');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('mobile-open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('mobile-open');
  });
});

// =====================
// AOS
// =====================
AOS.init({
  duration: 800,
  easing: 'ease-out',
  once: false,
  mirror: true,
  offset: 60
});

// =====================
// TYPING EFFECT
// =====================
const roles = [
  'Computer Science Student',
  'Data Science Researcher',
  'AI Developer',
  'Tech Consultant'
];

let roleIdx = 0, charIdx = 0, deleting = false;
const typingEl = document.getElementById('typing-text');

function typeRole() {
  const current = roles[roleIdx];
  typingEl.textContent = deleting
    ? current.substring(0, charIdx - 1)
    : current.substring(0, charIdx + 1);
  deleting ? charIdx-- : charIdx++;
  if (!deleting && charIdx === current.length) setTimeout(() => deleting = true, 2000);
  else if (deleting && charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
  setTimeout(typeRole, deleting ? 35 : 80);
}
typeRole();

// =====================
// HERO CANVAS — ANIMATED GRID
// =====================
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');

function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
setCanvasSize();
window.addEventListener('resize', setCanvasSize);

let mouseCanvasX = 9999, mouseCanvasY = 9999;
document.addEventListener('mousemove', e => {
  mouseCanvasX = e.clientX;
  mouseCanvasY = e.clientY;
});

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const gap = 60;
  const cols = Math.ceil(canvas.width / gap) + 1;
  const rows = Math.ceil(canvas.height / gap) + 1;
  const time = Date.now() * 0.0004;

  // Grid lines
  ctx.strokeStyle = 'rgba(200, 240, 255, 0.025)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= cols; i++) {
    ctx.beginPath(); ctx.moveTo(i * gap, 0); ctx.lineTo(i * gap, canvas.height); ctx.stroke();
  }
  for (let j = 0; j <= rows; j++) {
    ctx.beginPath(); ctx.moveTo(0, j * gap); ctx.lineTo(canvas.width, j * gap); ctx.stroke();
  }

  // Animated dots at intersections
  for (let i = 0; i <= cols; i++) {
    for (let j = 0; j <= rows; j++) {
      const x = i * gap;
      const y = j * gap;
      const dist = Math.hypot(mouseCanvasX - x, mouseCanvasY - y);
      const influence = Math.max(0, 1 - dist / 280);
      const wave = Math.sin(i * 0.5 + time) * Math.cos(j * 0.5 + time);
      const ox = wave * influence * 6;
      const oy = wave * influence * 6;
      const alpha = 0.06 + influence * 0.25;
      const radius = 0.8 + influence * 1.5;

      ctx.beginPath();
      ctx.arc(x + ox, y + oy, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 240, 255, ${alpha})`;
      ctx.fill();
    }
  }
  requestAnimationFrame(drawGrid);
}
drawGrid();

// =====================
// TEXT SCRAMBLE — subtle
// =====================
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function scramble(el, finalText, duration = 500) {
  let start = null;
  function frame(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const resolved = Math.floor(progress * finalText.length);
    let out = '';
    for (let i = 0; i < finalText.length; i++) {
      if (finalText[i] === '\n' || finalText[i] === ' ') out += finalText[i];
      else if (i < resolved) out += finalText[i];
      else if (i < resolved + 3) out += chars[Math.floor(Math.random() * chars.length)];
      else out += finalText[i];
    }
    el.textContent = out;
    if (progress < 1) requestAnimationFrame(frame);
    else el.textContent = finalText;
  }
  requestAnimationFrame(frame);
}

const headings = document.querySelectorAll('.section-heading');
const scrambleObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const original = el.getAttribute('data-original');
      if (original) scramble(el, original);
    }
  });
}, { threshold: 0.4 });

headings.forEach(h => {
  h.setAttribute('data-original', h.innerText);
  scrambleObs.observe(h);
});

// =====================
// SECTION FADE IN
// =====================
document.querySelectorAll('section').forEach(s => {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting));
  }, { threshold: 0.06 });
  obs.observe(s);
});

// =====================
// SKILL BARS
// =====================
const bars = document.querySelectorAll('.skill-bar-fill');
const skillSection = document.querySelector('.skills');
if (skillSection) {
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      bars.forEach(bar => {
        bar.style.width = e.isIntersecting ? bar.getAttribute('data-w') + '%' : '0%';
      });
    });
  }, { threshold: 0.3 }).observe(skillSection);
}

// =====================
// STAT COUNTERS
// =====================
function animateCount(el, target, isDecimal, suffix, duration = 1400) {
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const val = target * ease;
    el.textContent = (isDecimal ? val.toFixed(1) : Math.floor(val)) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const aboutSection = document.querySelector('.about');
if (aboutSection) {
  new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.stat-val').forEach(el => {
          const target = parseFloat(el.getAttribute('data-target'));
          const suffix = el.getAttribute('data-suffix') || '';
          const isDecimal = el.getAttribute('data-target').includes('.');
          animateCount(el, target, isDecimal, suffix);
        });
      }
    });
  }, { threshold: 0.5 }).observe(aboutSection);
}

// =====================
// HORIZONTAL SCROLL — AUTO + BUTTONS
// =====================
const hTrack = document.getElementById('h-track');
const prevBtn = document.getElementById('h-prev');
const nextBtn = document.getElementById('h-next');

if (hTrack) {
  const cardWidth = 401; // card width + gap
  let autoScrollInterval;
  let isPaused = false;

  // Auto scroll
  function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
      if (isPaused) return;
      const maxScroll = hTrack.scrollWidth - hTrack.clientWidth;
      if (hTrack.scrollLeft >= maxScroll - 10) {
        hTrack.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        hTrack.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    }, 3000);
  }

  startAutoScroll();

  // Pause on hover/touch
  hTrack.addEventListener('mouseenter', () => isPaused = true);
  hTrack.addEventListener('mouseleave', () => isPaused = false);
  hTrack.addEventListener('touchstart', () => isPaused = true);
  hTrack.addEventListener('touchend', () => {
    setTimeout(() => isPaused = false, 2000);
  });

  // Buttons
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      isPaused = true;
      const maxScroll = hTrack.scrollWidth - hTrack.clientWidth;
      if (hTrack.scrollLeft >= maxScroll - 10) {
        hTrack.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        hTrack.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
      setTimeout(() => isPaused = false, 1500);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      isPaused = true;
      hTrack.scrollBy({ left: -cardWidth, behavior: 'smooth' });
      setTimeout(() => isPaused = false, 1500);
    });
  }

  // Drag support
  let isDown = false, startX = 0, scrollLeft = 0;
  hTrack.addEventListener('mousedown', e => {
    isDown = true;
    isPaused = true;
    hTrack.style.cursor = 'grabbing';
    startX = e.pageX - hTrack.offsetLeft;
    scrollLeft = hTrack.scrollLeft;
  });
  hTrack.addEventListener('mouseleave', () => { isDown = false; hTrack.style.cursor = 'grab'; });
  hTrack.addEventListener('mouseup', () => {
    isDown = false;
    hTrack.style.cursor = 'grab';
    setTimeout(() => isPaused = false, 1500);
  });
  hTrack.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    hTrack.scrollLeft = scrollLeft - (e.pageX - hTrack.offsetLeft - startX) * 1.5;
  });

  let tStartX = 0, tScrollLeft = 0;
  hTrack.addEventListener('touchstart', e => {
    tStartX = e.touches[0].pageX;
    tScrollLeft = hTrack.scrollLeft;
  });
  hTrack.addEventListener('touchmove', e => {
    hTrack.scrollLeft = tScrollLeft + (tStartX - e.touches[0].pageX) * 1.2;
  });
}

// =====================
// SMOOTH SCROLL
// =====================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// =====================
// CONTACT FORM
// =====================
const submitBtn = document.querySelector('.contact-submit');
if (submitBtn) {
  submitBtn.addEventListener('click', () => {
    const name = document.querySelector('.contact-field input[type="text"]')?.value;
    const email = document.querySelector('.contact-field input[type="email"]')?.value;
    const msg = document.querySelector('.contact-field textarea')?.value;
    if (name && email && msg) {
      submitBtn.textContent = 'Message Sent';
      submitBtn.style.opacity = '0.6';
      submitBtn.style.cursor = 'default';
      submitBtn.style.pointerEvents = 'none';
    }
  });
}