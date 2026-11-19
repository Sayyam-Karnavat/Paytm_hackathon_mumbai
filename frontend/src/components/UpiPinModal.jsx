import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Gift, ArrowRight } from 'lucide-react';
import { playSound } from '../utils/audio';
import { speak } from '../utils/speech';

export default function UpiPinModal({ paymentData, onClose, onComplete }) {
  const [pin, setPin] = useState('');
  const [status, setStatus] = useState('entering'); // 'entering' | 'processing' | 'success'
  const [scratchRevealed, setScratchRevealed] = useState(false);

  const amount = paymentData?.amount || 299;
  const operator = paymentData?.operator || 'Jio';
  const validity = paymentData?.validity || '28 Days';

  const handleKeypad = (digit) => {
    playSound('keypad');
    if (digit === 'back') {
      setPin((prev) => prev.slice(0, -1));
    } else if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        setTimeout(() => executePayment(), 300);
      }
    }
  };

  const executePayment = () => {
    setStatus('processing');
    playSound('chime');

    setTimeout(() => {
      setStatus('success');
      playSound('paytm_success');
      
      const voiceMsg = `Paytm par ₹${amount} prapt hue! Recharge safalta-poorvak ho gaya hai.`;
      speak(voiceMsg, 'hi-IN');
    }, 1200);
  };

  const txnId = 'PTM' + Math.floor(100000000 + Math.random() * 900000000);
  const opRef = 'OPR' + Math.floor(10000000 + Math.random() * 90000000);

  return (
    <div className="fixed inset-0 z-50 bg-ink/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-white rounded-xl border border-hairline shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        {status !== 'processing' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted hover:text-ink text-sm font-bold"
          >
            ✕
          </button>
        )}

        {/* 1. ENTERING PIN STATE */}
        {status === 'entering' && (
          <div className="space-y-5">
            <div className="flex items-center justify-center gap-1.5">
              <span className="font-bold text-xl text-ink">paytm</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase font-bold">
                UPI
              </span>
            </div>

            <div className="bg-surface-soft p-4 rounded-lg border border-hairline">
              <div className="font-mono text-3xl font-semibold text-ink">₹{amount}</div>
              <div className="text-xs text-body font-medium mt-1">{operator} Prepaid ({validity})</div>
              <div className="text-[11px] text-muted font-mono mt-0.5">Debit: State Bank of India •••• 4821</div>
            </div>

            <div>
              <div className="text-xs font-semibold text-ink mb-3">ENTER 4-DIGIT UPI PIN</div>
              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-3.5 h-3.5 rounded-full transition-all ${
                      i < pin.length ? 'bg-primary scale-110' : 'bg-surface-strong border border-hairline'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-[220px] mx-auto pt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypad(digit)}
                  className="h-11 rounded-md bg-surface-soft hover:bg-surface-strong border border-hairline font-mono font-medium text-lg text-ink transition-colors"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleKeypad('back')}
                className="h-11 rounded-md bg-surface-soft hover:bg-surface-strong border border-hairline text-semantic-down font-mono text-sm transition-colors"
              >
                ⌫
              </button>
              <button
                type="button"
                onClick={() => handleKeypad('0')}
                className="h-11 rounded-md bg-surface-soft hover:bg-surface-strong border border-hairline font-mono font-medium text-lg text-ink transition-colors"
              >
                0
              </button>
              <button
                type="button"
                onClick={executePayment}
                className="h-11 rounded-md bg-primary hover:bg-primary-active text-white font-mono text-sm transition-colors flex items-center justify-center"
              >
                ✓
              </button>
            </div>

            <div className="flex items-center justify-center gap-1 text-[11px] text-muted pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-semantic-up" />
              <span>NPCI 256-bit Certified Rail</span>
            </div>
          </div>
        )}

        {/* 2. PROCESSING STATE */}
        {status === 'processing' && (
          <div className="py-10 space-y-4">
            <div className="w-12 h-12 border-3 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
            <div className="space-y-1">
              <div className="font-semibold text-ink text-sm">NPCI Bank Switch Reconciling...</div>
              <p className="text-xs text-muted">Authorizing transaction with telecom switch</p>
            </div>
          </div>
        )}

        {/* 3. SUCCESS RECEIPT STATE */}
        {status === 'success' && (
          <div className="space-y-5 animate-in zoom-in-95 duration-300">
            <div className="w-14 h-14 bg-semantic-up/10 text-semantic-up rounded-full flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>

            <div>
              <h3 className="font-sans font-bold text-xl text-ink">Payment Successful</h3>
              <p className="text-xs text-muted mt-0.5">₹{amount} received for {operator} Prepaid</p>
            </div>

            <div className="bg-surface-soft p-3.5 rounded-lg border border-hairline text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-muted">Transaction ID:</span>
                <span className="text-ink font-semibold">#{txnId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Operator Ref:</span>
                <span className="text-ink font-semibold">{opRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Mobile Number:</span>
                <span className="text-ink font-semibold">98201 23456</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-hairline">
                <span className="text-muted">Paid Via:</span>
                <span className="text-primary font-semibold">Paytm UPI • SBI XX4821</span>
              </div>
            </div>

            {/* Interactive Cashback Scratch Card */}
            <div
              onClick={() => {
                if (!scratchRevealed) {
                  playSound('chime');
                  setScratchRevealed(true);
                }
              }}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                scratchRevealed 
                  ? 'bg-semantic-up/10 border-semantic-up/30 text-semantic-up' 
                  : 'bg-primary text-white border-primary hover:bg-primary-active'
              }`}
            >
              {!scratchRevealed ? (
                <div className="space-y-1">
                  <Gift className="w-5 h-5 mx-auto" />
                  <div className="text-xs font-semibold">Tap to Scratch Paytm Cashback Card</div>
                  <div className="text-[10px] opacity-80">Guaranteed Hackathon Reward</div>
                </div>
              ) : (
                <div className="space-y-1 animate-in zoom-in-95">
                  <div className="text-xl font-bold font-mono">₹25 Won!</div>
                  <div className="text-[11px] font-sans">Credited instantly to your Paytm Wallet</div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                playSound('click');
                onClose();
              }}
              className="btn-pill w-full h-11 text-xs font-semibold text-white bg-ink hover:bg-ink/90 transition-colors"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
