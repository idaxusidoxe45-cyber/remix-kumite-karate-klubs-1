import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const distViteDir = path.join(distDir, '.vite');
const distManifestPath = path.join(distViteDir, 'manifest.json');
const ssrCacheDir = path.join(projectRoot, 'node_modules', '.cache', 'kumite-ssr');
const cachedManifestPath = path.join(ssrCacheDir, 'manifest.json');
const ssrEntryPath = path.join(ssrCacheDir, 'entry-server.js');

const ROUTE_SOURCE_FILES = {
  '/': 'src/pages/Home.tsx',
  '/about': 'src/pages/AboutClub.tsx',
  '/coaches': 'src/pages/Coaches.tsx',
  '/schedule': 'src/pages/Schedule.tsx',
  '/gallery': 'src/pages/Gallery.tsx',
  '/contacts': 'src/pages/Contacts.tsx',
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, '&quot;');
}

function serializeJsonLd(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

const rawProdHost = (process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || '').trim();
const resolvedAssetOrigin = rawProdHost
  ? rawProdHost.startsWith('http')
    ? rawProdHost.replace(/\/+$/, '')
    : `https://${rawProdHost.replace(/\/+$/, '')}`
  : '';

function buildHeadTags(seo, modulePreloadHrefs) {
  const ogImage = resolvedAssetOrigin ? `${resolvedAssetOrigin}/og-banner.jpg` : seo.ogImage;
  const lines = [
    `<title>${escapeHtml(seo.title)}</title>`,
    `<meta name="description" content="${escapeAttr(seo.description)}" />`,
    `<meta name="keywords" content="karatē Rīga, karate klubs, bērnu karatē, karatē treniņi, Kumite Karate Klubs, karatē nodarbības bērniem, karatē jauniešiem, cīņas māksla Rīga, Nikolajs Bodrovs" />`,
    `<meta name="robots" content="${escapeAttr(seo.robots)}" />`,
    `<meta name="theme-color" content="#0a0a0c" />`,
    `<link rel="canonical" href="${escapeAttr(seo.canonical)}" />`,
    `<link rel="icon" type="image/png" href="/logo.png" />`,
    `<link rel="apple-touch-icon" href="/logo.png" />`,
    ``,
    `<!-- Open Graph / Facebook -->`,
    `<meta property="og:type" content="${escapeAttr(seo.ogType)}" />`,
    `<meta property="og:url" content="${escapeAttr(seo.canonical)}" />`,
    `<meta property="og:title" content="${escapeAttr(seo.ogTitle)}" />`,
    `<meta property="og:description" content="${escapeAttr(seo.ogDescription)}" />`,
    `<meta property="og:image" content="${escapeAttr(ogImage)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:image:alt" content="${escapeAttr(seo.ogImageAlt)}" />`,
    `<meta property="og:locale" content="lv_LV" />`,
    `<meta property="og:site_name" content="Kumite Karate Klubs" />`,
    ``,
    `<!-- Twitter Card -->`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:url" content="${escapeAttr(seo.canonical)}" />`,
    `<meta name="twitter:title" content="${escapeAttr(seo.ogTitle)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(seo.ogDescription)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(ogImage)}" />`,
    `<meta name="twitter:image:alt" content="${escapeAttr(seo.ogImageAlt)}" />`,
    ``,
    `<!-- Schema.org Structured Data -->`,
    `<script id="schema-org-jsonld" type="application/ld+json">${serializeJsonLd(seo.jsonLd)}</script>`,
  ];

  if (seo.preloadHero) {
    const srcSetAttr = seo.preloadHero.imageSrcSet
      ? ` imagesrcset="${escapeAttr(seo.preloadHero.imageSrcSet)}"`
      : '';
    const sizesAttr = seo.preloadHero.imageSizes
      ? ` imagesizes="${escapeAttr(seo.preloadHero.imageSizes)}"`
      : '';
    lines.push(
      `<link rel="preload" as="image" href="${escapeAttr(seo.preloadHero.href)}"${srcSetAttr}${sizesAttr} fetchpriority="high" />`
    );
  }

  for (const href of modulePreloadHrefs) {
    lines.push(`<link rel="modulepreload" crossorigin href="${escapeAttr(href)}" />`);
  }

  return lines.map((l) => (l ? `    ${l}` : '')).join('\n');
}

function collectModulePreloads(manifest, route) {
  const entryKey = ROUTE_SOURCE_FILES[route];
  if (!manifest || !entryKey || !manifest[entryKey]) return [];

  const visited = new Set();
  const files = [];

  function walk(key) {
    if (!key || visited.has(key)) return;
    visited.add(key);
    const chunk = manifest[key];
    if (!chunk) return;
    if (chunk.file) {
      files.push(`/${chunk.file}`);
    }
    if (Array.isArray(chunk.imports)) {
      for (const imp of chunk.imports) {
        walk(imp);
      }
    }
  }

  walk(entryKey);
  return files;
}

async function loadManifest() {
  try {
    const manifestRaw = await fs.readFile(distManifestPath, 'utf8');
    const parsed = JSON.parse(manifestRaw);
    await fs.mkdir(ssrCacheDir, { recursive: true });
    await fs.writeFile(cachedManifestPath, manifestRaw, 'utf8');
    return parsed;
  } catch {
    try {
      const cachedRaw = await fs.readFile(cachedManifestPath, 'utf8');
      return JSON.parse(cachedRaw);
    } catch {
      return null;
    }
  }
}

async function run() {
  const templateHtml = await fs.readFile(path.join(distDir, 'index.html'), 'utf8');
  const manifest = await loadManifest();

  try {
    const { renderRoute, PUBLIC_ROUTES, getRouteSeo } = await import(
      pathToFileURL(ssrEntryPath).href
    );

    for (const route of PUBLIC_ROUTES) {
      const seo = getRouteSeo(route);
      const rawAppHtml = renderRoute(route);

      // In React 19 SSR, document-level <link> elements (such as image preloads)
      // are hoisted to the beginning of the renderToString output. We MUST strip them
      // from the markup inserted into <div id="root"> so that:
      // 1) hydrateRoot finds the exact matching <div> root, preventing React error #418.
      // 2) <head> contains the single authoritative canonical preload without duplicates.
      const hoistedMatch = rawAppHtml.match(/^(?:<link\b[^>]*\/>)+/);
      const cleanAppHtml = hoistedMatch ? rawAppHtml.slice(hoistedMatch[0].length) : rawAppHtml;

      const modulePreloads = collectModulePreloads(manifest, route).filter(
        (href) => !templateHtml.includes(`href="${href}"`) && !templateHtml.includes(`src="${href}"`)
      );
      const headBlock = buildHeadTags(seo, modulePreloads);

      let html = templateHtml.replace(
        /<!--\s*SEO_HEAD_START\s*-->[\s\S]*?<!--\s*SEO_HEAD_END\s*-->/,
        () => `<!-- SEO_HEAD_START -->\n${headBlock}\n    <!-- SEO_HEAD_END -->`
      );

      html = html.replace('<div id="root"></div>', () => `<div id="root">${cleanAppHtml}</div>`);

      const outPath =
        route === '/'
          ? path.join(distDir, 'index.html')
          : path.join(distDir, route.slice(1), 'index.html');

      await fs.mkdir(path.dirname(outPath), { recursive: true });
      await fs.writeFile(outPath, html, 'utf8');
      console.log(`[prerender] ${route} -> ${path.relative(projectRoot, outPath)} (${html.length} chars)`);
    }
  } finally {
    await fs.rm(distViteDir, { recursive: true, force: true });
  }
}

run().catch((err) => {
  console.error('[prerender] Failed:', err);
  process.exit(1);
});
