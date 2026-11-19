// Web Speech API for Multi-lingual Speech-to-Text and Text-to-Speech

export const speak = (text, lang = 'hi-IN') => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const prefix = lang.split('-')[0];
    const matchingVoice = voices.find(
      v => v.lang.startsWith(prefix) || v.name.includes('Hindi') || v.name.includes('India')
    );
    if (matchingVoice) utterance.voice = matchingVoice;

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis error:', e);
  }
};

export class VoiceRecognition {
  constructor(onResult, onStatusChange) {
    this.recognition = null;
    this.isListening = false;
    this.onResult = onResult;
    this.onStatusChange = onStatusChange;

    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;

        this.recognition.onstart = () => {
          this.isListening = true;
          if (this.onStatusChange) this.onStatusChange(true);
        };

        this.recognition.onresult = (event) => {
          let interim = '';
          let final = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final += event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          if (this.onResult) this.onResult(final || interim, Boolean(final));
        };

        this.recognition.onerror = () => {
          this.isListening = false;
          if (this.onStatusChange) this.onStatusChange(false);
        };

        this.recognition.onend = () => {
          this.isListening = false;
          if (this.onStatusChange) this.onStatusChange(false);
        };
      }
    }
  }

  start(lang = 'hi-IN') {
    if (!this.recognition) return false;
    this.recognition.lang = lang;
    try {
      this.recognition.start();
      return true;
    } catch {
      return false;
    }
  }

  stop() {
    if (!this.recognition) return;
    try {
      this.recognition.stop();
    } catch {}
  }
}
