// Paytm AI Hub — Universal Action & Resolution OS
// Core Multi-Agent Orchestrator, Voice Recognition & Synthesis, and Telecom Engine

class PaytmApp {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = true;
    this.speechSynthesis = window.speechSynthesis || null;
    this.speechRecognition = null;
    this.isListening = false;
    this.currentLanguage = 'mr-IN'; // Default: Marathi
    
    this.initAudio();
    this.initSpeechRecognition();
    this.bindEvents();
  }

  // 1. Audio Synthesizer (Realistic Paytm Clicks, Chimes & Success)
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
        // Iconic Paytm sound melody
        const notes = [
          { f: 587.33, d: 0.12 }, // D5
          { f: 880.00, d: 0.16 }, // A5
          { f: 1174.66, d: 0.35 } // D6
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

  // 2. Speech Synthesis (Text-to-Speech)
  speakText(text, lang = this.currentLanguage) {
    if (!this.speechSynthesis) return;
    try {
      this.speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      // Try selecting an Indian voice if available
      const voices = this.speechSynthesis.getVoices();
      const matchingVoice = voices.find(v => v.lang.includes(lang.split('-')[0]) || v.name.includes('India'));
      if (matchingVoice) utterance.voice = matchingVoice;

      this.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS error:', e);
    }
  }

  // 3. Web Speech Recognition (Mic Voice Input)
  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.speechRecognition = new SpeechRecognition();
      this.speechRecognition.continuous = false;
      this.speechRecognition.interimResults = false;
      this.speechRecognition.lang = this.currentLanguage;

      this.speechRecognition.onstart = () => {
        this.isListening = true;
        this.playSound('chime');
        this.updateMicUi(true);
      };

      this.speechRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.handleVoiceInput(transcript);
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
    if (customLang) {
      this.speechRecognition.lang = customLang;
    }
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
        btn.classList.add('mic-active', 'ring-4', 'ring-cyan-400', 'animate-pulse');
        btn.title = "Listening... Speak now";
      } else {
        btn.classList.remove('mic-active', 'ring-4', 'ring-cyan-400', 'animate-pulse');
        btn.title = "Click to speak";
      }
    });
  }

  handleVoiceInput(transcript) {
    this.showToast(`🗣️ "${transcript}"`, 'ai', '🎙️');
    
    // If on ai-workspace.html, run the agent orchestrator directly
    if (window.agentEngine) {
      window.agentEngine.processQuery(transcript);
    } else {
      // Forward to workspace with query param
      window.location.href = `ai-workspace.html?q=${encodeURIComponent(transcript)}`;
    }
  }

  bindEvents() {
    // Micro-interaction ripples
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
    setTimeout(() => {
      toast.remove();
    }, 3200);
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
    this.showToast('🚀 Opening Paytm AI Hub Assistant...', 'ai', '🤖');

    const overlay = document.getElementById('portal-overlay');
    if (overlay) {
      overlay.classList.add('active');
    }

    setTimeout(() => {
      window.location.href = 'ai-hub.html';
    }, 450);
  }
}

// Instantiate global app controller
const paytm = new PaytmApp();
window.paytm = paytm;


