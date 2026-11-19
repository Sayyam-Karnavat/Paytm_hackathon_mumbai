import React, { useState } from 'react';
import { MessageSquare, Send, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function NexconnModal({ sessionData, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: 'agent',
      text: 'Namaste! I am Priya Sharma from Paytm Tier-2 Dispute Team. I can see your pending recharge for ₹599. Let me check the operator switch logs.',
      time: 'Just now'
    }
  ]);
  const [inputVal, setInputVal] = useState('');

  const appKey = sessionData?.app_key || 'm7ua80gbmcxrm';
  const agentName = sessionData?.assigned_agent?.name || 'Priya Sharma (Resolution Specialist)';

  const handleSend = (e) => {
    e.preventDefault();
    const text = inputVal.trim();
    if (!text) return;

    playSound('click');
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text, time: 'Just now' }
    ]);
    setInputVal('');

    setTimeout(() => {
      playSound('chime');
      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: 'I have verified the telecom settlement log via Nexconn Real-Time Gateway. The reversal token #RT-9481 has been issued. Amount will reflect within T+1 days.',
          time: 'Just now'
        }
      ]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-xl border border-hairline shadow-2xl flex flex-col h-[520px] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 bg-surface-dark text-on-dark flex items-center justify-between border-b border-hairline/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center font-bold text-white text-sm">
              PS
            </div>
            <div>
              <div className="font-semibold text-sm text-white">{agentName}</div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-soft">
                <span className="w-2 h-2 rounded-full bg-semantic-up animate-pulse" />
                <span>Nexconn Chat SDK • Singapore Cluster</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-muted-soft hover:text-white text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center bg-surface-dark-elevated"
          >
            ✕
          </button>
        </div>

        {/* Security & AppKey Banner */}
        <div className="px-4 py-2 bg-surface-soft border-b border-hairline flex items-center justify-between text-[11px] font-mono text-muted">
          <span>AppKey: {appKey}</span>
          <span className="text-semantic-up flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            256-Bit Encrypted
          </span>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-lg leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-surface-soft text-ink border border-hairline rounded-tl-none'
                }`}
              >
                {m.sender === 'agent' && (
                  <span className="font-semibold text-[10px] text-primary block mb-1">
                    Paytm Dispute Specialist:
                  </span>
                )}
                <div>{m.text}</div>
                <div
                  className={`text-[9px] mt-1 text-right ${
                    m.sender === 'user' ? 'text-white/70' : 'text-muted'
                  }`}
                >
                  {m.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-hairline flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type your message to Priya..."
            className="flex-1 text-xs text-ink placeholder:text-muted bg-surface-soft border border-hairline rounded-md px-3 py-2 outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="btn-pill h-9 px-4 text-xs font-semibold text-white bg-primary hover:bg-primary-active transition-colors flex items-center gap-1"
          >
            <span>Send</span>
            <Send className="w-3 h-3" />
          </button>
        </form>

      </div>
    </div>
  );
}
