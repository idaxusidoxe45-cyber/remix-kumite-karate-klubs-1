import React, { useState, useEffect, lazy, Suspense } from 'react';
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

export default function App() {
  const [currentTab, setCurrentTab] = useState<PageTab>('home');
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentTab]);

  const renderPage = () => {
    switch (currentTab) {
      case 'home':
        return (
          <Home
            setCurrentTab={setCurrentTab}
            openTrialModal={() => setTrialModalOpen(true)}
            openReviewModal={() => setReviewModalOpen(true)}
          />
        );
      case 'about':
        return (
          <AboutClub
            setCurrentTab={setCurrentTab}
            openTrialModal={() => setTrialModalOpen(true)}
            openReviewModal={() => setReviewModalOpen(true)}
          />
        );
      case 'coaches':
        return <Coaches openTrialModal={() => setTrialModalOpen(true)} />;
      case 'schedule':
        return <Schedule openTrialModal={() => setTrialModalOpen(true)} />;
      case 'gallery':
        return <Gallery openTrialModal={() => setTrialModalOpen(true)} />;
      case 'contacts':
        return <Contacts openTrialModal={() => setTrialModalOpen(true)} />;
      default:
        return (
          <Home
            setCurrentTab={setCurrentTab}
            openTrialModal={() => setTrialModalOpen(true)}
            openReviewModal={() => setReviewModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f3ec] text-[#1c1b18] font-serif selection:bg-[#c83832] selection:text-white relative overflow-x-hidden">
      <JapaneseBackground />
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openTrialModal={() => setTrialModalOpen(true)}
      />

      <main className="flex-grow relative z-10">
        <Suspense fallback={<PageLoader />}>
          {renderPage()}
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

