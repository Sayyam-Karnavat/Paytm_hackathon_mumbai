import React from 'react';
import { User, ArrowRight, ShieldCheck } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function TopNav({ onSignIn }) {
  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-canvas border-b border-hairline/80">
      <div className="max-w-[1200px] h-full mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        
        {/* Brand Wordmark & Tag */}
        <div className="flex items-center gap-6">
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm tracking-tight shadow-xs">
              P
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-sans font-bold text-xl text-ink tracking-tight">paytm</span>
              <span className="text-[11px] font-mono font-medium text-primary uppercase tracking-wider bg-surface-strong px-2 py-0.5 rounded-full">
                ONE
              </span>
            </div>
          </a>

          {/* Navigation Items (Clean & informative) */}
          <nav className="hidden md:flex items-center gap-6 text-[14px] font-medium text-body">
            <a href="#services" className="hover:text-ink transition-colors">Services</a>
            <a href="#services" className="hover:text-ink transition-colors">Recharge & Bills</a>
            <a href="#institutional" className="hover:text-ink transition-colors">Payment Protection</a>
            <a href="#institutional" className="hover:text-ink transition-colors">How It Works</a>
          </nav>
        </div>

        {/* Right: Clean, single Sign In Button to enter Dashboard */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playSound('chime');
              onSignIn();
            }}
            className="btn-pill h-11 px-6 text-[14px] font-semibold text-white bg-primary hover:bg-primary-active transition-colors flex items-center gap-2 shadow-xs"
          >
            <User className="w-4 h-4" />
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
}
