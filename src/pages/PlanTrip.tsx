import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, PartyPopper, Copy, ArrowRight, MessageCircle, MapPin } from 'lucide-react';
import PageHero from '../components/PageHero';
import { Reveal } from '../components/ui';
import { api, useResource, img, waLink } from '../lib/api';
import type { Destination, CustomTour } from '../lib/types';
import { useSettings } from '../lib/settings';

const ALL_ACTIVITIES = ['Wildlife safari', 'Whale watching', 'Surfing', 'Scuba diving & snorkelling', 'Hiking & trekking', 'Scenic train ride', 'Tea factory visit', 'Cooking class', 'Cultural shows', 'Temple visits', 'Ayurveda & spa', 'Shopping & crafts', 'Bird watching', 'Waterfalls', 'Water sports', 'Yoga & wellness'];
const ACCOMMODATIONS = ['Budget Guesthouses (2★)', 'Comfort Hotels (3★)', 'Premium Hotels (4★)', 'Luxury Resorts & Villas (5★)', 'Mix — Best Value'];
const VEHICLES = ['Sedan Car (2–3 pax)', 'SUV (3–4 pax)', 'Van (5–7 pax)', 'Minibus (8–14 pax)', 'Not Sure Yet'];
const BUDGETS = ['Budget — under $75/day/person', 'Comfort — $75–$150/day/person', 'Premium — $150–$300/day/person', 'Luxury — $300+/day/person', 'Flexible — surprise me'];

const input = 'input-field';
const label = 'label-field';

