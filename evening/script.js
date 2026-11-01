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

/* ================================================================
   5. RSVP — PLUS ONES
================================================================ */
(function() {
  const MAX_PLUS_ONES = 4;
  const rows      = document.getElementById('plus-one-rows');
  const addBtn    = document.getElementById('btn-add-guest');
  const plusOnes  = document.getElementById('plus-ones');
  const declined  = document.getElementById('attending_no');
  let nextId = 1;

  function renumber() {
    rows.querySelectorAll('.plus-one-row').forEach((row, i) => {
      row.querySelector('label').textContent = `Plus One ${i + 1} — Full Name`;
      row.querySelector('input').name = `plus_one_${i + 1}`;
    });
    addBtn.hidden = rows.children.length >= MAX_PLUS_ONES;
  }

  addBtn.addEventListener('click', () => {
    const id = `plus_one_input_${nextId++}`;
    const row = document.createElement('div');
    row.className = 'plus-one-row';
    row.innerHTML = `
      <div class="form-group">
        <label for="${id}"></label>
        <input type="text" id="${id}" autocomplete="off" required />
      </div>
      <button type="button" class="btn-remove-guest" aria-label="Remove plus one">✕</button>`;
    row.querySelector('.btn-remove-guest').addEventListener('click', () => {
      row.remove();
      renumber();
    });
    rows.append(row);
    renumber();
    row.querySelector('input').focus();
  });

  // Plus ones only make sense if the guest is coming
  document.querySelectorAll('input[name="attending"]').forEach(radio => {
    radio.addEventListener('change', () => {
      plusOnes.hidden = declined.checked;
      if (declined.checked) {
        rows.innerHTML = '';
        renumber();
      }
    });
  });
})();

/* ================================================================
   6. RSVP — SUBMIT (Formspree)
================================================================ */
(function() {
  const form    = document.getElementById('rsvp-form');
  const success = document.getElementById('rsvp-success');
  const error   = document.getElementById('rsvp-error');
  const btn     = form.querySelector('.submit-btn');
  const label   = btn.querySelector('span');

  function showError(msg) {
    error.textContent = msg;
    error.hidden = false;
    btn.disabled = false;
    label.textContent = 'Send RSVP';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.hidden = true;
    btn.disabled = true;
    label.textContent = 'Sending…';

    const data = new FormData(form);
    data.append('plus_ones', form.querySelectorAll('.plus-one-row').length);

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.hidden = true;
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        const json = await res.json().catch(() => ({}));
        const msg = json.errors ? json.errors.map(err => err.message).join(', ') : 'Something went wrong.';
        showError('Sorry, there was a problem sending your RSVP: ' + msg);
      }
    } catch (err) {
      showError('Network error — please try again, or email us using the address below.');
    }
  });
})();

/* ================================================================
   7. RSVP — THE RUNAWAY DECLINE BUTTON
   The first few taps on "Regretfully Declines" make it jump somewhere
   else on screen. Once caught, two double-negative questions decide
   what the guest actually meant.
================================================================ */
(function() {
  const MAX_MOVES = 5;

  const declineLabel = document.querySelector('label[for="attending_no"]');
  const accept   = document.getElementById('attending_yes');
  const decline  = document.getElementById('attending_no');
  const note     = document.getElementById('attend-note');
  const dialog   = document.getElementById('decline-dialog');
  const stepEl   = document.getElementById('decline-step');
  const textEl   = document.getElementById('decline-question');
  if (!declineLabel || !dialog || typeof dialog.showModal !== 'function') return;

  // "Yes" agrees with the statement; yesMeansComing is what agreeing works out to.
  //  1. "won't not be missing" = will miss it; "not saying" that = you're coming.
  //  2. "can't not decline" = must decline; "isn't untrue" = true;
  //     "don't disagree" = agree, so agreeing = not coming.
  const QUESTIONS = [
    { step: 'Just to confirm…',
      text: "So you're not saying you won't not be missing our evening?",
      yesMeansComing: true },
    { step: '…and to confirm the confirmation',
      text: "And you don't disagree that it isn't untrue that you can't not decline?",
      yesMeansComing: false }
  ];

  let moves = 0;
  let runner = null;
  let answers = [];

  // Pick a spot on screen, clear of the nav, well away from the last one
  function placeRandomly(el) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const prev = el.getBoundingClientRect();
    let x, y, tries = 0;
    do {
      x = 16 + Math.random() * Math.max(0, vw - w - 32);
      y = 100 + Math.random() * Math.max(0, vh - h - 130);
      tries++;
    } while (tries < 10 && Math.hypot(x - prev.left, y - prev.top) < Math.min(vw, vh) / 3);
    el.style.left = x + 'px';
    el.style.top  = y + 'px';
  }

  function runAway() {
    moves++;
    if (!runner) {
      // A fixed-position stand-in on <body>, so it stays on screen while scrolling
      const r = declineLabel.getBoundingClientRect();
      runner = document.createElement('button');
      runner.type = 'button';
      runner.className = 'runaway-btn';
      runner.textContent = declineLabel.textContent;
      runner.style.width = r.width + 'px';
      runner.style.left  = r.left + 'px';
      runner.style.top   = r.top + 'px';
      runner.addEventListener('click', onDeclineTap);
      document.body.append(runner);
      declineLabel.style.visibility = 'hidden';
      runner.getBoundingClientRect(); // start from the original spot so the jump animates
    }
    placeRandomly(runner);
  }

  function showQuestion() {
    const q = QUESTIONS[answers.length];
    stepEl.textContent = q.step;
    textEl.textContent = q.text;
    if (!dialog.open) dialog.showModal();
  }

  function finish() {
    dialog.close();
    const coming  = answers[answers.length - 1];
    const changed = answers[0] !== coming;
    const target  = coming ? accept : decline;
    target.checked = true;
    target.dispatchEvent(new Event('change', { bubbles: true }));
    note.textContent = (coming
      ? "Translation: you're coming! 🎉"
      : "Translation: you can't make it. We'll miss you! 💛")
      + (changed ? ' (You changed your mind halfway through.)' : '')
      + " Not what you meant? Just tap the other option.";
    note.hidden = false;
  }

  // Every switch to "decline" runs the whole chase and both questions again
  function onDeclineTap(e) {
    if (decline.checked && !runner) return; // already declined: nothing to change
    e.preventDefault();
    if (moves < MAX_MOVES) {
      runAway();
      return;
    }
    runner.remove();
    runner = null;
    declineLabel.style.visibility = '';
    moves = 0;
    answers = [];
    showQuestion();
  }

  declineLabel.addEventListener('click', onDeclineTap);

  dialog.querySelectorAll('.dialog-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = QUESTIONS[answers.length];
      answers.push(btn.value === 'yes' ? q.yesMeansComing : !q.yesMeansComing);
      if (answers.length < QUESTIONS.length) showQuestion();
      else finish();
    });
  });

  // No escaping the questions with the Esc / back key
  dialog.addEventListener('cancel', e => e.preventDefault());

  // Hide the translation once the guest picks an option themselves
  [accept, decline].forEach(radio => radio.addEventListener('change', e => {
    if (e.isTrusted) note.hidden = true;
  }));

  window.addEventListener('resize', () => { if (runner) placeRandomly(runner); });
})();