// =========================================================================
// TELECOM & SERVICE AGENT DATABASE (Accurate Real Indian Plans 2024-2026)
// =========================================================================
const TELECOM_PLANS_DB = {
  jio: [
    {
      id: 'jio-299',
      price: 299,
      validity: '28 Days',
      data: '2 GB / Day',
      totalData: '56 GB',
      calls: 'Unlimited Calls',
      sms: '100 SMS / Day',
      network: 'True Unlimited 5G',
      badge: 'Best Value ⭐',
      ott: ['JioCinema', 'JioTV', 'JioCloud'],
      hasNetflix: false,
      cashback: '₹25 Cashback with Paytm UPI',
      description: 'Ideal 2GB daily data plan with unlimited 5G data & high-speed calls.'
    },
    {
      id: 'jio-349',
      price: 349,
      validity: '28 Days',
      data: '2.5 GB / Day',
      totalData: '70 GB',
      calls: 'Unlimited Calls',
      sms: '100 SMS / Day',
      network: 'True Unlimited 5G',
      badge: 'Extra Data 🚀',
      ott: ['JioCinema Premium', 'JioTV'],
      hasNetflix: false,
      cashback: '₹30 Cashback',
      description: '2.5 GB per day power plan with JioCinema Premium subscription.'
    },
    {
      id: 'jio-398',
      price: 398,
      validity: '28 Days',
      data: '2 GB / Day',
      totalData: '56 GB',
      calls: 'Unlimited Calls',
      sms: '100 SMS / Day',
      network: 'True Unlimited 5G',
      badge: 'Netflix Bundle 🍿',
      ott: ['Netflix (Basic Mobile)', 'JioTV', 'JioCinema'],
      hasNetflix: true,
      cashback: '₹40 Cashback',
      description: 'Includes official Netflix Mobile subscription + 2GB daily 5G data.'
    },
    {
      id: 'jio-857',
      price: 857,
      validity: '84 Days',
      data: '2 GB / Day',
      totalData: '168 GB',
      calls: 'Unlimited Calls',
      sms: '100 SMS / Day',
      network: 'True Unlimited 5G',
      badge: '84 Days Super Saver 🌟',
      ott: ['Amazon Prime Video Mobile', 'JioCinema'],
      hasNetflix: false,
      cashback: '₹50 Cashback',
      description: 'Long validity 84 days pack with Amazon Prime Video subscription.'
    },
    {
      id: 'jio-1099',
      price: 1099,
      validity: '84 Days',
      data: '2 GB / Day',
      totalData: '168 GB',
      calls: 'Unlimited Calls',
      sms: '100 SMS / Day',
      network: 'True Unlimited 5G',
      badge: 'Netflix 84 Days 🎬',
      ott: ['Netflix (Basic)', 'Unlimited 5G Data'],
      hasNetflix: true,
      cashback: '₹75 Cashback',
      description: '84 Days validity with Netflix Basic included for high-volume users.'
    }
  ],
  airtel: [
    {
      id: 'airtel-299',
      price: 299,
      validity: '28 Days',
      data: '1.5 GB / Day',
      totalData: '42 GB',
      calls: 'Unlimited Calls',
      sms: '100 SMS / Day',
      network: 'Unlimited 5G Data',
      badge: 'Popular ⭐',
      ott: ['Airtel Xstream Play (20+ OTTs)', 'Wynk Music'],
      hasNetflix: false,
      cashback: '₹20 Cashback',
      description: 'Airtel flagship 28 days pack with Xstream OTT suite.'
    },
    {
      id: 'airtel-349',
      price: 349,
      validity: '28 Days',
      data: '2 GB / Day',
      totalData: '56 GB',
      calls: 'Unlimited Calls',
      sms: '100 SMS / Day',
      network: 'Unlimited 5G Data',
      badge: 'Best 2GB 🌟',
      ott: ['Airtel Xstream Play', 'Free Hellotunes'],
      hasNetflix: false,
      cashback: '₹30 Cashback',
      description: '2GB per day with unlimited 5G high-speed connectivity.'
    },
    {
      id: 'airtel-839',
      price: 839,
      validity: '84 Days',
      data: '2 GB / Day',
      totalData: '168 GB',
      calls: 'Unlimited Calls',
      sms: '100 SMS / Day',
      network: 'Unlimited 5G Data',
      badge: 'Hotstar Special 🏏',
      ott: ['Disney+ Hotstar (3 Months)', 'Airtel Xstream'],
      hasNetflix: false,
      cashback: '₹50 Cashback',
      description: '84 Days with Disney+ Hotstar Mobile subscription.'
    }
  ],
  vi: [
    {
      id: 'vi-299',
      price: 299,
      validity: '28 Days',
      data: '1.5 GB / Day + Binge All Night',
      totalData: '42 GB + Unlimited Night Data',
      calls: 'Unlimited Calls',
      sms: '100 SMS / Day',
      network: 'Vi GIGAnet 4G',
      badge: 'Hero Unlimited 🦸',
      ott: ['Vi Movies & TV', 'Weekend Data Rollover'],
      hasNetflix: false,
      cashback: '₹25 Cashback',
      description: 'Unlimited data from 12 AM to 6 AM with Weekend Rollover.'
    },
    {
      id: 'vi-365',
      price: 365,
      validity: '28 Days',
      data: '2 GB / Day',
      totalData: '56 GB',
      calls: 'Unlimited Calls',
      sms: '100 SMS / Day',
      network: 'Vi GIGAnet 4G',
      badge: 'Hotstar Special 🍿',
      ott: ['Disney+ Hotstar Mobile', 'Binge All Night'],
      hasNetflix: false,
      cashback: '₹35 Cashback',
      description: '2GB/Day + Disney+ Hotstar + Unlimited Night data.'
    }
  ]
};

