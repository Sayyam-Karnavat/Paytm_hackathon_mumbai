import React, { useState } from 'react';
import { Smartphone, Zap, Car, Tv, Shield, Plane, ArrowRight, User } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function ServiceModal({ serviceId, onClose, onOpenPinModal, onLaunchAiWithPrompt }) {
  const [phone, setPhone] = useState('98201 23456');
  const [operator, setOperator] = useState('Jio');
  const [amount, setAmount] = useState('299');
  const [consumerNo, setConsumerNo] = useState('002948192841');
  const [board, setBoard] = useState('Maharashtra - MSEDCL');
  const [vehicle, setVehicle] = useState('MH 12 AB 8921');
  const [policyNo, setPolicyNo] = useState('849201948');

  const handleCheckout = (e) => {
    e.preventDefault();
    playSound('click');
    onClose();
    onOpenPinModal({
      amount: parseInt(amount) || 299,
      operator: operator || 'Utility Biller',
      validity: 'Standard Cycle',
      language: 'hi'
    });
  };

  const titles = {
    recharge: 'Mobile Recharge',
    electricity: 'Electricity Bill',
    fastag: 'FASTag Highway Toll',
    dth: 'DTH Entertainment',
    insurance: 'Insurance Premium Payment',
    travel: 'Paytm Travel Ticket',
    signin: 'Sign In to Paytm Account'
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-xl border border-hairline shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-hairline pb-4 mb-5">
          <h3 className="font-sans font-bold text-lg text-ink">
            {titles[serviceId] || 'Paytm Service'}
          </h3>
          <button
            onClick={onClose}
            className="text-muted hover:text-ink text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center bg-surface-soft"
          >
            ✕
          </button>
        </div>

        {/* 1. SIGN IN FORM */}
        {serviceId === 'signin' && (
          <form onSubmit={(e) => {
            e.preventDefault();
            playSound('chime');
            alert('Signed in successfully as Akash (+91 98201 23456)');
            onClose();
          }} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase mb-1">Mobile Number or Email</label>
              <input
                type="text"
                defaultValue="+91 98201 23456"
                required
                className="w-full text-sm font-semibold text-ink bg-surface-soft border border-hairline rounded-md px-3.5 py-2.5 outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="btn-pill w-full h-11 text-sm font-semibold text-white bg-primary hover:bg-primary-active transition-colors"
            >
              Secure Sign In
            </button>
          </form>
        )}

        {/* 2. RECHARGE FORM */}
        {serviceId === 'recharge' && (
          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase mb-1">Mobile Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full text-sm font-semibold text-ink bg-surface-soft border border-hairline rounded-md px-3.5 py-2.5 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase mb-1">Operator</label>
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
                {['Jio', 'Airtel', 'Vi', 'BSNL'].map((op) => (
                  <button
                    key={op}
                    type="button"
                    onClick={() => setOperator(op)}
                    className={`py-2 rounded-md border transition-colors ${
                      operator === op ? 'border-primary bg-primary/5 text-primary' : 'border-hairline text-ink hover:bg-surface-soft'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase mb-1">Popular Pack</label>
              <div className="space-y-2">
                {[
                  { price: '299', validity: '28 Days', data: '2 GB / Day • True 5G' },
                  { price: '349', validity: '28 Days', data: '2.5 GB / Day + JioCinema' },
                  { price: '398', validity: '28 Days', data: '2 GB / Day + Netflix' }
                ].map((pack) => (
                  <div
                    key={pack.price}
                    onClick={() => setAmount(pack.price)}
                    className={`p-3 rounded-md border cursor-pointer flex items-center justify-between text-xs transition-colors ${
                      amount === pack.price ? 'border-primary bg-primary/5' : 'border-hairline hover:bg-surface-soft'
                    }`}
                  >
                    <div>
                      <span className="font-mono font-bold text-sm text-ink">₹{pack.price}</span>
                      <span className="text-muted ml-2">({pack.validity})</span>
                      <div className="text-muted mt-0.5">{pack.data}</div>
                    </div>
                    {amount === pack.price && (
                      <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="btn-pill w-full h-11 text-sm font-semibold text-white bg-primary hover:bg-primary-active transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Proceed to Pay ₹{amount}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 3. ELECTRICITY FORM */}
        {serviceId === 'electricity' && (
          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase mb-1">State / Power Board</label>
              <select
                value={board}
                onChange={(e) => setBoard(e.target.value)}
                className="w-full text-xs font-medium text-ink bg-surface-soft border border-hairline rounded-md px-3.5 py-2.5 outline-none"
              >
                <option>Maharashtra - MSEDCL (Mahavitaran)</option>
                <option>Tata Power - Mumbai</option>
                <option>Adani Electricity - Mumbai</option>
                <option>Delhi - BSES Rajdhani</option>
                <option>Karnataka - BESCOM</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted uppercase mb-1">Consumer CA Number</label>
              <input
                type="text"
                value={consumerNo}
                onChange={(e) => setConsumerNo(e.target.value)}
                required
                className="w-full text-sm font-mono font-semibold text-ink bg-surface-soft border border-hairline rounded-md px-3.5 py-2.5 outline-none"
              />
            </div>
            <div className="bg-surface-soft p-3 rounded-md border border-hairline flex items-center justify-between text-xs">
              <span className="text-body font-medium">Billed Due Amount:</span>
              <span className="font-mono font-bold text-semantic-up text-sm">₹1,420</span>
            </div>
            <button
              type="submit"
              className="btn-pill w-full h-11 text-sm font-semibold text-white bg-primary hover:bg-primary-active transition-colors"
            >
              Pay ₹1,420 via Paytm UPI
            </button>
          </form>
        )}

        {/* 4. FASTAG FORM */}
        {serviceId === 'fastag' && (
          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase mb-1">Vehicle Registration Number</label>
              <input
                type="text"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value.toUpperCase())}
                required
                className="w-full text-sm font-mono font-semibold text-ink bg-surface-soft border border-hairline rounded-md px-3.5 py-2.5 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted uppercase mb-1">Select Amount</label>
              <div className="grid grid-cols-3 gap-2">
                {['500', '1000', '2000'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={`py-2 rounded-md font-mono text-sm font-semibold border ${
                      amount === amt ? 'border-primary bg-primary/5 text-primary' : 'border-hairline text-ink'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="btn-pill w-full h-11 text-sm font-semibold text-white bg-primary hover:bg-primary-active transition-colors"
            >
              Recharge FASTag (₹{amount})
            </button>
          </form>
        )}

        {/* 5. DTH & INSURANCE */}
        {(serviceId === 'dth' || serviceId === 'insurance' || serviceId === 'travel') && (
          <div className="space-y-4 text-center py-4">
            <p className="text-sm text-body">
              Let the autonomous AI Hub fetch and reconcile this service seamlessly.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onLaunchAiWithPrompt(`Reconcile and pay my ${titles[serviceId]}`);
              }}
              className="btn-pill w-full h-11 text-sm font-semibold text-white bg-primary hover:bg-primary-active transition-colors"
            >
              Launch in AI Hub →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
