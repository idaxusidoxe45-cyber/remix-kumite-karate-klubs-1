import type { ScheduleGroup, GalleryItem, Testimonial, FaqItem, BeltDetail } from './types.ts';

export const SCHEDULE_GROUPS: ScheduleGroup[] = [
  {
    id: 1,
    title: '1. GRUPA',
    image: '/assets_gallery/trenini/karate-web-1-400x284.webp',
    ageGroups: ['5-6', '7-9'],
    ageLabel: '5–9 gadi • Pēcpusdienas grupa',
    dayPattern: 'mwf',
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
    ageGroups: ['7-9'],
    ageLabel: '7–9 gadi • Pamatskola',
    dayPattern: 'mwf',
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
    ageGroups: ['7-9', '10+'],
    ageLabel: '7–12 gadi • Vakara grupa',
    dayPattern: 'mwf',
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
    ageGroups: ['10+'],
    ageLabel: '10+ gadi • Vecākā grupa',
    dayPattern: 'mwf',
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
    ageGroups: ['5-6'],
    ageLabel: '5–6 gadi • Mazie iesācēji',
    dayPattern: 'tt',
    schedule: [
      'OTRDIENA : 18:00 – 19:00',
      'CETURTDIENA: 18:00 – 19:00'
    ]
  },
  {
    id: 6,
    title: '6. GRUPA',
    image: '/assets_gallery/trenini/karate-web-10-1-400x284.webp',
    ageGroups: ['10+'],
    ageLabel: '10+ gadi • Iesācēji un jaunieši',
    dayPattern: 'tt',
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

export const BELT_SYSTEM_DETAILS: BeltDetail[] = [
  {
    id: 0,
    label: BELT_SYSTEM[0],
    rank: '11. kyu',
    name: 'Karatē krekls (mazākajiem)',
    primaryColor: '#f8fafc',
    secondaryColor: '#dc2626',
    isApparel: true,
    focus: 'Pirmais iepazīšanās posms pašiem mazākajiem karatistiem (5–6 gadi): droša adaptācija zālē, koordinācijas spēles un disciplīnas pamati.',
    kihon: 'Pareiza sveicināšanās (Rei), taisna stāja (Musubi-dachi), pirmie taisnie sitieni no vietas (Choku-zuki) un droša krišana.',
    kata: 'Ritma un koordinācijas kombinācijas kustībā',
    kumite: 'Reakcijas un distances vingrinājumi rotaļu formā',
    skills: [
      'Zāles etiķete un cieņa pret treneri un biedriem',
      'Pamata līdzsvars, lokanība un skaitīšana japāniski (1–10)',
      'Kluba treniņu T-krekla saņemšana pēc pirmā pārbaudījuma'
    ]
  },
  {
    id: 1,
    label: BELT_SYSTEM[1],
    rank: '10. kyu',
    name: 'Kimono',
    primaryColor: '#ffffff',
    isApparel: true,
    focus: 'Pirmā īstā karatē atestācija: audzēknis apliecina gatavību nēsāt baltu kimono (iekļauts eksāmena cenā) un baltu jostu.',
    kihon: 'Zenkutsu-dachi stāja, Oi-zuki (solis ar sitienu), Gedan-barai (apakšējais bloks) un Mae-geri (taisnais kājas sitiens).',
    kata: 'Taikyoku Shodan sagatavošanas soļi',
    kumite: 'Pamatuzbrukuma un aizsardzības kustību sinhronizācija',
    skills: [
      'Patstāvīga kimono uzvilkšana un pareiza jostas sasiešana',
      'Pirmie precīzie bloki un taisnie sitieni pārvietojoties',
      'Skaļš un pārliecinošs Kiai (enerģijas izelpa)'
    ]
  },
  {
    id: 2,
    label: BELT_SYSTEM[2],
    rank: '10. kyu',
    name: 'Emblēma',
    primaryColor: '#f1f5f9',
    secondaryColor: '#0f172a',
    isApparel: true,
    focus: 'Piederības zīme Kumite Karatē Klubam: tehniskās bāzes nostiprināšana baltās jostas posmā un oficiālās kluba emblēmas saņemšana.',
    kihon: 'Oi-zuki, Age-uke (augšējais bloks), Soto-uke (ārējais bloks), Mae-geri uz priekšu un pagriezienā.',
    kata: 'Taikyoku Shodan (pirmā daļa un virzienu maiņa)',
    kumite: 'Pāra vingrinājumi precīzai distances izjūtai',
    skills: [
      'Stabilas pamata stājas bez līdzsvara zuduma',
      'Atšķirība starp Jodan, Chudan un Gedan sitienu līmeņiem',
      'Oficiālās kluba emblēmas piešūšana uz kimono'
    ]
  },
  {
    id: 3,
    label: BELT_SYSTEM[3],
    rank: '9. kyu',
    name: 'Balta – Sarkana josta',
    primaryColor: '#ffffff',
    secondaryColor: '#dc2626',
    focus: 'Pāreja no baltās uz pirmo krāsaino jostu: pirmā pilnā kata un sistemātiska bloku kombinēšana.',
    kihon: 'Oi-zuki, Age-uke, Soto-uke, Uchi-uke, Gedan-barai un Mae-geri kustībā uz priekšu un atpakaļ.',
    kata: 'Taikyoku Shodan (pilnā izpilde)',
    kumite: 'Gohon Kumite (5 soļu taisnais uzbrukums un bloks)',
    skills: [
      'Pareiza gurnu rotācija sitiena un bloka brīdī',
      'Stabila kāju darbība pagriezienos par 90° un 180°',
      'Ritma un elpošanas kontrole visas katas garumā'
    ]
  },
  {
    id: 4,
    label: BELT_SYSTEM[4],
    rank: '9. kyu',
    name: 'Sarkana josta',
    primaryColor: '#dc2626',
    focus: 'Pilnā sarkanā josta: stingrs tehniskais pamats, koordinēts darbs pārī un pārliecība pirmajās sacensībās.',
    kihon: 'Gyaku-zuki (pretējais sitiens), Kiba-dachi (jātnieka stāja), Yoko-geri Keage (sānu vēziens) un divu sitienu kombinācijas.',
    kata: 'Taikyoku Shodan un Heian Shodan pamati',
    kumite: 'Gohon Kumite (Jodan un Chudan līmenī ar pretuzbrukumu)',
    skills: [
      'Precīzs fokuss (Kime) kustības noslēgumā',
      'Droša aizsardzība un tūlītējs pretuzbrukums pārī',
      'Gatavība pirmajiem startiem kluba un iesācēju turnīros'
    ]
  },
  {
    id: 5,
    label: BELT_SYSTEM[5],
    rank: '8. kyu',
    name: 'Sarkana – Oranža josta',
    primaryColor: '#dc2626',
    secondaryColor: '#f97316',
    focus: 'Starpposms ceļā uz oranžo jostu: jaunu stāju (Kokutsu-dachi) un asu roku tehniku apgūšana.',
    kihon: 'Kokutsu-dachi ar Shuto-uke (atvērtas plaukstas bloks), Kizami-zuki + Gyaku-zuki un Mawashi-geri pamati.',
    kata: 'Heian Shodan (1.–21. kustība)',
    kumite: 'Gohon Kumite ar kustības uzsākšanu no abām kājām',
    skills: [
      'Svara sadalījums aizmugurējā stājā (Kokutsu-dachi)',
      'Sānu sitiena ar kāju (Yoko-geri) precīza trajektorija',
      'Ātra pāreja no aizsardzības uzbrukuma pozīcijā'
    ]
  },
  {
    id: 6,
    label: BELT_SYSTEM[6],
    rank: '8. kyu',
    name: 'Oranža josta',
    primaryColor: '#f97316',
    focus: 'Pirmā klasiskā Shotokan kata pilnā izpildē un pārliecinoša roku-kāju kombināciju koordinācija.',
    kihon: 'Sanbon-zuki (trīskāršs sitiens), Age-uke + Gyaku-zuki, Yoko-geri Kekomi (spēcīgs sānu grūdiens).',
    kata: 'Heian Shodan (pilnā izpilde)',
    kumite: 'Gohon Kumite un Sanbon Kumite pamati',
    skills: [
      'Klasiskās Heian Shodan katas nevainojams ritms',
      'Spēka pārnešana no grīdas caur gurniem līdz sitienam',
      'Līdzsvara saglabāšana augstos kāju sitienos'
    ]
  },
  {
    id: 7,
    label: BELT_SYSTEM[7],
    rank: '7. kyu',
    name: 'Oranža – Dzeltena josta',
    primaryColor: '#f97316',
    secondaryColor: '#eab308',
    focus: 'Ātruma un daudzveidības attīstīšana: jauni sitieni ar kājām un dinamiskas pārejas starp dažādām stājām.',
    kihon: 'Uraken-uchi, Mae-geri + Oi-zuki, Mawashi-geri (apļveida sitiens) un kombinēti bloki kustībā.',
    kata: 'Heian Nidan (sākuma un vidus kombinācijas)',
    kumite: 'Sanbon Kumite (3 soļu kombinētie uzbrukumi)',
    skills: [
      'Pāreja no Kiba-dachi uz Zenkutsu-dachi un Kokutsu-dachi',
      'Apļveida sitiena ar kāju (Mawashi-geri) tehnika',
      'Ātrāka reakcija pret partnera negaidītu uzbrukumu'
    ]
  },
  {
    id: 8,
    label: BELT_SYSTEM[8],
    rank: '7. kyu',
    name: 'Dzeltena josta',
    primaryColor: '#eab308',
    focus: 'Stabila tehniskā bāze un ritma izjūta: audzēknis pārliecinoši demonstrē gan katas, gan kombinēto kumite.',
    kihon: 'Uchi-uke + Kizami-zuki + Gyaku-zuki, Mae-geri + Yoko-geri bez kājas nolikšanas uz tatami.',
    kata: 'Heian Nidan (pilnā izpilde)',
    kumite: 'Sanbon Kumite un Kihon Ippon Kumite ievads',
    skills: [
      'Divu dažādu kāju sitienu izpilde ar vienu kāju',
      'Heian Nidan asums, pauzes un ātruma maiņas',
      'Kontrolēta distance pret partneri bez kontakta kļūdām'
    ]
  },
  {
    id: 9,
    label: BELT_SYSTEM[9],
    rank: '6. kyu',
    name: 'Dzeltena – Zaļa josta',
    primaryColor: '#eab308',
    secondaryColor: '#16a34a',
    focus: 'Solis uz vidējo meistarības līmeni: sarežģītākas kāju-roku sērijas un viena soļa cīņas (Ippon Kumite) apgūšana.',
    kihon: 'Empi-uchi (sitieni ar elkoni), Morote-uke (pastiprinātais bloks), Mawashi-geri + Gyaku-zuki.',
    kata: 'Heian Sandan sagatavošana',
    kumite: 'Kihon Ippon Kumite (Jodan, Chudan)',
    skills: [
      'Viena soļa aizsardzība ar tūlītēju pretuzbrukumu',
      'Tuvās distances elkoņu un īso sitienu pielietojums',
      'Precīza laika izjūta (Timing) pretuzbrukumā'
    ]
  },
  {
    id: 10,
    label: BELT_SYSTEM[10],
    rank: '6. kyu',
    name: 'Zaļa josta',
    primaryColor: '#16a34a',
    focus: 'Vidējā līmeņa josta: disciplinēta, asa tehnika un droša pārvietošanās cīņas distancē.',
    kihon: 'Shuto-uke + Nukite, Fumikomi (piesitiens), Kizami-mae-geri + Oi-zuki + Gyaku-zuki.',
    kata: 'Heian Sandan (pilnā izpilde)',
    kumite: 'Kihon Ippon Kumite (Jodan, Chudan, Mae-geri)',
    skills: [
      'Heian Sandan raksturīgie Kiba-dachi un elkoņu elementi',
      'Ātra distances saīsināšana un atiešana no uzbrukuma līnijas',
      'Emocionālā noturība augstākas slodzes treniņos'
    ]
  },
  {
    id: 11,
    label: BELT_SYSTEM[11],
    rank: '5. kyu',
    name: 'Zaļa – Zila josta',
    primaryColor: '#16a34a',
    secondaryColor: '#2563eb',
    focus: 'Sagatavošanās zilajai jostai: dinamiski lēcieni, āķveida kāju sitieni un augstāka līmeņa koordinācija.',
    kihon: 'Ura-mawashi-geri (atpakaļapļveida sitiens), Kakiwake-uke, Juji-uke, trīskāršas kāju-roku sērijas.',
    kata: 'Heian Yondan (sākuma un vidus posmi)',
    kumite: 'Kihon Ippon Kumite (ar Yoko-geri un Mawashi-geri aizsardzību)',
    skills: [
      'Augsto kāju sitienu kontrole un ātra kājas atgriešana',
      'Sarežģīti pagriezieni ar skatiena fiksēšanu mērķī',
      'Pārliecinoša dalība nacionāla mēroga sacensībās'
    ]
  },
  {
    id: 12,
    label: BELT_SYSTEM[12],
    rank: '5. kyu',
    name: 'Zila josta',
    primaryColor: '#2563eb',
    focus: 'Augsta dinamika un taktikas sākums: katas ar izteiktu elpošanas ritmu un sarežģīti pretuzbrukumi.',
    kihon: 'Mae-geri + Yoko-geri + Ushiro-geri kombinācijas, Hiza-geri, sērijas no brīvās cīņas stājas.',
    kata: 'Heian Yondan (pilnā izpilde)',
    kumite: 'Kihon Ippon Kumite ar dažādiem pretuzbrukuma leņķiem',
    skills: [
      'Heian Yondan lēnā spēka un straujo sprādzienu saskaņa',
      'Aizsardzība pret visiem pamatkāju sitieniem',
      'Taktiska māņu kustība (feints) pārī'
    ]
  },
  {
    id: 13,
    label: BELT_SYSTEM[13],
    rank: '4. kyu',
    name: 'Zila – Brūna josta',
    primaryColor: '#2563eb',
    secondaryColor: '#78350f',
    focus: 'Slieksnis pirms brūnajām jostām: pilna Heian sērijas apgūšana un pāreja uz brīvāku sparingu (Jiyu Ippon).',
    kihon: 'Ushiro-geri (sitiens atpakaļ), Kosa-dachi, lēciena un ātruma maiņas sērijas abos virzienos.',
    kata: 'Heian Godan (pilnā izpilde)',
    kumite: 'Jiyu Ippon Kumite (viena uzbrukuma brīvā cīņa)',
    skills: [
      'Pilna visu piecu Heian katu pārzināšana',
      'Brīva kustība un distances izvēle Jiyu Ippon Kumite',
      'Precīza spēka dozēšana bez traumas riska partnerim'
    ]
  },
  {
    id: 14,
    label: BELT_SYSTEM[14],
    rank: '3. kyu',
    name: 'Brūna josta (3. kyu)',
    primaryColor: '#78350f',
    focus: 'Vecākā skolnieka pakāpe: stingrība, eksplozivitāte un klasiskās dzelzs jātnieka katas (Tekki Shodan) apgūšana.',
    kihon: 'Ātrās sērijas no Fudo-dachi / Kamae stājas, Gyaku-zuki + Mawashi-geri + Ushiro-geri pārejās.',
    kata: 'Tekki Shodan (pilnā izpilde)',
    kumite: 'Jiyu Ippon Kumite (Jodan, Chudan, Mae-geri, Yoko-geri, Mawashi-geri)',
    skills: [
      'Kiba-dachi spēks un stabilitāte visas Tekki Shodan garumā',
      'Skaidrs atbalsts jaunākajiem audzēkņiem treniņos',
      'Taktiskās kombinācijas sporta kumite turnīriem'
    ]
  },
  {
    id: 15,
    label: BELT_SYSTEM[15],
    rank: '2. kyu',
    name: 'Brūna josta (2. kyu)',
    primaryColor: '#78350f',
    focus: 'Meistarības slīpēšana: augstāko Shotokan katu izvēle un brīvais sparings ar pilnu distances kontroli.',
    kihon: 'Sarežģītas kombinācijas ar kāju maiņu, ātras pretuzbrukuma ķēdes un vairāku uzbrukumu bloķēšana.',
    kata: 'Bassai Dai vai Kanku Dai (izvēles kata)',
    kumite: 'Jiyu Ippon Kumite un Jiyu Kumite (brīvais sparings)',
    skills: [
      'Bassai Dai spēka pārvarēšanas dinamika',
      'Brīva improvizācija un pretinieka nodomu lasīšana sparingā',
      'Augsta fiziskā izturība un garīgā koncentrācija'
    ]
  },
  {
    id: 16,
    label: BELT_SYSTEM[16],
    rank: '1. kyu',
    name: 'Brūna josta (1. kyu)',
    primaryColor: '#78350f',
    focus: 'Pēdējais solis pirms melnās jostas: visu kyu programmas prasmju apvienojums un gatavība DAN komisijai.',
    kihon: 'Pilns Shotokan Kihon arsenāls maksimālā ātrumā un ar nevainojamu Kime.',
    kata: 'Bassai Dai, Kanku Dai, Jion vai Enpi (augstākās katas)',
    kumite: 'Jiyu Kumite (brīvais cīņas duelis pret vairākiem partneriem)',
    skills: [
      'Pārliecinoša vairāku augstāko katu un to pielietojuma (Bunkai) izpratne',
      'Spēja analizēt savu un pretinieka tehniku cīņas laikā',
      'Gatavība vadīt iesildīšanos un būt par paraugu klubā'
    ]
  },
  {
    id: 17,
    label: BELT_SYSTEM[17],
    rank: '1. DAN',
    name: 'Melnā josta (Shodan)',
    primaryColor: '#0a0a0c',
    secondaryColor: '#eab308',
    focus: 'Shodan — "pirmais līmenis": bāzes apguve ir noslēgusies, un sākas īstais karatē meistarības ceļš.',
    kihon: 'Visu Shotokan sitienu, bloku, stāju un lēcienu nevainojama demonstrācija augstā tempā.',
    kata: 'Obligātās Heian / Tekki katas + augstākā kata (Bassai Dai / Kanku Dai / Jion / Enpi)',
    kumite: 'Jiyu Kumite un Kihon Ippon Kumite augstākajā līmenī',
    skills: [
      'Pilnīga ķermeņa, elpošanas un gara kontrole (Zanshin)',
      'Katas pielietojuma (Bunkai) un pašaizsardzības prasmju demonstrācija',
      'Oficiāla 1. DAN kvalifikācija un piemērs visai kluba saimei'
    ]
  }
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
export function getDynamicGalleryItems(options: { includeLocal?: boolean } = {}): GalleryItem[] {
  const { includeLocal = true } = options;
  let localCustomItems: GalleryItem[] = [];
  let deletedIds = new Set<string>();

  if (includeLocal && typeof window !== 'undefined') {
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
    const isJson = res.ok && Boolean(res.headers.get('content-type')?.includes('application/json'));
    if (isJson) {
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
export function getDynamicTestimonials(options: { includeLocal?: boolean } = {}): Testimonial[] {
  const { includeLocal = true } = options;
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
  let overrides: Record<string, { status?: 'published' | 'draft' | 'rejected'; deleted?: boolean }> = {};
  if (includeLocal && typeof window !== 'undefined') {
    try {
      localReviews = JSON.parse(localStorage.getItem('user_submitted_reviews') || '[]');
      overrides = JSON.parse(localStorage.getItem('kumite_review_overrides') || '{}');
    } catch {
      // ignore
    }
  }

  const allReviews = [...localReviews, ...cachedCmsTestimonials];
  return allReviews
    .filter((r) => !overrides[String(r.id)]?.deleted)
    .map((r) => {
      const ov = overrides[String(r.id)];
      return ov?.status ? { ...r, status: ov.status } : r;
    });
}

export async function fetchCloudTestimonials(): Promise<Testimonial[]> {
  const staticBase = (() => {
    getDynamicTestimonials();
    return cachedCmsTestimonials || TESTIMONIALS;
  })();

  try {
    const res = await fetch('/api/reviews', { credentials: 'include' });
    const isJson = res.ok && Boolean(res.headers.get('content-type')?.includes('application/json'));
    if (isJson) {
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
