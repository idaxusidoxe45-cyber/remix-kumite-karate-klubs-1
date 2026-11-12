import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { preloadPublicRoute } from './routePreload.ts';
import { normalizePathname, PUBLIC_ROUTES } from './seo.ts';
import './index.css';

const rootEl = document.getElementById('root')!;

async function bootstrap() {
  const pathname = window.location.pathname;
  const isAdminPath = pathname.startsWith('/admin');
  const normalized = normalizePathname(pathname);
  const isKnownPublicRoute = (PUBLIC_ROUTES as readonly string[]).includes(normalized);
  const canHydrate = rootEl.firstElementChild !== null && !isAdminPath && isKnownPublicRoute;

  if (canHydrate) {
    try {
      const preloadedPages = await preloadPublicRoute(pathname);
      hydrateRoot(
        rootEl,
        <StrictMode>
          <BrowserRouter>
            <App preloadedPages={preloadedPages} />
          </BrowserRouter>
        </StrictMode>
      );
      return;
    } catch (err) {
      console.warn('[kumite] Hydration recovery: falling back to createRoot', err);
      rootEl.innerHTML = '';
    }
  } else {
    rootEl.innerHTML = '';
  }

  if (isAdminPath) {
    rootEl.dataset.adminReady = '1';
  }
  createRoot(rootEl).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
}

void bootstrap();
