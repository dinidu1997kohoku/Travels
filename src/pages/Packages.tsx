import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search, SlidersHorizontal, ArrowLeft, ArrowRight, Check, X, Clock, MapPin, BedDouble,
  Car, CalendarDays, ShieldCheck, Star,
} from 'lucide-react';
import PageHero from '../components/PageHero';
import BookingCTA from '../components/BookingCTA';
import { Reveal, PackageCard, Loader, ErrorBox, EmptyBox, Stars, PriceTag } from '../components/ui';
import { useResource, img, arr, fmtUSD } from '../lib/api';
import type { TourPackage } from '../lib/types';

export function Packages() {
  const { data, loading, error, refresh } = useResource<TourPackage>('/api/packages');
  const [sp] = useSearchParams();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState(sp.get('cat') || 'All');
  const [dur, setDur] = useState('All');
  const [price, setPrice] = useState('All');
  const [dest, setDest] = useState('All');

  useEffect(() => {
    const c = sp.get('cat');
    if (c) setCat(c);
  }, [sp]);

  const cats = useMemo(() => ['All', ...Array.from(new Set((data || []).map((p) => p.category).filter(Boolean)))], [data]);
  const dests = useMemo(() => ['All', ...Array.from(new Set((data || []).flatMap((p) => arr(p.destinations))))], [data]);

  const filtered = useMemo(
    () =>
      (data || []).filter((p) => {
        const hay = `${p.name} ${p.category} ${p.short_desc} ${arr(p.destinations).join(' ')}`.toLowerCase();
        if (q && !hay.includes(q.toLowerCase())) return false;
        if (cat !== 'All' && p.category !== cat) return false;
        if (dest !== 'All' && !arr(p.destinations).includes(dest)) return false;
        if (dur === 'Day trips' && p.duration_days > 1) return false;
        if (dur === '2–5 days' && (p.duration_days < 2 || p.duration_days > 5)) return false;
        if (dur === '6–10 days' && (p.duration_days < 6 || p.duration_days > 10)) return false;
        if (dur === '11+ days' && p.duration_days < 11) return false;
        const pr = p.price_usd ?? 999999;
        if (price === 'Under $500' && pr >= 500) return false;
        if (price === '$500 – $1,000' && (pr < 500 || pr > 1000)) return false;
        if (price === '$1,000 – $2,000' && (pr < 1000 || pr > 2000)) return false;
        if (price === 'Over $2,000' && pr <= 2000) return false;
        return true;
      }),
    [data, q, cat, dur, price, dest]
  );

  return (
    <div>
      <PageHero
        title="Tour Packages"
        subtitle="Hand-designed private itineraries — cultural journeys, beach escapes, wildlife safaris, honeymoons and more."
        image="/images/dest-ella.jpg"
        crumbs={[{ label: 'Tour Packages' }]}
      />
      <section className="container-x section-pad">
        <Reveal>
          <div className="rounded-3xl border border-jungle-900/10 bg-white p-5 shadow-lg md:p-6">
            <div className="flex items-center gap-2 text-jungle-900">
              <SlidersHorizontal size={17} />
              <span className="text-sm font-extrabold uppercase tracking-wider">Find your perfect tour</span>
            </div>
            <div className="relative mt-4">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-900/40" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search honeymoon, safari, Sigiriya, 7 days..." className="input-field !pl-11 !py-3" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {cats.map((c) => (
                <button key={c} onClick={() => setCat(c)} className={`chip ${cat === c ? 'bg-jungle-900 text-white border-jungle-900' : 'bg-sand-100 text-jungle-900 border-transparent hover:bg-sand-200'}`}>{c}</button>
              ))}
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <select value={dur} onChange={(e) => setDur(e.target.value)} className="input-field">
                {['All', 'Day trips', '2–5 days', '6–10 days', '11+ days'].map((x) => <option key={x} value={x}>{x === 'All' ? 'Any duration' : x}</option>)}
              </select>
              <select value={price} onChange={(e) => setPrice(e.target.value)} className="input-field">
                {['All', 'Under $500', '$500 – $1,000', '$1,000 – $2,000', 'Over $2,000'].map((x) => <option key={x} value={x}>{x === 'All' ? 'Any price' : x}</option>)}
              </select>
              <select value={dest} onChange={(e) => setDest(e.target.value)} className="input-field">
                {dests.map((x) => <option key={x} value={x}>{x === 'All' ? 'Any destination' : x}</option>)}
              </select>
            </div>
            <p className="mt-3 text-xs font-semibold text-ink-900/50">{filtered.length} package{filtered.length === 1 ? '' : 's'} found</p>
          </div>
        </Reveal>

        {loading ? <Loader /> : error ? <ErrorBox message={error} onRetry={refresh} /> : filtered.length === 0 ? (
          <EmptyBox message="No packages match your filters. Try our Custom Tour Planner and we'll design one for you!" />
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => <PackageCard key={p.id} p={p} delay={(i % 3) * 0.07} />)}
          </div>
        )}
      </section>
      <BookingCTA title="Want Something Different?" subtitle="Every package is fully customisable — add days, swap hotels, change the route. Or start from a blank page." />
    </div>
  );
}

