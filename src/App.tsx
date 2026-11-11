import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { LazyMotion, domAnimation, MotionConfig } from 'motion/react';
import { PageTab } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';

const Home = lazy(() => import('./pages/Home'));
const AboutClub = lazy(() => import('./pages/AboutClub'));
const Coaches = lazy(() => import('./pages/Coaches'));
const Schedule = lazy(() => import('./pages/Schedule'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contacts = lazy(() => import('./pages/Contacts'));
const Admin = lazy(() => import('./pages/Admin'));

const TrialModal = lazy(() => import('./components/TrialModal'));
const ReviewModal = lazy(() => import('./components/ReviewModal'));
const JapaneseBackground = lazy(() => import('./components/JapaneseBackground'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-[#ffffff]" role="status" aria-label="Ielādē saturu">
    <div className="w-12 h-12 border-4 border-[#dc2626] border-t-transparent rounded-full animate-spin" />
  </div>
);

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [trialEverOpened, setTrialEverOpened] = useState(false);
  const [reviewEverOpened, setReviewEverOpened] = useState(false);
  const [bgMounted, setBgMounted] = useState(false);

  const isAdminRoute = location.pathname.startsWith('/admin');

  const openTrialModal = () => {
    setTrialEverOpened(true);
    setTrialModalOpen(true);
  };

  const openReviewModal = () => {
    setReviewEverOpened(true);
    setReviewModalOpen(true);
  };

  // Defer decorative background mount & secondary route chunk prefetching until idle
  useEffect(() => {
    if (isAdminRoute) return;

    const scheduleIdle =
      typeof window.requestIdleCallback === 'function'
        ? (cb: () => void) => window.requestIdleCallback(cb, { timeout: 2000 })
        : (cb: () => void) => window.setTimeout(cb, 1200);

    const cancelIdle =
      typeof window.cancelIdleCallback === 'function'
        ? (id: number) => window.cancelIdleCallback(id)
        : (id: number) => window.clearTimeout(id);

    const bgTimer = scheduleIdle(() => {
      setBgMounted(true);

      const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
      if (!conn?.saveData) {
        void import('./pages/Schedule');
        void import('./pages/Contacts');
        void import('./pages/Coaches');
        void import('./pages/AboutClub');
        void import('./pages/Gallery');
      }
    });

    return () => cancelIdle(bgTimer);
  }, [isAdminRoute]);

  const getTabFromPath = (path: string): PageTab => {
    if (path === '/about') return 'about';
    if (path === '/coaches') return 'coaches';
    if (path === '/schedule') return 'schedule';
    if (path === '/gallery') return 'gallery';
    if (path === '/contacts') return 'contacts';
    if (path.startsWith('/admin')) return 'admin';
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
      admin: '/admin',
    };
    navigate(routeMap[tab] || '/');
  };

  if (isAdminRoute) {
    return (
      <MotionConfig reducedMotion="user">
        <LazyMotion features={domAnimation} strict>
          <Suspense fallback={<PageLoader />}>
            <Admin />
          </Suspense>
        </LazyMotion>
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <div className="min-h-screen flex flex-col bg-[#ffffff] text-[#0f172a] font-sans selection:bg-[#dc2626] selection:text-white relative overflow-x-clip">
          <a href="#main-content" className="visually-hidden skip-link">
            Pāriet uz galveno saturu
          </a>
          <ScrollToTop />
          {bgMounted && (
            <Suspense fallback={null}>
              <JapaneseBackground />
            </Suspense>
          )}
          <Navbar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            openTrialModal={openTrialModal}
          />

          <main id="main-content" tabIndex={-1} className="flex-grow relative z-10 focus:outline-none">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Home
                      setCurrentTab={setCurrentTab}
                      openTrialModal={openTrialModal}
                      openReviewModal={openReviewModal}
                    />
                  }
                />
                <Route
                  path="/about"
                  element={
                    <AboutClub
                      setCurrentTab={setCurrentTab}
                      openTrialModal={openTrialModal}
                      openReviewModal={openReviewModal}
                    />
                  }
                />
                <Route
                  path="/coaches"
                  element={<Coaches openTrialModal={openTrialModal} />}
                />
                <Route
                  path="/schedule"
                  element={<Schedule openTrialModal={openTrialModal} />}
                />
                <Route
                  path="/gallery"
                  element={<Gallery openTrialModal={openTrialModal} />}
                />
                <Route
                  path="/contacts"
                  element={<Contacts openTrialModal={openTrialModal} />}
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>

          <Footer />

          {trialEverOpened && (
            <Suspense fallback={null}>
              <TrialModal
                isOpen={trialModalOpen}
                onClose={() => setTrialModalOpen(false)}
              />
            </Suspense>
          )}

          {reviewEverOpened && (
            <Suspense fallback={null}>
              <ReviewModal
                isOpen={reviewModalOpen}
                onClose={() => setReviewModalOpen(false)}
              />
            </Suspense>
          )}

          <CookieBanner />
        </div>
      </LazyMotion>
    </MotionConfig>
  );
}
