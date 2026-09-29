import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ChevronDown, Palmtree, Globe } from 'lucide-react';
import { useSettings } from '../lib/settings';
import { AVAILABLE_LANGS, COMING_SOON_LANGS, useLang, type Lang } from '../i18n/lang';

const LINKS: { to: string; key: string }[] = [
  { to: '/', key: 'nav.home' },
  { to: '/destinations', key: 'nav.destinations' },
  { to: '/packages', key: 'nav.packages' },
  { to: '/plan-trip', key: 'nav.plan' },
  { to: '/transport', key: 'nav.transport' },
  { to: '/hotels', key: 'nav.hotels' },
];

const MORE_LINKS: { to: string; key: string }[] = [
  { to: '/gallery', key: 'nav.gallery' },
  { to: '/blog', key: 'nav.blog' },
  { to: '/reviews', key: 'nav.reviews' },
  { to: '/faq', key: 'nav.faq' },
  { to: '/about', key: 'nav.about' },
  { to: '/contact', key: 'nav.contact' },
];

function LangPicker({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold ${dark ? 'text-white hover:bg-white/10' : 'text-jungle-900 hover:bg-jungle-900/5'}`}
        aria-label="Change language"
      >
        <Globe size={15} />
        {lang === 'en' ? 'EN' : 'සිං'}
        <ChevronDown size={13} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-jungle-900/10 bg-white shadow-2xl">
            {AVAILABLE_LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code as Lang);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-sm font-semibold text-jungle-950 hover:bg-sand-100 ${lang === l.code ? 'bg-sand-100' : ''}`}
              >
                {l.native}
                {lang === l.code && <span className="text-ocean-600">✓</span>}
              </button>
            ))}
            <div className="border-t border-jungle-900/10 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-ink-900/40">
              Coming soon
            </div>
            {COMING_SOON_LANGS.map((l) => (
              <div key={l} className="px-4 py-1.5 text-sm text-ink-900/40">
                {l}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { get } = useSettings();
  const { t } = useLang();
  const brand = get('brand_name', 'Serendib Trails');
  const phone = get('phone', '+94 77 123 4567');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const solid = scrolled || mobileOpen;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${solid ? 'bg-jungle-950/95 shadow-xl shadow-jungle-950/20 backdrop-blur' : 'bg-gradient-to-b from-jungle-950/70 to-transparent'}`}>
      <div className="container-x flex items-center justify-between gap-3 py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-sunset-500 shadow-lg shadow-gold-500/30">
            <Palmtree size={24} className="text-jungle-950" />
          </span>
          <span className="leading-tight">
            <span className="font-display block text-xl font-bold tracking-tight text-white">{brand}</span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-gold-300">Sri Lanka Tours</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-2 text-[13px] font-semibold transition ${isActive ? 'bg-white/15 text-gold-300' : 'text-white/85 hover:bg-white/10 hover:text-white'}`
              }
            >
              {t(l.key)}
            </NavLink>
          ))}
          <div className="group relative">
            <button className="flex items-center gap-1 rounded-full px-3.5 py-2 text-[13px] font-semibold text-white/85 transition hover:bg-white/10 hover:text-white">
              More <ChevronDown size={14} />
            </button>
            <div className="invisible absolute right-0 top-full z-50 w-48 translate-y-2 pt-2 opacity-0 transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="overflow-hidden rounded-2xl border border-jungle-900/10 bg-white shadow-2xl">
                {MORE_LINKS.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    className="block px-4 py-2.5 text-sm font-semibold text-jungle-950 transition hover:bg-sand-100"
                  >
                    {t(l.key)}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <a href={`tel:${phone.replace(/\s/g, '')}`} className="hidden items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/20 lg:flex">
            <Phone size={14} className="text-gold-300" /> {phone}
          </a>
          <div className="hidden sm:block">
            <LangPicker dark />
          </div>
          <Link
            to="/booking"
            className="hidden rounded-full bg-gradient-to-r from-gold-500 to-gold-400 px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-jungle-950 shadow-lg shadow-gold-500/30 transition hover:brightness-105 sm:inline-flex"
          >
            {t('nav.booking')}
          </Link>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white xl:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="max-h-[75vh] overflow-y-auto border-t border-white/10 bg-jungle-950/98 pb-6 xl:hidden" style={{ background: 'rgba(7,33,29,0.98)' }}>
          <nav className="container-x grid gap-1 py-4">
            {[...LINKS, ...MORE_LINKS].map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-white/15 text-gold-300' : 'text-white/85 hover:bg-white/10'}`
                }
              >
                {t(l.key)}
              </NavLink>
            ))}
            <div className="mt-2 flex items-center gap-3 px-4">
              <LangPicker dark />
              <Link
                to="/booking"
                className="flex-1 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 px-6 py-3 text-center text-xs font-extrabold uppercase tracking-wider text-jungle-950"
              >
                {t('nav.booking')}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
