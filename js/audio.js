/* ==========================================================================
   WEB AUDIO API SOUND ENGINE
   Procedural ambient drone & interaction sounds (Zero external audio assets required)
   ========================================================================== */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.currentTheme = 'space';
    this.masterGain = null;
    this.ambientGain = null;
    this.oscillators = [];
    this.filter = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.ambientGain.connect(this.masterGain);

    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(400, this.ctx.currentTime);
    this.filter.connect(this.ambientGain);
  }

  startAmbient() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.stopAmbient();
    this.isPlaying = true;

    const now = this.ctx.currentTime;
    this.ambientGain.gain.cancelScheduledValues(now);
    this.ambientGain.gain.linearRampToValueAtTime(0.2, now + 2);

    if (this.currentTheme === 'space') {
      // Deep cosmic chord (Sub bass drone with gentle beating)
      this.createDroneOsc(55, 'sine', -8);   // A1
      this.createDroneOsc(110, 'sine', 0);   // A2
      this.createDroneOsc(164.81, 'triangle', 4); // E3
      this.filter.frequency.linearRampToValueAtTime(500, now + 1);
    } else if (this.currentTheme === 'horror') {
      // Eerie dissonant minor second drone + horror resonance
      this.createDroneOsc(46.25, 'sawtooth', -12); // F#1
      this.createDroneOsc(49.00, 'sawtooth', 12);  // G1 dissonant clash
      this.createDroneOsc(92.50, 'sine', 0);
      this.filter.frequency.linearRampToValueAtTime(320, now + 1);
    } else if (this.currentTheme === 'cyber') {
      // Cyber synthwave pulse drone
      this.createDroneOsc(65.41, 'sawtooth', -5); // C2
      this.createDroneOsc(130.81, 'square', 5);  // C3
      this.createDroneOsc(196.00, 'sine', 0);    // G3
      this.filter.frequency.linearRampToValueAtTime(650, now + 1);
    }
  }

  createDroneOsc(freq, type, detune = 0) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.detune.setValueAtTime(detune, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    // LFO subtle pulse
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.15 + Math.random() * 0.1, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    lfo.connect(lfoGain.gain);
    lfo.start();

    osc.connect(this.filter);
    osc.start();
    this.oscillators.push(osc, lfo);
  }

  stopAmbient() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.ambientGain) {
      this.ambientGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
    }
    setTimeout(() => {
      this.oscillators.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch (e) {}
      });
      this.oscillators = [];
    }, 900);
    this.isPlaying = false;
  }

  setTheme(theme) {
    this.currentTheme = theme;
    if (this.isPlaying) {
      this.startAmbient();
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stopAmbient();
      return false;
    } else {
      this.startAmbient();
      return true;
    }
  }

  // Interactive feedback sounds
  playHover() {
    if (!this.ctx || this.ctx.state === 'suspended') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      const baseFreq = this.currentTheme === 'horror' ? 220 : (this.currentTheme === 'cyber' ? 880 : 540);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.08);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch(e) {}
  }

  playClick() {
    if (!this.ctx || this.ctx.state === 'suspended') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      if (this.currentTheme === 'horror') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.18);
        gain.gain.setValueAtTime(0.12, now);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
      }
      
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch(e) {}
  }
}

window.soundEngine = new AudioEngine();
