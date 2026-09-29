import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, StarHalf, Loader2, AlertCircle, MapPin, Clock, CalendarDays } from 'lucide-react';
import { fmtUSD, img } from '../lib/api';
import type { Destination, TourPackage, Vehicle, Hotel, Review, Blog } from '../lib/types';
import { useLang } from '../i18n/lang';

export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  light = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <div className="mx-auto mb-10 md:mb-14 max-w-3xl text-center">
      <Reveal>
        <span
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] ${light ? 'bg-white/10 text-gold-300' : 'bg-jungle-900/5 text-ocean-700'}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${light ? 'bg-gold-400' : 'bg-ocean-600'}`} />
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className={`font-display mt-4 text-3xl md:text-5xl font-semibold leading-tight ${light ? 'text-white' : 'text-jungle-950'}`}>{title}</h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.16}>
          <p className={`mt-4 text-base md:text-lg ${light ? 'text-white/70' : 'text-ink-900/60'}`}>{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}

export function Stars({ rating, size = 15 }: { rating: number; size?: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} star rating`}>
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) return <Star key={i} size={size} className="fill-gold-400 text-gold-400" />;
        if (i === full && half) return <StarHalf key={i} size={size} className="fill-gold-400 text-gold-400" />;
        return <Star key={i} size={size} className="text-sand-300" />;
      })}
    </span>
  );
}

export function Loader({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-jungle-900/60">
      <Loader2 className="animate-spin text-ocean-600" size={30} />
      <p className="text-sm font-semibold tracking-wide">{label || 'Loading...'}</p>
    </div>
  );
}

export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="mx-auto my-10 flex max-w-xl flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
      <AlertCircle className="text-red-500" size={28} />
      <p className="font-semibold text-red-700">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-ocean !px-6 !py-2 text-xs">
          Try Again
        </button>
      )}
    </div>
  );
}

export function EmptyBox({ message }: { message: string }) {
  return (
    <div className="mx-auto my-8 max-w-xl rounded-2xl border border-dashed border-jungle-900/20 bg-white/60 px-6 py-10 text-center text-sm text-ink-900/60">
      {message}
    </div>
  );
}

export function PriceTag({ price, note, discount }: { price: number | null; note?: string; discount?: number }) {
  const { t } = useLang();
  if (price === null || price === undefined) {
    return <span className="text-sm font-semibold text-ocean-700">{note || 'Contact for Price'}</span>;
  }
  const final = discount ? Math.round(price * (1 - discount / 100)) : price;
  return (
    <span className="flex items-baseline gap-2">
      {discount ? <s className="text-sm text-ink-900/40">{fmtUSD(price)}</s> : null}
      <span className="text-xl font-extrabold text-jungle-900">
        {fmtUSD(final)}{' '}
        <span className="text-xs font-medium text-ink-900/50">
          {t('common.from')} / {t('common.perPerson')}
        </span>
      </span>
    </span>
  );
}

