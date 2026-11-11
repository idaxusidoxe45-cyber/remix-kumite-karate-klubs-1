import { ScheduleGroup, GalleryItem, Testimonial, FaqItem } from './types';

export const SCHEDULE_GROUPS: ScheduleGroup[] = [
  {
    id: 1,
    title: '1. GRUPA',
    image: '/assets_gallery/trenini/karate-web-1-400x284.webp',
    schedule: [
      'PIRMDIENA : 15:30 – 16:45',
      'TREŠDIENA: 15:30 – 16:45',
      'PIEKTDIENA: 15:30 – 16:45'
    ]
  },
  {
    id: 2,
    title: '2. GRUPA',
    image: '/assets_gallery/trenini/karate-web-2-400x284.webp',
    schedule: [
      'PIRMDIENA : 16:45 – 18:00',
      'TREŠDIENA: 16:45 – 18:00',
      'PIEKTDIENA: 16:45 – 18:00'
    ]
  },
  {
    id: 3,
    title: '3. GRUPA',
    image: '/assets_gallery/trenini/karate-web-3-400x284.webp',
    schedule: [
      'PIRMDIENA : 18:00 – 19:15',
      'TREŠDIENA: 18:00 – 19:15',
      'PIEKTDIENA: 18:00 – 19:15'
    ]
  },
  {
    id: 4,
    title: '4. GRUPA',
    image: '/assets_gallery/trenini/karate-web-4-400x284.webp',
    schedule: [
      'PIRMDIENA : 19:15 – 20:30',
      'TREŠDIENA: 19:15 – 20:30',
      'PIEKTDIENA: 19:15 – 20:30'
    ]
  },
  {
    id: 5,
    title: '5. GRUPA',
    image: '/assets_gallery/trenini/karate-web-6-400x284.webp',
    schedule: [
      'OTRDIENA : 18:00 – 19:00',
      'CETURTDIENA: 18:00 – 19:00'
    ]
  },
  {
    id: 6,
    title: '6. GRUPA',
    image: '/assets_gallery/trenini/karate-web-10-1-400x284.webp',
    schedule: [
      'OTRDIENA : 19:00 – 20:15',
      'CETURTDIENA: 19:00 – 20:15'
    ]
  }
];

