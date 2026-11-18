import { FAQ_ITEMS, SCHEDULE_GROUPS } from './data.ts';

export const SITE_URL = 'https://kumitekarate.lv';
export const SITE_NAME = 'Kumite Karate Klubs';
export const OG_IMAGE_URL = `${SITE_URL}/og-banner.jpg`;
export const OG_IMAGE_ALT =
  'Kumite Karate Klubs Rīgā – karatē treniņi bērniem, jauniešiem un pieaugušajiem';

export type PublicRoutePath =
  | '/'
  | '/about'
  | '/coaches'
  | '/schedule'
  | '/gallery'
  | '/contacts';

export const PUBLIC_ROUTES: readonly PublicRoutePath[] = [
  '/',
  '/about',
  '/coaches',
  '/schedule',
  '/gallery',
  '/contacts',
] as const;

export interface HeroPreloadConfig {
  href: string;
  imageSrcSet?: string;
  imageSizes?: string;
}

export interface RouteSeoData {
  path: string;
  title: string;
  description: string;
  canonical: string;
  robots: string;
  ogType: 'website' | 'profile';
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImageAlt: string;
  preloadHero?: HeroPreloadConfig;
  jsonLd: Record<string, unknown>;
}

const SPORTS_CLUB_ENTITY = {
  '@type': 'SportsClub',
  '@id': `${SITE_URL}/#sportsclub`,
  name: 'Kumite Karate Klubs',
  alternateName: 'Bērnu un jauniešu karatē klubs Kumite',
  description:
    'Profesionāli karatē treniņi bērniem, jauniešiem un pieaugušajiem Rīgā. Sertificēts treneris Nikolajs Bodrovs (2 DAN), sagatavošana sacensībām, nometnes un bezmaksas izmēģinājuma nodarbības.',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo.png`,
  image: OG_IMAGE_URL,
  telephone: '+371 29177274',
  email: 'info@kumitekarate.lv',
  priceRange: '€€',
  sport: 'Karate',
  sameAs: [
    'https://www.facebook.com/kumitekarateklubs',
    'https://www.instagram.com/kumite_karate_klubs/',
    'https://www.youtube.com/@KUMITEKARATEKLUBS',
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Gustava Zemgala gatve 71',
    addressLocality: 'Rīga',
    postalCode: 'LV-1039',
    addressCountry: 'LV',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 56.971622,
    longitude: 24.166368,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Wednesday', 'Friday'],
      opens: '15:30',
      closes: '20:30',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Tuesday', 'Thursday'],
      opens: '18:00',
      closes: '20:15',
    },
  ],
  coach: {
    '@type': 'Person',
    '@id': `${SITE_URL}/coaches#nikolajs-bodrovs`,
    name: 'Nikolajs Bodrovs',
    jobTitle: 'Galvenais treneris (2 DAN)',
    telephone: '+371 29177274',
    description:
      'Sertificēts karatē treneris (LSPA, Sertifikāta Nr. 3973), melnā josta (2 DAN), Latvijas izlases sportists (2009–2021) un LKF Slavas zāles dalībnieks.',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Karatē nodarbību programmas',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Karatē bērniem (5–7 gadi) — Jaunākā grupa',
          description: 'Karatē pamati, koordinācija, lokanība, disciplīna un rotaļu elementi.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Karatē bērniem (7–11 gadi) — Vidējā grupa',
          description: 'Karatē tehnika, disciplīna, fiziskā sagatavotība un pirmie starti sacensībās.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Karatē jauniešiem (12–17 gadi) — Vecākā grupa',
          description: 'Padziļināta karatē tehnika, kumite sparingi un sagatavošanās čempionātiem.',
        },
      },
      {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
        itemOffered: {
          '@type': 'Service',
          name: 'Bezmaksas izmēģinājuma nodarbība',
          description: 'Pirmā iepazīšanās nodarbība Rīgā bez maksas ar iepriekšēju pieteikšanos.',
        },
      },
    ],
  },
};

const WEBSITE_ENTITY = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  inLanguage: 'lv-LV',
  publisher: { '@id': `${SITE_URL}/#sportsclub` },
};

