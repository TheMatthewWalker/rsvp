/* ================================================================
   1. FALLING PETALS CANVAS
================================================================ */
(function() {
  const canvas = document.getElementById('petal-canvas');
  const ctx = canvas.getContext('2d');
  let petals = [];
  const PETAL_COUNT = 30;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function randomRange(a, b) { return a + Math.random() * (b - a); }

  class Petal {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x = randomRange(0, window.innerWidth);
      this.y = initial ? randomRange(-100, window.innerHeight) : -20;
      this.size = randomRange(5, 14);
      this.speedY = randomRange(0.4, 1.2);
      this.speedX = randomRange(-0.5, 0.5);
      this.opacity = randomRange(0.25, 0.6);
      this.rotation = randomRange(0, Math.PI * 2);
      this.rotSpeed = randomRange(-0.02, 0.02);
      this.wobble = randomRange(0, Math.PI * 2);
      this.wobbleSpeed = randomRange(0.01, 0.03);
      const hue = randomRange(340, 360);
      const sat = randomRange(40, 60);
      const light = randomRange(75, 90);
      this.color = `hsla(${hue},${sat}%,${light}%,${this.opacity})`;
    }
    update() {
      this.wobble += this.wobbleSpeed;
      this.x += this.speedX + Math.sin(this.wobble) * 0.5;
      this.y += this.speedY;
      this.rotation += this.rotSpeed;
      if (this.y > window.innerHeight + 30) this.reset();
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < PETAL_COUNT; i++) petals.push(new Petal());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => { p.update(); p.draw(); });
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
  // Standard one-shot reveal for most elements
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = (i * 0.07) + 's';
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal:not(.story-image-wrap), .party-card').forEach(el => observer.observe(el));

  // Scroll-driven animation for the story image
  // Position and opacity are set directly based on scroll progress —
  // so stopping mid-scroll leaves it exactly mid-animation.
  const storyImg = document.querySelector('.story-image-wrap.reveal');
  if (storyImg) {
    // Remove the reveal class so our CSS transition doesn't fight with scroll JS
    storyImg.classList.remove('reveal');
    storyImg.style.opacity = '0';
    storyImg.style.transform = 'translateX(-80px)';
    storyImg.style.transition = 'none'; // We're setting values directly, no CSS transition

    function updateStoryImg() {
      const rect = storyImg.getBoundingClientRect();
      const windowH = window.innerHeight;

      // --- Slide IN ---
      // Slide finishes when image top reaches 30% down the screen
      const inStart = windowH * 1;             // animation begins: image just entering from bottom
      const inEnd   = windowH * 0.3;           // animation ends: image settled at 30% from top
      const inProgress = Math.min(1, Math.max(0, (inStart - rect.top) / (inStart - inEnd)));

      // --- Slide OUT ---
      // Slide out begins when image top is well above the screen (-20% of image height)
      const outStart = -rect.height * 0.3;  // starts leaving late — image mostly off top
      const outEnd   = -rect.height * 1;  // fully gone
      const outProgress = Math.min(1, Math.max(0, (outStart - rect.top) / (outStart - outEnd)));

      let slideProgress, opacityProgress;

      if (rect.top > outStart) {
        // Coming in from bottom or fully visible
        slideProgress = inProgress;
      } else {
        // Scrolling off the top
        slideProgress = 1 - outProgress;
      }

      // Opacity uses its own faster curve — reaches full opacity in the first 20% of the slide,
      // and fades out in the first 20% of the slide out
      opacityProgress = rect.top > outStart
        ? Math.min(1, inProgress / 0.2)          // fade in fast during first 20% of slide in
        : Math.max(0, (1 - outProgress / 0.2));  // fade out fast during first 20% of slide out

      const translateX = -80 * (1 - slideProgress);
      storyImg.style.transform = `translateX(${translateX}px)`;
      storyImg.style.opacity   = Math.min(1, Math.max(0, opacityProgress));
    }

    window.addEventListener('scroll', updateStoryImg, { passive: true });
    updateStoryImg(); // run once on load in case already in view
  }
})();

