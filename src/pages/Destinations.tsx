import { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, CalendarDays, ArrowLeft, ArrowRight, Check, Sparkles, SlidersHorizontal } from 'lucide-react';
import PageHero from '../components/PageHero';
import BookingCTA from '../components/BookingCTA';
import { Reveal, DestinationCard, Loader, ErrorBox, EmptyBox } from '../components/ui';
import { useResource, img, arr } from '../lib/api';
import type { Destination, TourPackage } from '../lib/types';

export function Destinations() {
  const { data, loading, error, refresh } = useResource<Destination>('/api/destinations');
  const [q, setQ] = useState('');
  const [region, setRegion] = useState('All');
  const [activity, setActivity] = useState('All');
  const [category, setCategory] = useState('All');

  const regions = useMemo(() => ['All', ...Array.from(new Set((data || []).map((d) => d.region).filter(Boolean)))], [data]);
  const activities = useMemo(() => ['All', ...Array.from(new Set((data || []).flatMap((d) => arr(d.activities))))].slice(0, 14), [data]);
  const categories = useMemo(() => ['All', ...Array.from(new Set((data || []).flatMap((d) => arr(d.categories))))], [data]);

  const filtered = useMemo(
    () =>
      (data || []).filter((d) => {
        const hay = `${d.name} ${d.province} ${d.short_intro} ${arr(d.attractions).join(' ')}`.toLowerCase();
        if (q && !hay.includes(q.toLowerCase())) return false;
        if (region !== 'All' && d.region !== region) return false;
        if (activity !== 'All' && !arr(d.activities).includes(activity)) return false;
        if (category !== 'All' && !arr(d.categories).includes(category)) return false;
        return true;
      }),
    [data, q, region, activity, category]
  );

  return (
    <div>
      <PageHero
        title="Destinations of Wonder"
        subtitle="From ancient rock fortresses to whale-filled seas — explore the ten places every Sri Lanka journey should include."
        image="/images/dest-sigiriya.jpg"
        crumbs={[{ label: 'Destinations' }]}
      />
      <section className="container-x section-pad">
        <Reveal>
          <div className="rounded-3xl border border-jungle-900/10 bg-white p-5 shadow-lg md:p-6">
            <div className="flex items-center gap-2 text-jungle-900">
              <SlidersHorizontal size={17} />
              <span className="text-sm font-extrabold uppercase tracking-wider">Find your destination</span>
            </div>
            <div className="relative mt-4">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-900/40" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Sigiriya, beach, safari, temple..." className="input-field !pl-11 !py-3" />
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div>
                <label className="label-field">Region</label>
                <select value={region} onChange={(e) => setRegion(e.target.value)} className="input-field">
                  {regions.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="label-field">Activity</label>
                <select value={activity} onChange={(e) => setActivity(e.target.value)} className="input-field">
                  {activities.map((a) => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="label-field">Travel style</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field">
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <p className="mt-3 text-xs font-semibold text-ink-900/50">{filtered.length} destination{filtered.length === 1 ? '' : 's'} found</p>
          </div>
        </Reveal>

        {loading ? <Loader /> : error ? <ErrorBox message={error} onRetry={refresh} /> : filtered.length === 0 ? (
          <EmptyBox message="No destinations match your filters. Try widening your search." />
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((d, i) => <DestinationCard key={d.id} d={d} delay={(i % 4) * 0.06} />)}
          </div>
        )}
      </section>
      <BookingCTA title="Not Sure Where to Start?" subtitle="Tell us your travel style and dates — we'll recommend the perfect combination of destinations." />
    </div>
  );
}

export function DestinationDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data, loading } = useResource<Destination>('/api/destinations');
  const { data: pkgs } = useResource<TourPackage>('/api/packages');

  const d = (data || []).find((x) => x.slug === slug);
  const related = (pkgs || []).filter((p) => arr(p.destinations).some((x) => x.toLowerCase().includes((d?.name || '|||').toLowerCase().split(' ')[0]))).slice(0, 3);
  const others = (data || []).filter((x) => x.slug !== slug).slice(0, 3);

  if (loading) return <div className="pt-32"><Loader /></div>;
  if (!d) {
    return (
      <div className="container-x py-40 text-center">
        <h1 className="font-display text-4xl text-jungle-950">Destination not found</h1>
        <Link to="/destinations" className="btn-ocean mt-6">Back to Destinations</Link>
      </div>
    );
  }

  return (
    <div>
      <section className="relative flex min-h-[70vh] items-end overflow-hidden">
        <img src={img(d.image)} alt={d.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-jungle-950 via-jungle-950/40 to-jungle-950/20" />
        <div className="container-x relative pb-14 pt-40">
          <button onClick={() => navigate(-1)} className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-xs font-bold text-white backdrop-blur transition hover:bg-white/25">
            <ArrowLeft size={14} /> Back
          </button>
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-gold-300">
            <MapPin size={15} /> {d.province} • {d.region} Sri Lanka
          </p>
          <h1 className="font-display mt-2 max-w-3xl text-5xl font-semibold text-white text-shadow-hero md:text-7xl">{d.name}</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/85">{d.short_intro}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {arr(d.categories).map((c) => (
              <span key={c} className="rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur">{c}</span>
            ))}
          </div>
        </div>
        <svg className="absolute bottom-0 left-0 w-full text-sand-50" viewBox="0 0 1440 70" preserveAspectRatio="none" height="44" aria-hidden>
          <path fill="currentColor" d="M0,32 C240,70 480,0 720,24 C960,48 1200,64 1440,24 L1440,70 L0,70 Z" />
        </svg>
      </section>

      <section className="container-x section-pad grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-jungle-950">About {d.name}</h2>
            <div className="prose-travel mt-4">
              {(d.description || '').split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </Reveal>
          <Reveal>
            <h3 className="font-display mt-10 text-2xl font-semibold text-jungle-950">Main Attractions</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {arr(d.attractions).map((a) => (
                <li key={a} className="flex items-start gap-2.5 rounded-2xl border border-jungle-900/10 bg-white p-4 text-sm font-medium text-ink-900/80 shadow-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ocean-600/10 text-ocean-700"><Check size={14} /></span> {a}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal>
            <h3 className="font-display mt-10 text-2xl font-semibold text-jungle-950">Things To Do</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {arr(d.activities).map((a) => (
                <span key={a} className="inline-flex items-center gap-1.5 rounded-full bg-jungle-900 px-4 py-2 text-sm font-semibold text-white">
                  <Sparkles size={13} className="text-gold-300" /> {a}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="space-y-5">
          <Reveal>
            <div className="rounded-3xl bg-jungle-950 p-6 text-white shadow-xl">
              <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-gold-300">
                <CalendarDays size={16} /> Best time to visit
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">{d.best_time}</p>
              <div className="mt-4 rounded-2xl bg-white/10 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-white/60">Location</p>
                <p className="mt-1 text-sm font-semibold">{d.province}, {d.region} Province region</p>
                {d.latitude && d.longitude && (
                  <a href={`https://www.google.com/maps?q=${d.latitude},${d.longitude}`} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-gold-300 hover:text-gold-400">
                    Open in Google Maps <ArrowRight size={13} />
                  </a>
                )}
              </div>
              <Link to={`/booking?destination=${encodeURIComponent(d.name)}`} className="btn-gold mt-5 w-full">Book This Destination</Link>
              <Link to="/plan-trip" className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10">
                Add to Custom Tour
              </Link>
            </div>
          </Reveal>
          {related.length > 0 && (
            <Reveal>
              <div className="rounded-3xl border border-jungle-900/10 bg-white p-6 shadow-md">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-jungle-900">Tours visiting {d.name}</h3>
                <div className="mt-3 space-y-3">
                  {related.map((p) => (
                    <Link key={p.id} to={`/packages/${p.slug}`} className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-sand-100">
                      <img src={img(p.image)} alt={p.name} className="h-14 w-18 shrink-0 rounded-xl object-cover" style={{ width: 72 }} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-jungle-950">{p.name}</p>
                        <p className="text-xs text-ink-900/55">{p.duration_label} • {p.category}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {others.length > 0 && (
        <section className="container-x !pt-0 section-pad">
          <h2 className="font-display text-3xl font-semibold text-jungle-950">Keep Exploring</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o, i) => <DestinationCard key={o.id} d={o} delay={i * 0.07} />)}
          </div>
        </section>
      )}
      <BookingCTA title={`Dreaming of ${d.name}?`} subtitle="Our local experts will design the perfect itinerary around this destination — free quote, no obligation." image={img(d.image)} />
    </div>
  );
}