const KARATE_HERO_PRELOAD: HeroPreloadConfig = {
  href: '/assets_gallery/trenini/karate-web-17.webp',
  imageSrcSet:
    '/assets_gallery/trenini/karate-web-17-800w.webp 800w, /assets_gallery/trenini/karate-web-17.webp 1600w',
  imageSizes: '100vw',
};

const COACH_HERO_PRELOAD: HeroPreloadConfig = {
  href: '/assets_coaches/marikanikolajs-52-scaled.webp',
  imageSrcSet:
    '/assets_coaches/marikanikolajs-52-800w.webp 800w, /assets_coaches/marikanikolajs-52-scaled.webp 1707w',
  imageSizes: '100vw',
};

function buildBreadcrumb(name: string, path: string) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Sākums',
        item: `${SITE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name,
        item: `${SITE_URL}${path}`,
      },
    ],
  };
}

function buildFaqEntity() {
  return {
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

const ROUTE_SEO_MAP: Record<PublicRoutePath, RouteSeoData> = {
  '/': {
    path: '/',
    title: 'Kumite Karate Klubs Rīgā – Karatē treniņi bērniem un jauniešiem',
    description:
      'Kumite Karate Klubs Rīgā (Gustava Zemgala gatve 71): profesionāli karatē treniņi bērniem no 5 gadiem un jauniešiem. Disciplīna, pašpārliecība un bezmaksas izmēģinājuma nodarbība!',
    canonical: `${SITE_URL}/`,
    robots: 'index, follow',
    ogType: 'website',
    ogTitle: 'Kumite Karate Klubs Rīgā – Karatē treniņi bērniem un jauniešiem',
    ogDescription:
      'Profesionāli karatē treniņi Rīgā sertificēta trenera Nikolaja Bodrova (2 DAN) vadībā. Piesakies bezmaksas izmēģinājuma nodarbībai!',
    ogImage: OG_IMAGE_URL,
    ogImageAlt: OG_IMAGE_ALT,
    preloadHero: KARATE_HERO_PRELOAD,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        WEBSITE_ENTITY,
        SPORTS_CLUB_ENTITY,
        {
          '@type': 'WebPage',
          '@id': `${SITE_URL}/#webpage`,
          url: `${SITE_URL}/`,
          name: 'Kumite Karate Klubs Rīgā – Karatē treniņi bērniem un jauniešiem',
          inLanguage: 'lv-LV',
          isPartOf: { '@id': `${SITE_URL}/#website` },
          about: { '@id': `${SITE_URL}/#sportsclub` },
        },
        buildFaqEntity(),
      ],
    },
  },
  '/about': {
    path: '/about',
    title: 'Par klubu un karatē sistēmu | Kumite Karate Klubs Rīgā',
    description:
      'Uzzini vairāk par Kumite Karate Klubu Rīgā: dibināts 2023. gadā, Latvijas Karatē Federācijas biedrs, jostu sistēma (11 kyu – 1 DAN), nometnes, eksāmeni un vecāku atsauksmes.',
    canonical: `${SITE_URL}/about`,
    robots: 'index, follow',
    ogType: 'website',
    ogTitle: 'Par klubu un karatē sistēmu | Kumite Karate Klubs Rīgā',
    ogDescription:
      'Kumite Karate Kluba vēsture, mērķi, karatē jostu sistēma, biežāk uzdotie jautājumi un audzēkņu vecāku atsauksmes.',
    ogImage: OG_IMAGE_URL,
    ogImageAlt: OG_IMAGE_ALT,
    preloadHero: KARATE_HERO_PRELOAD,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        SPORTS_CLUB_ENTITY,
        {
          '@type': 'AboutPage',
          '@id': `${SITE_URL}/about#webpage`,
          url: `${SITE_URL}/about`,
          name: 'Par klubu un karatē sistēmu | Kumite Karate Klubs Rīgā',
          inLanguage: 'lv-LV',
          isPartOf: { '@id': `${SITE_URL}/#website` },
          about: { '@id': `${SITE_URL}/#sportsclub` },
        },
        buildBreadcrumb('Par mums', '/about'),
        buildFaqEntity(),
      ],
    },
  },
  '/coaches': {
    path: '/coaches',
    title: 'Treneris Nikolajs Bodrovs (2 DAN) | Kumite Karate Klubs Rīgā',
    description:
      'Kumite Karate Kluba galvenais treneris Nikolajs Bodrovs (2 DAN) – sertificēts LSPA sporta speciālists, Eiropas čempionāta medaļnieks un LKF Slavas zāles sportists ar 24+ gadu pieredzi.',
    canonical: `${SITE_URL}/coaches`,
    robots: 'index, follow',
    ogType: 'profile',
    ogTitle: 'Treneris Nikolajs Bodrovs (2 DAN) | Kumite Karate Klubs',
    ogDescription:
      'Iepazīsties ar sertificētu karatē treneri Nikolaju Bodrovu (2 DAN): izglītība, sportiskie sasniegumi un individuāla pieeja katram audzēknim.',
    ogImage: OG_IMAGE_URL,
    ogImageAlt: OG_IMAGE_ALT,
    preloadHero: COACH_HERO_PRELOAD,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        SPORTS_CLUB_ENTITY,
        {
          '@type': 'ProfilePage',
          '@id': `${SITE_URL}/coaches#webpage`,
          url: `${SITE_URL}/coaches`,
          name: 'Treneris Nikolajs Bodrovs (2 DAN) | Kumite Karate Klubs Rīgā',
          inLanguage: 'lv-LV',
          isPartOf: { '@id': `${SITE_URL}/#website` },
          mainEntity: {
            '@type': 'Person',
            '@id': `${SITE_URL}/coaches#nikolajs-bodrovs`,
            name: 'Nikolajs Bodrovs',
            jobTitle: 'Sertificēts karatē treneris (2 DAN)',
            image: `${SITE_URL}/assets_coaches/ka_00302-edit.webp`,
            worksFor: { '@id': `${SITE_URL}/#sportsclub` },
            alumniOf: [
              {
                '@type': 'CollegeOrUniversity',
                name: 'Latvijas Sporta pedagoģijas akadēmija',
              },
              {
                '@type': 'CollegeOrUniversity',
                name: 'Banku augstskola',
              },
            ],
            award: [
              '2 DAN melnā josta karatē (2023)',
              'Komandu Eiropas čempionāts 2010 – 1. vieta (juniori)',
              'Latvijas Karatē Federācijas Slavas zāle',
            ],
          },
        },
        buildBreadcrumb('Treneri', '/coaches'),
      ],
    },
  },
  '/schedule': {
    path: '/schedule',
    title: 'Nodarbību grafiks Rīgā | Kumite Karate Klubs',
    description:
      'Karatē treniņu grafiks Rīgā, Gustava Zemgala gatvē 71: pēcpusdienas un vakara grupas bērniem un jauniešiem (5–7, 7–11, 8–13, 9–12 un 12–17 gadi). Piesakies bezmaksas nodarbībai!',
    canonical: `${SITE_URL}/schedule`,
    robots: 'index, follow',
    ogType: 'website',
    ogTitle: 'Nodarbību grafiks Rīgā | Kumite Karate Klubs',
    ogDescription:
      'Apskati aktuālo karatē nodarbību sarakstu iesācēju, jaunākajai, vidējai un vecākajai grupai Rīgā, Gustava Zemgala gatvē 71.',
    ogImage: OG_IMAGE_URL,
    ogImageAlt: OG_IMAGE_ALT,
    preloadHero: KARATE_HERO_PRELOAD,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        SPORTS_CLUB_ENTITY,
        {
          '@type': 'WebPage',
          '@id': `${SITE_URL}/schedule#webpage`,
          url: `${SITE_URL}/schedule`,
          name: 'Nodarbību grafiks Rīgā | Kumite Karate Klubs',
          inLanguage: 'lv-LV',
          isPartOf: { '@id': `${SITE_URL}/#website` },
          mainEntity: {
            '@type': 'ItemList',
            name: 'Kumite Karate Kluba treniņu grupas',
            itemListElement: SCHEDULE_GROUPS.map((group, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              name: group.title,
              description: group.ageLabel
                ? `${group.ageLabel} — ${group.schedule.join('; ')}`
                : group.schedule.join('; '),
            })),
          },
        },
        buildBreadcrumb('Grafiks', '/schedule'),
      ],
    },
  },
  '/gallery': {
    path: '/gallery',
    title: 'Foto galerija – Treniņi, sacensības un nometnes | Kumite Karate Klubs',
    description:
      'Kumite Karate Kluba foto galerija: mirkļi no ikdienas karatē treniņiem Rīgā, Latvijas un starptautiskajām sacensībām, vasaras nometnēm, jostu eksāmeniem un kluba pasākumiem.',
    canonical: `${SITE_URL}/gallery`,
    robots: 'index, follow',
    ogType: 'website',
    ogTitle: 'Foto galerija | Kumite Karate Klubs Rīgā',
    ogDescription:
      'Apskati Kumite Karate Kluba treniņu, čempionātu, vasaras nometņu un eksāmenu spilgtākos mirkļus.',
    ogImage: OG_IMAGE_URL,
    ogImageAlt: OG_IMAGE_ALT,
    preloadHero: KARATE_HERO_PRELOAD,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        SPORTS_CLUB_ENTITY,
        {
          '@type': 'CollectionPage',
          '@id': `${SITE_URL}/gallery#webpage`,
          url: `${SITE_URL}/gallery`,
          name: 'Foto galerija – Treniņi, sacensības un nometnes | Kumite Karate Klubs',
          inLanguage: 'lv-LV',
          isPartOf: { '@id': `${SITE_URL}/#website` },
          about: { '@id': `${SITE_URL}/#sportsclub` },
        },
        buildBreadcrumb('Galerija', '/gallery'),
      ],
    },
  },
  '/contacts': {
    path: '/contacts',
    title: 'Kontakti un zāles adrese Rīgā | Kumite Karate Klubs',
    description:
      'Sazinies ar Kumite Karate Klubu: Rīga, Gustava Zemgala gatve 71, tālr. +371 29177274, info@kumitekarate.lv. Bezmaksas auto stāvvieta (līdz 3 stundām) un pieteikšanās izmēģinājuma treniņam.',
    canonical: `${SITE_URL}/contacts`,
    robots: 'index, follow',
    ogType: 'website',
    ogTitle: 'Kontakti un zāles adrese Rīgā | Kumite Karate Klubs',
    ogDescription:
      'Zāles adrese: Gustava Zemgala gatve 71, Rīga. Tālrunis: +371 29177274. Piesakies bezmaksas izmēģinājuma nodarbībai!',
    ogImage: OG_IMAGE_URL,
    ogImageAlt: OG_IMAGE_ALT,
    preloadHero: KARATE_HERO_PRELOAD,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        SPORTS_CLUB_ENTITY,
        {
          '@type': 'ContactPage',
          '@id': `${SITE_URL}/contacts#webpage`,
          url: `${SITE_URL}/contacts`,
          name: 'Kontakti un zāles adrese Rīgā | Kumite Karate Klubs',
          inLanguage: 'lv-LV',
          isPartOf: { '@id': `${SITE_URL}/#website` },
          mainEntity: { '@id': `${SITE_URL}/#sportsclub` },
        },
        buildBreadcrumb('Kontakti', '/contacts'),
      ],
    },
  },
};

const ADMIN_SEO: RouteSeoData = {
  path: '/admin',
  title: 'Vadības panelis | Kumite Karate Klubs',
  description: 'Kumite Karate Kluba administrācijas panelis.',
  canonical: `${SITE_URL}/admin`,
  robots: 'noindex, nofollow',
  ogType: 'website',
  ogTitle: 'Vadības panelis | Kumite Karate Klubs',
  ogDescription: 'Administrācijas panelis.',
  ogImage: OG_IMAGE_URL,
  ogImageAlt: OG_IMAGE_ALT,
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Vadības panelis | Kumite Karate Klubs',
    url: `${SITE_URL}/admin`,
  },
};

export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

export function getRouteSeo(pathname: string): RouteSeoData {
  const normalized = normalizePathname(pathname);
  if (normalized.startsWith('/admin')) {
    return ADMIN_SEO;
  }
  if (normalized in ROUTE_SEO_MAP) {
    return ROUTE_SEO_MAP[normalized as PublicRoutePath];
  }
  return ROUTE_SEO_MAP['/'];
}
