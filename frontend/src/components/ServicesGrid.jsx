import React from 'react';
import { Smartphone, Zap, Car, Tv, Shield, Plane, ArrowRight, Check } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function ServicesGrid({ onOpenService, onPromptAi }) {
  const services = [
    {
      id: 'recharge',
      title: 'Mobile Recharge',
      sub: 'Jio, Airtel, Vi & BSNL prepaid packs with instant true 5G benefits.',
      icon: Smartphone,
      accent: 'text-primary',
      badge: 'Instant 5G',
      actionPrompt: 'Recharge Jio 299 with 2GB daily data'
    },
    {
      id: 'electricity',
      title: 'Electricity & Utilities',
      sub: 'MSEDCL, Tata Power, Adani Electricity, BESCOM and 80+ state boards.',
      icon: Zap,
      accent: 'text-accent-yellow',
      badge: 'Auto-Fetch',
      actionPrompt: 'Pay my electricity bill for MSEDCL'
    },
    {
      id: 'fastag',
      title: 'FASTag Highway Toll',
      sub: 'Instant highway balance top-ups across all bank issuers with zero surcharge.',
      icon: Car,
      accent: 'text-primary',
      badge: 'Zero Surcharge',
      actionPrompt: 'Recharge FASTag MH 12 AB 8921 for ₹500'
    },
    {
      id: 'dth',
      title: 'DTH Satellite Entertainment',
      sub: 'Tata Play, Airtel Digital TV, Dish TV & Sun Direct recharge bundles.',
      icon: Tv,
      accent: 'text-body',
      badge: 'Instant Signal',
      actionPrompt: 'Recharge Tata Play subscriber ID 1092837461'
    },
    {
      id: 'insurance',
      title: 'Insurance Premium',
      sub: 'LIC, HDFC Life, ICICI Pru with institutional receipt reconciliation.',
      icon: Shield,
      accent: 'text-semantic-up',
      badge: 'Verified Receipt',
      actionPrompt: 'Fetch and pay LIC insurance policy 849201948'
    },
    {
      id: 'travel',
      title: 'Travel: Flights & Buses',
      sub: 'SerpApi real-time Google Flights & inter-city bus ticketing comparison.',
      icon: Plane,
      accent: 'text-primary',
      badge: 'SerpApi Live',
      actionPrompt: 'Cheapest flights from Pune to Mumbai this Friday'
    }
  ];

  return (
    <section id="services" className="w-full bg-canvas py-20 lg:py-24 border-b border-hairline">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <div className="inline-block bg-surface-strong text-ink font-semibold text-[12px] uppercase tracking-wider px-3 py-1 rounded-pill mb-3">
            All Everyday Services
          </div>
          <h2 className="font-display font-normal text-3xl sm:text-5xl text-ink tracking-display-lg leading-[1.05]">
            Everything you need, in one place.
          </h2>
          <p className="text-[17px] text-body mt-4 leading-relaxed">
            Recharge your phone, clear electricity bills, top up FASTag, or book travel. Click any service to pay directly, or let our AI assistant handle it for you.
          </p>
        </div>

        {/* 3-Up Feature Grid (As per DESIGN.md) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white border border-hairline rounded-xl p-8 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:border-hairline/80 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-full bg-surface-strong flex items-center justify-center">
                      <Icon className={`w-6 h-6 ${item.accent}`} />
                    </div>
                    <span className="text-[11px] font-semibold tracking-wider font-mono px-2.5 py-1 rounded-pill bg-surface-strong text-ink">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-sans font-semibold text-xl text-ink mb-2">
                    {item.title}
                  </h3>

                  <p className="text-[15px] text-body leading-relaxed">
                    {item.sub}
                  </p>
                </div>

                {/* Actions: Direct Drawer vs AI Prompt */}
                <div className="pt-6 mt-6 border-t border-hairline-soft flex items-center justify-between">
                  <button
                    onClick={() => {
                      playSound('click');
                      onOpenService(item.id);
                    }}
                    className="text-[14px] font-semibold text-ink hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span>Instant Pay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      playSound('chime');
                      onPromptAi(item.actionPrompt);
                    }}
                    className="text-[12px] font-semibold text-primary hover:text-primary-active bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-pill transition-colors"
                  >
                    Ask AI Agent
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
