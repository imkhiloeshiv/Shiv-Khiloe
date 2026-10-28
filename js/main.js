/* ==========================================================================
   MAIN APPLICATION LOGIC & TOPIC SWITCHER ENGINE
   Handles dynamic theme switching, custom cursor, modals, and telemetry
   ========================================================================== */

const THEME_DATA = {
  space: {
    name: 'Cosmic Tech (Reference)',
    statusText: 'TELEMETRY: STABLE • 24,000 ORBITING PARTICLES',
    titleLine1: 'BOOST',
    titleLine2: 'YOUR',
    titleLine3: 'BRAND',
    subtitle: 'We create <strong>digital experience</strong> at the intersection between <strong>design</strong> and <strong>technology</strong>, helping our clients to <strong>imagine the future</strong>, today.',
    cards: [
      {
        tag: 'PROPULSION',
        title: 'Deep Space Nebula Voyager',
        desc: 'Autonomous orbital exploration craft traversing deep cosmological star clusters with photonic particle propulsion.',
        badge: 'ORBITAL',
        img: 'assets/space-1.jpg'
      },
      {
        tag: 'OBSERVATORY',
        title: 'Quantum Atmospheric Sphere',
        desc: 'High-altitude sub-orbital research node capturing cosmic ray anomalies across the upper stratospheric vortex.',
        badge: 'HORIZON',
        img: 'assets/space-2.jpg'
      },
      {
        tag: 'CELESTIAL',
        title: 'Singularity Event Horizon',
        desc: 'Relativistic spacetime distortion engine warping localized gravitational fields for instantaneous interstellar transit.',
        badge: 'WARP V',
        img: 'assets/space-3.jpg'
      }
    ],
    bento: {
      b1_title: 'Volumetric Point Clouds',
      b1_desc: 'Over 24,000 real-time procedural particles rendered at 60 FPS using hardware-accelerated WebGL buffers and custom vertex shaders.',
      b2_title: 'True 3D Gyro Tilt',
      b2_desc: 'Multi-layer perspective parallax with physical specular glare calculation responsive to cursor momentum.',
      b3_title: 'Spatial Soundscape',
      b3_desc: 'Synthetic Web Audio API engine producing deep binaural drones and tactile capacitive click feedback.'
    }
  },
  horror: {
    name: 'Dark Horror (Scary Style)',
    statusText: 'WARNING: SPECTRAL MANIFESTATION DETECTED',
    titleLine1: 'UNLEASH',
    titleLine2: 'THE',
    titleLine3: 'TERROR',
    subtitle: 'Step into the abyss of <strong>forgotten shadows</strong> and <strong>eldritch nightmares</strong>, where ancient spectres whisper in the chill of eternal darkness.',
    cards: [
      {
        tag: 'SPECTRAL',
        title: 'The Catacomb of Shadows',
        desc: 'A labyrinth of petrified sorrow where the echoes of wandering spirits bleed through crumbling gothic stone arches.',
        badge: 'CURSED',
        img: 'assets/horror-1.jpg'
      },
      {
        tag: 'ELDRITCH',
        title: 'Phantom of the Red Mist',
        desc: 'A primordial horror crowned in burning blood-fog, consuming the sanity of any mortal who gazes into its hollow eyes.',
        badge: 'LEVIATHAN',
        img: 'assets/horror-2.jpg'
      },
      {
        tag: 'OCCULT',
        title: 'The Midnight Ritual',
        desc: 'Flickering candlelight illuminating archaic occult sigils etched in bone beneath an eclipse of necrotic stars.',
        badge: 'ABYSSAL',
        img: 'assets/horror-3.jpg'
      }
    ],
    bento: {
      b1_title: 'Haunted Particle Mist',
      b1_desc: 'Rising blood-red embers and spectral emerald wisps orbiting an anatomically carved hollow phantom skull.',
      b2_title: 'Eerie Depth Aberration',
      b2_desc: 'Distorted photographic layers with sinister chromatic flicker and chromatic aberration on card hover.',
      b3_title: 'Dissonant Minor Drones',
      b3_desc: 'Unsettling microtonal saw waves and sub-bass resonance designed to evoke visceral suspense.'
    }
  },
  cyber: {
    name: 'Cyberpunk Neon Matrix',
    statusText: 'GRID ONLINE: QUANTUM LINK 100% SYNCHRONIZED',
    titleLine1: 'OVERCLOCK',
    titleLine2: 'THE',
    titleLine3: 'MATRIX',
    subtitle: 'Transcend the physical boundary through <strong>quantum neural links</strong>, <strong>high-voltage synth aesthetics</strong>, and next-generation algorithmic cyberspace.',
    cards: [
      {
        tag: 'NEURAL LINK',
        title: 'Neo-Tokyo Megastructure',
        desc: 'Gigawatt holographic skyscrapers towering above perpetual acid-rain alleys buzzing with encrypted optical data.',
        badge: 'NODE 01',
        img: 'assets/cyber-1.jpg'
      },
      {
        tag: 'CYBORG CORE',
        title: 'Augmented Cybernetic Nexus',
        desc: 'Sub-dermal optic displays and carbon-lattice neural implants processing petabytes of synthetic intuition.',
        badge: 'AUGMENT',
        img: 'assets/cyber-2.jpg'
      },
      {
        tag: 'GRID RUNNER',
        title: 'Quantum Velocity Speeder',
        desc: 'Antigravity street racer propelled by ion thrusters leaving blinding neon cyan and magenta light trails.',
        badge: 'OVERDRIVE',
        img: 'assets/cyber-3.jpg'
      }
    ],
    bento: {
      b1_title: 'Holographic Tesseract',
      b1_desc: 'A 4D hypercube particle grid synchronized to digital clock cycles and responsive cursor gravity.',
      b2_title: 'HUD Glare Reflections',
      b2_desc: 'Futuristic glassmorphism cards with electric cyan neon borders and high-velocity specular tracking.',
      b3_title: 'Synthwave Pulse Engine',
      b3_desc: 'Square wave oscillations and high-tech frequency-swept chirps delivering futuristic sensory immersion.'
    }
  }
};

