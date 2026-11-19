import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Bot, CheckCircle2 } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function HeroBand({ onSignInWithQuery, onSignIn }) {
  const samplePrompts = [
    { label: "Jio 2GB/Day + Netflix", text: "Jio 300 budget 2gb daily data aur netflix recharge" },
    { label: "Check Failed UPI ₹599", text: "Paise cut ho gaye par recharge nahi hua, ₹599 refund check karo" },
    { label: "MSEDCL Power Bill", text: "Pay my electricity bill for MSEDCL" },
    { label: "FASTag Balance Top-up", text: "Recharge FASTag MH 12 AB 8921" }
  ];

  return (
    <section className="relative w-full bg-surface-dark text-on-dark py-20 lg:py-24 overflow-hidden border-b border-hairline/10">
      
      {/* Background subtle radial glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8">
            
            <div className="inline-flex items-center gap-2 bg-surface-dark-elevated border border-hairline/10 px-3.5 py-1.5 rounded-pill text-[12px] font-semibold text-on-dark-soft tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-semantic-up animate-pulse" />
              <span>Paytm AI Platform • Powered by SQLite & Pure AI</span>
            </div>

            <h1 className="font-display font-normal text-4xl sm:text-6xl lg:text-[76px] leading-[1.02] tracking-display-mega text-white">
              Just tell Paytm what you need. AI handles the rest.
            </h1>

            <p className="text-[17px] sm:text-[19px] font-normal leading-relaxed text-on-dark-soft max-w-xl">
              Recharge your phone, settle power bills, or track stuck payments. Sign in to your dashboard to chat with the AI assistant connected directly to your merchant's live database.
            </p>

            {/* CTAs: Clean, zero duplicate "Open AI" actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  playSound('chime');
                  onSignIn();
                }}
                className="btn-pill h-14 px-8 text-[16px] font-semibold text-white bg-primary hover:bg-primary-active transition-all flex items-center gap-2.5 shadow-lg shadow-primary/20"
              >
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#services"
                onClick={() => playSound('click')}
                className="btn-pill h-14 px-7 text-[16px] font-semibold text-white bg-surface-dark-elevated hover:bg-surface-dark-elevated/80 border border-hairline/15 transition-colors flex items-center gap-2"
              >
                <span>Browse Services</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-hairline/10 flex flex-wrap items-center gap-6 text-[13px] text-muted-soft">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-semantic-up" />
                <span>100% Secure Paytm UPI</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-primary font-mono font-semibold">T+1</span>
                <span>Fast Refund for Failed Payments</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-primary" />
                <span>Zero Hallucination SQLite Grounding</span>
              </div>
            </div>

          </div>

          {/* Right Column: Layered Dashboard Preview */}
          <div className="lg:col-span-5 relative">
            <div className="hidden sm:block absolute -top-4 -right-3 w-full h-full bg-surface-dark-elevated/40 border border-hairline/10 rounded-xl transform rotate-2 pointer-events-none" />

            <div className="relative bg-surface-dark-elevated border border-hairline/15 rounded-xl p-6 sm:p-7 shadow-2xl backdrop-blur-md space-y-6">
              
              <div className="flex items-center justify-between border-b border-hairline/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold">
                    P
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-white flex items-center gap-2">
                      <span>Sharma Telecom & Services</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-semantic-up/10 text-semantic-up">Verified</span>
                    </div>
                    <div className="text-[12px] text-muted-soft">Linked Merchant ID: MERCH_SHARMA_01</div>
                  </div>
                </div>

                <div className="text-right font-mono text-[11px] text-muted-soft">
                  <div>DATABASE</div>
                  <div className="text-semantic-up font-semibold">SQLite Active</div>
                </div>
              </div>

              {/* Sample Queries */}
              <div className="space-y-3">
                <div className="text-xs text-muted-soft font-semibold uppercase tracking-wider">
                  Try asking in the dashboard:
                </div>
                <div className="space-y-2">
                  {samplePrompts.map((p, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        playSound('click');
                        onSignInWithQuery(p.text);
                      }}
                      className="p-3 bg-surface-dark rounded-md border border-hairline/10 text-xs text-on-dark-soft hover:text-white hover:border-primary/40 transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span>"{p.text}"</span>
                      <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0 ml-2" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Card Snapshot */}
              <div className="bg-surface-dark/90 border border-hairline/10 rounded-lg p-4 space-y-2 text-[13px]">
                <div className="flex items-center justify-between text-muted-soft text-[11px]">
                  <span className="font-semibold text-primary uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Live Merchant Plan
                  </span>
                  <span className="font-mono">Catalog ID: jio-299</span>
                </div>

                <div className="flex items-center justify-between bg-surface-dark-elevated p-3 rounded-md border border-hairline/10">
                  <div>
                    <div className="text-white font-semibold">Jio 28 Days Recharge</div>
                    <div className="text-muted-soft text-[12px]">2 GB / Day • True 5G • Unlimited Voice</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-lg font-semibold text-white">₹299</div>
                    <span className="text-[10px] text-semantic-up font-medium">Best Value</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
