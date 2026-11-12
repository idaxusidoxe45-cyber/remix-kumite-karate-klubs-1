import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getRouteSeo } from '../seo';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function upsertJsonLd(jsonLd: Record<string, unknown>) {
  let script = document.head.querySelector<HTMLScriptElement>(
    'script#schema-org-jsonld[type="application/ld+json"]'
  );
  if (!script) {
    script = document.createElement('script');
    script.id = 'schema-org-jsonld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(jsonLd);
}

export default function RouteSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = getRouteSeo(pathname);
    document.title = seo.title;

    upsertMeta('name', 'description', seo.description);
    upsertMeta('name', 'robots', seo.robots);
    upsertCanonical(seo.canonical);

    upsertMeta('property', 'og:type', seo.ogType);
    upsertMeta('property', 'og:url', seo.canonical);
    upsertMeta('property', 'og:title', seo.ogTitle);
    upsertMeta('property', 'og:description', seo.ogDescription);
    upsertMeta('property', 'og:image', seo.ogImage);
    upsertMeta('property', 'og:image:alt', seo.ogImageAlt);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:url', seo.canonical);
    upsertMeta('name', 'twitter:title', seo.ogTitle);
    upsertMeta('name', 'twitter:description', seo.ogDescription);
    upsertMeta('name', 'twitter:image', seo.ogImage);
    upsertMeta('name', 'twitter:image:alt', seo.ogImageAlt);

    upsertJsonLd(seo.jsonLd);
  }, [pathname]);

  return null;
}
