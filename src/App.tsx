import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { PageTab } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import RouteSeo from './components/RouteSeo';
import { useScrollReveal } from './hooks/useScrollReveal';
import type { PreloadedPagesMap } from './routePreload';

const LazyHome = lazy(() => import('./pages/Home'));
const LazyAboutClub = lazy(() => import('./pages/AboutClub'));
const LazyCoaches = lazy(() => import('./pages/Coaches'));
const LazySchedule = lazy(() => import('./pages/Schedule'));
const LazyGallery = lazy(() => import('./pages/Gallery'));
const LazyContacts = lazy(() => import('./pages/Contacts'));
const Admin = lazy(() => import('./pages/Admin'));

const TrialModal = lazy(() => import('./components/TrialModal'));
const ReviewModal = lazy(() => import('./components/ReviewModal'));
const JapaneseBackground = lazy(() => import('./components/JapaneseBackground'));

const PageLoader = () => (
  <div className="min-h-[60dvh] flex items-center justify-center bg-[#ffffff]" role="status" aria-label="Ielādē saturu">
    <div className="w-12 h-12 border-4 border-[#dc2626] border-t-[#2563eb] rounded-full animate-spin" />
  </div>
);

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      return;
    }

    const id = hash.replace('#', '');
    let cancelled = false;
    let attempts = 0;

    const tryScroll = () => {
      if (cancelled) return;
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      if (attempts < 12) {
        attempts += 1;
        window.setTimeout(tryScroll, 80);
      }
    };

    tryScroll();
    return () => {
      cancelled = true;
    };
  }, [pathname, hash]);

  return null;
}

interface AppProps {
  preloadedPages?: PreloadedPagesMap;
}

export default function App({ preloadedPages }: AppProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [trialEverOpened, setTrialEverOpened] = useState(false);
  const [reviewEverOpened, setReviewEverOpened] = useState(false);
  const [bgMounted, setBgMounted] = useState(false);

  const isAdminRoute = location.pathname.startsWith('/admin');

  useScrollReveal(isAdminRoute ? '__admin__' : location.pathname);

  const HomeComponent = preloadedPages?.['/'] ?? LazyHome;
  const AboutComponent = preloadedPages?.['/about'] ?? LazyAboutClub;
  const CoachesComponent = preloadedPages?.['/coaches'] ?? LazyCoaches;
  const ScheduleComponent = preloadedPages?.['/schedule'] ?? LazySchedule;
  const GalleryComponent = preloadedPages?.['/gallery'] ?? LazyGallery;
  const ContactsComponent = preloadedPages?.['/contacts'] ?? LazyContacts;

  const openTrialModal = () => {
    setTrialEverOpened(true);
    setTrialModalOpen(true);
  };

  const openReviewModal = () => {
    setReviewEverOpened(true);
    setReviewModalOpen(true);
  };

  // Mount ambient background immediately post-hydration and defer secondary route prefetch until idle
  useEffect(() => {
    if (isAdminRoute) return;

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setBgMounted(true);
    }

    const scheduleIdle =
      typeof window.requestIdleCallback === 'function'
        ? (cb: () => void) => window.requestIdleCallback(cb, { timeout: 1800 })
        : (cb: () => void) => window.setTimeout(cb, 800);

    const cancelIdle =
      typeof window.cancelIdleCallback === 'function'
        ? (id: number) => window.cancelIdleCallback(id)
        : (id: number) => window.clearTimeout(id);

    const prefetchTimer = scheduleIdle(() => {
      const conn = (
        navigator as Navigator & {
          connection?: { saveData?: boolean; effectiveType?: string };
        }
      ).connection;
      const isSlowConnection = ['slow-2g', '2g', '3g'].includes(conn?.effectiveType ?? '');
      if (!conn?.saveData && !isSlowConnection) {
        void import('./pages/Schedule');
        void import('./pages/Contacts');
        void import('./pages/Coaches');
        void import('./pages/AboutClub');
        void import('./pages/Gallery');
      }
    });

    return () => cancelIdle(prefetchTimer);
  }, [isAdminRoute]);

  const getTabFromPath = (path: string): PageTab => {
    const clean = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
    if (clean === '/about') return 'about';
    if (clean === '/coaches') return 'coaches';
    if (clean === '/schedule') return 'schedule';
    if (clean === '/gallery') return 'gallery';
    if (clean === '/contacts') return 'contacts';
    if (clean.startsWith('/admin')) return 'admin';
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
      <>
        <RouteSeo />
        <Suspense fallback={<PageLoader />}>
          <Admin />
        </Suspense>
      </>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#ffffff] text-[#0f172a] font-sans selection:bg-[#dc2626] selection:text-white relative">
      <RouteSeo />
      <a href="#main-content" className="visually-hidden skip-link">
        Pāriet uz galveno saturu
      </a>
      <ScrollManager />
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

      <main id="main-content" tabIndex={-1} className="flex-grow relative z-10 focus:outline-none overflow-x-clip">
        <div key={location.pathname} className="page-enter">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route
                path="/"
                element={
                  <HomeComponent
                    setCurrentTab={setCurrentTab}
                    openTrialModal={openTrialModal}
                    openReviewModal={openReviewModal}
                  />
                }
              />
              <Route
                path="/about"
                element={
                  <AboutComponent
                    setCurrentTab={setCurrentTab}
                    openTrialModal={openTrialModal}
                    openReviewModal={openReviewModal}
                  />
                }
              />
              <Route
                path="/coaches"
                element={<CoachesComponent openTrialModal={openTrialModal} />}
              />
              <Route
                path="/schedule"
                element={<ScheduleComponent openTrialModal={openTrialModal} />}
              />
              <Route
                path="/gallery"
                element={<GalleryComponent openTrialModal={openTrialModal} />}
              />
              <Route
                path="/contacts"
                element={<ContactsComponent openTrialModal={openTrialModal} />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
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
  );
}