// =========================================================================
// MASTER AI ORCHESTRATOR & AGENT SQUAD ENGINE
// =========================================================================
class PaytmAgentOrchestrator {
  constructor() {
    this.activePlan = null;
    this.extractedConstraints = {};
    this.detectedLanguage = 'mr'; // 'mr', 'hi', 'en'
    this.activeMode = 'ACTION'; // 'ACTION' or 'RESOLVE'
  }

  // 1. Language Detector
  detectLanguage(text) {
    const marathiKeywords = ['मला', 'करायचं', 'आहे', 'पाहिजे', 'पैसे', 'कट', 'झाले', 'दाखव', 'करा', 'नाही', 'बजेट', 'दिवस', 'द्या'];
    const hindiKeywords = ['मुझे', 'करना', 'है', 'चाहिए', 'पैसे', 'कट', 'गए', 'दिखाओ', 'रिचार्ज', 'दिन', 'बताओ'];
    
    const lower = text.toLowerCase();
    const hasMarathi = marathiKeywords.some(w => lower.includes(w));
    const hasHindi = hindiKeywords.some(w => lower.includes(w));

    if (hasMarathi) return 'mr';
    if (hasHindi) return 'hi';
    return 'en';
  }

  // 2. Intent & Constraint Extractor
  extractConstraints(text) {
    const lower = text.toLowerCase();
    const constraints = {
      operator: 'jio',
      budget: null,
      dataDaily: null,
      ott: [],
      wantsNetflix: false,
      mode: 'ACTION',
      serviceType: 'recharge',
      targetMobile: '9820123456'
    };

    // Determine Mode: Action vs Resolve
    if (lower.includes('cut') || lower.includes('कट') || lower.includes('pending') || 
        lower.includes('failed') || lower.includes('refund') || lower.includes('अडकले') || 
        lower.includes('झाला नाही') || lower.includes('issue') || lower.includes('complaint')) {
      constraints.mode = 'RESOLVE';
      constraints.serviceType = 'dispute';
      return constraints;
    }

    // Travel Intent
    if (lower.includes('flight') || lower.includes('train') || lower.includes('bus') || 
        lower.includes('ticket') || lower.includes('mumbai') || lower.includes('pune') || lower.includes('तिकीट')) {
      constraints.serviceType = 'travel';
      return constraints;
    }

    // Bill Intent
    if (lower.includes('bill') || lower.includes('light') || lower.includes('electricity') || 
        lower.includes('msedcl') || lower.includes('वीज') || lower.includes('बिल')) {
      constraints.serviceType = 'bill';
      return constraints;
    }

    // Recharge Intent — Extract Operator
    if (lower.includes('airtel') || lower.includes('एअरटेल')) {
      constraints.operator = 'airtel';
    } else if (lower.includes('vi') || lower.includes('vodafone') || lower.includes('idea') || lower.includes('व्होडाफोन')) {
      constraints.operator = 'vi';
    } else {
      constraints.operator = 'jio';
    }

    // Extract Budget
    const numMatches = text.match(/\d{3,4}/g);
    if (numMatches && numMatches.length > 0) {
      // Find numbers that look like prices (~200 - 1500)
      const foundPrice = numMatches.map(Number).find(n => n >= 100 && n <= 2000);
      if (foundPrice) constraints.budget = foundPrice;
    }
    if (!constraints.budget) {
      if (lower.includes('300')) constraints.budget = 300;
      else if (lower.includes('500')) constraints.budget = 500;
      else constraints.budget = 300; // sensible default
    }

    // Extract Data Requirement
    if (lower.includes('2gb') || lower.includes('2 gb') || lower.includes('२gb') || lower.includes('दोन gb')) {
      constraints.dataDaily = '2 GB / Day';
    } else if (lower.includes('1.5gb') || lower.includes('1.5 gb') || lower.includes('दीड gb')) {
      constraints.dataDaily = '1.5 GB / Day';
    } else if (lower.includes('2.5gb') || lower.includes('2.5 gb')) {
      constraints.dataDaily = '2.5 GB / Day';
    } else {
      constraints.dataDaily = '2 GB / Day';
    }

    // Extract OTT
    if (lower.includes('netflix') || lower.includes('नेटफ्लिक्स')) {
      constraints.ott.push('Netflix');
      constraints.wantsNetflix = true;
    }
    if (lower.includes('hotstar') || lower.includes('हॉटस्टार') || lower.includes('disney')) {
      constraints.ott.push('Disney+ Hotstar');
    }
    if (lower.includes('prime') || lower.includes('प्राइम')) {
      constraints.ott.push('Amazon Prime');
    }

    return constraints;
  }

