import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App.tsx';
import Home from './pages/Home.tsx';
import AboutClub from './pages/AboutClub.tsx';
import Coaches from './pages/Coaches.tsx';
import Schedule from './pages/Schedule.tsx';
import Gallery from './pages/Gallery.tsx';
import Contacts from './pages/Contacts.tsx';
import type { PreloadedPagesMap } from './routePreload.ts';
import { PUBLIC_ROUTES, getRouteSeo } from './seo.ts';

const SERVER_PAGES: PreloadedPagesMap = {
  '/': Home,
  '/about': AboutClub,
  '/coaches': Coaches,
  '/schedule': Schedule,
  '/gallery': Gallery,
  '/contacts': Contacts,
};

export function renderRoute(url: string): string {
  return renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <App preloadedPages={SERVER_PAGES} />
      </StaticRouter>
    </React.StrictMode>
  );
}

export { PUBLIC_ROUTES, getRouteSeo };
