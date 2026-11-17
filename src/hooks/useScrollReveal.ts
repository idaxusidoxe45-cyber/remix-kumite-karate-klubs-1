import { useEffect } from 'react';

const supportsNativeScrollTimeline = () =>
  typeof window !== 'undefined' &&
  typeof CSS !== 'undefined' &&
  typeof CSS.supports === 'function' &&
  CSS.supports('(animation-timeline: view()) and (animation-range: entry)');

/**
 * Provides cross-platform scroll reveal animations (iOS Safari, Android WebView, Firefox, Windows)
 * as a progressive fallback whenever CSS View Timelines (`animation-timeline: view()`) are unsupported,
 * plus a passive CSS `--scroll-progress` fallback when `animation-timeline: scroll()` is unsupported.
 */
export function useScrollReveal(routeKey: string) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMq.matches) {
      delete root.dataset.jsReveal;
      return;
    }

    const cleanups: Array<() => void> = [];

    // 1. Scroll progress bar fallback when native CSS `animation-timeline: scroll(root)` is missing
    const supportsScrollProgress =
      typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      CSS.supports('animation-timeline: scroll(root)');

    if (!supportsScrollProgress) {
      let rafId: number | null = null;
      const updateProgress = () => {
        rafId = null;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
        root.style.setProperty('--scroll-progress', ratio.toFixed(4));
      };
      const onScroll = () => {
        if (rafId === null) {
          rafId = requestAnimationFrame(updateProgress);
        }
      };
      updateProgress();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      cleanups.push(() => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        if (rafId !== null) cancelAnimationFrame(rafId);
      });
    }

    // 2. IntersectionObserver + MutationObserver fallback when native View Timelines are unavailable (e.g., iOS Safari < 26)
    if (!supportsNativeScrollTimeline() && 'IntersectionObserver' in window) {
      root.dataset.jsReveal = '1';

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          }
        },
        {
          rootMargin: '0px 0px -6% 0px',
          threshold: 0.06,
        }
      );

      const observedSet = new WeakSet<Element>();
      const registerTarget = (el: HTMLElement) => {
        if (observedSet.has(el)) return;
        observedSet.add(el);
        const viewportH = window.innerHeight || 800;
        const rect = el.getBoundingClientRect();
        if (rect.top < viewportH * 0.96) {
          el.classList.add('is-visible');
        } else {
          el.classList.remove('is-visible');
          observer.observe(el);
        }
      };

      for (const el of document.querySelectorAll<HTMLElement>('.scroll-reveal')) {
        registerTarget(el);
      }

      let mutationObserver: MutationObserver | null = null;
      if ('MutationObserver' in window && document.body) {
        mutationObserver = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            mutation.addedNodes.forEach((node) => {
              if (!(node instanceof HTMLElement)) return;
              if (node.classList.contains('scroll-reveal')) {
                registerTarget(node);
              }
              node.querySelectorAll<HTMLElement>('.scroll-reveal').forEach(registerTarget);
            });
          }
        });
        mutationObserver.observe(document.body, { childList: true, subtree: true });
      }

      cleanups.push(() => {
        mutationObserver?.disconnect();
        observer.disconnect();
        delete root.dataset.jsReveal;
      });
    } else {
      delete root.dataset.jsReveal;
    }

    return () => {
      for (const fn of cleanups) fn();
    };
  }, [routeKey]);
}
