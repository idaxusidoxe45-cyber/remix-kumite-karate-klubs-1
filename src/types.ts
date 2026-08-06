export type PageTab = 'home' | 'about' | 'coaches' | 'schedule' | 'gallery' | 'contacts';

export interface ScheduleGroup {
  id: number | string;
  title: string;
  image: string;
  schedule: string[];
  description?: string;
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