export const HOME_GALLERY_PREVIEW: GalleryItem[] = [
{
    "id": 1,
    "category": "eksameni",
    "title": "Eksāmeni",
    "caption": "Eksāmenu fotogrāfija",
    "image": "/assets_gallery/eksameni/0ba2a7bc-fcab-49ac-8a8a-9eb3551f8951-1-400x284.webp",
    "fullImage": "/assets_gallery/eksameni/0ba2a7bc-fcab-49ac-8a8a-9eb3551f8951-1.webp"
  },
{
    "id": 2,
    "category": "eksameni",
    "title": "Eksāmeni",
    "caption": "Eksāmenu fotogrāfija",
    "image": "/assets_gallery/eksameni/289ff004-dde9-4c4c-9d53-0bddc122d087-1-400x284.webp",
    "fullImage": "/assets_gallery/eksameni/289ff004-dde9-4c4c-9d53-0bddc122d087-1-scaled.webp"
  },
{
    "id": 3,
    "category": "eksameni",
    "title": "Eksāmeni",
    "caption": "Eksāmenu fotogrāfija",
    "image": "/assets_gallery/eksameni/306720bb-d6e4-4dd7-8aa7-007dda031edb-1-400x284.webp",
    "fullImage": "/assets_gallery/eksameni/306720bb-d6e4-4dd7-8aa7-007dda031edb-1.webp"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    author: 'Vilnis',
    status: 'published',
    text: '“Manā uztverē Kumite Karate klubs ir ļoti labs, jo tur trenējas mans dēls, kuram ir ļoti labi panākumi salīdzinoši īsā laika posmā, pateicoties trenera individuālajai pieejai pret katru audzēkni un izvērtējot katra spējas”'
  },
  {
    id: 2,
    author: 'Jūlija',
    status: 'published',
    text: '“Paldies! Mēs rītdien būsim! Pie mums izrunājām, ka Vincents ir atradis savu perfekto sporta veidu un tā sajūta ir mums abiem.”'
  },
  {
    id: 3,
    author: 'Irina',
    status: 'published',
    text: '“Mans dēls apmeklē un ļoti patīk. Jauka atmosfēra, interesantas spēles, laba disciplīna un foršs treneris. Paldies!”'
  },
  {
    id: 4,
    author: 'Margarita',
    status: 'published',
    text: '“Bērni jau 6 gadus trenējas karatē pie Nikolaja — ļoti patīk! Bērni ir sportiski, rezultāti ir labi, braucam uz sacensībām un izcīnām augstas vietas. Noteikti iesaku, esam ļoti apmierināti.”'
  },
  {
    id: 5,
    author: 'Olivijas mamma',
    status: 'published',
    text: '“Liels paldies Nikolajam par tik nopietno darbu ar mūsu bērniem! Jūsu aizrautība un profesionalitāte patiesi iedvesmo!”'
  },
  {
    id: 6,
    author: 'Kristīne',
    status: 'published',
    text: '“Gribu izteikt sirsnīgu pateicību trenerim Nikolajam par profesionālismu un pozitīvo attieksmi pret bērniem. Ar savu attieksmi un mīlestību pret savu darbu un bērniem, Jūs esat radījis lielisku iespēju bērniem izpētīt karatē pasauli, augt un attīstīties par karatistu.\n\nKatrs treniņš ir ar individuālu pieeju, pozitīvs un ar atvērtu vidi.\n\nEs novērtēju Jūsu darbu, radot drošu un motivējošu atmosfēru, kurā aug un attīstās mūsu bērni, pirmkārt kā individualitāte un personība ar saviem mērķiem un pozitīvu attieksmi un gribasspēku, lai kļūtu par izcilu karatistu.”'
  },
  {
    id: 7,
    author: 'Juliāna mamma',
    status: 'published',
    text: '“Labdien, trener! Milzīgs paldies par Jūsu darba ieguldījumu bērnos un, jo īpaši par Juliāna redzesloka paplašināšanu un iedrošinājumiem! 😊 ”'
  },
  {
    id: 8,
    author: 'Juliāna mamma par nometni',
    status: 'published',
    text: '“Jā, esot paticis vislabāk LaserTag, putu balle, tautas bumba, peldēšana, kvadracikli, treniņi, florbols...oj, laikam visu pārējo nosaukto vairs nerakstīšu 😊 ”'
  },
  {
    id: 9,
    author: 'Kristina par nometni',
    status: 'published',
    text: '“Ļoti patika — bija daudz aktivitāšu, jautrības, garšīgs ēdiens un mājīgi namiņi.”'
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Kas jāņem līdzi uz pirmo nodarbību?',
    answer: 'Uz pirmo nodarbību jāņem ērts sporta tērps (sporta krekls, šorti/bikses), gumijas čības un ūdens pudele. Nodarbības notiek ar basām kājām.'
  },
  {
    question: 'Kad jāiegādājas kimono?',
    answer: 'Kimono pašiem nav jāiegādājas. Kimono var iegūt tikai pēc eksāmena nokārtošanas. Kimono ir iekļauts eksāmena cenā. Eksāmens notiek divas reizes gadā.'
  },
  {
    question: 'Vai uz izmēģinājuma nodarbību ir jāpiesakās?',
    answer: 'Jā, obligāti ir jāpiesakās, aizpildot pieteikuma formu vai sazinoties ar mums pa tālruni.'
  },
  {
    question: 'Par izmēģinājuma nodarbību ir jāmaksā?',
    answer: 'Par izmēģinājuma nodarbību nav jāmaksā, tā ir bezmaksas.'
  },
  {
    question: 'Vai vecāki var skatīties nodarbības norisi?',
    answer: 'Jā, var.'
  },
  {
    question: 'Vai pie zāles var novietot auto?',
    answer: 'Jā, automašīnu var novietot bezmaksas.'
  }
];

export const BELT_SYSTEM = [
  '11 kyu - Karatē krekls (mazākajiem karatistiem)',
  '10 kyu – Kimono',
  '10 kyu – Emblēma',
  '9 kyu – Balta – Sarkana',
  '9 kyu – Sarkana',
  '8 kyu – Sarkana – Oranža',
  '8 kyu – Oranža',
  '7 kyu – Oranža – Dzeltena',
  '7 kyu – Dzeltena',
  '6 kyu – Dzeltena – Zaļa',
  '6 kyu – Zaļa',
  '5 kyu – Zaļa – Zila',
  '5 kyu – Zila',
  '4 kyu – Zila – Brūna',
  '3 kyu – Brūna',
  '2 kyu – Brūna',
  '1 kyu – Brūna',
  '1 DAN – Melna'
];

export const JAPANESE_NUMBERS = [
  { jp: 'Ichi', lv: 'Viens' },
  { jp: 'Ni', lv: 'Divi' },
  { jp: 'San', lv: 'Trīs' },
  { jp: 'Shi', lv: 'Četri' },
  { jp: 'Go', lv: 'Pieci' },
  { jp: 'Roku', lv: 'Seši' },
  { jp: 'Shichi', lv: 'Septiņi' },
  { jp: 'Hachi', lv: 'Astoņi' },
  { jp: 'Kyu', lv: 'Deviņi' },
  { jp: 'Ju', lv: 'Desmit' }
];

export const STRIKE_LEVELS = [
  { level: 'Augšējais līmenis – JODAN', desc: '(galva, seja, kakls)' },
  { level: 'Vidējais līmenis – CHUDAN', desc: '(krūtis, vēders, mugura, sāni)' },
  { level: 'Apakšējais līmenis – GEDAN', desc: '(kājas, ceļi)' }
];