/* ================================================================
   4. GALLERY LIGHTBOX
================================================================ */
(function() {
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightbox-img');
  const lbClose  = document.getElementById('lightbox-close');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      lbImg.src = item.dataset.src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  lbClose.addEventListener('click', close);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ================================================================
   5. DYNAMIC GUEST ROWS
================================================================ */
(function() {
  let guestCount = 1;

  const STARTERS  = ['— Select Starter —', 'French Onion & Marscapone Soup', 'Cajun Chicken Thigh',];
  const MAINS     = ['— Select Main —', 'Slow-Roasted Beef Shin with Potato Rosti', 'Roast Chicken with Seasonal Veg and Yorkshire Pudding'];
  const DESSERTS  = ['— Select Dessert —', 'Sticky Toffee Pudding', 'Trio of Desserts'];
  const MAIN_VALS = ['', 'Beef', 'Chicken'];
  const STRT_VALS = ['', 'Soup', 'Thigh'];
  const DSSR_VALS = ['', 'Toffee', 'Trio'];

  function buildSelect(name, options, values) {
    const sel = document.createElement('select');
    sel.name = name;
    options.forEach((o, i) => {
      const opt = new Option(o, values[i]);
      if (i === 0) opt.disabled = false;
      sel.appendChild(opt);
    });
    return sel;
  }
  // The code for dynamic guest rows is currently commented out to simplify the form,
  /* document.getElementById('btn-add-guest').addEventListener('click', () => {
    if (guestCount >= 6) return; // max 6 guests per RSVP
    guestCount++;
    const n = guestCount;

    const row = document.createElement('div');
    row.className = 'guest-row';
    row.id = `guest-${n}`;

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn-remove-guest';
    removeBtn.innerHTML = '✕';
    removeBtn.addEventListener('click', () => {
      row.remove();
      guestCount = document.querySelectorAll('.guest-row').length;
    });

    const title = document.createElement('p');
    title.className = 'guest-row-title';
    title.textContent = `ADDITIONAL GUEST ${n - 1}`;

    // Name row
    const nameRow = document.createElement('div');
    nameRow.className = 'form-row';

    const fgFirst = document.createElement('div');
    fgFirst.className = 'form-group';
    const lblFirst = document.createElement('label');
    lblFirst.textContent = 'First Name';
    const inpFirst = document.createElement('input');
    inpFirst.type = 'text'; inpFirst.name = `guest_${n}_first`; inpFirst.placeholder = 'First Name';
    fgFirst.append(lblFirst, inpFirst);

    const fgLast = document.createElement('div');
    fgLast.className = 'form-group';
    const lblLast = document.createElement('label');
    lblLast.textContent = 'Last Name';
    const inpLast = document.createElement('input');
    inpLast.type = 'text'; inpLast.name = `guest_${n}_last`; inpLast.placeholder = 'Last Name';
    fgLast.append(lblLast, inpLast);

    nameRow.append(fgFirst, fgLast);

    // Meal row
    const mealRow = document.createElement('div');
    mealRow.className = 'form-row';

    const fgStarter = document.createElement('div');
    fgStarter.className = 'form-group';
    const lblSt = document.createElement('label'); lblSt.textContent = 'Starter';
    fgStarter.append(lblSt, buildSelect(`guest_${n}_starter`, STARTERS, STRT_VALS));

    const fgMain = document.createElement('div');
    fgMain.className = 'form-group';
    const lblMn = document.createElement('label'); lblMn.textContent = 'Main Course';
    fgMain.append(lblMn, buildSelect(`guest_${n}_main`, MAINS, MAIN_VALS));

    const fgDessert = document.createElement('div');
    fgDessert.className = 'form-group';
    const lblDs = document.createElement('label'); lblDs.textContent = 'Dessert';
    fgDessert.append(lblDs, buildSelect(`guest_${n}_dessert`, DESSERTS, DSSR_VALS));

    mealRow.append(fgStarter, fgMain, fgDessert);

    // Dietary
    const fgDietary = document.createElement('div');
    fgDietary.className = 'form-group';
    fgDietary.style.marginBottom = '1rem';
    const lblDiet = document.createElement('label'); lblDiet.textContent = 'Dietary Requirements';
    const inpDiet = document.createElement('input');
    inpDiet.type = 'text'; inpDiet.name = `guest_${n}_dietary`; inpDiet.placeholder = 'e.g. Vegetarian, nut allergy...';
    fgDietary.append(lblDiet, inpDiet);

    row.append(removeBtn, title, nameRow, mealRow, fgDietary);
    document.getElementById('guest-rows').append(row);
  }); */
})();

/* ================================================================
   6. RSVP FORM SUBMISSION (Formspree)
================================================================ */

(function() {
  const form    = document.getElementById('rsvp-form');
  const success = document.getElementById('rsvp-success');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.submit-btn');
    btn.querySelector('span').textContent = 'Sending…';
    btn.disabled = true;

    const guestsData = await fetch('./guests.json').then(r => r.json());
    const firstName = form.querySelector('#first_name').value.trim().toLowerCase();
    const lastName  = form.querySelector('#last_name').value.trim().toLowerCase();

    const isGuest = guestsData.guests.some(g =>
      g.firstname.toLowerCase() === firstName &&
      g.lastname.toLowerCase() === lastName
    );

    if (!isGuest) {
      alert('Your name was not found on the guest list. Please check your spelling and try again.');
      btn.querySelector('span').textContent = 'Send RSVP';
      btn.disabled = false;
      return;
    }

    const data = new FormData(form);

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.style.display = 'none';
        success.style.display = 'block';
      } else {
        const json = await res.json();
        const msg  = json.errors ? json.errors.map(e => e.message).join(', ') : 'Something went wrong.';
        alert('Sorry, there was an issue: ' + msg);
        btn.querySelector('span').textContent = 'Send RSVP';
        btn.disabled = false;
      }
    } catch (err) {
      alert('Network error. Please try again or contact us directly.');
      btn.querySelector('span').textContent = 'Send RSVP';
      btn.disabled = false;
    }
  });
})();

/* ================================================================
   7. HERO ORNAMENT PARALLAX
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