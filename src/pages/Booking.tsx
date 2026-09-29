import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, PartyPopper, Copy, ArrowRight, CalendarDays, Users, BedDouble, Car, Plane, MessageCircle } from 'lucide-react';
import PageHero from '../components/PageHero';
import { Reveal } from '../components/ui';
import { api, useResource } from '../lib/api';
import type { TourPackage, Destination, Vehicle, Booking } from '../lib/types';
import { useSettings } from '../lib/settings';
import { waLink } from '../lib/api';

const ACCOMMODATIONS = ['Budget Guesthouses (2★)', 'Comfort Hotels (3★)', 'Premium Hotels (4★)', 'Luxury Resorts & Villas (5★)', 'Mix — Best Value', 'Not Sure Yet'];
const VEHICLES = ['Sedan Car (2–3 pax)', 'SUV (3–4 pax)', 'Van (5–7 pax)', 'Minibus (8–14 pax)', 'Coach (15+ pax)', 'Not Sure Yet'];
const COUNTRIES = ['United Kingdom', 'Germany', 'France', 'Australia', 'United States', 'Canada', 'Netherlands', 'India', 'China', 'Japan', 'Russia', 'UAE', 'Sri Lanka', 'Other'];

const input = 'input-field';
const label = 'label-field';

function Field({ label: l, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className={label}>{l} {required && <span className="text-sunset-500">*</span>}</label>
      {children}
    </div>
  );
}

