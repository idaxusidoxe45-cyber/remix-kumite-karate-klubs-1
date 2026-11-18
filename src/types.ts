export type PageTab = 'home' | 'about' | 'coaches' | 'schedule' | 'gallery' | 'contacts' | 'admin';

export type AgeGroupFilter = '5-7' | '7-11' | '12-17';

export interface ScheduleGroup {
  id: number | string;
  title: string;
  image: string;
  schedule: string[];
  description?: string;
  ageGroups?: AgeGroupFilter[];
  ageLabel?: string;
  dayPattern?: 'mwf' | 'tt';
}

export interface BeltDetail {
  id: number;
  label: string;
  rank: string;
  name: string;
  primaryColor: string;
  secondaryColor?: string;
  isApparel?: boolean;
  apparelIcon?: 'tshirt' | 'kimono' | 'emblem';
  focus: string;
  kihon: string;
  kumite: string;
}

export interface GalleryItem {
  id: number | string;
  title: string;
  category: 'trenini' | 'eksameni' | 'sacensibas' | 'nometnes' | 'pasakumi' | 'zale';
  image: string;
  fullImage?: string;
  caption: string;
}

export interface Testimonial {
  id: number | string;
  author: string;
  text: string;
  role?: string;
  rating?: number;
  status?: 'published' | 'draft' | 'rejected';
}

export interface FaqItem {
  question: string;
  answer: string;
}