window.applyTheme = applyTheme;
window.currentThemeKey = currentThemeKey;

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initThemeSwitcher();
  initAudioToggle();
  initMorphControls();
  initDetailModal();
  initInteractiveSliders();
});

// --- Custom Mouse Cursor Engine ---
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  const follower = document.getElementById('custom-cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  function updateFollower() {
    followerX += (mouseX - followerX) * 0.18;
    followerY += (mouseY - followerY) * 0.18;
    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;
    requestAnimationFrame(updateFollower);
  }
  requestAnimationFrame(updateFollower);

  // Hover states for interactive elements
  const hoverables = document.querySelectorAll('a, button, input, .tilt-card, .bento-card, .morph-btn');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// --- Topic / Theme Switcher Engine ---
function initThemeSwitcher() {
  const topicButtons = document.querySelectorAll('.topic-btn');

  topicButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTheme = btn.dataset.topic;
      if (targetTheme === currentThemeKey) return;

      topicButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (window.soundEngine) window.soundEngine.playClick();
      applyTheme(targetTheme);
    });
  });
}

function applyTheme(themeKey) {
  currentThemeKey = themeKey;
  const data = THEME_DATA[themeKey];
  if (!data) return;

  // 1. Update HTML data-theme attribute for CSS variables
  document.documentElement.setAttribute('data-theme', themeKey);

  // 2. Update Web Audio theme
  if (window.soundEngine) {
    window.soundEngine.setTheme(themeKey);
  }

  // 3. Update Three.js 3D Model
  if (window.threeScene) {
    window.threeScene.setTheme(themeKey);
  }

  // 4. Update Morph Buttons Active State
  const morphButtons = document.querySelectorAll('.morph-btn');
  morphButtons.forEach(mb => {
    const shape = mb.dataset.shape;
    if ((themeKey === 'space' && shape === 'rocket') ||
        (themeKey === 'horror' && shape === 'skull') ||
        (themeKey === 'cyber' && shape === 'tesseract')) {
      mb.classList.add('active');
    } else {
      mb.classList.remove('active');
    }
  });

  // 5. Kinetic Hero Typography Animation
  const statusEl = document.getElementById('status-text');
  const line1El = document.getElementById('hero-line-1');
  const line2El = document.getElementById('hero-line-2');
  const line3El = document.getElementById('hero-line-3');
  const subtitleEl = document.getElementById('hero-subtitle');

  // Smooth fade-out & fade-in text animation
  const heroContent = document.querySelector('.hero-content');
  heroContent.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
  heroContent.style.opacity = '0.2';
  heroContent.style.transform = 'translateY(10px)';

  setTimeout(() => {
    if (statusEl) statusEl.innerText = data.statusText;
    if (line1El) line1El.innerText = data.titleLine1;
    if (line2El) line2El.innerText = data.titleLine2;
    if (line3El) line3El.innerText = data.titleLine3;
    if (subtitleEl) subtitleEl.innerHTML = data.subtitle;

    heroContent.style.opacity = '1';
    heroContent.style.transform = 'translateY(0)';
  }, 250);

  // 6. Update 3D Showcase Cards
  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach((card, idx) => {
    const cardData = data.cards[idx];
    if (!cardData) return;

    const img = card.querySelector('.card-img');
    const badge = card.querySelector('.card-overlay-badge');
    const tag = card.querySelector('.card-topic-tag');
    const title = card.querySelector('.card-title');
    const text = card.querySelector('.card-text');

    card.style.opacity = '0.3';
    setTimeout(() => {
      if (img) img.src = cardData.img;
      if (badge) badge.innerText = cardData.badge;
      if (tag) tag.innerText = cardData.tag;
      if (title) title.innerText = cardData.title;
      if (text) text.innerText = cardData.desc;
      card.style.opacity = '1';
    }, 250);
  });

  // 7. Update Bento Grid Text
  const b1Title = document.getElementById('bento-1-title');
  const b1Desc = document.getElementById('bento-1-desc');
  const b2Title = document.getElementById('bento-2-title');
  const b2Desc = document.getElementById('bento-2-desc');
  const b3Title = document.getElementById('bento-3-title');
  const b3Desc = document.getElementById('bento-3-desc');

  if (b1Title) b1Title.innerText = data.bento.b1_title;
  if (b1Desc) b1Desc.innerText = data.bento.b1_desc;
  if (b2Title) b2Title.innerText = data.bento.b2_title;
  if (b2Desc) b2Desc.innerText = data.bento.b2_desc;
  if (b3Title) b3Title.innerText = data.bento.b3_title;
  if (b3Desc) b3Desc.innerText = data.bento.b3_desc;

  // Update Telemetry Log
  const logEl = document.getElementById('visualizer-log');
  if (logEl) {
    logEl.innerHTML = `> THEME_LOADED: ${data.name.toUpperCase()}<br>> BUFFER_RESYNCHRONIZED<br>> SHADER_UNIFORM_UPDATED<br>> READY_FOR_RENDER`;
  }
}