  // 3. Plan Matching Algorithm (Finding the Perfect Fit)
  findBestPlan(constraints) {
    const list = TELECOM_PLANS_DB[constraints.operator] || TELECOM_PLANS_DB.jio;
    
    // Exact or closest match
    let candidates = [...list];

    // Priority 1: If user specifically asked for Netflix, find Netflix plan
    if (constraints.wantsNetflix) {
      const netflixPlan = candidates.find(p => p.hasNetflix && Math.abs(p.price - constraints.budget) <= 150);
      if (netflixPlan) return { best: netflixPlan, alternatives: candidates.filter(p => p.id !== netflixPlan.id) };
    }

    // Priority 2: Closest price to budget with required data
    let sorted = candidates.sort((a, b) => {
      const diffA = Math.abs(a.price - constraints.budget);
      const diffB = Math.abs(b.price - constraints.budget);
      return diffA - diffB;
    });

    return {
      best: sorted[0],
      alternatives: sorted.slice(1, 4)
    };
  }

  // 4. Main Query Processor
  processQuery(query) {
    this.detectedLanguage = this.detectLanguage(query);
    this.extractedConstraints = this.extractConstraints(query);

    const langCode = this.detectedLanguage === 'mr' ? 'mr-IN' : (this.detectedLanguage === 'hi' ? 'hi-IN' : 'en-IN');
    paytm.currentLanguage = langCode;

    if (this.extractedConstraints.mode === 'RESOLVE') {
      this.renderResolveMode(query);
    } else if (this.extractedConstraints.serviceType === 'travel') {
      this.renderTravelMode(query);
    } else if (this.extractedConstraints.serviceType === 'bill') {
      this.renderBillMode(query);
    } else {
      this.renderRechargeMode(query);
    }
  }

