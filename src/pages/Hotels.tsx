import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import PageHero from '../components/PageHero';
import BookingCTA from '../components/BookingCTA';
import { Reveal, HotelCard, Loader, ErrorBox, EmptyBox, SectionHeading } from '../components/ui';
import { useResource } from '../lib/api';
import type { Hotel } from '../lib/types';

export function Hotels() {
  const { data, loading, error, refresh } = useResource<Hotel>('/api/hotels');
  const [q, setQ] = useState('');
  const [type, setType] = useState('All');
  const [dest, setDest] = useState('All');

  const types = useMemo(() => ['All', ...Array.from(new Set((data || []).map((h) => h.type).filter(Boolean)))], [data]);
  const dests = useMemo(() => ['All', ...Array.from(new Set((data || []).map((h) => h.destination).filter(Boolean)))], [data]);

  const filtered = useMemo(
    () =>
      (data || []).filter((h) => {
        const hay = `${h.name} ${h.location} ${h.description}`.toLowerCase();
        if (q && !hay.includes(q.toLowerCase())) return false;
        if (type !== 'All' && h.type !== type) return false;
        if (dest !== 'All' && h.destination !== dest) return false;
        return true;
      }),
    [data, q, type, dest]
  );

  return (
    <div>
      <PageHero title="Hotels & Accommodation" subtitle="Hand-inspected stays across the island — beach resorts, jungle eco-lodges, heritage villas and cosy guesthouses." image="/images/hotel-resort.jpg" crumbs={[{ label: 'Hotels' }]} />
      <section className="container-x section-pad">
        <SectionHeading eyebrow="Sleep in Paradise" title="Where You'll Stay" subtitle="Every property below is personally visited by our team. Tell us your style — we match you with the perfect beds." />
        <Reveal>
          <div className="rounded-3xl border border-jungle-900/10 bg-white p-5 shadow-lg">
            <div className="relative">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-900/40" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, beach, Ella, pool..." className="input-field !pl-11 !py-3" />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {types.map((t) => (
                <button key={t} onClick={() => setType(t)} className={`chip ${type === t ? 'bg-jungle-900 text-white border-jungle-900' : 'bg-sand-100 text-jungle-900 border-transparent hover:bg-sand-200'}`}>{t}</button>
              ))}
            </div>
            <div className="mt-3">
              <select value={dest} onChange={(e) => setDest(e.target.value)} className="input-field max-w-xs">
                {dests.map((d) => <option key={d} value={d}>{d === 'All' ? 'All locations' : d}</option>)}
              </select>
            </div>
          </div>
        </Reveal>
        {loading ? <Loader /> : error ? <ErrorBox message={error} onRetry={refresh} /> : filtered.length === 0 ? (
          <EmptyBox message="No stays match your search. Contact us — we partner with 200+ hotels island-wide." />
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((h, i) => <HotelCard key={h.id} h={h} delay={(i % 3) * 0.07} />)}
          </div>
        )}
      </section>
      <BookingCTA title="Want Us to Arrange Your Hotels?" subtitle="We secure better rates than booking sites — and handle every check-in, upgrade request and early breakfast box." image="/images/hotel-villa.jpg" />
    </div>
  );
}