export function PlanTrip() {
  const { data: dests } = useResource<Destination>('/api/destinations');
  const { get } = useSettings();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<CustomTour | null>(null);
  const [copied, setCopied] = useState(false);
  const [sel, setSel] = useState<string[]>(['Sigiriya', 'Kandy', 'Ella']);
  const [acts, setActs] = useState<string[]>(['Wildlife safari', 'Scenic train ride']);
  const [f, setF] = useState({
    full_name: '', email: '', phone: '', country: '', arrival_date: '', departure_date: '',
    adults: '2', children: '0', accommodation: 'Comfort Hotels (3★)', vehicle: 'SUV (3–4 pax)',
    airport_pickup: true, budget: 'Comfort — $75–$150/day/person', special_requirements: '',
  });
  const set = (k: string, v: any) => setF((p) => ({ ...p, [k]: v }));
  const toggle = (list: string[], v: string, apply: (x: string[]) => void) =>
    apply(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const nights = useMemo(() => {
    if (!f.arrival_date || !f.departure_date) return 0;
    const ms = new Date(f.departure_date).getTime() - new Date(f.arrival_date).getTime();
    return ms > 0 ? Math.round(ms / 86400000) : 0;
  }, [f.arrival_date, f.departure_date]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!f.full_name.trim() || !f.email.trim()) return setError('Please add your name and email so we can send your itinerary.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return setError('Please enter a valid email address.');
    if (sel.length === 0) return setError('Please select at least one destination.');
    setSending(true);
    try {
      const res = await api<CustomTour>('/api/custom-tours', 'POST', {
        full_name: f.full_name.trim(), email: f.email.trim(), phone: f.phone.trim(), country: f.country.trim(),
        destinations: sel, arrival_date: f.arrival_date, departure_date: f.departure_date || f.arrival_date,
        adults: Number(f.adults) || 1, children: Number(f.children) || 0,
        accommodation: f.accommodation, vehicle: f.vehicle, airport_pickup: f.airport_pickup,
        activities: acts, budget: f.budget, special_requirements: f.special_requirements.trim(),
      });
      setDone(res);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err?.message || 'Failed to send. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div>
        <PageHero title="Plan Received!" subtitle="Your dream itinerary is being designed." image="/images/dest-nuwaraeliya.jpg" crumbs={[{ label: 'Custom Tour' }]} />
        <section className="container-x section-pad">
          <Reveal>
            <div className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
              <div className="bg-gradient-to-r from-ocean-700 to-jungle-800 p-8 text-center text-white">
                <PartyPopper size={44} className="mx-auto text-gold-300" />
                <h2 className="font-display mt-3 text-3xl font-semibold">Wonderful choice, {done.full_name.split(' ')[0]}!</h2>
                <p className="mt-2 text-white/80">Our designers are crafting your day-by-day itinerary. Expect it within 24 hours.</p>
              </div>
              <div className="p-8">
                <div className="rounded-2xl border-2 border-dashed border-gold-500/50 bg-sand-100 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-900/50">Your custom tour reference</p>
                  <p className="font-display mt-1 text-4xl font-bold text-jungle-900">{done.ref}</p>
                  <button onClick={() => { navigator.clipboard?.writeText(done.ref); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-ocean-700">
                    <Copy size={13} /> {copied ? 'Copied!' : 'Copy reference'}
                  </button>
                </div>
                <p className="mt-4 text-sm text-ink-900/70"><span className="font-bold">Route preview:</span> {(done.destinations || []).join(' → ')}</p>
                <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                  <button onClick={() => window.open(waLink(get('whatsapp', '94771234567'), `Hello! I just sent custom tour plan ${done.ref}.`), '_blank')} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white hover:bg-[#1fb857]">
                    <MessageCircle size={17} /> Discuss on WhatsApp
                  </button>
                  <Link to="/packages" className="flex flex-1 items-center justify-center gap-2 rounded-full border border-jungle-900/20 px-6 py-3 text-sm font-bold text-jungle-900 hover:bg-jungle-900 hover:text-white">
                    Browse Ready Tours <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHero title="Custom Tour Planner" subtitle="Design your own Sri Lanka story — pick places, pace and comfort. We handle every detail." image="/images/dest-nuwaraeliya.jpg" crumbs={[{ label: 'Custom Tour' }]} />
      <section className="container-x section-pad">
        <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
          <div className="space-y-6">
            <Reveal>
              <div className="rounded-3xl border border-jungle-900/10 bg-white p-6 shadow-lg md:p-8">
                <h2 className="flex items-center gap-2 text-lg font-extrabold text-jungle-950"><MapPin size={19} className="text-ocean-600" /> 1. Choose Your Destinations</h2>
                <p className="mt-1 text-sm text-ink-900/55">Tap to select — we will order them into the smoothest route.</p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                  {(dests || []).map((d) => {
                    const on = sel.includes(d.name);
                    return (
                      <button type="button" key={d.id} onClick={() => toggle(sel, d.name, setSel)} className={`group relative overflow-hidden rounded-2xl ring-2 transition ${on ? 'ring-gold-400' : 'ring-transparent hover:ring-ocean-600/40'}`}>
                        <img src={img(d.image)} alt={d.name} className="aspect-square w-full object-cover" loading="lazy" />
                        <span className={`absolute inset-0 ${on ? 'bg-jungle-950/25' : 'bg-jungle-950/45'}`} />
                        <span className="absolute inset-x-1 bottom-1.5 text-center text-xs font-extrabold text-white text-shadow-hero">{d.name}</span>
                        {on && <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-gold-400 text-sm font-extrabold text-jungle-950">✓</span>}
                      </button>
                    );
                  })}
                </div>
                {sel.length > 0 && <p className="mt-3 rounded-xl bg-jungle-50 p-3 text-sm font-semibold text-jungle-900">Route preview: {sel.join(' → ')}</p>}
              </div>
            </Reveal>

            <Reveal>
              <div className="rounded-3xl border border-jungle-900/10 bg-white p-6 shadow-lg md:p-8">
                <h2 className="flex items-center gap-2 text-lg font-extrabold text-jungle-950"><Sparkles size={19} className="text-ocean-600" /> 2. Dates, Group & Activities</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div><label className={label}>Arrival date</label><input type="date" className={input} value={f.arrival_date} onChange={(e) => set('arrival_date', e.target.value)} min={new Date().toISOString().slice(0, 10)} /></div>
                  <div><label className={label}>Departure date {nights > 0 && <span className="text-ocean-700">({nights} nights)</span>}</label><input type="date" className={input} value={f.departure_date} onChange={(e) => set('departure_date', e.target.value)} min={f.arrival_date || new Date().toISOString().slice(0, 10)} /></div>
                  <div><label className={label}>Adults</label><select className={input} value={f.adults} onChange={(e) => set('adults', e.target.value)}>{Array.from({ length: 14 }).map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}</select></div>
                  <div><label className={label}>Children</label><select className={input} value={f.children} onChange={(e) => set('children', e.target.value)}>{Array.from({ length: 9 }).map((_, i) => <option key={i} value={i}>{i}</option>)}</select></div>
                </div>
                <p className="label-field mt-5">Preferred activities</p>
                <div className="flex flex-wrap gap-2">
                  {ALL_ACTIVITIES.map((a) => (
                    <button type="button" key={a} onClick={() => toggle(acts, a, setActs)} className={`chip ${acts.includes(a) ? 'bg-ocean-700 text-white border-ocean-700' : 'bg-sand-100 text-jungle-900 border-transparent hover:bg-sand-200'}`}>{a}</button>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="rounded-3xl border border-jungle-900/10 bg-white p-6 shadow-lg md:p-8">
                <h2 className="text-lg font-extrabold text-jungle-950">3. Comfort, Budget & Contact</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div><label className={label}>Accommodation type</label><select className={input} value={f.accommodation} onChange={(e) => set('accommodation', e.target.value)}>{ACCOMMODATIONS.map((a) => <option key={a}>{a}</option>)}</select></div>
                  <div><label className={label}>Required vehicle</label><select className={input} value={f.vehicle} onChange={(e) => set('vehicle', e.target.value)}>{VEHICLES.map((a) => <option key={a}>{a}</option>)}</select></div>
                  <div className="sm:col-span-2"><label className={label}>Estimated budget</label><select className={input} value={f.budget} onChange={(e) => set('budget', e.target.value)}>{BUDGETS.map((a) => <option key={a}>{a}</option>)}</select></div>
                  <div className="sm:col-span-2">
                    <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-jungle-50 p-4 ring-1 ring-jungle-900/10">
                      <input type="checkbox" checked={f.airport_pickup} onChange={(e) => set('airport_pickup', e.target.checked)} className="h-5 w-5 accent-teal-700" />
                      <span className="text-sm font-bold text-jungle-950">✈️ Airport pickup at CMB on arrival</span>
                    </label>
                  </div>
                  <div><label className={label}>Full name *</label><input className={input} value={f.full_name} onChange={(e) => set('full_name', e.target.value)} placeholder="Your name" /></div>
                  <div><label className={label}>Email *</label><input type="email" className={input} value={f.email} onChange={(e) => set('email', e.target.value)} placeholder="you@email.com" /></div>
                  <div><label className={label}>Phone / WhatsApp</label><input className={input} value={f.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+..." /></div>
                  <div><label className={label}>Country</label><input className={input} value={f.country} onChange={(e) => set('country', e.target.value)} placeholder="Where are you from?" /></div>
                  <div className="sm:col-span-2"><label className={label}>Special requirements</label><textarea rows={3} className={input} value={f.special_requirements} onChange={(e) => set('special_requirements', e.target.value)} placeholder="Honeymoon surprises, dietary needs, mobility, photography stops, must-see list..." /></div>
                </div>
              </div>
            </Reveal>

            {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3.5 text-sm font-semibold text-red-700">{error}</div>}
            <button type="submit" disabled={sending} className="btn-ocean w-full !py-4 text-base disabled:opacity-60">
              {sending ? 'Sending your plan...' : <><Sparkles size={18} /> Send My Custom Plan</>}
            </button>
          </div>

          <div>
            <div className="lg:sticky lg:top-24 space-y-5">
              <Reveal>
                <div className="overflow-hidden rounded-3xl bg-jungle-950 text-white shadow-xl">
                  <img src="/images/culture-dance.jpg" alt="Culture" className="h-44 w-full object-cover" />
                  <div className="p-6">
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-gold-300">Your plan so far</h3>
                    <div className="mt-3 space-y-2.5 text-sm">
                      <p className="flex justify-between"><span className="text-white/60">Stops</span><span className="font-bold">{sel.length}</span></p>
                      <p className="flex justify-between"><span className="text-white/60">Nights</span><span className="font-bold">{nights || '—'}</span></p>
                      <p className="flex justify-between"><span className="text-white/60">Travellers</span><span className="font-bold">{f.adults} + {f.children} ch</span></p>
                      <p className="flex justify-between gap-3"><span className="text-white/60">Budget</span><span className="text-right font-bold">{f.budget.split('—')[0]}</span></p>
                    </div>
                    <p className="mt-4 rounded-2xl bg-white/10 p-3 text-xs leading-relaxed text-white/75">A dedicated designer reviews every plan by hand — no robots, no templates. Free quote, zero obligation.</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
