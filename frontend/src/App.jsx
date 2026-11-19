import React, { useState } from 'react';
import TopNav from './components/TopNav';
import HeroBand from './components/HeroBand';
import MarketTicker from './components/MarketTicker';
import ServicesGrid from './components/ServicesGrid';
import InstitutionalGrid from './components/InstitutionalGrid';
import CtaBand from './components/CtaBand';
import Footer from './components/Footer';
import MainDashboard from './components/MainDashboard';
import ServiceModal from './components/ServiceModal';
import UpiPinModal from './components/UpiPinModal';
import NexconnModal from './components/NexconnModal';
import { playSound } from './utils/audio';

export default function App() {
  // 'landing' | 'dashboard'
  const [currentView, setCurrentView] = useState('landing');
  const [dashboardInitialQuery, setDashboardInitialQuery] = useState('');

  // Modals
  const [serviceModal, setServiceModal] = useState(null);
  const [pinModalData, setPinModalData] = useState(null);
  const [nexconnData, setNexconnData] = useState(null);

  const goToDashboard = (query = '') => {
    playSound('chime');
    setDashboardInitialQuery(query);
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToLanding = () => {
    playSound('click');
    setDashboardInitialQuery('');
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink antialiased">
      
      {/* ========================================================
          VIEW 1: AUTHENTICATED USER DASHBOARD
          ======================================================== */}
      {currentView === 'dashboard' ? (
        <MainDashboard
          onLogOut={goToLanding}
          initialQuery={dashboardInitialQuery}
          onOpenPinModal={(data) => setPinModalData(data)}
          onOpenNexconn={(data) => setNexconnData(data)}
        />
      ) : (
        /* ========================================================
           VIEW 2: PUBLIC LANDING PAGE (Clean, No "Open AI" Clutter)
           ======================================================== */
        <>
          {/* 1. Clean Top Navigation (Single Sign In to Dashboard CTA) */}
          <TopNav onSignIn={() => goToDashboard('')} />

          {/* 2. Hero Section */}
          <HeroBand
            onSignIn={() => goToDashboard('')}
            onSignInWithQuery={(q) => goToDashboard(q)}
          />

          {/* 3. Live Telemetry & Network Status */}
          <MarketTicker onSelectService={() => goToDashboard('')} />

          {/* 4. Core Services */}
          <ServicesGrid
            onOpenService={(id) => setServiceModal(id)}
            onPromptAi={(prompt) => goToDashboard(prompt)}
          />

          {/* 5. How It Works / Trust Pillars */}
          <InstitutionalGrid />

          {/* 6. Pre-Footer Sign In CTA */}
          <CtaBand onSignIn={() => goToDashboard('')} />

          {/* 7. Institutional Footer */}
          <Footer />
        </>
      )}

      {/* SERVICE ACTION MODAL (From Services Grid on landing page) */}
      {serviceModal && (
        <ServiceModal
          serviceId={serviceModal}
          onClose={() => setServiceModal(null)}
          onOpenPinModal={(data) => setPinModalData(data)}
          onLaunchAiWithPrompt={(p) => goToDashboard(p)}
        />
      )}

      {/* UPI PIN NPCI AUTHORIZATION MODAL */}
      {pinModalData && (
        <UpiPinModal
          paymentData={pinModalData}
          onClose={() => setPinModalData(null)}
          onComplete={() => setPinModalData(null)}
        />
      )}

      {/* NEXCONN REAL-TIME DISPUTE SUPPORT CHAT MODAL */}
      {nexconnData && (
        <NexconnModal
          sessionData={nexconnData}
          onClose={() => setNexconnData(null)}
        />
      )}

    </div>
  );
}