  // 5. Render Mobile Recharge (Flagship Paytm ONE Flow)
  renderRechargeMode(query) {
    const { best, alternatives } = this.findBestPlan(this.extractedConstraints);
    this.activePlan = best;

    // AI Verbal / Text Response in Detected Language
    let voiceMsg = '';
    let aiSpeechText = '';

    if (this.detectedLanguage === 'mr') {
      voiceMsg = `मी तुमच्यासाठी ${this.extractedConstraints.operator.toUpperCase()} चा बेस्ट ₹${best.price} चा ${best.data} प्लॅन निवडला आहे. रिचार्ज मंजूर करायचा का?`;
      aiSpeechText = `मी तुमच्या मागणीनुसार <strong>${this.extractedConstraints.operator.toUpperCase()}</strong> चा सर्वात योग्य <strong>₹${best.price}</strong> चा प्लॅन शोधला आहे! यामध्ये <strong>${best.data}</strong>, <strong>${best.network}</strong> आणि OTT ॲक्सेस उपलब्ध आहे. खालील तपशील तपासून रिचार्ज मंजूर (Approve) करा.`;
    } else if (this.detectedLanguage === 'hi') {
      voiceMsg = `मैंने आपके लिए ${this.extractedConstraints.operator.toUpperCase()} का बेस्ट ₹${best.price} का ${best.data} प्लान चुना है। क्या रिचार्ज कन्फर्म करें?`;
      aiSpeechText = `मैंने आपकी मांग के अनुसार <strong>${this.extractedConstraints.operator.toUpperCase()}</strong> का सबसे बेस्ट <strong>₹${best.price}</strong> का प्लान चुना है! इसमें <strong>${best.data}</strong>, <strong>${best.network}</strong> और OTT शामिल है। कृपया रिचार्ज अप्रूव करें।`;
    } else {
      voiceMsg = `I found the best match ${this.extractedConstraints.operator.toUpperCase()} ₹${best.price} plan with ${best.data}. Ready to approve recharge?`;
      aiSpeechText = `Matched top plan for <strong>${this.extractedConstraints.operator.toUpperCase()}</strong> at <strong>₹${best.price}</strong> featuring <strong>${best.data}</strong>, <strong>${best.network}</strong>, and OTT perks. Please review and approve below.`;
    }

    // Speak out loud!
    paytm.speakText(voiceMsg);

    // Render HTML inside Workspace
    const container = document.getElementById('workspace-dynamic-content');
    if (!container) return;

    container.innerHTML = `
      <!-- 1. AI Assistant Message Header -->
      <div class="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-lg border border-white/80 animate-in fade-in slide-in-from-top-4 duration-300">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-[#002970] to-[#00b9f1] flex items-center justify-center text-white text-xl shadow-md shrink-0">
            🤖
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-black tracking-wider text-[#002970] uppercase">Paytm ONE • AI Commander</span>
              <span class="text-[10px] font-bold bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full">
                🌐 ${this.detectedLanguage === 'mr' ? 'मराठी (Detected)' : (this.detectedLanguage === 'hi' ? 'हिंदी' : 'English')}
              </span>
              <span class="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                ⚡ Action Mode
              </span>
            </div>
            <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">${aiSpeechText}</p>
          </div>
        </div>

        <!-- Detected Constraints & Filter Badges -->
        <div class="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span class="text-[11px] font-semibold text-slate-400">AI Filters:</span>
          <span class="inline-flex items-center gap-1 bg-[#002970]/10 text-[#002970] font-bold text-xs px-2.5 py-1 rounded-lg">
            📱 ${this.extractedConstraints.operator.toUpperCase()}
          </span>
          <span class="inline-flex items-center gap-1 bg-cyan-100 text-cyan-800 font-bold text-xs px-2.5 py-1 rounded-lg">
            💰 Budget: ~₹${this.extractedConstraints.budget}
          </span>
          <span class="inline-flex items-center gap-1 bg-blue-100 text-blue-800 font-bold text-xs px-2.5 py-1 rounded-lg">
            📶 ${this.extractedConstraints.dataDaily || '2 GB/Day'}
          </span>
          ${this.extractedConstraints.ott.length > 0 ? `
            <span class="inline-flex items-center gap-1 bg-purple-100 text-purple-800 font-bold text-xs px-2.5 py-1 rounded-lg">
              🍿 ${this.extractedConstraints.ott.join(', ')}
            </span>
          ` : `
            <span class="inline-flex items-center gap-1 bg-slate-100 text-slate-700 font-bold text-xs px-2.5 py-1 rounded-lg">
              🍿 OTT Suite Included
            </span>
          `}
          <span class="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-1 rounded-lg">
            🎁 ${best.cashback}
          </span>
        </div>
      </div>

      <!-- 2. Flagship Plan Recommendation Card (Main Spotlight) -->
      <div class="bg-gradient-to-br from-white via-cyan-50/40 to-blue-50/60 rounded-2xl p-5 sm:p-6 shadow-xl border-2 border-[#00b9f1]/40 relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <!-- Star Match Ribbon -->
        <div class="absolute top-0 right-0 bg-gradient-to-l from-[#002970] to-[#00b9f1] text-white text-[11px] font-black uppercase tracking-wider px-4 py-1.5 rounded-bl-xl shadow-md">
          ${best.badge}
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl sm:text-4xl font-black text-[#002970]">₹${best.price}</span>
              <span class="text-xs text-slate-400 line-through">₹${best.price + 50}</span>
              <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                100% Perfect Match
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-1 font-medium">${best.description}</p>
          </div>

          <div class="text-left sm:text-right">
            <span class="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">Mobile Number</span>
            <span class="text-sm font-bold text-[#002970]">${this.extractedConstraints.targetMobile}</span>
            <span class="text-[10px] text-slate-500 block">Prepaid • Maharashtra & Goa</span>
          </div>
        </div>

        <!-- Plan Specifications Grid -->
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
            <span class="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">5G Speed</span>
            <span class="text-sm sm:text-base font-black text-emerald-600">${best.network}</span>
          </div>
        </div>

        <!-- Perks & OTT Subscriptions -->
        <div class="mt-4 p-3 bg-white/90 rounded-xl border border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span class="text-base">🍿</span>
            <span class="text-xs font-bold text-slate-700">Included OTT:</span>
            <span class="text-xs text-[#002970] font-semibold">${best.ott.join(' • ')}</span>
          </div>
          <div class="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
            ⚡ ${best.cashback}
          </div>
        </div>

        <!-- 3. Human Approval Section (UNWIND Security Governance) -->
        <div class="mt-6 pt-4 border-t border-slate-200/80">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="text-xs font-bold text-[#002970]">Human Approval Required (UNWIND Governance)</span>
            </div>
            <span class="text-[11px] text-slate-400">NPCI 256-bit Secure</span>
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-3">
            <!-- Glowing Approve Button -->
            <button onclick="window.agentEngine.openPinModal(${best.price}, '${this.extractedConstraints.operator.toUpperCase()}', '${best.validity}')"
                    class="interactive-btn w-full sm:flex-1 py-3.5 px-6 rounded-xl font-black text-sm text-white bg-gradient-to-r from-[#002970] via-[#0047a1] to-[#00b9f1] hover:brightness-110 shadow-lg shadow-blue-900/25 flex items-center justify-center gap-2">
              <span>✅</span>
              <span>${this.detectedLanguage === 'mr' ? 'मंजूर करा आणि ₹' + best.price + ' भरा (Pay)' : (this.detectedLanguage === 'hi' ? 'स्वीकार करें और ₹' + best.price + ' भरें' : 'Approve & Pay ₹' + best.price)}</span>
            </button>

            <!-- Cancel / Change Plan Button -->
            <button onclick="window.agentEngine.showAlternativePlans()"
                    class="interactive-btn w-full sm:w-auto py-3.5 px-5 rounded-xl font-bold text-xs sm:text-sm text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center gap-1.5">
              <span>🔄</span>
              <span>${this.detectedLanguage === 'mr' ? 'इतर प्लॅन दाखवा' : 'View Alternatives'}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 4. Alternative Matching Plans Carousel -->
      <div id="alternative-plans-row" class="hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div class="text-xs font-bold text-[#002970] mb-2 flex items-center justify-between">
          <span>Alternative Matching Plans:</span>
          <span class="text-[11px] text-slate-400">Click any plan to select</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          ${alternatives.map(alt => `
            <div onclick="window.agentEngine.switchPlan('${alt.id}')"
                 class="interactive-btn p-3 bg-white/95 rounded-xl border border-slate-200 hover:border-[#00b9f1] cursor-pointer shadow-xs transition-all text-left">
              <div class="flex items-center justify-between mb-1">
                <span class="text-base font-black text-[#002970]">₹${alt.price}</span>
                <span class="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">${alt.validity}</span>
              </div>
              <div class="text-xs font-bold text-[#00b9f1]">${alt.data}</div>
              <div class="text-[11px] text-slate-500 truncate mt-1">${alt.ott.join(', ')}</div>
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

  switchPlan(planId) {
    const list = TELECOM_PLANS_DB[this.extractedConstraints.operator] || TELECOM_PLANS_DB.jio;
    const found = list.find(p => p.id === planId);
    if (found) {
      this.activePlan = found;
      paytm.playSound('chime');
      this.renderRechargeMode(`recharge ${this.extractedConstraints.operator} ${found.price}`);
    }
  }

  // 6. Interactive Paytm UPI PIN Modal & Instant Execution
  openPinModal(amount, operator, validity) {
    paytm.playSound('click');
    const modal = document.getElementById('upi-pin-modal');
    if (!modal) return;

    document.getElementById('modal-pay-amount').textContent = `₹${amount}`;
    document.getElementById('modal-operator-name').textContent = `${operator} Prepaid Recharge (${validity})`;
    
    // Clear PIN display
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

    // Auto submit on 4th digit
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

    // Show processing toast
    paytm.showToast('Connecting to NPCI & Telecom Switch...', 'ai', '🔄');

    setTimeout(() => {
      // PLAY ICONIC PAYTM SOUND
      paytm.playSound('paytm_success');

      // Voice confirmation
      const successVoice = this.detectedLanguage === 'mr'
        ? `पेटीएम वर ₹${this.activePlan ? this.activePlan.price : 299} चा रिचार्ज यशस्वी झाला!`
        : `Paytm par ₹${this.activePlan ? this.activePlan.price : 299} prapt hue! Recharge successful.`;
      paytm.speakText(successVoice);

      // Render Receipt & Scratch Card Screen
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
        <!-- Big Animated Green Checkmark -->
        <div class="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-4xl text-emerald-600 shadow-md animate-bounce">
          ✓
        </div>

        <h2 class="text-2xl sm:text-3xl font-black text-[#002970] mt-4">
          ${this.detectedLanguage === 'mr' ? 'रिचार्ज यशस्वी झाला!' : 'Recharge Successful!'}
        </h2>
        <p class="text-sm text-slate-500 mt-1">
          ₹${this.activePlan ? this.activePlan.price : 299} paid to ${this.extractedConstraints.operator.toUpperCase()} Prepaid
        </p>

        <!-- Receipt Metadata Grid -->
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
            <span class="font-bold text-slate-800">${this.extractedConstraints.targetMobile}</span>
          </div>
          <div class="flex justify-between py-1">
            <span class="text-slate-500">Paid Via</span>
            <span class="font-bold text-[#002970]">Paytm UPI • SBI XX4821</span>
          </div>
        </div>

        <!-- Interactive Paytm Cashback Scratch Card -->
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

        <!-- Next Actions -->
        <div class="mt-6 flex justify-center gap-3">
          <button onclick="window.agentEngine.processQuery('Recharge another Jio')" 
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

  // 7. Resolve Mode (Dispute Resolution Flow)
  renderResolveMode(query) {
    let voiceMsg = this.detectedLanguage === 'mr'
      ? `मी तुमचा पेंडिंग ट्रॅन्झॅक्शन तपासत आहे. You.com द्वारे रिफंड पॉलिसी शोधली आहे.`
      : `Investigating your pending transaction. Checking policy citations with You.com.`;
    paytm.speakText(voiceMsg);

    const container = document.getElementById('workspace-dynamic-content');
    if (!container) return;

    container.innerHTML = `
      <div class="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-xl border border-red-200 text-left animate-in fade-in duration-300">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-2xl">🛡️</span>
          <div>
            <h3 class="text-base sm:text-lg font-black text-[#002970]">Paytm Resolve Intelligence Squad</h3>
            <span class="text-xs text-red-600 font-bold">Investigation Active: Pending Payment Issue</span>
          </div>
        </div>

        <div class="bg-red-50/70 rounded-xl p-4 border border-red-100 text-xs text-slate-700 space-y-2">
          <div class="flex justify-between font-bold text-slate-800">
            <span>TXN #PTM7890124 (Jio ₹599)</span>
            <span class="text-amber-600">Status: Pending at Telecom Switch</span>
          </div>
          <p>Bank debited ₹599. Operator confirmation pending. NPCI SLA: Auto-reversed within 24 hours.</p>
        </div>

        <div class="mt-4 p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-slate-700">
          <div class="font-bold text-[#002970] flex items-center gap-1.5 mb-1">
            <span>🔍 You.com Live Policy Verification</span>
            <span class="text-[10px] bg-blue-200 text-blue-900 px-1.5 py-0.5 rounded">Official Citation</span>
          </div>
          <p>"Under NPCI Harmonisation Circular No. 81, any UPI debit without service fulfillment must be reconciled within T+1 days with ₹100/day compensation."</p>
        </div>

        <div class="mt-5 flex flex-col sm:flex-row gap-3">
          <button onclick="paytm.showToast('Live Support Chat Connected via Nexconn SDK!', 'ai', '💬')" 
                  class="interactive-btn flex-1 py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-md flex items-center justify-center gap-2">
            <span>💬</span>
            <span>Connect Live Support (Nexconn Chat SDK)</span>
          </button>
          <button onclick="paytm.showToast('Dispute Ticket #DISP-9482 Opened with SBI & Jio!', 'success', '🎫')" 
                  class="interactive-btn py-3 px-4 rounded-xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300">
            Raise Official Ticket
          </button>
        </div>
      </div>
    `;
  }

  // 8. Travel Mode (SerpApi Search Flow)
  renderTravelMode(query) {
    paytm.speakText("Searching live flights and buses using SerpApi.");
    const container = document.getElementById('workspace-dynamic-content');
    if (!container) return;

    container.innerHTML = `
      <div class="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-xl border border-blue-200 text-left animate-in fade-in duration-300">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-2xl">✈️</span>
          <div>
            <h3 class="text-base sm:text-lg font-black text-[#002970]">Paytm Travel Agent (Powered by SerpApi)</h3>
            <span class="text-xs text-[#00b9f1] font-bold">Live Flight & Bus Comparison</span>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div class="flex justify-between font-bold text-sm text-[#002970]">
              <span>IndiGo 6E-5321</span>
              <span class="text-emerald-600">₹2,499</span>
            </div>
            <div class="text-xs text-slate-500 mt-1">Pune (PNQ) → Mumbai (BOM) • 08:30 AM</div>
            <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded mt-2 inline-block">Lowest Price on SerpApi</span>
          </div>

          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div class="flex justify-between font-bold text-sm text-[#002970]">
              <span>Shivneri AC Bus</span>
              <span class="text-emerald-600">₹450</span>
            </div>
            <div class="text-xs text-slate-500 mt-1">Swargate → Dadar • Every 30 mins</div>
            <span class="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded mt-2 inline-block">Paytm Travel Instant Ticket</span>
          </div>
        </div>
      </div>
    `;
  }

  // 9. Bill Mode
  renderBillMode(query) {
    paytm.speakText("Electricity bill detected for MSEDCL. Ready to fetch details.");
    const container = document.getElementById('workspace-dynamic-content');
    if (!container) return;

    container.innerHTML = `
      <div class="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-xl border border-amber-200 text-left animate-in fade-in duration-300">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-2xl">⚡</span>
          <div>
            <h3 class="text-base sm:text-lg font-black text-[#002970]">Paytm Bill Pay Agent</h3>
            <span class="text-xs text-amber-600 font-bold">Electricity Bill: MSEDCL Maharashtra</span>
          </div>
        </div>

        <div class="p-4 bg-amber-50/60 rounded-xl border border-amber-200 flex justify-between items-center">
          <div>
            <div class="text-xs text-slate-500">Consumer No: 028491823901</div>
            <div class="text-xl font-black text-[#002970] mt-0.5">Bill Amount: ₹1,420</div>
            <div class="text-[11px] text-red-500 font-semibold">Due Date: 24th Nov 2026</div>
          </div>
          <button onclick="window.agentEngine.openPinModal(1420, 'MSEDCL Electricity', 'Nov Bill')"
                  class="interactive-btn px-4 py-2.5 bg-[#002970] text-white font-bold text-xs rounded-xl shadow-md">
            Pay ₹1,420
          </button>
        </div>
      </div>
    `;
  }
}

// Global Agent Engine Instance
window.agentEngine = new PaytmAgentOrchestrator();