export function Booking() {
  const [sp] = useSearchParams();
  const { data: pkgs } = useResource<TourPackage>('/api/packages');
  const { data: vehicles } = useResource<Vehicle>('/api/vehicles');
  const { get } = useSettings();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<Booking | null>(null);
  const [copied, setCopied] = useState(false);

  const prePkg = sp.get('package');
  const preDest = sp.get('destination');
  const preHotel = sp.get('hotel');

  const [f, setF] = useState({
    full_name: '', country: '', email: '', phone: '', whatsapp: '',
    package_id: prePkg || '', arrival_date: '', departure_date: '',
    adults: '2', children: '0', accommodation: 'Comfort Hotels (3★)',
    vehicle: 'Sedan Car (2–3 pax)', airport_pickup: true, special_requests: preDest ? `Interested in visiting: ${preDest}. ` : preHotel ? `Interested in staying at: ${preHotel}. ` : '', message: '',
  });
  const set = (k: string, v: any) => setF((p) => ({ ...p, [k]: v }));

  const pkg = useMemo(() => (pkgs || []).find((p) => String(p.id) === String(f.package_id)), [pkgs, f.package_id]);
  const nights = useMemo(() => {
    if (!f.arrival_date || !f.departure_date) return 0;
    const ms = new Date(f.departure_date).getTime() - new Date(f.arrival_date).getTime();
    return ms > 0 ? Math.round(ms / 86400000) : 0;
  }, [f.arrival_date, f.departure_date]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!f.full_name.trim() || !f.email.trim() || !f.country) return setError('Please fill your name, country and email.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return setError('Please enter a valid email address.');
    if (!f.arrival_date) return setError('Please choose your arrival date.');
    setSending(true);
    try {
      const res = await api<Booking>('/api/bookings', 'POST', {
        full_name: f.full_name.trim(), country: f.country, email: f.email.trim(),
        phone: f.phone.trim(), whatsapp: f.whatsapp.trim(),
        package_id: f.package_id ? Number(f.package_id) : null,
        package_name: pkg?.name || (preDest ? `Custom — ${preDest}` : preHotel ? `Hotel stay — ${preHotel}` : 'General enquiry'),
        arrival_date: f.arrival_date, departure_date: f.departure_date || f.arrival_date,
        adults: Number(f.adults) || 1, children: Number(f.children) || 0,
        accommodation: f.accommodation, vehicle: f.vehicle, airport_pickup: f.airport_pickup,
        special_requests: f.special_requests.trim(), message: f.message.trim(),
      });
      setDone(res);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err?.message || 'Failed to send booking request. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div>
        <PageHero title="Booking Received!" subtitle="Thank you for choosing Serendib Trails." image="/images/dest-mirissa.jpg" crumbs={[{ label: 'Booking' }]} />
        <section className="container-x section-pad">
          <Reveal>
            <div className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
              <div className="bg-gradient-to-r from-jungle-900 to-ocean-700 p-8 text-center text-white">
                <PartyPopper size={44} className="mx-auto text-gold-300" />
                <h2 className="font-display mt-3 text-3xl font-semibold">Ayubowan, {done.full_name.split(' ')[0]}!</h2>
                <p className="mt-2 text-white/80">Your booking request was sent successfully. Our travel team will contact you within a few hours.</p>
              </div>
              <div className="p-8">
                <div className="rounded-2xl border-2 border-dashed border-gold-500/50 bg-sand-100 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-900/50">Your booking reference</p>
                  <p className="font-display mt-1 text-4xl font-bold tracking-wide text-jungle-900">{done.ref}</p>
                  <button
                    onClick={() => { navigator.clipboard?.writeText(done.ref); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-ocean-700 hover:text-ocean-600"
                  >
                    <Copy size={13} /> {copied ? 'Copied!' : 'Copy reference'}
                  </button>
                </div>
                <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                  <p className="rounded-xl bg-sand-100 p-3"><span className="block text-[11px] font-bold uppercase text-ink-900/50">Package</span><span className="font-bold text-jungle-950">{done.package_name}</span></p>
                  <p className="rounded-xl bg-sand-100 p-3"><span className="block text-[11px] font-bold uppercase text-ink-900/50">Travellers</span><span className="font-bold text-jungle-950">{done.adults} adult{done.adults === 1 ? '' : 's'}{done.children > 0 ? ` + ${done.children} child${done.children === 1 ? '' : 'ren'}` : ''}</span></p>
                  <p className="rounded-xl bg-sand-100 p-3"><span className="block text-[11px] font-bold uppercase text-ink-900/50">Arrival</span><span className="font-bold text-jungle-950">{done.arrival_date}</span></p>
                  <p className="rounded-xl bg-sand-100 p-3"><span className="block text-[11px] font-bold uppercase text-ink-900/50">Status</span><span className="font-bold text-gold-600">Pending — we reply soon</span></p>
                </div>
                <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                  <button onClick={() => window.open(waLink(get('whatsapp', '94771234567'), `Hello! I just sent booking request ${done.ref} (${done.package_name}).`), '_blank')} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1fb857]">
                    <MessageCircle size={17} /> Confirm on WhatsApp
                  </button>
                  <Link to="/packages" className="flex flex-1 items-center justify-center gap-2 rounded-full border border-jungle-900/20 px-6 py-3 text-sm font-bold text-jungle-900 transition hover:bg-jungle-900 hover:text-white">
                    Browse More Tours <ArrowRight size={15} />
                  </Link>
                </div>
                <p className="mt-4 text-center text-xs text-ink-900/50">A confirmation email is on its way to {done.email}. Please save your reference number.</p>
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHero title="Request Your Booking" subtitle="No payment needed today — send your request and receive a personalised confirmation within hours." image="/images/dest-galle.jpg" crumbs={[{ label: 'Booking' }]} />
      <section className="container-x section-pad">
        <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
          <div className="space-y-6">
            <Reveal>
              <div className="rounded-3xl border border-jungle-900/10 bg-white p-6 shadow-lg md:p-8">
                <h2 className="flex items-center gap-2 text-lg font-extrabold text-jungle-950"><Users size={19} className="text-ocean-600" /> 1. Your Details</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" required><input className={input} value={f.full_name} onChange={(e) => set('full_name', e.target.value)} placeholder="e.g. Emma Johnson" /></Field>
                  <Field label="Country" required>
                    <select className={input} value={f.country} onChange={(e) => set('country', e.target.value)}>
                      <option value="">Select country...</option>
                      {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Email address" required><input type="email" className={input} value={f.email} onChange={(e) => set('email', e.target.value)} placeholder="you@email.com" /></Field>
                  <Field label="Phone number"><input className={input} value={f.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+44 ..." /></Field>
                  <div className="sm:col-span-2">
                    <Field label="WhatsApp number"><input className={input} value={f.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} placeholder="With country code — fastest way to reach you" /></Field>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="rounded-3xl border border-jungle-900/10 bg-white p-6 shadow-lg md:p-8">
                <h2 className="flex items-center gap-2 text-lg font-extrabold text-jungle-950"><CalendarDays size={19} className="text-ocean-600" /> 2. Trip Details</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field label="Selected tour package">
                      <select className={input} value={f.package_id} onChange={(e) => set('package_id', e.target.value)}>
                        <option value="">General enquiry / not decided yet</option>
                        {(pkgs || []).map((p) => <option key={p.id} value={p.id}>{p.name} — {p.duration_label}</option>)}
                      </select>
                    </Field>
                  </div>
                  <Field label="Arrival date" required><input type="date" className={input} value={f.arrival_date} onChange={(e) => set('arrival_date', e.target.value)} min={new Date().toISOString().slice(0, 10)} /></Field>
                  <Field label="Departure date"><input type="date" className={input} value={f.departure_date} onChange={(e) => set('departure_date', e.target.value)} min={f.arrival_date || new Date().toISOString().slice(0, 10)} /></Field>
                  <Field label="Adults" required>
                    <select className={input} value={f.adults} onChange={(e) => set('adults', e.target.value)}>{Array.from({ length: 14 }).map((_, i) => <option key={i + 1} value={i + 1}>{i + 1} adult{i === 0 ? '' : 's'}</option>)}</select>
                  </Field>
                  <Field label="Children (under 12)">
                    <select className={input} value={f.children} onChange={(e) => set('children', e.target.value)}>{Array.from({ length: 9 }).map((_, i) => <option key={i} value={i}>{i} child{i === 1 ? '' : 'ren'}</option>)}</select>
                  </Field>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="rounded-3xl border border-jungle-900/10 bg-white p-6 shadow-lg md:p-8">
                <h2 className="flex items-center gap-2 text-lg font-extrabold text-jungle-950"><BedDouble size={19} className="text-ocean-600" /> 3. Preferences</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field label="Accommodation preference">
                    <select className={input} value={f.accommodation} onChange={(e) => set('accommodation', e.target.value)}>{ACCOMMODATIONS.map((a) => <option key={a}>{a}</option>)}</select>
                  </Field>
                  <Field label="Vehicle requirement">
                    <select className={input} value={f.vehicle} onChange={(e) => set('vehicle', e.target.value)}>
                      {VEHICLES.map((a) => <option key={a}>{a}</option>)}
                      {(vehicles || []).map((v) => <option key={v.id} value={v.name}>{v.name} ({v.passengers} seats)</option>)}
                    </select>
                  </Field>
                  <div className="sm:col-span-2">
                    <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-jungle-50 p-4 ring-1 ring-jungle-900/10">
                      <input type="checkbox" checked={f.airport_pickup} onChange={(e) => set('airport_pickup', e.target.checked)} className="h-5 w-5 accent-teal-700" />
                      <span className="flex items-center gap-2 text-sm font-bold text-jungle-950"><Plane size={16} className="text-ocean-600" /> Yes, pick us up at Bandaranaike Airport (CMB) — free meet & greet</span>
                    </label>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Special requests (diet, honeymoon, wheelchair, child seats...)"><textarea rows={2} className={input} value={f.special_requests} onChange={(e) => set('special_requests', e.target.value)} placeholder="Anything we should prepare for you?" /></Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Additional message"><textarea rows={3} className={input} value={f.message} onChange={(e) => set('message', e.target.value)} placeholder="Tell us about your dream trip..." /></Field>
                  </div>
                </div>
              </div>
            </Reveal>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3.5 text-sm font-semibold text-red-700">{error}</div>
            )}
            <button type="submit" disabled={sending} className="btn-gold w-full !py-4 text-base disabled:opacity-60">
              {sending ? 'Sending your request...' : <><CheckCircle2 size={18} /> Send Booking Request</>}
            </button>
            <p className="text-center text-xs text-ink-900/50">No payment required today • Free cancellation advice • Reply within hours</p>
          </div>

          <div>
            <div className="lg:sticky lg:top-24 space-y-5">
              <Reveal>
                <div className="overflow-hidden rounded-3xl bg-jungle-950 text-white shadow-xl">
                  <div className="p-6">
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-gold-300">Your trip summary</h3>
                    <div className="mt-4 space-y-3 text-sm">
                      <p className="flex justify-between gap-3"><span className="text-white/60">Package</span><span className="text-right font-bold">{pkg?.name || 'Custom / To decide'}</span></p>
                      <p className="flex justify-between"><span className="text-white/60">Travellers</span><span className="font-bold">{f.adults} + {f.children} ch</span></p>
                      <p className="flex justify-between"><span className="text-white/60">Trip length</span><span className="font-bold">{nights ? `${nights} night${nights === 1 ? '' : 's'}` : '—'}</span></p>
                      <p className="flex justify-between"><span className="text-white/60">Stay</span><span className="text-right font-bold">{f.accommodation.split('(')[0]}</span></p>
                      <p className="flex justify-between"><span className="text-white/60">Airport pickup</span><span className="font-bold">{f.airport_pickup ? 'Yes ✓' : 'No'}</span></p>
                    </div>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="rounded-3xl border border-jungle-900/10 bg-white p-6 shadow-md">
                  <h3 className="flex items-center gap-2 font-bold text-jungle-950"><Car size={17} className="text-ocean-600" /> What happens next?</h3>
                  <ol className="mt-3 space-y-2.5 text-sm text-ink-900/70">
                    {[['1', 'We confirm availability & send your personalised quote'], ['2', 'You approve — small deposit secures everything'], ['3', 'We meet you at the airport with flower garlands!']].map(([n, x]) => (
                      <li key={n} className="flex gap-2.5"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ocean-600 text-xs font-extrabold text-white">{n}</span>{x}</li>
                    ))}
                  </ol>
                </div>
              </Reveal>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