export function DestinationCard({ d, delay = 0 }: { d: Destination; delay?: number }) {
  const { t } = useLang();
  return (
    <Reveal delay={delay}>
      <Link
        to={`/destinations/${d.slug}`}
        className="card-hover img-zoom group relative block overflow-hidden rounded-3xl shadow-lg shadow-jungle-950/10"
      >
        <div className="aspect-[3/4] w-full overflow-hidden">
          <img src={img(d.image)} alt={d.name} className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-jungle-950/90 via-jungle-950/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-300">
            <MapPin size={12} /> {d.province}
          </p>
          <h3 className="font-display mt-1 text-2xl font-semibold text-white">{d.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-white/75">{d.short_intro}</p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-white group-hover:text-gold-300 transition">
            {t('common.explore')} <ArrowRight size={15} className="transition group-hover:translate-x-1" />
          </span>
        </div>
        {d.featured && (
          <span className="absolute left-4 top-4 rounded-full bg-gold-400 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-jungle-950 shadow">
            Featured
          </span>
        )}
      </Link>
    </Reveal>
  );
}

export function PackageCard({ p, delay = 0 }: { p: TourPackage; delay?: number }) {
  const { t } = useLang();
  return (
    <Reveal delay={delay}>
      <div className="card-hover img-zoom group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-lg shadow-jungle-950/10">
        <Link to={`/packages/${p.slug}`} className="relative block overflow-hidden">
          <div className="aspect-[16/10] w-full overflow-hidden">
            <img src={img(p.image)} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-jungle-950/50 to-transparent opacity-70" />
          <span className="absolute left-4 top-4 rounded-full bg-jungle-950/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">
            {p.category}
          </span>
          {p.discount_pct > 0 && (
            <span className="absolute right-4 top-4 rounded-full bg-sunset-500 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow">
              Save {p.discount_pct}%
            </span>
          )}
          <span className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs font-semibold text-white">
            <Clock size={13} /> {p.duration_label}
          </span>
        </Link>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center gap-2">
            <Stars rating={p.rating || 5} size={13} />
            <span className="text-xs text-ink-900/50">({p.reviews_count || 0})</span>
          </div>
          <Link to={`/packages/${p.slug}`}>
            <h3 className="font-display mt-2 text-xl font-semibold leading-snug text-jungle-950 transition group-hover:text-ocean-700">
              {p.name}
            </h3>
          </Link>
          <p className="mt-1.5 line-clamp-2 text-sm text-ink-900/60">{p.short_desc}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(p.destinations || []).slice(0, 3).map((x) => (
              <span key={x} className="rounded-full bg-jungle-50 px-2.5 py-1 text-[11px] font-semibold text-jungle-800">
                {x}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-jungle-900/10 pt-4 mt-auto">
            <PriceTag price={p.price_usd} note={p.price_note} discount={p.discount_pct} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              to={`/packages/${p.slug}`}
              className="inline-flex items-center justify-center gap-1 rounded-full border border-ocean-700/30 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-ocean-700 transition hover:bg-ocean-700 hover:text-white"
            >
              {t('common.viewDetails')}
            </Link>
            <Link
              to={`/booking?package=${p.id}`}
              className="inline-flex items-center justify-center gap-1 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-jungle-950 shadow transition hover:brightness-105"
            >
              {t('common.bookNow')}
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function VehicleCard({ v, delay = 0 }: { v: Vehicle; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <div className="card-hover img-zoom flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-lg shadow-jungle-950/10">
        <div className="relative overflow-hidden">
          <div className="aspect-[16/10] w-full overflow-hidden">
            <img src={img(v.image)} alt={v.name} className="h-full w-full object-cover" loading="lazy" />
          </div>
          <span className="absolute left-4 top-4 rounded-full bg-jungle-950/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">
            {v.type}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-xl font-semibold text-jungle-950">{v.name}</h3>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-ink-900/65">
            <span className="rounded-lg bg-sand-100 px-2.5 py-1.5 font-semibold">👥 {v.passengers} Passengers</span>
            <span className="rounded-lg bg-sand-100 px-2.5 py-1.5 font-semibold">🧳 {v.luggage}</span>
            <span className="rounded-lg bg-sand-100 px-2.5 py-1.5 font-semibold">❄️ {v.ac ? 'Full A/C' : 'Non A/C'}</span>
            <span className="rounded-lg bg-sand-100 px-2.5 py-1.5 font-semibold">🧑‍✈️ {v.driver_included ? 'Driver incl.' : 'Self-drive'}</span>
          </div>
          <div className="mt-3 text-sm">
            {v.price_per_day_usd ? (
              <span className="font-extrabold text-jungle-900 text-lg">{fmtUSD(v.price_per_day_usd)}</span>
            ) : (
              <span className="font-bold text-ocean-700">{v.price_note || 'Contact for Price'}</span>
            )}
            <span className="text-xs text-ink-900/50"> {v.price_per_day_usd ? '/ day with driver' : ''}</span>
          </div>
          <Link
            to={`/transport?vehicle=${v.id}`}
            className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-ocean-700 to-ocean-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow transition hover:brightness-110"
          >
            Send Inquiry <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

export function HotelCard({ h, delay = 0 }: { h: Hotel; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <div className="card-hover img-zoom flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-lg shadow-jungle-950/10">
        <div className="relative overflow-hidden">
          <div className="aspect-[16/10] w-full overflow-hidden">
            <img src={img(h.image)} alt={h.name} className="h-full w-full object-cover" loading="lazy" />
          </div>
          <span className="absolute left-4 top-4 rounded-full bg-jungle-950/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">
            {h.type}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center gap-2">
            <Stars rating={h.rating || 4.5} size={13} />
            <span className="text-xs font-bold text-ink-900/60">{Number(h.rating || 4.5).toFixed(1)}</span>
          </div>
          <h3 className="font-display mt-2 text-xl font-semibold text-jungle-950">{h.name}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-900/55">
            <MapPin size={13} /> {h.location}
          </p>
          <p className="mt-2 line-clamp-2 text-sm text-ink-900/60">{h.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(h.facilities || []).slice(0, 4).map((f) => (
              <span key={f} className="rounded-full bg-jungle-50 px-2.5 py-1 text-[11px] font-semibold text-jungle-800">
                {f}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-jungle-900/10 pt-4 mt-auto">
            <span className="text-sm font-bold text-jungle-900">{h.price_range}</span>
            <Link to={`/booking?hotel=${encodeURIComponent(h.name)}`} className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-ocean-700 hover:text-ocean-600">
              Book Stay <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function ReviewCard({ r, delay = 0 }: { r: Review; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <div className="card-hover flex h-full flex-col rounded-3xl border border-jungle-900/10 bg-white p-6 shadow-lg shadow-jungle-950/5">
        <Stars rating={r.rating} />
        <h3 className="font-display mt-3 text-lg font-semibold text-jungle-950">“{r.title}”</h3>
        <p className="mt-2 line-clamp-4 flex-1 text-sm leading-relaxed text-ink-900/65">{r.experience}</p>
        <div className="mt-4 flex items-center gap-3 border-t border-jungle-900/10 pt-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-ocean-600 to-jungle-800 text-sm font-extrabold text-white">
            {(r.avatar && r.avatar.trim()) || r.name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-jungle-950">{r.name}</p>
            <p className="truncate text-xs text-ink-900/55">
              {r.country} • {r.package_name}
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function BlogCard({ b, delay = 0 }: { b: Blog; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <Link to={`/blog/${b.slug}`} className="card-hover img-zoom group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-lg shadow-jungle-950/10">
        <div className="relative overflow-hidden">
          <div className="aspect-[16/9] w-full overflow-hidden">
            <img src={img(b.image)} alt={b.title} className="h-full w-full object-cover" loading="lazy" />
          </div>
          <span className="absolute left-4 top-4 rounded-full bg-gold-400 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-jungle-950 shadow">
            {b.category}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-lg font-semibold leading-snug text-jungle-950 transition group-hover:text-ocean-700">{b.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-ink-900/60">{b.excerpt}</p>
          <div className="mt-3 flex items-center gap-3 text-xs text-ink-900/50 mt-auto pt-3 border-t border-jungle-900/10">
            <span className="flex items-center gap-1">
              <CalendarDays size={13} /> {b.created_at ? new Date(b.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
            </span>
            <span>• {b.read_minutes} min read</span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
