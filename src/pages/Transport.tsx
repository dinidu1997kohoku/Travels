import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheck, Car, CheckCircle2, Plane, MapPin, Clock } from 'lucide-react';
import PageHero from '../components/PageHero';
import BookingCTA from '../components/BookingCTA';
import { Reveal, VehicleCard, Loader, ErrorBox, SectionHeading } from '../components/ui';
import { api, useResource } from '../lib/api';
import type { Vehicle, Inquiry } from '../lib/types';

const input = 'input-field';
const label = 'label-field';

const PERKS = [
  { icon: ShieldCheck, t: 'Vetted Chauffeur-Drivers', d: 'Licensed tourist-board drivers with 5+ years experience, background-checked and English-speaking.' },
  { icon: Car, t: 'Late-Model Fleet', d: 'Air-conditioned comfort, full insurance, GPS tracking and 24/7 roadside backup vehicle guarantee.' },
  { icon: Plane, t: 'Airport Meet & Greet', d: 'Flight tracking, name-board welcome in the arrivals hall and cold towels after landing.' },
];

export function Transport() {
  const { data, loading, error, refresh } = useResource<Vehicle>('/api/vehicles');
  const [type, setType] = useState('All');
  const [sp] = useSearchParams();
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState('');
  const [f, setF] = useState({
    name: '', email: '', phone: '', country: '', vehicle_id: sp.get('vehicle') || '',
    pickup_date: '', return_date: '', pickup_location: 'Bandaranaike Airport (CMB)', passengers: '2', message: '',
  });
  const set = (k: string, v: any) => setF((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    const v = sp.get('vehicle');
    if (v) {
      setF((p) => ({ ...p, vehicle_id: v }));
      setTimeout(() => document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' }), 400);
    }
  }, [sp]);

  const types = useMemo(() => ['All', ...Array.from(new Set((data || []).map((v) => v.type).filter(Boolean)))], [data]);
  const filtered = type === 'All' ? data || [] : (data || []).filter((v) => v.type === type);
  const chosen = (data || []).find((v) => String(v.id) === String(f.vehicle_id));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (!f.name.trim() || !f.email.trim()) return setErr('Please add your name and email.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return setErr('Please enter a valid email.');
    setSending(true);
    try {
      await api<Inquiry>('/api/inquiries', 'POST', {
        name: f.name.trim(), email: f.email.trim(), phone: f.phone.trim(), country: f.country.trim(),
        vehicle_id: f.vehicle_id ? Number(f.vehicle_id) : null, vehicle_name: chosen?.name || 'General transport enquiry',
        pickup_date: f.pickup_date, return_date: f.return_date, pickup_location: f.pickup_location,
        passengers: Number(f.passengers) || 1, message: f.message.trim(),
      });
      setOk(true);
      setF({ name: '', email: '', phone: '', country: '', vehicle_id: '', pickup_date: '', return_date: '', pickup_location: 'Bandaranaike Airport (CMB)', passengers: '2', message: '' });
    } catch (e2: any) {
      setErr(e2?.message || 'Failed to send inquiry.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <PageHero title="Vehicles & Transport" subtitle="Private cars, vans, SUVs and coaches with professional drivers — airport transfers, day trips and island-wide tours." image="/images/vehicle-van.jpg" crumbs={[{ label: 'Transport' }]} />

      <section className="container-x section-pad !pb-0">
        <div className="grid gap-5 md:grid-cols-3">
          {PERKS.map((w, i) => (
            <Reveal key={w.t} delay={i * 0.08}>
              <div className="flex h-full gap-4 rounded-3xl border border-jungle-900/10 bg-white p-6 shadow-md">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean-600 to-jungle-800 text-white"><w.icon size={21} /></span>
                <div><h3 className="font-bold text-jungle-950">{w.t}</h3><p className="mt-1 text-sm text-ink-900/60">{w.d}</p></div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x section-pad">
        <SectionHeading eyebrow="Our Fleet" title="Choose Your Ride" subtitle="Transparent per-day rates with driver, fuel for standard routes and all taxes included." />
        <div className="flex flex-wrap justify-center gap-2">
          {types.map((t) => (
            <button key={t} onClick={() => setType(t)} className={`chip ${type === t ? 'bg-jungle-900 text-white border-jungle-900' : 'bg-white text-jungle-900 border-jungle-900/15 hover:bg-sand-100'}`}>{t}</button>
          ))}
        </div>
        {loading ? <Loader /> : error ? <ErrorBox message={error} onRetry={refresh} /> : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((v, i) => <VehicleCard key={v.id} v={v} delay={(i % 3) * 0.07} />)}
          </div>
        )}
      </section>

      <section className="bg-jungle-950 py-16 md:py-24">
        <div className="container-x grid items-start gap-10 lg:grid-cols-2">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gold-300">Airport Transfers & Hire</span>
              <h2 className="font-display mt-4 text-3xl font-semibold text-white md:text-4xl">Get a Transport Quote in Minutes</h2>
              <p className="mt-4 text-white/70">Popular routes: Airport → Colombo (45 min), Airport → Kandy (3 hrs), Airport → Sigiriya (4 hrs), Airport → Galle/Mirissa (2.5 hrs via expressway).</p>
            </Reveal>
            <div className="mt-6 space-y-3">
              {[
                [MapPin, 'Door-to-door pickup anywhere on the island'],
                [Clock, 'Free waiting for delayed flights — we track your flight'],
                [ShieldCheck, 'Child seats, extra luggage vans & wheelchair options'],
              ].map(([Icon, x]: any, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <p className="flex items-center gap-3 rounded-2xl bg-white/5 p-4 text-sm font-medium text-white/85 ring-1 ring-white/10">
                    <Icon size={18} className="shrink-0 text-gold-300" /> {x}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal>
            <form id="inquiry-form" onSubmit={submit} className="rounded-[2rem] bg-white p-6 shadow-2xl md:p-8">
              <h3 className="font-display text-2xl font-semibold text-jungle-950">Vehicle Inquiry</h3>
              {ok ? (
                <div className="mt-4 rounded-2xl bg-emerald-50 p-5 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-600/20">
                  <p className="flex items-center gap-2"><CheckCircle2 size={18} /> Inquiry sent! Our transport desk replies shortly.</p>
                  <button type="button" onClick={() => setOk(false)} className="mt-2 text-xs font-bold text-ocean-700 underline">Send another inquiry</button>
                </div>
              ) : (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div><label className={label}>Name *</label><input className={input} value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Your name" /></div>
                  <div><label className={label}>Email *</label><input type="email" className={input} value={f.email} onChange={(e) => set('email', e.target.value)} placeholder="you@email.com" /></div>
                  <div><label className={label}>Phone / WhatsApp</label><input className={input} value={f.phone} onChange={(e) => set('phone', e.target.value)} /></div>
                  <div><label className={label}>Country</label><input className={input} value={f.country} onChange={(e) => set('country', e.target.value)} /></div>
                  <div className="sm:col-span-2"><label className={label}>Vehicle</label>
                    <select className={input} value={f.vehicle_id} onChange={(e) => set('vehicle_id', e.target.value)}>
                      <option value="">Recommend the best vehicle for my group</option>
                      {(data || []).map((v) => <option key={v.id} value={v.id}>{v.name} — {v.passengers} seats</option>)}
                    </select>
                  </div>
                  <div><label className={label}>Pickup date</label><input type="date" className={input} value={f.pickup_date} onChange={(e) => set('pickup_date', e.target.value)} min={new Date().toISOString().slice(0, 10)} /></div>
                  <div><label className={label}>Return date</label><input type="date" className={input} value={f.return_date} onChange={(e) => set('return_date', e.target.value)} min={f.pickup_date || new Date().toISOString().slice(0, 10)} /></div>
                  <div><label className={label}>Pickup location</label><input className={input} value={f.pickup_location} onChange={(e) => set('pickup_location', e.target.value)} /></div>
                  <div><label className={label}>Passengers</label><input type="number" min={1} max={50} className={input} value={f.passengers} onChange={(e) => set('passengers', e.target.value)} /></div>
                  <div className="sm:col-span-2"><label className={label}>Message</label><textarea rows={3} className={input} value={f.message} onChange={(e) => set('message', e.target.value)} placeholder="Route, flight number, luggage, child seats..." /></div>
                  {err && <p className="sm:col-span-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700">{err}</p>}
                  <button type="submit" disabled={sending} className="btn-ocean sm:col-span-2 disabled:opacity-60">{sending ? 'Sending...' : 'Send Inquiry'}</button>
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </section>
      <BookingCTA />
    </div>
  );
}
