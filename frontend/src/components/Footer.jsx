import React from 'react';

export default function Footer() {
  const linkGroups = [
    {
      title: 'Paytm ONE',
      links: ['Mobile Recharge', 'Electricity Bills', 'FASTag Recharge', 'DTH Entertainment', 'Travel Booking', 'Insurance Payments']
    },
    {
      title: 'Dispute & Resolve',
      links: ['Transaction Tracker', 'NPCI Auto-Reversal', 'Refund Guidelines', 'You.com Live Policy', 'Nexconn Escalation', 'Grievance Officer']
    },
    {
      title: 'Autonomous AI',
      links: ['Groq LLM Engine', 'SerpApi Integration', 'Natural Language Voice', 'Hindi / Marathi AI', 'Human-in-the-Loop', 'API Documentation']
    },
    {
      title: 'Institutional Rails',
      links: ['UPI Switch Status', 'BBPS Integration', '256-bit Encryption', 'Reconciliation SLA', 'Latency Telemetry', 'RBI Ombudsman']
    },
    {
      title: 'Company',
      links: ['About Paytm', 'Hackathon Mumbai', 'Engineering Blog', 'Press & Media', 'Leadership', 'Careers']
    },
    {
      title: 'Legal & Compliance',
      links: ['Privacy Policy', 'Terms of Service', 'Security Audits', 'Dispute Disclosures', 'Cookie Preferences', 'Regulatory Filings']
    }
  ];

  return (
    <footer className="w-full bg-canvas text-body border-t border-hairline py-16 px-4 sm:px-8">
      <div className="max-w-[1200px] mx-auto space-y-12">
        
        {/* Brand Header */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
            P
          </div>
          <span className="font-sans font-bold text-xl text-ink tracking-tight">paytm</span>
          <span className="text-[11px] font-mono text-primary bg-surface-strong px-2 py-0.5 rounded-full">
            ONE
          </span>
        </div>

        {/* 6-Column Links Grid (As per DESIGN.md) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-[14px]">
          {linkGroups.map((group, idx) => (
            <div key={idx} className="space-y-3">
              <div className="font-semibold text-ink text-sm">
                {group.title}
              </div>
              <ul className="space-y-2">
                {group.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a href="#" className="hover:text-ink transition-colors text-[13px]">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal Band Strip */}
        <div className="pt-8 border-t border-hairline text-[12px] text-muted space-y-3">
          <p className="leading-relaxed">
            Paytm AI Hub & Paytm ONE are trademarks developed for Paytm Hackathon Mumbai 2026. Official payments routing provided via National Payments Corporation of India (NPCI) and licensed Bharat Bill Payment System (BBPS) partners. Verifiable citations powered by You.com; real-time dispute rooms powered by Nexconn Chat SDK; live tariff verification powered by SerpApi.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
            <div>© 2026 Paytm AI Hub. All rights reserved.</div>
            <div className="font-mono text-[11px]">System Status: All Payment Rails Operational (100.0%)</div>
          </div>
        </div>

      </div>
    </footer>
  );
}
