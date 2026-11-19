// Paytm AI Hub — Universal Action & Resolution OS
// Powered by Groq LLM, Sarvam AI Voice, SerpApi Live Search, You.com Citations, and Nexconn Chat SDK

const FRONTEND_PLANS = {
  jio: [
    { id: 'jio-198', price: 198, validity: '14 Days', data: '2 GB / Day', calls: 'Unlimited', badge: '5G Booster 🚀', ott: ['JioTV', 'JioCinema'], cashback: '₹15 Cashback', network: 'True Unlimited 5G', description: '2GB/day fast data pack.' },
    { id: 'jio-239', price: 239, validity: '28 Days', data: '1.5 GB / Day', calls: 'Unlimited', badge: 'Daily 1.5GB 📱', ott: ['JioTV', 'JioCinema'], cashback: '₹20 Cashback', network: 'Jio 4G/5G', description: 'Standard 28-day daily pack.' },
    { id: 'jio-299', price: 299, validity: '28 Days', data: '2 GB / Day', calls: 'Unlimited', badge: 'Best Seller ⭐', ott: ['JioCinema', 'JioTV', 'JioCloud'], cashback: '₹25 Cashback with Paytm UPI', network: 'True Unlimited 5G', description: 'Unlimited 5G Data with 2GB/day high-speed.' },
    { id: 'jio-349', price: 349, validity: '28 Days', data: '2.5 GB / Day', calls: 'Unlimited', badge: 'Power Pack ⚡', ott: ['JioCinema Premium', 'JioTV'], cashback: '₹30 Cashback', network: 'True Unlimited 5G', description: '2.5GB per day with JioCinema Premium.' },
    { id: 'jio-398', price: 398, validity: '28 Days', data: '2 GB / Day', calls: 'Unlimited', badge: 'Netflix Mobile 🍿', ott: ['Netflix (Basic Mobile)', 'JioCinema'], cashback: '₹40 Cashback', network: 'True Unlimited 5G', description: 'Includes Netflix Mobile Subscription + 2GB/Day.' },
    { id: 'jio-448', price: 448, validity: '28 Days', data: '2 GB / Day', calls: 'Unlimited', badge: '12 OTT Suite 🎬', ott: ['SonyLIV', 'Zee5', 'JioCinema Premium'], cashback: '₹45 Cashback', network: 'True Unlimited 5G', description: 'Mega entertainment pack with 12 OTTs.' },
    { id: 'jio-666', price: 666, validity: '70 Days', data: '1.5 GB / Day', calls: 'Unlimited', badge: '70 Days Value 🌟', ott: ['JioTV', 'JioCinema'], cashback: '₹50 Cashback', network: 'True Unlimited 5G', description: '70 days long validity plan.' },
    { id: 'jio-857', price: 857, validity: '84 Days', data: '2 GB / Day', calls: 'Unlimited', badge: 'Amazon Prime 📦', ott: ['Amazon Prime Video Mobile', 'JioCinema'], cashback: '₹50 Cashback', network: 'True Unlimited 5G', description: '84 days with Amazon Prime Video.' },
    { id: 'jio-1099', price: 1099, validity: '84 Days', data: '2 GB / Day', calls: 'Unlimited', badge: 'Netflix 84 Days 🍿', ott: ['Netflix (Basic)', 'Unlimited 5G'], cashback: '₹75 Cashback', network: 'True Unlimited 5G', description: '84 Days with Netflix Basic.' },
    { id: 'jio-2999', price: 2999, validity: '365 Days (1 Year)', data: '2.5 GB / Day', calls: 'Unlimited', badge: 'Annual 👑', ott: ['JioCinema Premium', 'JioTV'], cashback: '₹150 Cashback', network: 'True Unlimited 5G', description: 'Full 1 year unlimited 5G.' }
  ],
  airtel: [
    { id: 'airtel-199', price: 199, validity: '28 Days', data: '2 GB Total', calls: 'Unlimited', badge: 'Calling Special 📞', ott: ['Wynk Music', 'Free Hellotunes'], cashback: '₹15 Cashback', network: 'Airtel 4G/5G', description: 'Budget calling pack.' },
    { id: 'airtel-299', price: 299, validity: '28 Days', data: '1.5 GB / Day', calls: 'Unlimited', badge: 'Popular ⭐', ott: ['Airtel Xstream Play (20+ OTTs)'], cashback: '₹20 Cashback', network: 'Unlimited 5G Data', description: '1.5GB daily with Xstream Play.' },
    { id: 'airtel-349', price: 349, validity: '28 Days', data: '2 GB / Day', calls: 'Unlimited', badge: 'Best 2GB 🌟', ott: ['Airtel Xstream Play'], cashback: '₹30 Cashback', network: 'Unlimited 5G Data', description: '2GB per day with unlimited 5G.' },
    { id: 'airtel-399', price: 399, validity: '28 Days', data: '2.5 GB / Day', calls: 'Unlimited', badge: 'Disney+ Hotstar 🏏', ott: ['Disney+ Hotstar (3 Months)', 'Xstream'], cashback: '₹35 Cashback', network: 'Unlimited 5G Data', description: '2.5GB/day + 3 Months Disney+ Hotstar.' },
    { id: 'airtel-839', price: 839, validity: '84 Days', data: '2 GB / Day', calls: 'Unlimited', badge: 'Hotstar 84D 🏏', ott: ['Disney+ Hotstar (3 Months)'], cashback: '₹50 Cashback', network: 'Unlimited 5G Data', description: '84 days with Disney+ Hotstar.' },
    { id: 'airtel-999', price: 999, validity: '84 Days', data: '2.5 GB / Day', calls: 'Unlimited', badge: 'Amazon Prime 📦', ott: ['Amazon Prime (84 Days)', 'Xstream'], cashback: '₹60 Cashback', network: 'Unlimited 5G Data', description: '84 days validity with Amazon Prime.' },
    { id: 'airtel-1199', price: 1199, validity: '84 Days', data: '2.5 GB / Day', calls: 'Unlimited', badge: 'Netflix + Prime 🍿', ott: ['Netflix (Basic)', 'Amazon Prime'], cashback: '₹80 Cashback', network: 'Unlimited 5G Data', description: 'Dual OTT pack with Netflix and Prime.' },
    { id: 'airtel-2999', price: 2999, validity: '365 Days', data: '2 GB / Day', calls: 'Unlimited', badge: 'Annual Pack 👑', ott: ['Apollo 24/7', 'Wynk Music'], cashback: '₹150 Cashback', network: 'Unlimited 5G Data', description: 'Full 365 days 2GB/day data.' }
  ],
  vi: [
    { id: 'vi-199', price: 199, validity: '18 Days', data: '1 GB / Day', calls: 'Unlimited', badge: 'Short Term 🏷️', ott: ['Vi Movies & TV'], cashback: '₹15 Cashback', network: 'Vi 4G', description: 'Quick recharge.' },
    { id: 'vi-299', price: 299, validity: '28 Days', data: '1.5 GB / Day + Night Free', calls: 'Unlimited', badge: 'Hero Unlimited 🦸', ott: ['Binge All Night (12AM-6AM)', 'Weekend Rollover'], cashback: '₹25 Cashback', network: 'Vi 4G', description: 'Unlimited night data 12AM-6AM.' },
    { id: 'vi-365', price: 365, validity: '28 Days', data: '2 GB / Day', calls: 'Unlimited', badge: 'Hotstar Special 🍿', ott: ['Disney+ Hotstar', 'Binge All Night'], cashback: '₹35 Cashback', network: 'Vi 4G', description: '2GB/Day + Hotstar + Binge All Night.' },
    { id: 'vi-839', price: 839, validity: '84 Days', data: '2 GB / Day', calls: 'Unlimited', badge: '84 Days Hero 🦸', ott: ['Binge All Night', 'Weekend Rollover'], cashback: '₹50 Cashback', network: 'Vi 4G', description: '84 days with Hero Unlimited benefits.' },
    { id: 'vi-2899', price: 2899, validity: '365 Days', data: '1.5 GB / Day', calls: 'Unlimited', badge: 'Annual Hero 👑', ott: ['Binge All Night', 'Weekend Rollover'], cashback: '₹150 Cashback', network: 'Vi 4G', description: '1 Year unlimited night data.' }
  ],
  bsnl: [
    { id: 'bsnl-107', price: 107, validity: '35 Days', data: '3 GB Total', calls: '200 Mins', badge: 'Super Economy 🏷️', ott: ['BSNL Tunes'], cashback: '₹10 Cashback', network: 'BSNL 4G', description: '35 days longest validity under ₹110.' },
    { id: 'bsnl-197', price: 197, validity: '70 Days', data: '2 GB / Day (18D)', calls: 'Unlimited (18D)', badge: '70 Days Saver 🌟', ott: ['Zing'], cashback: '₹15 Cashback', network: 'BSNL 4G', description: '70 days incoming validity saver.' },
    { id: 'bsnl-397', price: 397, validity: '150 Days', data: '2 GB / Day (30D)', calls: 'Unlimited (30D)', badge: '150 Days 👑', ott: ['Free PRBT'], cashback: '₹25 Cashback', network: 'BSNL 4G', description: '150 days secondary SIM validity.' }
  ]
};

