import { useMemo, useState } from 'react';
import { Star, CheckCircle2, PenLine } from 'lucide-react';
import PageHero from '../components/PageHero';
import BookingCTA from '../components/BookingCTA';
import { Reveal, ReviewCard, Loader, ErrorBox, EmptyBox, Stars, SectionHeading } from '../components/ui';
import { api, useResource } from '../lib/api';
import type { Review, TourPackage } from '../lib/types';

const input = 'input-field';
const label = 'label-field';

export function Reviews() {
  const { data, loading, error, refresh } = useResource<Review>('/api/reviews');
  const { data: pkgs } = useResource<TourPackage>('/api/packages');
  const [minStars, setMinStars] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState('');
  const [f, setF] = useState({ name: '', country: '', rating: 5, package_name: '', title: '', experience: '', tour_date: '' });
  const set = (k: string, v: any) => setF((p) => ({ ...p, [k]: v }));

  const approved = useMemo(() => (data || []).filter((r) => r.approved), [data]);
  const filtered = minStars ? approved.filter((r) => r.rating >= minStars) : approved;
  const avg = approved.length ? approved.reduce((s, r) => s + Number(r.rating || 5), 0) / approved.length : 5;
  const dist = [5, 4, 3, 2, 1].map((s) => ({ s, n: approved.filter((r) => Math.round(Number(r.rating)) === s).length }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (!f.name.trim() || !f.country.trim() || !f.experience.trim()) return setErr('Please add your name, country and experience.');
    setSending(true);
    try {
      await api('/api/reviews', 'POST', {
        name: f.name.trim(), country: f.country.trim(), avatar: f.name.trim().charAt(0).toUpperCase(),
        rating: f.rating, package_name: f.package_name || 'Custom tour', title: f.title.trim() || 'Wonderful trip',
        experience: f.experience.trim(), tour_date: f.tour_date, featured: false, approved: false,
      });
      setOk(true);
      setF({ name: '', country: '', rating: 5, package_name: '', title: '', experience: '', tour_date: '' });
    } catch (e2: any) {
      setErr(e2?.message || 'Failed to submit review.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <PageHero title="Guest Reviews" subtitle="Real stories from real travellers — the reason we love what we do." image="/images/dest-trincomalee.jpg" crumbs={[{ label: 'Reviews' }]} />
      <section className="container-x section-pad">
        <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_1.6fr]">
          <Reveal>
            <div className="flex h-full flex-col items-center justify-center rounded-[2rem] bg-jungle-950 p-8 text-center text-white shadow-xl">
              <p className="font-display text-6xl font-bold text-gold-300">{avg.toFixed(1)}</p>
              <Stars rating={avg} size={18} />
              <p className="mt-2 text-sm text-white/70">Based on {approved.length} verified guest reviews</p>
              <div className="mt-5 w-full space-y-1.5">
                {dist.map((d) => (
                  <div key={d.s} className="flex items-center gap-2 text-xs font-bold text-white/70">
                    <span className="w-8 text-right">{d.s} ★</span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/15">
                      <span className="block h-full rounded-full bg-gold-400" style={{ width: `${approved.length ? (d.n / approved.length) * 100 : 0}%` }} />
                    </span>
                    <span className="w-8">{d.n}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowForm((s) => !s)} className="btn-gold mt-6 w-full !px-5">
                <PenLine size={16} /> Write a Review
              </button>
            </div>
          </Reveal>
          <div>
            <div className="flex flex-wrap gap-2">
              {[0, 5, 4, 3].map((s) => (
                <button key={s} onClick={() => setMinStars(s)} className={`chip ${minStars === s ? 'bg-jungle-900 text-white border-jungle-900' : 'bg-white text-jungle-900 border-jungle-900/15'}`}>
                  {s === 0 ? 'All reviews' : <><Star size={12} className="fill-gold-400 text-gold-400" /> {s}+ stars</>}
                </button>
              ))}
            </div>
            {loading ? <Loader /> : error ? <ErrorBox message={error} onRetry={refresh} /> : filtered.length === 0 ? (
              <EmptyBox message="No reviews match this filter." />
            ) : (
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {filtered.map((r, i) => <ReviewCard key={r.id} r={r} delay={(i % 4) * 0.05} />)}
              </div>
            )}
          </div>
        </div>

        {showForm && (
          <Reveal>
            <form onSubmit={submit} className="mx-auto mt-10 max-w-3xl rounded-[2rem] border border-jungle-900/10 bg-white p-6 shadow-xl md:p-10">
              <SectionHeading eyebrow="Share Your Story" title="Travelled With Us?" subtitle="Your words help future travellers — and make our drivers' day. Reviews are published after a quick check." />
              {ok ? (
                <div className="rounded-2xl bg-emerald-50 p-6 text-center font-semibold text-emerald-800 ring-1 ring-emerald-600/20">
                  <CheckCircle2 size={30} className="mx-auto" />
                  <p className="mt-2">Thank you! Your review is awaiting approval and will appear soon.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className={label}>Your name *</label><input className={input} value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Jane Smith" /></div>
                  <div><label className={label}>Country *</label><input className={input} value={f.country} onChange={(e) => set('country', e.target.value)} placeholder="Australia" /></div>
                  <div><label className={label}>Tour package</label>
                    <select className={input} value={f.package_name} onChange={(e) => set('package_name', e.target.value)}>
                      <option value="">Select...</option>
                      {(pkgs || []).map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
                      <option value="Custom tour">Custom tour</option>
                    </select>
                  </div>
                  <div><label className={label}>Travel date</label><input type="month" className={input} value={f.tour_date} onChange={(e) => set('tour_date', e.target.value)} /></div>
                  <div className="sm:col-span-2">
                    <label className={label}>Your rating</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button type="button" key={s} onClick={() => set('rating', s)} aria-label={`${s} stars`}>
                          <Star size={30} className={s <= f.rating ? 'fill-gold-400 text-gold-400' : 'text-sand-300'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="sm:col-span-2"><label className={label}>Review headline</label><input className={input} value={f.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Best honeymoon ever!" /></div>
                  <div className="sm:col-span-2"><label className={label}>Your experience *</label><textarea rows={4} className={input} value={f.experience} onChange={(e) => set('experience', e.target.value)} placeholder="Tell future travellers about your journey..." /></div>
                  {err && <p className="sm:col-span-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700">{err}</p>}
                  <button type="submit" disabled={sending} className="btn-ocean sm:col-span-2 disabled:opacity-60">{sending ? 'Submitting...' : 'Submit Review'}</button>
                </div>
              )}
            </form>
          </Reveal>
        )}
      </section>
      <BookingCTA />
    </div>
  );
}
