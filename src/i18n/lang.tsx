import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

// Language infrastructure: English is the default site language.
// Sinhala (si) chrome translations are included; additional languages
// (ta, fr, de, ...) can be added by extending STRINGS below.
export type Lang = 'en' | 'si';

export const AVAILABLE_LANGS: { code: Lang; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'si', label: 'Sinhala', native: 'සිංහල' },
];

export const COMING_SOON_LANGS = ['தமிழ் (Tamil)', 'Français', 'Deutsch', 'Русский', '中文'];

const STRINGS: Record<Lang, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.destinations': 'Destinations',
    'nav.packages': 'Tour Packages',
    'nav.plan': 'Custom Tour',
    'nav.transport': 'Transport',
    'nav.hotels': 'Hotels',
    'nav.gallery': 'Gallery',
    'nav.blog': 'Blog',
    'nav.reviews': 'Reviews',
    'nav.faq': 'FAQ',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'nav.booking': 'Book Now',
    'common.bookNow': 'Book Now',
    'common.viewDetails': 'View Details',
    'common.readMore': 'Read More',
    'common.explore': 'Explore',
    'common.from': 'from',
    'common.perPerson': 'per person',
    'common.search': 'Search',
    'common.all': 'All',
    'common.loading': 'Loading...',
    'hero.badge': 'Ayubowan! Welcome to Paradise',
    'footer.tagline': 'Handcrafted Sri Lankan journeys since 2012.',
    'footer.quickLinks': 'Quick Links',
    'footer.destinations': 'Top Destinations',
    'footer.contact': 'Contact Us',
    'footer.rights': 'All rights reserved.',
  },
  si: {
    'nav.home': 'මුල් පිටුව',
    'nav.destinations': 'සංචාරක ස්ථාන',
    'nav.packages': 'සංචාරක පැකේජ',
    'nav.plan': 'විශේෂ සංචාරය',
    'nav.transport': 'ප්‍රවාහන',
    'nav.hotels': 'නවාතැන්',
    'nav.gallery': 'ගැලරිය',
    'nav.blog': 'බ්ලොග්',
    'nav.reviews': 'ඇගයීම්',
    'nav.faq': 'ප්‍රශ්න',
    'nav.about': 'අප ගැන',
    'nav.contact': 'සම්බන්ධ වන්න',
    'nav.booking': 'දැන් වෙන් කරන්න',
    'common.bookNow': 'දැන් වෙන් කරන්න',
    'common.viewDetails': 'විස්තර බලන්න',
    'common.readMore': 'වැඩිදුර කියවන්න',
    'common.explore': 'ගවේෂණය',
    'common.from': 'සිට',
    'common.perPerson': 'එක් අයෙකුට',
    'common.search': 'සොයන්න',
    'common.all': 'සියල්ල',
    'common.loading': 'පූරණය වෙමින්...',
    'hero.badge': 'ආයුබෝවන්! පාරාදීසයට සාදරයෙන් පිළිගනිමු',
    'footer.tagline': '2012 සිට අත්දැකීමෙන් සැකසූ ශ්‍රී ලංකා සංචාර.',
    'footer.quickLinks': 'ඉක්මන් සබැඳි',
    'footer.destinations': 'ජනප්‍රිය ස්ථාන',
    'footer.contact': 'සම්බන්ධ වන්න',
    'footer.rights': 'සියලුම හිමිකම් ඇවිරිණි.',
  },
};

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string }>({
  lang: 'en',
  setLang: () => {},
  t: (k) => k,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const s = localStorage.getItem('st-lang');
      return s === 'si' ? 'si' : 'en';
    } catch {
      return 'en';
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem('st-lang', lang);
    } catch {}
  }, [lang]);
  const setLang = (l: Lang) => setLangState(l);
  const t = (k: string): string => STRINGS[lang][k] ?? STRINGS.en[k] ?? k;
  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);