class PaytmApp {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = true;
    this.speechSynthesis = window.speechSynthesis || null;
    this.speechRecognition = null;
    this.isListening = false;
    this.currentLanguage = 'hi-IN'; // Default: Hindi as requested
    this.backendUrl = 'http://localhost:8000';
    this.activeVoiceAudio = null;
    this.selectedOperator = 'jio';
    this.selectedCategory = 'recommended';
    
    this.initAudio();
    this.initSpeechRecognition();
    this.bindEvents();
  }

  initAudio() {
    const unlockAudio = () => {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.audioCtx = new AudioContext();
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
      } else if (type === 'keypad') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800 + Math.random() * 200, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
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
      } else if (type === 'paytm_success') {
        const notes = [
          { f: 587.33, d: 0.12 },
          { f: 880.00, d: 0.16 },
          { f: 1174.66, d: 0.35 }
        ];
        let offset = 0;
        notes.forEach(note => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          const noteTime = now + offset;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(note.f, noteTime);
          gain.gain.setValueAtTime(0.18, noteTime);
          gain.gain.exponentialRampToValueAtTime(0.001, noteTime + note.d);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(noteTime);
          osc.stop(noteTime + note.d + 0.05);
          offset += note.d * 0.85;
        });
      }
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  playSarvamAudio(base64Audio) {
    if (!this.soundEnabled || !base64Audio) return;
    try {
      if (this.activeVoiceAudio) {
        this.activeVoiceAudio.pause();
      }
      this.activeVoiceAudio = new Audio("data:audio/wav;base64," + base64Audio);
      this.activeVoiceAudio.play().catch(e => console.warn("Sarvam audio play error:", e));
    } catch (e) {
      console.warn("Audio load error:", e);
    }
  }

  speakTextFallback(text, lang = this.currentLanguage) {
    if (!this.speechSynthesis) return;
    try {
      this.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      const voices = this.speechSynthesis.getVoices();
      const matchingVoice = voices.find(v => v.lang.includes(lang.split('-')[0]) || v.name.includes('Hindi') || v.name.includes('India'));
      if (matchingVoice) utterance.voice = matchingVoice;

      this.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS error:', e);
    }
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.speechRecognition = new SpeechRecognition();
      this.speechRecognition.continuous = false;
      this.speechRecognition.interimResults = true; // Live interim text display!
      this.speechRecognition.lang = this.currentLanguage;

      this.speechRecognition.onstart = () => {
        this.isListening = true;
        this.playSound('chime');
        this.updateMicUi(true);
        this.showToast('🎙️ Sun raha hoon... Boliye! (Listening...)', 'info', '🎤');
      };

      this.speechRecognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const inputElem = document.getElementById('user-chat-prompt') || document.getElementById('ai-prompt-input');
        if (inputElem) {
          inputElem.value = finalTranscript || interimTranscript;
        }

        if (finalTranscript) {
          this.handleVoiceInput(finalTranscript);
        }
      };

      this.speechRecognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        this.isListening = false;
        this.updateMicUi(false);
      };

      this.speechRecognition.onend = () => {
        this.isListening = false;
        this.updateMicUi(false);
      };
    }
  }

  toggleVoiceRecognition(customLang = null) {
    if (!this.speechRecognition) {
      this.showToast('Speech recognition not supported in this browser. Please use Chrome/Edge.', 'info', '🎙️');
      return;
    }
    this.speechRecognition.lang = customLang || this.currentLanguage;

    if (this.isListening) {
      this.speechRecognition.stop();
    } else {
      try {
        this.speechRecognition.start();
      } catch (e) {
        console.warn('Voice restart error:', e);
      }
    }
  }

  updateMicUi(listening) {
    const micBtns = document.querySelectorAll('.voice-mic-btn');
    micBtns.forEach(btn => {
      if (listening) {
        btn.classList.add('mic-active', 'ring-4', 'ring-red-400', 'animate-pulse');
        btn.title = "Listening... Speak now";
      } else {
        btn.classList.remove('mic-active', 'ring-4', 'ring-red-400', 'animate-pulse');
        btn.title = "Click to speak";
      }
    });
  }

  handleVoiceInput(transcript) {
    this.showToast(`🗣️ "${transcript}"`, 'ai', '🎙️');
    if (window.agentEngine) {
      window.agentEngine.processQuery(transcript);
    } else {
      window.location.href = `ai-workspace.html?q=${encodeURIComponent(transcript)}`;
    }
  }

  bindEvents() {
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

      const existingRipple = target.querySelector('.ripple');
      if (existingRipple) existingRipple.remove();

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
    setTimeout(() => toast.remove(), 3200);
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    this.playSound('click');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    if (modalId === 'recharge-modal') {
      this.renderPlansCatalog();
    }
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
    this.showToast('🚀 Opening Paytm AI Hub Assistant...', 'ai', '🤖');

    const overlay = document.getElementById('portal-overlay');
    if (overlay) overlay.classList.add('active');

    setTimeout(() => {
      window.location.href = 'ai-hub.html';
    }, 450);
  }

  simulateRecharge(event) {
    if (event) event.preventDefault();
    this.closeModal('recharge-modal');
    this.playSound('paytm_success');
    this.showToast('✅ Mobile Recharge of ₹299 Successful! Ref ID: PAYTM' + Math.floor(100000 + Math.random() * 900000), 'success', '📱');
  }

  simulateRechargeDirect(amount, op) {
    this.closeModal('recharge-modal');
    this.playSound('paytm_success');
    this.showToast(`✅ ${op} Recharge of ₹${amount} Successful! Ref ID: PAYTM` + Math.floor(100000 + Math.random() * 900000), 'success', '📱');
  }

  simulateBillPay(event) {
    if (event) event.preventDefault();
    this.closeModal('bill-modal');
    this.closeModal('electricity-modal');
    this.playSound('paytm_success');
    this.showToast('✅ Bill Payment Successful! Ref ID: BBPS' + Math.floor(100000 + Math.random() * 900000), 'success', '⚡');
  }

  selectRechargeOperator(op) {
    this.selectedOperator = op;
    this.playSound('click');
    ['jio', 'airtel', 'vi', 'bsnl'].forEach(o => {
      const btn = document.getElementById(`op-btn-${o}`);
      if (btn) {
        if (o === op) {
          btn.className = 'py-2 px-3 rounded-xl border-2 border-[#00b9f1] bg-sky-50 text-[#002970] font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs';
        } else {
          btn.className = 'py-2 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold flex items-center justify-center gap-1.5 transition-all';
        }
      }
    });
    this.renderPlansCatalog();
  }

  filterPlanCategory(category) {
    this.selectedCategory = category;
    this.playSound('click');
    const pills = document.querySelectorAll('#plan-category-tabs .category-pill');
    pills.forEach(pill => {
      if (pill.getAttribute('onclick')?.includes(`'${category}'`)) {
        pill.className = 'category-pill active shrink-0 px-3 py-1.5 rounded-full bg-[#002970] text-white shadow-xs';
      } else {
        pill.className = 'category-pill shrink-0 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200';
      }
    });
    this.renderPlansCatalog();
  }

  rechargeWithAi(operator, planQuery) {
    this.playSound('chime');
    this.closeModal('recharge-modal');
    this.showToast(`🤖 Handing over to Paytm AI Hub: ${operator} ${planQuery}...`, 'ai', '🚀');
    setTimeout(() => {
      window.location.href = `ai-workspace.html?q=${encodeURIComponent('Recharge ' + operator + ' ' + planQuery)}`;
    }, 400);
  }

  renderPlansCatalog() {
    const catalog = document.getElementById('recharge-plans-catalog');
    if (!catalog) return;

    const op = this.selectedOperator || 'jio';
    const cat = this.selectedCategory || 'recommended';
    const plans = FRONTEND_PLANS[op] || FRONTEND_PLANS['jio'];

    let filtered = plans;
    if (cat === 'recommended') {
      filtered = plans.slice(0, 4);
    } else if (cat === 'daily') {
      filtered = plans.filter(p => p.data.includes('1.5') || p.data.includes('2 GB') || p.data.includes('2.5'));
    } else if (cat === '5g') {
      filtered = plans.filter(p => p.network.includes('5G') || p.badge.includes('5G'));
    } else if (cat === 'ott') {
      filtered = plans.filter(p => (p.ott && p.ott.length > 0) || p.has_netflix);
    } else if (cat === 'annual') {
      filtered = plans.filter(p => p.validity.includes('365') || p.validity.includes('Year') || p.validity.includes('150') || p.validity.includes('84'));
    }

    if (!filtered || filtered.length === 0) filtered = plans;

    catalog.innerHTML = filtered.map(plan => `
      <div class="p-3.5 bg-slate-50/90 hover:bg-white rounded-2xl border border-slate-200 hover:border-[#00b9f1] transition-all shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-lg font-black text-[#002970]">₹${plan.price}</span>
            <span class="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">• ${plan.validity}</span>
            <span class="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">${plan.badge}</span>
          </div>
          <div class="text-xs font-bold text-[#00b9f1] flex items-center gap-2">
            <span>📊 ${plan.data}</span>
            <span class="text-slate-400">•</span>
            <span class="text-slate-600">📞 ${plan.calls}</span>
          </div>
          <div class="text-[11px] text-slate-500">
            ${plan.ott && plan.ott.length ? '✨ Perks: ' + plan.ott.join(', ') : plan.description}
          </div>
          <div class="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
            <span>🎁</span> <span>${plan.cashback}</span>
          </div>
        </div>

        <div class="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0">
          <button type="button" onclick="paytm.rechargeWithAi('${op.toUpperCase()}', '${plan.price} plan (${plan.data}, ${plan.validity})')"
                  class="interactive-btn flex-1 sm:flex-none py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#002970] to-[#00b9f1] text-white font-bold text-xs hover:brightness-110 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer">
            <span>🤖 AI Auto-Pay</span>
          </button>
          <button type="button" onclick="paytm.simulateRechargeDirect(${plan.price}, '${op.toUpperCase()}')"
                  class="interactive-btn flex-1 sm:flex-none py-1.5 px-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer">
            <span>Direct Pay ₹${plan.price}</span>
          </button>
        </div>
      </div>
    `).join('');
  }
}

