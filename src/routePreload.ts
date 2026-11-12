import type { ComponentType } from 'react';
import { normalizePathname, type PublicRoutePath } from './seo.ts';

export type PreloadedPagesMap = Partial<Record<PublicRoutePath, ComponentType<any>>>;

const ROUTE_LOADERS: Record<PublicRoutePath, () => Promise<{ default: ComponentType<any> }>> = {
  '/': () => import('./pages/Home'),
  '/about': () => import('./pages/AboutClub'),
  '/coaches': () => import('./pages/Coaches'),
  '/schedule': () => import('./pages/Schedule'),
  '/gallery': () => import('./pages/Gallery'),
  '/contacts': () => import('./pages/Contacts'),
};

export async function preloadPublicRoute(pathname: string): Promise<PreloadedPagesMap> {
  const normalized = normalizePathname(pathname);
  if (normalized in ROUTE_LOADERS) {
    const key = normalized as PublicRoutePath;
    const mod = await ROUTE_LOADERS[key]();
    return { [key]: mod.default };
  }
  return {};
}
