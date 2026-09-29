import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, MessageCircle } from 'lucide-react';
import PageHero from '../components/PageHero';
import BookingCTA from '../components/BookingCTA';
import { Reveal, Loader, ErrorBox, EmptyBox } from '../components/ui';
import { useResource } from '../lib/api';
import type { Faq } from '../lib/types';

export function FaqPage() {
  const { data, loading, error, refresh } = useResource<Faq>('/api/faqs');
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [open, setOpen] = useState<number | null>(null);

  const cats = useMemo(() => ['All', ...Array.from(new Set((data || []).map((f) => f.category).filter(Boolean)))], [data]);
  const filtered = (data || []).filter((f) => {
    if (cat !== 'All' && f.category !== cat) return false;
    if (q && !`${f.question} ${f.answer}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <PageHero title="Frequently Asked Questions" subtitle="Booking, payments, cancellations, guides, hotels, vehicles, safety — everything travellers ask us." image="/images/dest-kandy.jpg" crumbs={[{ label: 'FAQ' }]} />
      <section className="container-x section-pad">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <div className="relative">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-900/40" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions — e.g. cancellation, visa, child..." className="input-field !rounded-full !py-4 !pl-12 !pr-5 !text-base shadow-lg" />
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {cats.map((c) => (
                <button key={c} onClick={() => { setCat(c); setOpen(null); }} className={`chip ${cat === c ? 'bg-jungle-900 text-white border-jungle-900' : 'bg-white text-jungle-900 border-jungle-900/15 hover:bg-sand-100'}`}>{c}</button>
              ))}
            </div>
          </Reveal>
          {loading ? <Loader /> : error ? <ErrorBox message={error} onRetry={refresh} /> : filtered.length === 0 ? (
            <EmptyBox message="No answers match your search — message us and we'll help right away!" />
          ) : (
            <div className="mt-8 space-y-3">
              {filtered.map((f) => (
                <Reveal key={f.id}>
                  <div className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${open === f.id ? 'border-ocean-600/40 shadow-lg' : 'border-jungle-900/10'}`}>
                    <button onClick={() => setOpen(open === f.id ? null : f.id)} className="flex w-full items-center gap-4 p-5 text-left">
                      <span className="hidden rounded-full bg-jungle-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ocean-700 sm:inline-block">{f.category}</span>
                      <span className="flex-1 font-bold text-jungle-950">{f.question}</span>
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${open === f.id ? 'rotate-45 bg-ocean-600 text-white' : 'bg-sand-100 text-jungle-900'}`}><Plus size={17} /></span>
                    </button>
                    {open === f.id && <p className="border-t border-jungle-900/10 px-5 py-5 text-sm leading-relaxed text-ink-900/70 sm:pl-[120px]">{f.answer}</p>}
                  </div>
                </Reveal>
              ))}
            </div>
          )}
          <Reveal>
            <div className="mt-10 rounded-3xl bg-jungle-950 p-8 text-center text-white">
              <MessageCircle size={32} className="mx-auto text-gold-300" />
              <h3 className="font-display mt-3 text-2xl font-semibold">Still Curious About Something?</h3>
              <p className="mt-2 text-sm text-white/70">Our travel experts reply within hours — usually much faster.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Link to="/contact" className="btn-gold !px-6">Contact Us</Link>
                <Link to="/booking" className="btn-outline-light !px-6">Request Booking</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <BookingCTA />
    </div>
  );
}