// Dynamic gallery items loader with cloud synchronization & server-side deletion support
export function getDynamicGalleryItems(): GalleryItem[] {
  let localCustomItems: GalleryItem[] = [];
  let deletedIds = new Set<string>();

  if (typeof window !== 'undefined') {
    try {
      localCustomItems = JSON.parse(localStorage.getItem('kumite_custom_gallery') || '[]');
      const deletedArr = JSON.parse(localStorage.getItem('kumite_deleted_gallery_ids') || '[]');
      deletedIds = new Set(deletedArr.map(String));
    } catch {
      // ignore
    }
  }

  const baseItems = HOME_GALLERY_PREVIEW.filter(item => !deletedIds.has(String(item.id)));
  const customFiltered = localCustomItems.filter(item => !deletedIds.has(String(item.id)));
  return [...customFiltered, ...baseItems];
}

export async function getDynamicGalleryItemsAsync(): Promise<GalleryItem[]> {
  const { GALLERY_ITEMS } = await import('./data/gallery');
  let localCustomItems: GalleryItem[] = [];
  let deletedIds = new Set<string>();
  if (typeof window !== 'undefined') {
    try {
      localCustomItems = JSON.parse(localStorage.getItem('kumite_custom_gallery') || '[]');
      const deletedArr = JSON.parse(localStorage.getItem('kumite_deleted_gallery_ids') || '[]');
      deletedIds = new Set(deletedArr.map(String));
    } catch {}
  }
  const baseItems = GALLERY_ITEMS.filter(item => !deletedIds.has(String(item.id)));
  const customFiltered = localCustomItems.filter(item => !deletedIds.has(String(item.id)));
  return [...customFiltered, ...baseItems];
}

export async function fetchCloudGalleryItems(options: { previewOnly?: boolean } = {}): Promise<GalleryItem[]> {
  try {
    const res = await fetch('/api/gallery', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        const cloudDeletedIds = new Set<string>((Array.isArray(data.deletedIds) ? data.deletedIds : []).map(String));

        // Sync deleted IDs cache locally
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('kumite_deleted_gallery_ids', JSON.stringify(Array.from(cloudDeletedIds)));
          } catch {}
        }

        const cloudItems: GalleryItem[] = data.items.filter(
          (item: GalleryItem) => !cloudDeletedIds.has(String(item.id))
        );
        const cloudIds = new Set(cloudItems.map((i: GalleryItem) => String(i.id)));
        const baseSource = options.previewOnly ? HOME_GALLERY_PREVIEW : (await import('./data/gallery')).GALLERY_ITEMS;
        const baseFiltered = baseSource.filter(
          i => !cloudIds.has(String(i.id)) && !cloudDeletedIds.has(String(i.id))
        );
        return [...cloudItems, ...baseFiltered];
      }
    }
  } catch (err) {
    console.error('Cloud gallery fetch error:', err);
  }
  return options.previewOnly ? getDynamicGalleryItems() : getDynamicGalleryItemsAsync();
}

// Memoized dynamic testimonials loader
let cachedCmsTestimonials: Testimonial[] | null = null;
export function getDynamicTestimonials(): Testimonial[] {
  if (!cachedCmsTestimonials) {
    const globReviews = import.meta.glob<{
      author?: string;
      role?: string;
      text?: string;
      rating?: number;
      status?: 'published' | 'draft' | 'rejected';
    }>(['/src/content/reviews/*.json'], { eager: true, import: 'default' });

    const cmsReviews: Testimonial[] = [];
    let nextId = 20000;

    for (const path in globReviews) {
      const data = globReviews[path];
      if (data && data.author && data.text) {
        cmsReviews.push({
          id: nextId++,
          author: data.author,
          role: data.role,
          text: data.text,
          rating: data.rating || 5,
          status: data.status || 'published',
        });
      }
    }

    cachedCmsTestimonials = cmsReviews.length > 0 ? cmsReviews : TESTIMONIALS;
  }

  let localReviews: Testimonial[] = [];
  if (typeof window !== 'undefined') {
    try {
      localReviews = JSON.parse(localStorage.getItem('user_submitted_reviews') || '[]');
    } catch {
      // ignore
    }
  }

  return [...localReviews, ...cachedCmsTestimonials];
}

export async function fetchCloudTestimonials(): Promise<Testimonial[]> {
  const staticBase = (() => {
    getDynamicTestimonials();
    return cachedCmsTestimonials || TESTIMONIALS;
  })();

  try {
    const res = await fetch('/api/reviews', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.reviews)) {
        const overrides: Record<string, any> = data.overrides || {};
        const cloudReviews: Testimonial[] = (data.reviews as Testimonial[]).filter(
          r => !overrides[String(r.id)]?.deleted
        );
        const cloudIds = new Set(cloudReviews.map(r => String(r.id)));

        const mergedStatic = staticBase
          .filter(r => !cloudIds.has(String(r.id)))
          .filter(r => !overrides[String(r.id)]?.deleted)
          .map(r => {
            const ov = overrides[String(r.id)];
            return ov ? { ...r, ...ov } : r;
          });

        return [...cloudReviews, ...mergedStatic];
      }
    }
  } catch (err) {
    console.error('Cloud reviews fetch error:', err);
  }
  return getDynamicTestimonials();
}
