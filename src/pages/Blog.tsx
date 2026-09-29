import { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, ArrowRight, CalendarDays, User, Clock } from 'lucide-react';
import PageHero from '../components/PageHero';
import BookingCTA from '../components/BookingCTA';
import { Reveal, BlogCard, Loader, ErrorBox, EmptyBox } from '../components/ui';
import { useResource, img } from '../lib/api';
import type { Blog } from '../lib/types';

export function BlogList() {
  const { data, loading, error, refresh } = useResource<Blog>('/api/blogs');
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const pubs = useMemo(() => (data || []).filter((b) => b.published), [data]);
  const cats = useMemo(() => ['All', ...Array.from(new Set(pubs.map((b) => b.category).filter(Boolean)))], [pubs]);
  const filtered = pubs.filter((b) => {
    if (cat !== 'All' && b.category !== cat) return false;
    if (q && !`${b.title} ${b.excerpt}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  const [first, ...rest] = filtered;

  return (
    <div>
      <PageHero title="Travel Blog & Guides" subtitle="Local knowledge for smart travellers — culture, food, safety, visas, seasons and insider itineraries." image="/images/culture-dance.jpg" crumbs={[{ label: 'Blog' }]} />
      <section className="container-x section-pad">
        <Reveal>
          <div className="flex flex-col gap-3 rounded-3xl border border-jungle-900/10 bg-white p-5 shadow-lg md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-900/40" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search guides..." className="input-field !pl-11" />
            </div>
            <div className="flex flex-wrap gap-2">
              {cats.map((c) => (
                <button key={c} onClick={() => setCat(c)} className={`chip ${cat === c ? 'bg-jungle-900 text-white border-jungle-900' : 'bg-sand-100 text-jungle-900 border-transparent hover:bg-sand-200'}`}>{c}</button>
              ))}
            </div>
          </div>
        </Reveal>
        {loading ? <Loader /> : error ? <ErrorBox message={error} onRetry={refresh} /> : filtered.length === 0 ? (
          <EmptyBox message="No articles found. Try another search." />
        ) : (
          <>
            {first && (
              <Reveal>
                <Link to={`/blog/${first.slug}`} className="card-hover img-zoom mt-8 grid overflow-hidden rounded-[2rem] bg-white shadow-xl md:grid-cols-2">
                  <div className="relative min-h-64 overflow-hidden">
                    <img src={img(first.image)} alt={first.title} className="absolute inset-0 h-full w-full object-cover" />
                    <span className="absolute left-5 top-5 rounded-full bg-gold-400 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-jungle-950">{first.category}</span>
                  </div>
                  <div className="p-7 md:p-10">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean-700">Featured guide</p>
                    <h2 className="font-display mt-2 text-2xl font-semibold text-jungle-950 md:text-3xl">{first.title}</h2>
                    <p className="mt-3 text-ink-900/65">{first.excerpt}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wider text-ocean-700">Read guide <ArrowRight size={15} /></span>
                  </div>
                </Link>
              </Reveal>
            )}
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((b, i) => <BlogCard key={b.id} b={b} delay={(i % 3) * 0.07} />)}
            </div>
          </>
        )}
      </section>
      <BookingCTA />
    </div>
  );
}

export function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data, loading } = useResource<Blog>('/api/blogs');
  const b = (data || []).find((x) => x.slug === slug && x.published);
  const others = (data || []).filter((x) => x.slug !== slug && x.published && x.category === b?.category).slice(0, 3);
  const more = others.length ? others : (data || []).filter((x) => x.slug !== slug && x.published).slice(0, 3);

  if (loading) return <div className="pt-32"><Loader /></div>;
  if (!b) {
    return (
      <div className="container-x py-40 text-center">
        <h1 className="font-display text-4xl text-jungle-950">Article not found</h1>
        <Link to="/blog" className="btn-ocean mt-6">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div>
      <section className="relative flex min-h-[60vh] items-end overflow-hidden">
        <img src={img(b.image)} alt={b.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-jungle-950 via-jungle-950/50 to-jungle-950/20" />
        <div className="container-x relative pb-14 pt-40">
          <button onClick={() => navigate(-1)} className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-xs font-bold text-white backdrop-blur hover:bg-white/25"><ArrowLeft size={14} /> Back</button>
          <span className="rounded-full bg-gold-400 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-jungle-950">{b.category}</span>
          <h1 className="font-display mt-4 max-w-4xl text-4xl font-semibold text-white text-shadow-hero md:text-5xl">{b.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/75">
            <span className="flex items-center gap-1.5"><User size={14} /> {b.author || 'Serendib Trails Team'}</span>
            <span className="flex items-center gap-1.5"><CalendarDays size={14} /> {b.created_at ? new Date(b.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} /> {b.read_minutes} min read</span>
          </div>
        </div>
        <svg className="absolute bottom-0 left-0 w-full text-sand-50" viewBox="0 0 1440 70" preserveAspectRatio="none" height="44" aria-hidden>
          <path fill="currentColor" d="M0,32 C240,70 480,0 720,24 C960,48 1200,64 1440,24 L1440,70 L0,70 Z" />
        </svg>
      </section>
      <section className="container-x section-pad grid gap-10 lg:grid-cols-[1.7fr_1fr]">
        <Reveal>
          <p className="border-l-4 border-gold-400 bg-white p-5 text-lg font-medium italic text-jungle-900 shadow-sm rounded-r-2xl">{b.excerpt}</p>
          <div className="prose-travel mt-6">
            {(b.content || '').split('\n\n').map((para, i) =>
              para.startsWith('### ') ? <h3 key={i}>{para.replace('### ', '')}</h3> : <p key={i}>{para}</p>
            )}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/booking" className="btn-gold">Plan My Trip <ArrowRight size={15} /></Link>
            <Link to="/blog" className="inline-flex items-center gap-2 rounded-full border border-jungle-900/20 px-6 py-3 text-sm font-bold text-jungle-900 hover:bg-jungle-900 hover:text-white">More Guides</Link>
          </div>
        </Reveal>
        <div>
          <div className="lg:sticky lg:top-24 rounded-3xl bg-jungle-950 p-6 text-white shadow-xl">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-gold-300">Inspired? Let's go!</h3>
            <p className="mt-2 text-sm text-white/75">Turn this guide into a real journey — free custom itinerary within 24 hours.</p>
            <Link to="/plan-trip" className="btn-gold mt-4 w-full !px-5">Start Planning</Link>
          </div>
        </div>
      </section>
      {more.length > 0 && (
        <section className="container-x !pt-0 section-pad">
          <h2 className="font-display text-3xl font-semibold text-jungle-950">Keep Reading</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {more.map((x, i) => <BlogCard key={x.id} b={x} delay={i * 0.07} />)}
          </div>
        </section>
      )}
    </div>
  );
}
