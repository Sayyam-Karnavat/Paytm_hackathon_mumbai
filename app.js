// Paytm Interactive Controller & Micro-interactions
class PaytmApp {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = true;
    this.initAudio();
    this.bindEvents();
  }

  initAudio() {
    const unlockAudio = () => {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      document.removeEventListener('click', unlockAudio);
    };
    document.addEventListener('click', unlockAudio, { once: true });
  }

  playSound(type = 'click') {
    if (!this.soundEnabled) return;
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.audioCtx = new AudioContext();
      }
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

      const now = this.audioCtx.currentTime;
      if (type === 'click') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.exponentialRampToValueAtTime(850, now + 0.04);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'chime') {
        const freqs = [523.25, 659.25, 783.99, 1046.50];
        freqs.forEach((freq, idx) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          const noteTime = now + (idx * 0.07);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, noteTime);
          gain.gain.setValueAtTime(0.12, noteTime);
          gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(noteTime);
          osc.stop(noteTime + 0.4);
        });
      } else if (type === 'success') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.24);
      }
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  bindEvents() {
    // 1. Ripple Effect
    document.addEventListener('click', (e) => {
      const target = e.target.closest('.interactive-btn, .ripple-effect');
      if (!target) return;

      this.playSound('click');

      const rect = target.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple');

      if (target.dataset.rippleDark) {
        circle.classList.add('ripple-dark');
      }

      const existingRipple = target.querySelector('.ripple');
      if (existingRipple) {
        existingRipple.remove();
      }

      target.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  }

  showToast(message, type = 'info', icon = '💡') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    if (type === 'success') toast.style.borderLeftColor = '#10b981';
    if (type === 'ai') toast.style.borderLeftColor = '#002970';

    toast.innerHTML = `
      <span style="font-size: 1.25rem;">${icon}</span>
      <div style="flex: 1;">${message}</div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    this.playSound('click');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    this.playSound('click');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  navigateToAiHub() {
    this.playSound('chime');
    this.showToast('🚀 Launching Paytm AI Hub Assistant...', 'ai', '🤖');

    const overlay = document.getElementById('portal-overlay');
    if (overlay) {
      overlay.classList.add('active');
    }

    setTimeout(() => {
      window.location.href = 'ai-hub.html';
    }, 450);
  }

  simulateRecharge(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    if (btn) {
      btn.innerHTML = `<span class="animate-spin inline-block mr-2">🔄</span> Processing Payment...`;
      btn.disabled = true;
    }
    this.playSound('click');

    setTimeout(() => {
      this.playSound('success');
      this.closeModal('recharge-modal');
      this.showToast('✅ Recharge of ₹299 Successful! Ref: #PTM' + Math.floor(100000 + Math.random() * 900000), 'success', '⚡');
      if (btn) {
        btn.innerHTML = 'Proceed to Pay ₹299';
        btn.disabled = false;
      }
    }, 1200);
  }

  simulateBillPay(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    if (btn) {
      btn.innerHTML = `<span class="animate-spin inline-block mr-2">🔄</span> Paying Bill...`;
      btn.disabled = true;
    }
    this.playSound('click');

    setTimeout(() => {
      this.playSound('success');
      this.closeModal('bill-modal');
      this.showToast('✅ Bill Payment Successful! Receipt generated.', 'success', '🧾');
      if (btn) {
        btn.innerHTML = 'Pay Bill Instantly';
        btn.disabled = false;
      }
    }, 1200);
  }

  selectTravelTab(tabName, el) {
    this.playSound('click');
    document.querySelectorAll('.travel-tab').forEach(t => {
      t.classList.remove('border-b-2', 'border-[#00b9f1]', 'text-[#002970]', 'font-bold');
      t.classList.add('text-slate-600');
    });
    el.classList.add('border-b-2', 'border-[#00b9f1]', 'text-[#002970]', 'font-bold');
    el.classList.remove('text-slate-600');

    const tabType = document.getElementById('travel-type-label');
    if (tabType) {
      tabType.innerText = tabName;
    }
    this.showToast(`Selected Paytm Travel: ${tabName}`, 'info', '✈️');
  }
}

// Global instance
window.paytm = new PaytmApp();

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
      }
    });
  });
});
