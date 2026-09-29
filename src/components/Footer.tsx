import { Link } from 'react-router-dom';
import { Palmtree, Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube, Twitter, Send } from 'lucide-react';
import { useSettings } from '../lib/settings';
import { useLang } from '../i18n/lang';
import { waLink } from '../lib/api';
import { useResource } from '../lib/api';
import type { Destination } from '../lib/types';

export default function Footer() {
  const { get } = useSettings();
  const { t } = useLang();
  const brand = get('brand_name', 'Serendib Trails');
  const { data: dests } = useResource<Destination>('/api/destinations');
  const top = (dests || []).slice(0, 6);

  const socials = [
    { icon: Facebook, href: get('facebook', 'https://facebook.com'), label: 'Facebook' },
    { icon: Instagram, href: get('instagram', 'https://instagram.com'), label: 'Instagram' },
    { icon: Youtube, href: get('youtube', 'https://youtube.com'), label: 'YouTube' },
    { icon: Twitter, href: get('twitter', 'https://x.com'), label: 'X' },
    { icon: Send, href: get('tiktok', 'https://tiktok.com'), label: 'TikTok' },
  ];

  return (
    <footer className="relative overflow-hidden bg-jungle-950 text-white">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-ocean-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gold-500/15 blur-3xl" />
      <div className="container-x relative grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-sunset-500">
              <Palmtree size={24} className="text-jungle-950" />
            </span>
            <span className="leading-tight">
              <span className="font-display block text-xl font-bold">{brand}</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-gold-300">Sri Lanka Tours</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/65">{t('footer.tagline')}</p>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            {get('about_short', 'Licensed tour operator crafting unforgettable journeys across the Pearl of the Indian Ocean.')}
          </p>
          <div className="mt-5 flex gap-2.5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-gold-400 hover:text-jungle-950"
              >
                <s.icon size={17} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-[0.18em] text-gold-300">{t('footer.quickLinks')}</h4>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm font-medium text-white/75">
            {[['/destinations', t('nav.destinations')], ['/packages', t('nav.packages')], ['/plan-trip', t('nav.plan')], ['/transport', t('nav.transport')], ['/hotels', t('nav.hotels')], ['/gallery', t('nav.gallery')], ['/blog', t('nav.blog')], ['/reviews', t('nav.reviews')], ['/faq', t('nav.faq')], ['/about', t('nav.about')], ['/contact', t('nav.contact')], ['/booking', t('nav.booking')]].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="transition hover:text-gold-300">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-[0.18em] text-gold-300">{t('footer.destinations')}</h4>
          <ul className="mt-4 space-y-2 text-sm font-medium text-white/75">
            {top.map((d) => (
              <li key={d.id}>
                <Link to={`/destinations/${d.slug}`} className="transition hover:text-gold-300">
                  {d.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/destinations" className="font-bold text-gold-300 hover:text-gold-400">
                View all →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-[0.18em] text-gold-300">{t('footer.contact')}</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            <li className="flex gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold-300" />
              {get('address', 'No. 42, Galle Road, Colombo 03, Sri Lanka')}
            </li>
            <li>
              <a href={`tel:${get('phone', '+94 77 123 4567').replace(/\s/g, '')}`} className="flex gap-2.5 transition hover:text-gold-300">
                <Phone size={16} className="mt-0.5 shrink-0 text-gold-300" /> {get('phone', '+94 77 123 4567')}
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); window.open(waLink(get('whatsapp', '94771234567'), get('whatsapp_message', 'Hello! I would like to plan a Sri Lanka tour.')), '_blank'); }} className="flex gap-2.5 transition hover:text-gold-300">
                <Phone size={16} className="mt-0.5 shrink-0 text-gold-300" /> WhatsApp: {get('whatsapp_display', '+94 77 123 4567')}
              </a>
            </li>
            <li>
              <a href={`mailto:${get('email', 'hello@serendibtrails.lk')}`} className="flex gap-2.5 transition hover:text-gold-300">
                <Mail size={16} className="mt-0.5 shrink-0 text-gold-300" /> {get('email', 'hello@serendibtrails.lk')}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Clock size={16} className="mt-0.5 shrink-0 text-gold-300" /> {get('hours', 'Daily 8:00 AM – 10:00 PM (Sri Lanka time)')}
            </li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/50 sm:flex-row">
          <span>© {new Date().getFullYear()} {brand}. {t('footer.rights')}</span>
          <span className="flex gap-4">
            <Link to="/faq" className="hover:text-gold-300">FAQ</Link>
            <Link to="/contact" className="hover:text-gold-300">Contact</Link>
            <Link to="/admin" className="hover:text-gold-300">Owner Login</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
