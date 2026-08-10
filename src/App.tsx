import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { PageTab } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TrialModal from './components/TrialModal';
import ReviewModal from './components/ReviewModal';
import CookieBanner from './components/CookieBanner';
import JapaneseBackground from './components/JapaneseBackground';

const Home = lazy(() => import('./pages/Home'));
const AboutClub = lazy(() => import('./pages/AboutClub'));
const Coaches = lazy(() => import('./pages/Coaches'));
const Schedule = lazy(() => import('./pages/Schedule'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contacts = lazy(() => import('./pages/Contacts'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-[#ffffff]">
    <div className="w-12 h-12 border-4 border-[#dc2626] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  // Map path to currentTab
  const getTabFromPath = (path: string): PageTab => {
    if (path === '/about') return 'about';
    if (path === '/coaches') return 'coaches';
    if (path === '/schedule') return 'schedule';
    if (path === '/gallery') return 'gallery';
    if (path === '/contacts') return 'contacts';
    return 'home';
  };

  const currentTab = getTabFromPath(location.pathname);

  const setCurrentTab = (tab: PageTab) => {
    const routeMap: Record<PageTab, string> = {
      home: '/',
      about: '/about',
      coaches: '/coaches',
      schedule: '/schedule',
      gallery: '/gallery',
      contacts: '/contacts',
    };
    navigate(routeMap[tab] || '/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f3ec] text-[#1c1b18] font-serif selection:bg-[#c83832] selection:text-white relative overflow-x-hidden">
      <ScrollToTop />
      <JapaneseBackground />
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openTrialModal={() => setTrialModalOpen(true)}
      />

      <main className="flex-grow relative z-10">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  setCurrentTab={setCurrentTab}
                  openTrialModal={() => setTrialModalOpen(true)}
                  openReviewModal={() => setReviewModalOpen(true)}
                />
              }
            />
            <Route
              path="/about"
              element={
                <AboutClub
                  setCurrentTab={setCurrentTab}
                  openTrialModal={() => setTrialModalOpen(true)}
                  openReviewModal={() => setReviewModalOpen(true)}
                />
              }
            />
            <Route
              path="/coaches"
              element={<Coaches openTrialModal={() => setTrialModalOpen(true)} />}
            />
            <Route
              path="/schedule"
              element={<Schedule openTrialModal={() => setTrialModalOpen(true)} />}
            />
            <Route
              path="/gallery"
              element={<Gallery openTrialModal={() => setTrialModalOpen(true)} />}
            />
            <Route
              path="/contacts"
              element={<Contacts openTrialModal={() => setTrialModalOpen(true)} />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />

      <TrialModal
        isOpen={trialModalOpen}
        onClose={() => setTrialModalOpen(false)}
      />

      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
      />

      <CookieBanner />
    </div>
  );
}

