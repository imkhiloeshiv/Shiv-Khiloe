/* ==========================================================================
   THREE.JS 3D PARTICLE CLOUD & INTERACTIVE PROCEDURAL ENGINE
   Direct design reference: URTA Rocket Point Cloud (Amber & Electric Cyan)
   Featuring dynamic theme morphing (Rocket, Skull, Tesseract, Spiral Galaxy)
   ========================================================================== */

class ThreeScene {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    
    // Particle counts
    this.HERO_COUNT = 24000;
    this.BG_COUNT = 2500;

    // Particle systems
    this.heroPoints = null;
    this.heroGeometry = null;
    this.bgPoints = null;

    // Morph buffers
    this.positions = null;
    this.targetPositions = null;
    this.colors = null;
    this.targetColors = null;
    this.velocities = null;

    // Mouse tracking & interaction
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.isDragging = false;
    this.prevMousePos = { x: 0, y: 0 };
    this.orbitRotation = { x: 0.15, y: -0.35, targetX: 0.15, targetY: -0.35 };

    // Tuning parameters
    this.params = {
      speed: 1.0,
      dispersion: 0.0,
      particleSize: 1.8,
      turbulence: 0.3,
      currentMorph: 'rocket',
      theme: 'space'
    };

    this.clock = new THREE.Clock();
    this.init();
  }

  init() {
    // 1. Scene setup
    this.scene = new THREE.Scene();

    // 2. Camera setup
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 2000);
    this.camera.position.set(0, 0, 130);

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // 4. Create Background Starfield & Floating Embers
    this.createBackgroundParticles();

    // 5. Create Central Hero Point Cloud (Pinterest Rocket Reference)
    this.createHeroParticleCloud();

    // 6. Bind Event Listeners
    this.bindEvents();

    // 7. Start Animation Loop
    this.animate();
  }

  // --- Background Ambient Dust / Fog Particles ---
  createBackgroundParticles() {
    const bgGeometry = new THREE.BufferGeometry();
    const bgPos = new Float32Array(this.BG_COUNT * 3);
    const bgColors = new Float32Array(this.BG_COUNT * 3);

    for (let i = 0; i < this.BG_COUNT; i++) {
      const i3 = i * 3;
      bgPos[i3] = (Math.random() - 0.5) * 1200;
      bgPos[i3 + 1] = (Math.random() - 0.5) * 900;
      bgPos[i3 + 2] = (Math.random() - 0.5) * 800 - 150;

      // Soft starlight color palette
      const isGold = Math.random() > 0.65;
      bgColors[i3] = isGold ? 1.0 : 0.22;
      bgColors[i3 + 1] = isGold ? 0.7 : 0.74;
      bgColors[i3 + 2] = isGold ? 0.2 : 0.98;
    }

    bgGeometry.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    bgGeometry.setAttribute('color', new THREE.BufferAttribute(bgColors, 3));

    const bgMaterial = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.bgPoints = new THREE.Points(bgGeometry, bgMaterial);
    this.scene.add(this.bgPoints);
  }

  // --- Hero 3D Point Cloud with Procedural Morph Shapes ---
  createHeroParticleCloud() {
    this.heroGeometry = new THREE.BufferGeometry();
    this.positions = new Float32Array(this.HERO_COUNT * 3);
    this.targetPositions = new Float32Array(this.HERO_COUNT * 3);
    this.colors = new Float32Array(this.HERO_COUNT * 3);
    this.targetColors = new Float32Array(this.HERO_COUNT * 3);
    this.velocities = new Float32Array(this.HERO_COUNT * 3);

    // Pre-calculate Morph Targets
    this.morphTargets = {
      rocket: this.generateRocketParticles(),
      skull: this.generateSkullParticles(),
      tesseract: this.generateTesseractParticles(),
      spiral: this.generateSpiralParticles()
    };

    // Initialize with Rocket shape (matches Pinterest reference photo)
    const initialTarget = this.morphTargets.rocket;
    for (let i = 0; i < this.HERO_COUNT * 3; i++) {
      this.positions[i] = initialTarget.positions[i];
      this.targetPositions[i] = initialTarget.positions[i];
      this.colors[i] = initialTarget.colors[i];
      this.targetColors[i] = initialTarget.colors[i];
      this.velocities[i] = (Math.random() - 0.5) * 0.1;
    }

    this.heroGeometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.heroGeometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));

    // Glow disc particle texture generator
    const particleTexture = this.generateParticleTexture();

    const heroMaterial = new THREE.PointsMaterial({
      size: this.params.particleSize,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      map: particleTexture,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.heroPoints = new THREE.Points(this.heroGeometry, heroMaterial);
    // Align stage towards right-center (matching the Pinterest layout with text on left)
    this.heroPoints.position.set(18, 0, 0);
    this.scene.add(this.heroPoints);
  }

  // Procedural Circular Glow Texture
  generateParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.9)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    return texture;
  }

  // =========================================================================
  // PROCEDURAL 3D GEOMETRY GENERATORS
  // =========================================================================

  // 1. ROCKET SHIP (Reference Photo Match: Golden nose cone + Electric Blue Body & Fins)
  generateRocketParticles() {
    const pos = new Float32Array(this.HERO_COUNT * 3);
    const col = new Float32Array(this.HERO_COUNT * 3);

    for (let i = 0; i < this.HERO_COUNT; i++) {
      const i3 = i * 3;
      const section = Math.random();

      if (section < 0.28) {
        // --- NOSE CONE (Vibrant Golden Starlight - Exactly as Pinterest image) ---
        const t = Math.random(); // 0 (tip) to 1 (base of nose)
        const radius = Math.pow(t, 0.7) * 9.5;
        const angle = Math.random() * Math.PI * 2;
        const jitter = (Math.random() - 0.5) * 1.2;

        pos[i3] = Math.cos(angle) * (radius + jitter);
        pos[i3 + 1] = 28 - (t * 22); // Height
        pos[i3 + 2] = Math.sin(angle) * (radius + jitter);

        // Golden/Orange stardust palette
        col[i3] = 1.0;
        col[i3 + 1] = 0.65 + Math.random() * 0.3;
        col[i3 + 2] = 0.15 + Math.random() * 0.2;

      } else if (section < 0.65) {
        // --- MAIN CYLINDRICAL HULL (Electric Cyan & Sapphire Blue) ---
        const h = Math.random(); // 0 to 1 along body
        const radius = 9.5 + Math.sin(h * Math.PI) * 1.5;
        const angle = Math.random() * Math.PI * 2;
        const jitter = (Math.random() - 0.5) * 1.5;

        pos[i3] = Math.cos(angle) * (radius + jitter);
        pos[i3 + 1] = 6 - (h * 32);
        pos[i3 + 2] = Math.sin(angle) * (radius + jitter);

        // Gradient from golden transition into electric blue/cyan
        if (h < 0.15) {
          col[i3] = 0.9;
          col[i3 + 1] = 0.8;
          col[i3 + 2] = 0.5;
        } else {
          col[i3] = 0.15 + Math.random() * 0.2;
          col[i3 + 1] = 0.6 + Math.random() * 0.38;
          col[i3 + 2] = 0.95 + Math.random() * 0.05;
        }

      } else if (section < 0.82) {
        // --- AERODYNAMIC STABILIZER WINGS & FINS (3 delta wings) ---
        const wingIndex = Math.floor(Math.random() * 3);
        const baseAngle = (wingIndex * Math.PI * 2) / 3;
        const wingSpan = Math.random() * 16;
        const wingY = -12 - Math.random() * 16;
        const wingDepth = (Math.random() - 0.5) * 2.0;

        const r = 9.5 + wingSpan;
        pos[i3] = Math.cos(baseAngle) * r + Math.sin(baseAngle) * wingDepth;
        pos[i3 + 1] = wingY - (wingSpan * 0.4);
        pos[i3 + 2] = Math.sin(baseAngle) * r - Math.cos(baseAngle) * wingDepth;

        // Cyan / Blue stardust
        col[i3] = 0.2;
        col[i3 + 1] = 0.75;
        col[i3 + 2] = 1.0;

      } else {
        // --- THRUSTER EXHAUST & ORBITING CELESTIAL STARDUST HALO ---
        if (Math.random() > 0.4) {
          // Thruster plasma trail
          const trailH = Math.random() * 26;
          const trailRadius = Math.random() * (4 + trailH * 0.25);
          const angle = Math.random() * Math.PI * 2;

          pos[i3] = Math.cos(angle) * trailRadius;
          pos[i3 + 1] = -26 - trailH;
          pos[i3 + 2] = Math.sin(angle) * trailRadius;

          // Glowing plasma flame
          col[i3] = 1.0;
          col[i3 + 1] = 0.5 + Math.random() * 0.4;
          col[i3 + 2] = 0.1;
        } else {
          // Surrounding orbital dust halo (as in Pinterest photo)
          const haloAngle = Math.random() * Math.PI * 2;
          const haloRadius = 14 + Math.random() * 18;
          const haloY = (Math.random() - 0.5) * 45;

          pos[i3] = Math.cos(haloAngle) * haloRadius;
          pos[i3 + 1] = haloY;
          pos[i3 + 2] = Math.sin(haloAngle) * haloRadius;

          const isGold = Math.random() > 0.5;
          col[i3] = isGold ? 1.0 : 0.2;
          col[i3 + 1] = isGold ? 0.75 : 0.7;
          col[i3 + 2] = isGold ? 0.25 : 1.0;
        }
      }
    }

    return { positions: pos, colors: col };
  }

  // 2. ELDRITCH HORROR SKULL (Scary Style Theme: Hollow Cranium, Deep Sockets & Spectral Souls)
  generateSkullParticles() {
    const pos = new Float32Array(this.HERO_COUNT * 3);
    const col = new Float32Array(this.HERO_COUNT * 3);

    for (let i = 0; i < this.HERO_COUNT; i++) {
      const i3 = i * 3;
      const part = Math.random();

      if (part < 0.55) {
        // Cranium Sphere (elongated, hollowed for eye sockets)
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        
        let r = 18 + (Math.random() - 0.5) * 2;
        let x = r * Math.sin(phi) * Math.cos(theta);
        let y = r * Math.cos(phi) * 1.15 + 4;
        let z = r * Math.sin(phi) * Math.sin(theta) * 0.9;

        // Carve hollow eye sockets
        if (z > 6 && y > 0 && y < 10) {
          if (Math.abs(x) > 3 && Math.abs(x) < 11) {
            z -= 10; // push inward
          }
        }
        // Hollow nasal cavity
        if (z > 10 && y > -4 && y <= 0 && Math.abs(x) < 3.5) {
          z -= 9;
        }

        pos[i3] = x;
        pos[i3 + 1] = y;
        pos[i3 + 2] = z;

        // Crimson Blood & Spectral Void palette
        col[i3] = 0.9 + Math.random() * 0.1;
        col[i3 + 1] = 0.08 + Math.random() * 0.15;
        col[i3 + 2] = 0.15 + Math.random() * 0.2;

      } else if (part < 0.8) {
        // Jaw & Bone Structure
        const t = Math.random();
        const jawAngle = (Math.random() - 0.5) * Math.PI * 0.7;
        const jawRadius = 11 * (1 - t * 0.3);

        pos[i3] = Math.sin(jawAngle) * jawRadius;
        pos[i3 + 1] = -12 - (t * 12);
        pos[i3 + 2] = Math.cos(jawAngle) * jawRadius * 0.8 + 4;

        col[i3] = 0.75;
        col[i3 + 1] = 0.05;
        col[i3 + 2] = 0.1;

      } else {
        // Floating Creeping Ghostly Soul Wisps / Mist
        const angle = Math.random() * Math.PI * 2;
        const radius = 10 + Math.random() * 22;
        const height = (Math.random() - 0.5) * 55;

        pos[i3] = Math.cos(angle) * radius;
        pos[i3 + 1] = height;
        pos[i3 + 2] = Math.sin(angle) * radius;

        // Spectral green & crimson mist
        const isEmerald = Math.random() > 0.7;
        col[i3] = isEmerald ? 0.05 : 0.88;
        col[i3 + 1] = isEmerald ? 0.9 : 0.05;
        col[i3 + 2] = isEmerald ? 0.45 : 0.15;
      }
    }

    return { positions: pos, colors: col };
  }

  // 3. CYBERNETIC TESSERACT / QUANTUM CORE (Cyberpunk Grid Matrix)
  generateTesseractParticles() {
    const pos = new Float32Array(this.HERO_COUNT * 3);
    const col = new Float32Array(this.HERO_COUNT * 3);
    const size = 20;

    for (let i = 0; i < this.HERO_COUNT; i++) {
      const i3 = i * 3;
      const part = Math.random();

      if (part < 0.6) {
        // Wireframe Cubic Shell
        const axis = Math.floor(Math.random() * 3);
        const sign1 = Math.random() > 0.5 ? 1 : -1;
        const sign2 = Math.random() > 0.5 ? 1 : -1;
        const t = (Math.random() - 0.5) * 2 * size;

        if (axis === 0) {
          pos[i3] = t;
          pos[i3 + 1] = sign1 * size;
          pos[i3 + 2] = sign2 * size;
        } else if (axis === 1) {
          pos[i3] = sign1 * size;
          pos[i3 + 1] = t;
          pos[i3 + 2] = sign2 * size;
        } else {
          pos[i3] = sign1 * size;
          pos[i3 + 1] = sign2 * size;
          pos[i3 + 2] = t;
        }

        col[i3] = 0.05;
        col[i3 + 1] = 0.85;
        col[i3 + 2] = 0.95; // Cyber Cyan

      } else if (part < 0.85) {
        // Inner Rotating Quantum Core Sphere
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 9 + Math.random() * 2;

        pos[i3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i3 + 2] = r * Math.cos(phi);

        col[i3] = 0.98;
        col[i3 + 1] = 0.15;
        col[i3 + 2] = 0.45; // Neon Magenta

      } else {
        // Data Stream Pulse Rings
        const ringAngle = Math.random() * Math.PI * 2;
        const ringR = 26 + Math.random() * 4;

        pos[i3] = Math.cos(ringAngle) * ringR;
        pos[i3 + 1] = (Math.random() - 0.5) * 3;
        pos[i3 + 2] = Math.sin(ringAngle) * ringR;

        col[i3] = 0.2;
        col[i3 + 1] = 0.95;
        col[i3 + 2] = 0.8;
      }
    }

    return { positions: pos, colors: col };
  }

  // 4. SPIRAL GALAXY VORTEX
  generateSpiralParticles() {
    const pos = new Float32Array(this.HERO_COUNT * 3);
    const col = new Float32Array(this.HERO_COUNT * 3);
    const arms = 4;

    for (let i = 0; i < this.HERO_COUNT; i++) {
      const i3 = i * 3;
      const distance = Math.pow(Math.random(), 1.5) * 40 + 2;
      const armIndex = Math.floor(Math.random() * arms);
      const angle = (armIndex * (Math.PI * 2 / arms)) + (distance * 0.28);
      const spreadX = (Math.random() - 0.5) * (distance * 0.25);
      const spreadY = (Math.random() - 0.5) * (distance * 0.18);
      const spreadZ = (Math.random() - 0.5) * (distance * 0.25);

      pos[i3] = Math.cos(angle) * distance + spreadX;
      pos[i3 + 1] = spreadY;
      pos[i3 + 2] = Math.sin(angle) * distance + spreadZ;

      const normDist = distance / 42;
      col[i3] = 1.0 - normDist * 0.6;
      col[i3 + 1] = 0.5 + normDist * 0.4;
      col[i3 + 2] = 0.2 + normDist * 0.8;
    }

    return { positions: pos, colors: col };
  }

  // =========================================================================
  // INTERACTION & MORPHING METHODS
  // =========================================================================

  morphTo(shapeKey) {
    if (!this.morphTargets[shapeKey]) return;
    this.params.currentMorph = shapeKey;
    const target = this.morphTargets[shapeKey];

    for (let i = 0; i < this.HERO_COUNT * 3; i++) {
      this.targetPositions[i] = target.positions[i];
      this.targetColors[i] = target.colors[i];
    }
  }

  setTheme(themeName) {
    this.params.theme = themeName;
    if (themeName === 'space') {
      this.morphTo('rocket');
    } else if (themeName === 'horror') {
      this.morphTo('skull');
    } else if (themeName === 'cyber') {
      this.morphTo('tesseract');
    }
  }

  setParticleSize(size) {
    this.params.particleSize = size;
    if (this.heroPoints) {
      this.heroPoints.material.size = size;
    }
  }

  setDispersion(val) {
    this.params.dispersion = val;
  }

  setSpeed(val) {
    this.params.speed = val;
  }

  bindEvents() {
    // Window Resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Mouse Movement for 3D Parallax Tilt
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;

      if (this.isDragging) {
        const deltaX = e.clientX - this.prevMousePos.x;
        const deltaY = e.clientY - this.prevMousePos.y;
        this.orbitRotation.targetY += deltaX * 0.008;
        this.orbitRotation.targetX += deltaY * 0.008;
        this.prevMousePos = { x: e.clientX, y: e.clientY };
      }
    });

    // Drag Orbit interaction on hero canvas
    window.addEventListener('mousedown', (e) => {
      if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input')) return;
      this.isDragging = true;
      this.prevMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Scroll interaction: Dynamic camera push & model rotation
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollY / docHeight, 1.0);

      // Camera gently shifts and zooms through 3D space
      this.camera.position.z = 130 + progress * 40;
      this.camera.position.y = -progress * 25;
      
      // Hero points position shifts dynamically
      if (this.heroPoints) {
        this.heroPoints.position.x = 18 - progress * 24;
      }
    });
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime() * this.params.speed;

    // Smooth Lerp for Mouse Parallax & Orbit
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

    this.orbitRotation.x += (this.orbitRotation.targetX - this.orbitRotation.x) * 0.1;
    this.orbitRotation.y += (this.orbitRotation.targetY - this.orbitRotation.y) * 0.1;

    // Apply 3D Rotation to Central Model
    if (this.heroPoints) {
      // Idle harmonic float + mouse tilt + drag orbit
      const idleTilt = Math.sin(elapsedTime * 0.8) * 0.06;
      this.heroPoints.rotation.x = this.orbitRotation.x + this.mouse.y * 0.25 + idleTilt;
      this.heroPoints.rotation.y = this.orbitRotation.y + this.mouse.x * 0.35 + (elapsedTime * 0.15);
      this.heroPoints.rotation.z = Math.cos(elapsedTime * 0.6) * 0.05;

      // Vertical levitation oscillation
      this.heroPoints.position.y = Math.sin(elapsedTime * 1.2) * 2.5;

      // Update Particle Morph Interpolation & Turbulence
      const posAttr = this.heroGeometry.attributes.position;
      const colAttr = this.heroGeometry.attributes.color;
      const posArray = posAttr.array;
      const colArray = colAttr.array;

      const lerpSpeed = 0.065;
      const dispersion = this.params.dispersion;

      for (let i = 0; i < this.HERO_COUNT; i++) {
        const i3 = i * 3;

        // Dispersion jitter
        let dispX = 0, dispY = 0, dispZ = 0;
        if (dispersion > 0.01) {
          dispX = Math.sin(elapsedTime * 3 + i) * dispersion * 15;
          dispY = Math.cos(elapsedTime * 2.5 + i) * dispersion * 15;
          dispZ = Math.sin(elapsedTime * 2 + i) * dispersion * 15;
        }

        // Lerp position towards target
        posArray[i3] += ((this.targetPositions[i3] + dispX) - posArray[i3]) * lerpSpeed;
        posArray[i3 + 1] += ((this.targetPositions[i3 + 1] + dispY) - posArray[i3 + 1]) * lerpSpeed;
        posArray[i3 + 2] += ((this.targetPositions[i3 + 2] + dispZ) - posArray[i3 + 2]) * lerpSpeed;

        // Lerp color towards target
        colArray[i3] += (this.targetColors[i3] - colArray[i3]) * lerpSpeed;
        colArray[i3 + 1] += (this.targetColors[i3 + 1] - colArray[i3 + 1]) * lerpSpeed;
        colArray[i3 + 2] += (this.targetColors[i3 + 2] - colArray[i3 + 2]) * lerpSpeed;
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    }

    // Slowly rotate background starfield
    if (this.bgPoints) {
      this.bgPoints.rotation.y = elapsedTime * 0.02;
      this.bgPoints.rotation.x = elapsedTime * 0.01;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.threeScene = new ThreeScene();
});