const paytm = new PaytmApp();
window.paytm = paytm;


// =========================================================================
// MASTER AGENT ENGINE (ORCHESTRATING ASTA-STYLE STEPS & APIS)
// =========================================================================
class PaytmAgentOrchestrator {
  constructor() {
    this.activePlan = null;
    this.currentData = null;
    this.activeLanguage = 'hi';
    this.enteredPin = '';
  }

  async processQuery(query) {
    const container = document.getElementById('workspace-dynamic-content');
    if (container) {
      container.innerHTML = `
        <div class="bg-white/95 backdrop-blur-md rounded-2xl p-6 text-center shadow-lg border border-white/80 animate-in fade-in duration-200">
          <div class="w-12 h-12 border-4 border-cyan-400 border-t-[#002970] rounded-full animate-spin mx-auto mb-3"></div>
          <p class="text-sm font-black text-[#002970]">Paytm Multi-Agent Squad Activated...</p>
          <div class="flex items-center justify-center gap-2 mt-2 text-xs text-slate-500 font-semibold">
            <span>⚡ Groq LLM</span> • <span>🔍 SerpApi</span> • <span>🎙️ Sarvam AI</span>
          </div>
        </div>
      `;
    }

    try {
      const resp = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query, user_id: 'paytm_user_01' })
      });

      if (resp.ok) {
        const data = await resp.json();
        this.currentData = data;
        this.activeLanguage = data.language || 'hi';

        // Play Sarvam AI Speech or browser fallback
        if (data.audio_base64) {
          paytm.playSarvamAudio(data.audio_base64);
        } else {
          paytm.speakTextFallback(data.ai_message);
        }

        if (data.mode === 'RESOLVE' || data.service === 'dispute') {
          this.renderResolveMode(data);
        } else if (data.service === 'travel') {
          this.renderTravelMode(data);
        } else {
          this.renderRechargeMode(data);
        }
        return;
      }
    } catch (e) {
      console.warn('Backend call failed, using standalone fallback:', e);
    }
  }

  // 1. Render Recharge Mode (Paytm ONE Action Squad)
  renderRechargeMode(data) {
    const best = data.plan_data.best;
    const alternatives = data.plan_data.alternatives || [];
    const serpResults = data.serp_verification?.live_web_matches || [];
    const steps = data.steps_log || [];
    this.activePlan = best;

    const container = document.getElementById('workspace-dynamic-content');
    if (!container) return;

    container.innerHTML = `
      <!-- ASTRA-STYLE AGENT THINKING & EXECUTION TRACE BOX -->
      <div class="bg-slate-900/90 text-white backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-xl border border-slate-700/80 text-left text-xs space-y-2 animate-in fade-in duration-200">
        <div class="flex items-center justify-between border-b border-slate-700/60 pb-2">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span class="font-black text-cyan-400 tracking-wide uppercase text-[11px]">Astra Multi-Agent Execution Trace</span>
          </div>
          <span class="text-[10px] text-slate-400 font-mono">Status: 200 OK • Groq + SerpApi + Sarvam</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
          <div class="flex items-center gap-1.5 text-emerald-300">
            <span>✓</span> <span>Step 1: Intent & Entity Extraction (Groq)</span>
          </div>
          <div class="flex items-center gap-1.5 text-cyan-300">
            <span>✓</span> <span>Step 2: SerpApi Live Google Deals Query</span>
          </div>
          <div class="flex items-center gap-1.5 text-blue-300">
            <span>✓</span> <span>Step 3: Telecom Plan Matching (${(data.operator || 'Jio').toUpperCase()} ₹${best.price})</span>
          </div>
          <div class="flex items-center gap-1.5 text-purple-300">
            <span>✓</span> <span>Step 4: Sarvam AI Bulbul v3 Voice Synthesized</span>
          </div>
        </div>
      </div>

      <!-- AI Verbal Response Bubble -->
      <div class="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-lg border border-white/80 animate-in fade-in slide-in-from-top-2 duration-300">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-[#002970] to-[#00b9f1] flex items-center justify-center text-white text-xl shadow-md shrink-0">
            🤖
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1 flex-wrap">
              <span class="text-xs font-black tracking-wider text-[#002970] uppercase">Paytm ONE • AI Commander</span>
              <span class="text-[10px] font-bold bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full">
                🌐 ${data.language === 'hi' ? 'हिंदी (Hindi)' : (data.language === 'en' ? 'English' : 'मराठी')}
              </span>
              <span class="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                🎙️ Sarvam AI Audio Active
              </span>
            </div>
            <p class="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">${data.ai_message}</p>
          </div>
        </div>

        <!-- Filter Tags -->
        <div class="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span class="text-[11px] font-semibold text-slate-400">Filters:</span>
          <span class="inline-flex items-center gap-1 bg-[#002970]/10 text-[#002970] font-bold text-xs px-2.5 py-1 rounded-lg">
            📱 ${(data.operator || 'jio').toUpperCase()}
          </span>
          <span class="inline-flex items-center gap-1 bg-cyan-100 text-cyan-800 font-bold text-xs px-2.5 py-1 rounded-lg">
            💰 Budget: ~₹${data.budget || 300}
          </span>
          <span class="inline-flex items-center gap-1 bg-blue-100 text-blue-800 font-bold text-xs px-2.5 py-1 rounded-lg">
            📶 ${best.data}
          </span>
          <span class="inline-flex items-center gap-1 bg-purple-100 text-purple-800 font-bold text-xs px-2.5 py-1 rounded-lg">
            🍿 ${best.ott?.join(', ') || 'OTT Suite'}
          </span>
          <span class="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-1 rounded-lg">
            🎁 ${best.cashback}
          </span>
        </div>
      </div>

      <!-- Best Plan Highlight Card -->
      <div class="bg-gradient-to-br from-white via-cyan-50/40 to-blue-50/60 rounded-2xl p-5 sm:p-6 shadow-xl border-2 border-[#00b9f1]/40 relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div class="absolute top-0 right-0 bg-gradient-to-l from-[#002970] to-[#00b9f1] text-white text-[11px] font-black uppercase tracking-wider px-4 py-1.5 rounded-bl-xl shadow-md">
          ${best.badge}
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl sm:text-4xl font-black text-[#002970]">₹${best.price}</span>
              <span class="text-xs text-slate-400 line-through">₹${best.price + 50}</span>
              <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                100% Top Match
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-1 font-medium">${best.description}</p>
          </div>

          <div class="text-left sm:text-right">
            <span class="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">Mobile Number</span>
            <span class="text-sm font-bold text-[#002970]">9820123456</span>
            <span class="text-[10px] text-slate-500 block">Prepaid • Mumbai / Maharashtra</span>
          </div>
        </div>

        <!-- Specifications Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
          <div class="bg-white/80 p-2.5 rounded-xl border border-slate-100 text-center">
            <span class="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Validity</span>
            <span class="text-sm sm:text-base font-black text-[#002970]">${best.validity}</span>
          </div>
          <div class="bg-white/80 p-2.5 rounded-xl border border-slate-100 text-center">
            <span class="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Daily Data</span>
            <span class="text-sm sm:text-base font-black text-[#00b9f1]">${best.data}</span>
          </div>
          <div class="bg-white/80 p-2.5 rounded-xl border border-slate-100 text-center">
            <span class="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Voice Calls</span>
            <span class="text-sm sm:text-base font-black text-[#002970]">Unlimited</span>
          </div>
          <div class="bg-white/80 p-2.5 rounded-xl border border-slate-100 text-center">
            <span class="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Speed</span>
            <span class="text-sm sm:text-base font-black text-emerald-600">${best.network}</span>
          </div>
        </div>

        <!-- SerpApi Live Search Verification Proof -->
        ${serpResults.length > 0 ? `
          <div class="mt-4 p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-left">
            <div class="flex items-center gap-1.5 text-xs font-bold text-[#002970] mb-1">
              <span>🔎 SerpApi Live Web Verification:</span>
              <span class="text-[10px] bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full font-mono">Status: 200 OK</span>
            </div>
            <p class="text-[11px] text-slate-600 italic truncate">"${serpResults[0].snippet}"</p>
          </div>
        ` : ''}

        <!-- Human Approval & PIN Action -->
        <div class="mt-6 pt-4 border-t border-slate-200/80">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="text-xs font-bold text-[#002970]">Human Approval Required (UNWIND Security)</span>
            </div>
            <span class="text-[11px] text-slate-400">NPCI 256-bit Secure</span>
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-3">
            <button onclick="window.agentEngine.openPinModal(${best.price}, '${(data.operator || 'Jio').toUpperCase()}', '${best.validity}')"
                    class="interactive-btn w-full sm:flex-1 py-3.5 px-6 rounded-xl font-black text-sm text-white bg-gradient-to-r from-[#002970] via-[#0047a1] to-[#00b9f1] hover:brightness-110 shadow-lg shadow-blue-900/25 flex items-center justify-center gap-2">
              <span>✅</span>
              <span>${data.language === 'hi' ? 'स्वीकार करें और ₹' + best.price + ' भरें (Pay)' : (data.language === 'mr' ? 'मंजूर करा आणि ₹' + best.price + ' भरा' : 'Approve & Pay ₹' + best.price)}</span>
            </button>

            <button onclick="window.agentEngine.showAlternativePlans()"
                    class="interactive-btn w-full sm:w-auto py-3.5 px-5 rounded-xl font-bold text-xs sm:text-sm text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center gap-1.5">
              <span>🔄</span>
              <span>${data.language === 'hi' ? 'अन्य प्लान्स देखें' : 'View Alternatives'}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- More Alternatives Grid -->
      <div id="alternative-plans-row" class="hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div class="text-xs font-bold text-[#002970] mb-2 flex items-center justify-between">
          <span>More Matching Plans for ${(data.operator || 'Jio').toUpperCase()}:</span>
          <span class="text-[11px] text-slate-400">Click to switch plan instantly</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          ${alternatives.map(alt => `
            <div onclick="window.agentEngine.switchPlan('${alt.id}', ${alt.price}, '${data.operator || 'jio'}')"
                 class="interactive-btn p-3 bg-white/95 rounded-xl border border-slate-200 hover:border-[#00b9f1] cursor-pointer shadow-xs transition-all text-left">
              <div class="flex items-center justify-between mb-1">
                <span class="text-base font-black text-[#002970]">₹${alt.price}</span>
                <span class="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">${alt.validity}</span>
              </div>
              <div class="text-xs font-bold text-[#00b9f1]">${alt.data}</div>
              <div class="text-[11px] text-slate-500 truncate mt-1">${alt.ott?.join(', ') || ''}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  showAlternativePlans() {
    const row = document.getElementById('alternative-plans-row');
    if (row) {
      row.classList.toggle('hidden');
      paytm.playSound('click');
    }
  }

  switchPlan(planId, price, operator) {
    paytm.playSound('chime');
    this.processQuery(`${operator} ${price} plan recharge`);
  }

  // 2. Render Resolve Mode (Paytm Resolve Squad)
  renderResolveMode(data) {
    const cit = data.citations || {};
    const nex = data.nexconn_chat || {};

    const container = document.getElementById('workspace-dynamic-content');
    if (!container) return;

    container.innerHTML = `
      <!-- Astra Execution Trace -->
      <div class="bg-slate-900/90 text-white backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-xl border border-slate-700/80 text-left text-xs space-y-2 animate-in fade-in duration-200">
        <div class="flex items-center justify-between border-b border-slate-700/60 pb-2">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping"></span>
            <span class="font-black text-red-400 tracking-wide uppercase text-[11px]">Paytm Resolve Dispute Squad Active</span>
          </div>
          <span class="text-[10px] text-slate-400 font-mono">You.com Cited Research + Nexconn Live SDK</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
          <div class="flex items-center gap-1.5 text-emerald-300">
            <span>✓</span> <span>Step 1: Problem Classification (Failed/Pending Payment)</span>
          </div>
          <div class="flex items-center gap-1.5 text-cyan-300">
            <span>✓</span> <span>Step 2: You.com Live Regulatory Citation Search</span>
          </div>
          <div class="flex items-center gap-1.5 text-blue-300">
            <span>✓</span> <span>Step 3: Nexconn Real-Time Support Room Spawned</span>
          </div>
          <div class="flex items-center gap-1.5 text-purple-300">
            <span>✓</span> <span>Step 4: Sarvam AI Voice Synthesized</span>
          </div>
        </div>
      </div>

      <div class="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-xl border border-red-200 text-left animate-in fade-in duration-300">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-2xl">🛡️</span>
          <div>
            <h3 class="text-base sm:text-lg font-black text-[#002970]">Paytm Resolve Intelligence Squad</h3>
            <span class="text-xs text-red-600 font-bold">Investigation Active: Pending Payment Reversal</span>
          </div>
        </div>

        <div class="bg-red-50/70 rounded-xl p-4 border border-red-100 text-xs text-slate-700 space-y-2">
          <div class="flex justify-between font-bold text-slate-800">
            <span>TXN #PTM7890124 (Jio ₹599)</span>
            <span class="text-amber-600">Status: Pending at Telecom Switch</span>
          </div>
          <p>Bank debited ₹599. Operator confirmation pending. NPCI SLA: Auto-reversal within 24 hours.</p>
        </div>

        <!-- You.com Live Citation Box -->
        <div class="mt-4 p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-slate-700">
          <div class="font-bold text-[#002970] flex items-center justify-between mb-1">
            <span class="flex items-center gap-1.5">
              <span>🔍 You.com Live Policy Verification</span>
              <span class="text-[10px] bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full font-mono">Live Citation</span>
            </span>
            <a href="${cit.url || 'https://www.npci.org.in'}" target="_blank" class="text-blue-600 hover:underline font-bold text-[11px]">
              View Source ↗
            </a>
          </div>
          <p class="italic text-slate-700">"${cit.snippet || 'Under NPCI guidelines, failed UPI transactions are auto-reconciled within T+1 days.'}"</p>
          <div class="mt-1 text-[10px] text-slate-400">Cited from: ${cit.source_title || 'NPCI Circular'}</div>
        </div>

        <!-- Nexconn Support -->
        <div class="mt-5 p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-slate-700">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span class="font-bold text-emerald-900">Nexconn Chat SDK Active (AppKey: ${nex.app_key || 'm7ua80gbmcxrm'})</span>
            </div>
            <span class="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-mono">Singapore Cluster</span>
          </div>
          <p class="text-slate-600">Assigned Agent: <strong>${nex.assigned_agent?.name || 'Priya Sharma (Paytm Support)'}</strong></p>
          <button onclick="window.agentEngine.openNexconnChatModal()"
                  class="interactive-btn mt-3 w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-md flex items-center justify-center gap-2">
            <span>💬</span>
            <span>Open Real-Time Support Chat (Nexconn SDK)</span>
          </button>
        </div>
      </div>
    `;
  }

  // 3. Render Travel Mode (SerpApi)
  renderTravelMode(data) {
    const opts = data.travel_data?.options || [];
    const container = document.getElementById('workspace-dynamic-content');
    if (!container) return;

    container.innerHTML = `
      <div class="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-xl border border-blue-200 text-left animate-in fade-in duration-300">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-2xl">✈️</span>
          <div>
            <h3 class="text-base sm:text-lg font-black text-[#002970]">Paytm Travel Agent (Powered by SerpApi)</h3>
            <span class="text-xs text-[#00b9f1] font-bold">Live Flight & Bus Search</span>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          ${opts.map(o => `
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div class="flex justify-between font-bold text-sm text-[#002970]">
                <span>${o.airline || o.operator}</span>
                <span class="text-emerald-600 font-black">${o.price}</span>
              </div>
              <div class="text-xs text-slate-500 mt-1">${o.route} • ${o.time}</div>
              <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded mt-2 inline-block">${o.badge}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 4. PIN & Payment Flow
  openPinModal(amount, operator, validity) {
    paytm.playSound('click');
    const modal = document.getElementById('upi-pin-modal');
    if (!modal) return;

    document.getElementById('modal-pay-amount').textContent = `₹${amount}`;
    document.getElementById('modal-operator-name').textContent = `${operator} Prepaid Recharge (${validity})`;
    
    this.enteredPin = '';
    this.updatePinDisplay();

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  closePinModal() {
    const modal = document.getElementById('upi-pin-modal');
    if (!modal) return;
    paytm.playSound('click');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  handlePinKeypad(digit) {
    if (!this.enteredPin) this.enteredPin = '';
    paytm.playSound('keypad');

    if (digit === 'back') {
      this.enteredPin = this.enteredPin.slice(0, -1);
    } else if (this.enteredPin.length < 4) {
      this.enteredPin += digit;
    }

    this.updatePinDisplay();

    if (this.enteredPin.length === 4) {
      setTimeout(() => this.executeRechargePayment(), 250);
    }
  }

  updatePinDisplay() {
    const dots = document.querySelectorAll('.pin-dot');
    dots.forEach((dot, idx) => {
      if (this.enteredPin && idx < this.enteredPin.length) {
        dot.classList.add('bg-[#002970]', 'scale-110');
        dot.classList.remove('bg-slate-200');
      } else {
        dot.classList.remove('bg-[#002970]', 'scale-110');
        dot.classList.add('bg-slate-200');
      }
    });
  }

  executeRechargePayment() {
    this.closePinModal();
    paytm.showToast('Connecting to NPCI & Telecom Switch...', 'ai', '🔄');

    setTimeout(() => {
      paytm.playSound('paytm_success');
      this.renderSuccessReceipt();
    }, 1200);
  }

  renderSuccessReceipt() {
    const container = document.getElementById('workspace-dynamic-content');
    if (!container) return;

    const txnId = 'PTM' + Math.floor(100000000 + Math.random() * 900000000);
    const opRef = 'OPR' + Math.floor(10000000 + Math.random() * 90000000);

    container.innerHTML = `
      <div class="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl border border-emerald-200 text-center animate-in zoom-in-95 duration-400">
        <div class="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-4xl text-emerald-600 shadow-md animate-bounce">
          ✓
        </div>

        <h2 class="text-2xl sm:text-3xl font-black text-[#002970] mt-4">
          ${this.activeLanguage === 'hi' ? 'रिचार्ज सफल हुआ!' : 'Recharge Successful!'}
        </h2>
        <p class="text-sm text-slate-500 mt-1">
          ₹${this.activePlan ? this.activePlan.price : 299} paid to ${(this.currentData?.operator || 'Jio').toUpperCase()} Prepaid
        </p>

        <div class="bg-slate-50 rounded-xl p-4 mt-6 max-w-md mx-auto text-left text-xs space-y-2 border border-slate-200">
          <div class="flex justify-between py-1 border-b border-slate-200/60">
            <span class="text-slate-500">Transaction ID</span>
            <span class="font-bold text-slate-800 font-mono">#${txnId}</span>
          </div>
          <div class="flex justify-between py-1 border-b border-slate-200/60">
            <span class="text-slate-500">Operator Ref</span>
            <span class="font-bold text-slate-800 font-mono">${opRef}</span>
          </div>
          <div class="flex justify-between py-1 border-b border-slate-200/60">
            <span class="text-slate-500">Mobile Number</span>
            <span class="font-bold text-slate-800">9820123456</span>
          </div>
          <div class="flex justify-between py-1">
            <span class="text-slate-500">Paid Via</span>
            <span class="font-bold text-[#002970]">Paytm UPI • SBI XX4821</span>
          </div>
        </div>

        <!-- Scratch Card -->
        <div class="mt-6 max-w-md mx-auto">
          <div onclick="window.agentEngine.scratchCard(this)" 
               class="interactive-btn bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-2xl p-5 text-white shadow-lg cursor-pointer transform hover:scale-102 transition-all">
            <div id="scratch-front">
              <span class="text-2xl">🎁</span>
              <div class="text-base font-black mt-1">Tap to Scratch Your Cashback Card!</div>
              <div class="text-xs text-amber-100">Paytm Exclusive Hackathon Reward</div>
            </div>
            <div id="scratch-revealed" class="hidden">
              <span class="text-3xl">🎉</span>
              <div class="text-2xl font-black mt-1">₹25 Cashback Won!</div>
              <div class="text-xs text-amber-100">Credited directly to your Paytm Wallet</div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-center gap-3">
          <button onclick="window.agentEngine.processQuery('Airtel 349 plan recharge')" 
                  class="interactive-btn px-5 py-2.5 rounded-xl font-bold text-xs bg-[#002970] text-white hover:bg-blue-900 shadow-md">
            Do Another Action
          </button>
          <a href="ai-hub.html" class="interactive-btn px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300">
            Back to AI Hub
          </a>
        </div>
      </div>
    `;
  }

  scratchCard(cardElem) {
    paytm.playSound('chime');
    const front = cardElem.querySelector('#scratch-front');
    const revealed = cardElem.querySelector('#scratch-revealed');
    if (front && revealed) {
      front.classList.add('hidden');
      revealed.classList.remove('hidden');
      cardElem.classList.remove('from-amber-400', 'to-amber-500');
      cardElem.classList.add('from-emerald-500', 'to-teal-600');
    }
  }

  openNexconnChatModal() {
    paytm.playSound('click');
    const modal = document.getElementById('nexconn-chat-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  closeNexconnChatModal() {
    paytm.playSound('click');
    const modal = document.getElementById('nexconn-chat-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  sendNexconnMessage() {
    const input = document.getElementById('nexconn-msg-input');
    const text = input.value.trim();
    if (!text) return;
    paytm.playSound('click');

    const msgBox = document.getElementById('nexconn-chat-messages');
    msgBox.innerHTML += `
      <div class="flex justify-end mb-2">
        <div class="bg-[#002970] text-white px-3 py-2 rounded-2xl rounded-tr-xs text-xs max-w-[80%]">
          ${text}
        </div>
      </div>
    `;
    input.value = '';
    msgBox.scrollTop = msgBox.scrollHeight;

    setTimeout(() => {
      paytm.playSound('chime');
      msgBox.innerHTML += `
        <div class="flex justify-start mb-2">
          <div class="bg-white text-slate-800 px-3 py-2 rounded-2xl rounded-tl-xs text-xs max-w-[80%] border border-slate-200">
            <span class="font-bold text-[10px] text-emerald-700 block">Priya Sharma (Resolution Specialist):</span>
            I have verified your transaction logs via Nexconn Real-Time Gateway. The amount is currently in reconciliation with the bank switch. A resolution token #RT-9481 has been issued.
          </div>
        </div>
      `;
      msgBox.scrollTop = msgBox.scrollHeight;
    }, 1000);
  }
}

window.agentEngine = new PaytmAgentOrchestrator();
