import React from 'react';
import { Cpu, ShieldCheck, Headphones, Lock, Check, FileText } from 'lucide-react';

export default function InstitutionalGrid() {
  const pillars = [
    {
      title: 'Understands Everyday Language',
      body: 'Speak or type naturally in Hindi, Hinglish, Marathi, or English. You never have to scroll through dozens of confusing recharge packs or bills.',
      icon: Cpu,
      meta: 'Powered by Groq Fast LLM'
    },
    {
      title: 'Verified Official Bank Rules',
      body: 'When your payment is stuck, our assistant references verified RBI and NPCI guidelines so you know the exact turnaround time for your refund.',
      icon: FileText,
      meta: 'Powered by You.com Cited Research'
    },
    {
      title: 'Instant Live Human Support',
      body: 'If your dispute needs personalized attention, the AI immediately connects you to a real Paytm resolution specialist with your transaction logs pre-verified.',
      icon: Headphones,
      meta: 'Powered by Nexconn Chat SDK'
    }
  ];

  return (
    <section id="institutional" className="w-full bg-surface-soft py-20 lg:py-24 border-b border-hairline">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <div className="inline-block bg-surface-strong text-ink font-semibold text-[12px] uppercase tracking-wider px-3 py-1 rounded-pill mb-3">
            How Paytm AI Helps You
          </div>
          <h2 className="font-display font-normal text-3xl sm:text-5xl text-ink tracking-display-lg leading-[1.05]">
            Built to be fast, honest, and helpful.
          </h2>
          <p className="text-[17px] text-body mt-4 leading-relaxed">
            No robotic confusion or endless phone menus. Clear answers, live price checks, and instant human support when you need it.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-hairline rounded-xl p-8 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-full bg-surface-strong flex items-center justify-center text-primary mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-sans font-semibold text-lg text-ink mb-2">
                    {p.title}
                  </h3>
                  <p className="text-[15px] text-body leading-relaxed">
                    {p.body}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-hairline-soft font-mono text-[12px] text-muted flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-semantic-up" />
                  <span>{p.meta}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