// --- Audio Ambient Toggle ---
function initAudioToggle() {
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (!audioBtn) return;

  audioBtn.addEventListener('click', () => {
    if (window.soundEngine) {
      const playing = window.soundEngine.toggle();
      if (playing) {
        audioBtn.classList.add('audio-playing');
      } else {
        audioBtn.classList.remove('audio-playing');
      }
    }
  });
}

// --- 3D Particle Morph Controls ---
function initMorphControls() {
  const morphButtons = document.querySelectorAll('.morph-btn');
  morphButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const shape = btn.dataset.shape;
      morphButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (window.soundEngine) window.soundEngine.playClick();
      if (window.threeScene) window.threeScene.morphTo(shape);

      const logEl = document.getElementById('visualizer-log');
      if (logEl) {
        logEl.innerHTML = `> MORPH_GEOMETRY: ${shape.toUpperCase()}<br>> INTERPOLATING_BUFFERS...<br>> CONVERGED_AT_0.06s`;
      }
    });
  });
}

// --- Interactive Particle Sliders ---
function initInteractiveSliders() {
  const speedSlider = document.getElementById('slider-speed');
  const speedVal = document.getElementById('val-speed');
  const dispersionSlider = document.getElementById('slider-dispersion');
  const dispersionVal = document.getElementById('val-dispersion');
  const sizeSlider = document.getElementById('slider-size');
  const sizeVal = document.getElementById('val-size');

  if (speedSlider) {
    speedSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (speedVal) speedVal.innerText = `${val.toFixed(1)}x`;
      if (window.threeScene) window.threeScene.setSpeed(val);
    });
  }

  if (dispersionSlider) {
    dispersionSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (dispersionVal) dispersionVal.innerText = `${Math.round(val * 100)}%`;
      if (window.threeScene) window.threeScene.setDispersion(val);
    });
  }

  if (sizeSlider) {
    sizeSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (sizeVal) sizeVal.innerText = `${val.toFixed(1)}px`;
      if (window.threeScene) window.threeScene.setParticleSize(val);
    });
  }
}

// --- Interactive Detail Modal ---
function initDetailModal() {
  const modal = document.getElementById('detail-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  window.openDetailModal = ({ title, desc, tag, img }) => {
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalTag = document.getElementById('modal-tag');
    const modalImg = document.getElementById('modal-img');

    if (modalTitle) modalTitle.innerText = title;
    if (modalDesc) modalDesc.innerText = desc;
    if (modalTag) modalTag.innerText = tag;
    if (modalImg) modalImg.src = img;

    if (modal) modal.classList.add('open');
  };

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
      if (window.soundEngine) window.soundEngine.playClick();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });
  }
}
