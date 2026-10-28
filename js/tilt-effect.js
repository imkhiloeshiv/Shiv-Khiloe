/* ==========================================================================
   3D TILT & FLOATING LEVITATION INTERACTION ENGINE
   Smooth perspective tilt with dynamic specular glare highlight & z-depth
   ========================================================================== */

class TiltManager {
  constructor() {
    this.cards = [];
    this.init();
  }

  init() {
    this.cards = document.querySelectorAll('.tilt-card');
    
    this.cards.forEach(card => {
      let rafId = null;
      let mouseX = 0;
      let mouseY = 0;
      let currentRX = 0;
      let currentRY = 0;
      let isHovered = false;

      const glare = card.querySelector('.card-glare');

      const onMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Max tilt rotation in degrees
        const maxTilt = 18;
        const targetRY = ((mouseX - centerX) / centerX) * maxTilt;
        const targetRX = -((mouseY - centerY) / centerY) * maxTilt;

        // Update glare position
        if (glare) {
          const glareX = (mouseX / rect.width) * 100;
          const glareY = (mouseY / rect.height) * 100;
          glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.35), transparent 70%)`;
        }

        const updateTilt = () => {
          if (!isHovered) return;
          // Smooth interpolation (lerp)
          currentRX += (targetRX - currentRX) * 0.15;
          currentRY += (targetRY - currentRY) * 0.15;

          card.style.transform = `perspective(1000px) rotateX(${currentRX.toFixed(2)}deg) rotateY(${currentRY.toFixed(2)}deg) translateZ(15px)`;
          rafId = requestAnimationFrame(updateTilt);
        };

        if (!rafId) {
          rafId = requestAnimationFrame(updateTilt);
        }
      };

      const onMouseEnter = () => {
        isHovered = true;
        if (window.soundEngine) window.soundEngine.playHover();
      };

      const onMouseLeave = () => {
        isHovered = false;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        currentRX = 0;
        currentRY = 0;
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
      };

      card.addEventListener('mousemove', onMouseMove);
      card.addEventListener('mouseenter', onMouseEnter);
      card.addEventListener('mouseleave', onMouseLeave);

      // Card click interaction
      card.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playClick();
        const title = card.querySelector('.card-title')?.innerText || '';
        const desc = card.querySelector('.card-text')?.innerText || '';
        const tag = card.querySelector('.card-topic-tag')?.innerText || '';
        const img = card.querySelector('.card-img')?.getAttribute('src') || '';
        
        if (window.openDetailModal) {
          window.openDetailModal({ title, desc, tag, img });
        }
      });
    });
  }

  refresh() {
    this.init();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.tiltManager = new TiltManager();
});