export function PackageDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data, loading } = useResource<TourPackage>('/api/packages');
  const [openDay, setOpenDay] = useState<number | null>(0);

  const p = (data || []).find((x) => x.slug === slug);
  const others = (data || []).filter((x) => x.slug !== slug && x.category === p?.category).slice(0, 3);
  const fallbackOthers = others.length ? others : (data || []).filter((x) => x.slug !== slug).slice(0, 3);

  if (loading) return <div className="pt-32"><Loader /></div>;
  if (!p) {
    return (
      <div className="container-x py-40 text-center">
        <h1 className="font-display text-4xl text-jungle-950">Package not found</h1>
        <Link to="/packages" className="btn-ocean mt-6">Back to Packages</Link>
      </div>
    );
  }

  const itinerary: { day: string; title: string; detail: string }[] = Array.isArray(p.itinerary) ? p.itinerary : [];
  const discounted = p.discount_pct > 0 && p.price_usd ? Math.round(p.price_usd * (1 - p.discount_pct / 100)) : p.price_usd;

  return (
    <div>
      <section className="relative flex min-h-[70vh] items-end overflow-hidden">
        <img src={img(p.image)} alt={p.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-jungle-950 via-jungle-950/40 to-jungle-950/20" />
        <div className="container-x relative pb-14 pt-40">
          <button onClick={() => navigate(-1)} className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-xs font-bold text-white backdrop-blur transition hover:bg-white/25">
            <ArrowLeft size={14} /> Back
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gold-400 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-jungle-950">{p.category}</span>
            <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur"><Clock size={13} /> {p.duration_label}</span>
            <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur"><Star size={13} className="fill-gold-300 text-gold-300" /> {Number(p.rating || 5).toFixed(1)} ({p.reviews_count || 0} reviews)</span>
          </div>
          <h1 className="font-display mt-3 max-w-4xl text-4xl font-semibold text-white text-shadow-hero md:text-6xl">{p.name}</h1>
          <p className="mt-3 flex max-w-2xl flex-wrap items-center gap-1.5 text-sm font-semibold text-white/85">
            <MapPin size={15} className="text-gold-300" /> {arr(p.destinations).join('  •  ')}
          </p>
        </div>
        <svg className="absolute bottom-0 left-0 w-full text-sand-50" viewBox="0 0 1440 70" preserveAspectRatio="none" height="44" aria-hidden>
          <path fill="currentColor" d="M0,32 C240,70 480,0 720,24 C960,48 1200,64 1440,24 L1440,70 L0,70 Z" />
        </svg>
      </section>

      <section className="container-x section-pad grid gap-10 lg:grid-cols-[1.65fr_1fr]">
        <div>
          <Reveal>
            <div className="flex flex-wrap items-center gap-2">
              <Stars rating={p.rating || 5} />
              <span className="text-sm font-semibold text-ink-900/60">{p.reviews_count || 0} traveller reviews</span>
            </div>
            <p className="mt-4 leading-relaxed text-ink-900/75">{p.short_desc}</p>
            <div className="prose-travel mt-2">
              {(p.description || '').split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
            </div>
          </Reveal>

          <Reveal>
            <h2 className="font-display mt-10 flex items-center gap-2.5 text-2xl font-semibold text-jungle-950">
              <CalendarDays size={22} className="text-ocean-600" /> Day-by-Day Itinerary
            </h2>
            <div className="mt-5 space-y-3">
              {itinerary.map((d, i) => (
                <div key={i} className={`overflow-hidden rounded-2xl border transition ${openDay === i ? 'border-ocean-600/40 bg-white shadow-lg' : 'border-jungle-900/10 bg-white/70'}`}>
                  <button onClick={() => setOpenDay(openDay === i ? null : i)} className="flex w-full items-center gap-4 p-4 text-left">
                    <span className={`flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl text-white ${openDay === i ? 'bg-gradient-to-br from-ocean-600 to-jungle-800' : 'bg-jungle-900/70'}`}>
                      <span className="text-[9px] font-bold uppercase">Day</span>
                      <span className="text-base font-extrabold leading-none">{i + 1}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold text-jungle-950">{d.title}</span>
                      <span className="block text-xs text-ink-900/50">{d.day}</span>
                    </span>
                    <span className={`text-xl font-light text-ocean-700 transition ${openDay === i ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  {openDay === i && <p className="border-t border-jungle-900/10 px-4 py-4 pl-[76px] text-sm leading-relaxed text-ink-900/70">{d.detail}</p>}
                </div>
              ))}
              {itinerary.length === 0 && <p className="text-sm text-ink-900/60">Detailed day-by-day plan will be shared with your personalised quote.</p>}
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <Reveal>
              <div className="rounded-3xl border border-jungle-900/10 bg-white p-6 shadow-md">
                <h3 className="flex items-center gap-2 font-bold text-jungle-950"><BedDouble size={18} className="text-ocean-600" /> Accommodation</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-900/70">{p.accommodation}</p>
                <h3 className="mt-5 flex items-center gap-2 font-bold text-jungle-950"><Car size={18} className="text-ocean-600" /> Transport</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-900/70">{p.transport}</p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="rounded-3xl border border-jungle-900/10 bg-white p-6 shadow-md">
                <h3 className="font-bold text-jungle-950">Activities & Experiences</h3>
                <ul className="mt-3 space-y-2">
                  {arr(p.activities).map((a) => (
                    <li key={a} className="flex items-start gap-2 text-sm text-ink-900/70"><Check size={15} className="mt-0.5 shrink-0 text-ocean-600" /> {a}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-3xl bg-emerald-50 p-6 ring-1 ring-emerald-600/15">
                <h3 className="font-bold text-emerald-900">✓ Included</h3>
                <ul className="mt-3 space-y-2">
                  {arr(p.included).map((x) => (
                    <li key={x} className="flex items-start gap-2 text-sm text-emerald-950/80"><Check size={15} className="mt-0.5 shrink-0 text-emerald-600" /> {x}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="h-full rounded-3xl bg-red-50/70 p-6 ring-1 ring-red-500/10">
                <h3 className="font-bold text-red-900">✕ Not Included</h3>
                <ul className="mt-3 space-y-2">
                  {arr(p.excluded).map((x) => (
                    <li key={x} className="flex items-start gap-2 text-sm text-red-950/75"><X size={15} className="mt-0.5 shrink-0 text-red-400" /> {x}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <div className="mt-5 rounded-3xl border border-jungle-900/10 bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 font-bold text-jungle-950"><ShieldCheck size={18} className="text-ocean-600" /> Terms & Conditions</h3>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-900/65">{p.terms}</p>
            </div>
          </Reveal>
        </div>

        <div>
          <div className="lg:sticky lg:top-24 space-y-5">
            <Reveal>
              <div className="overflow-hidden rounded-3xl bg-jungle-950 text-white shadow-2xl">
                <div className="p-6">
                  {p.discount_pct > 0 && (
                    <span className="mb-3 inline-block rounded-full bg-sunset-500 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider">Save {p.discount_pct}% — Limited Offer</span>
                  )}
                  <div className="flex items-end gap-2">
                    {p.price_usd ? (
                      <>
                        {p.discount_pct > 0 && <s className="text-lg text-white/40">{fmtUSD(p.price_usd)}</s>}
                        <span className="font-display text-4xl font-bold text-gold-300">{fmtUSD(discounted)}</span>
                      </>
                    ) : (
                      <span className="font-display text-2xl font-bold text-gold-300">{p.price_note || 'Contact for Price'}</span>
                    )}
                  </div>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/55">per person {p.price_usd ? '(twin sharing)' : ''}</p>
                  {p.price_note && p.price_usd ? <p className="mt-1 text-xs text-white/55">{p.price_note}</p> : null}
                  <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
                    <p className="flex justify-between"><span className="text-white/60">Duration</span><span className="font-bold">{p.duration_label}</span></p>
                    <p className="flex justify-between"><span className="text-white/60">Tour type</span><span className="font-bold">Private</span></p>
                    <p className="flex justify-between"><span className="text-white/60">Group size</span><span className="font-bold">1 – 14 guests</span></p>
                  </div>
                  <Link to={`/booking?package=${p.id}`} className="btn-gold mt-5 w-full">Request Booking <ArrowRight size={16} /></Link>
                  <Link to="/plan-trip" className="mt-2.5 flex w-full items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10">
                    Customise This Tour
                  </Link>
                  <p className="mt-3 text-center text-xs text-white/50">Free cancellation up to 14 days before arrival • No payment needed today</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="rounded-3xl border border-jungle-900/10 bg-white p-6 shadow-md">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-jungle-900">Tour Highlights</h3>
                <ul className="mt-3 space-y-2">
                  {arr(p.destinations).map((x) => (
                    <li key={x} className="flex items-center gap-2 text-sm font-medium text-ink-900/75"><MapPin size={14} className="text-ocean-600" /> {x}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {fallbackOthers.length > 0 && (
        <section className="container-x !pt-0 section-pad">
          <h2 className="font-display text-3xl font-semibold text-jungle-950">You May Also Like</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {fallbackOthers.map((o, i) => <PackageCard key={o.id} p={o} delay={i * 0.07} />)}
          </div>
        </section>
      )}
      <BookingCTA />
    </div>
  );
}
