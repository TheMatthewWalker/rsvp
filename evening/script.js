/* ================================================================
   1. FAIRY LIGHTS CANVAS
================================================================ */
(function() {
  const canvas = document.getElementById('lights-canvas');
  const ctx = canvas.getContext('2d');
  let lights = [];
  const LIGHT_COUNT = 40;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function randomRange(a, b) { return a + Math.random() * (b - a); }

  class Light {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x = randomRange(0, window.innerWidth);
      this.y = initial ? randomRange(0, window.innerHeight) : window.innerHeight + 10;
      this.radius = randomRange(1, 2.8);
      this.speedY = randomRange(0.1, 0.35);
      this.drift = randomRange(0, Math.PI * 2);
      this.driftSpeed = randomRange(0.004, 0.012);
      this.twinkle = randomRange(0, Math.PI * 2);
      this.twinkleSpeed = randomRange(0.01, 0.04);
      this.hue = randomRange(38, 48);
    }
    update() {
      this.drift += this.driftSpeed;
      this.twinkle += this.twinkleSpeed;
      this.x += Math.sin(this.drift) * 0.3;
      this.y -= this.speedY;
      if (this.y < -10) this.reset();
    }
    draw() {
      const alpha = 0.35 + Math.sin(this.twinkle) * 0.3;
      const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 5);
      glow.addColorStop(0, `hsla(${this.hue}, 80%, 80%, ${alpha})`);
      glow.addColorStop(1, `hsla(${this.hue}, 80%, 70%, 0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < LIGHT_COUNT; i++) lights.push(new Light());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lights.forEach(l => { l.update(); l.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ================================================================
   2. NAV SCROLL EFFECT
================================================================ */
(function() {
  const nav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
})();

/* ================================================================
   3. SCROLL REVEAL
================================================================ */
(function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = (i * 0.07) + 's';
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ================================================================
   4. HERO ORNAMENT PARALLAX
================================================================ */
(function() {
  const ornaments = document.querySelectorAll('.hero-ornament');
  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    ornaments.forEach((o, i) => {
      const factor = (i + 1) * 8;
      o.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  });
})();
