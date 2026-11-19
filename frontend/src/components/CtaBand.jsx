import React from 'react';
import { ArrowRight, User } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function CtaBand({ onSignIn }) {
  return (
    <section className="w-full bg-surface-dark text-on-dark py-20 lg:py-24 border-b border-hairline/10 relative overflow-hidden text-center">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[800px] mx-auto px-4 sm:px-6 relative space-y-8">
        
        <h2 className="font-display font-normal text-3xl sm:text-5xl text-white tracking-display-lg leading-[1.08]">
          Ready to experience the easier way to pay?
        </h2>

        <p className="text-[17px] sm:text-[19px] text-on-dark-soft max-w-xl mx-auto leading-relaxed">
          Sign in to your account to recharge your phone, pay bills, or investigate pending payment refunds with our AI assistant.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => {
              playSound('chime');
              onSignIn();
            }}
            className="btn-pill h-14 px-8 text-[16px] font-semibold text-white bg-primary hover:bg-primary-active transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            <User className="w-4 h-4" />
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#services"
            onClick={() => playSound('click')}
            className="btn-pill h-14 px-7 text-[16px] font-semibold text-white bg-surface-dark-elevated hover:bg-surface-dark-elevated/80 border border-hairline/15 transition-colors flex items-center gap-2"
          >
            <span>View All Services</span>
          </a>
        </div>

      </div>
    </section>
  );
}
