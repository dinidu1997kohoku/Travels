import { useMemo, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import PageHero from '../components/PageHero';
import BookingCTA from '../components/BookingCTA';
import { Reveal, Loader, ErrorBox, EmptyBox } from '../components/ui';
import { useResource, img } from '../lib/api';
import type { GalleryItem } from '../lib/types';

export function Gallery() {
  const { data, loading, error, refresh } = useResource<GalleryItem>('/api/gallery');
  const [cat, setCat] = useState('All');
  const [light, setLight] = useState<number | null>(null);

  const cats = useMemo(() => ['All', ...Array.from(new Set((data || []).map((g) => g.category).filter(Boolean)))], [data]);
  const filtered = cat === 'All' ? data || [] : (data || []).filter((g) => g.category === cat);

  const step = (dir: number) => {
    if (light === null) return;
    setLight((light + dir + filtered.length) % filtered.length);
  };

  return (
    <div>
      <PageHero title="Travel Gallery" subtitle="Postcards from paradise — destinations, wildlife, culture, hotels and our travellers' own moments." image="/images/culture-fishermen.jpg" crumbs={[{ label: 'Gallery' }]} />
      <section className="container-x section-pad">
        <div className="flex flex-wrap justify-center gap-2">
          {cats.map((c) => (
            <button key={c} onClick={() => { setCat(c); setLight(null); }} className={`chip ${cat === c ? 'bg-jungle-900 text-white border-jungle-900' : 'bg-white text-jungle-900 border-jungle-900/15 hover:bg-sand-100'}`}>
              <Camera size={13} /> {c}
            </button>
          ))}
        </div>
        {loading ? <Loader /> : error ? <ErrorBox message={error} onRetry={refresh} /> : filtered.length === 0 ? (
          <EmptyBox message="No photos in this category yet." />
        ) : (
          <div className="mt-8 columns-2 gap-4 md:columns-3 lg:columns-4 [&>div]:mb-4">
            {filtered.map((g, i) => (
              <Reveal key={g.id} delay={(i % 4) * 0.05}>
                <button onClick={() => setLight(i)} className="img-zoom group relative block w-full overflow-hidden rounded-2xl shadow-md">
                  <img src={img(g.image)} alt={g.title} className="w-full object-cover" loading="lazy" />
                  <span className="absolute inset-0 bg-gradient-to-t from-jungle-950/70 to-transparent opacity-0 transition group-hover:opacity-100" />
                  <span className="absolute inset-x-0 bottom-0 p-3 text-left opacity-0 transition group-hover:opacity-100">
                    <span className="block truncate text-sm font-bold text-white">{g.title}</span>
                    <span className="text-xs text-gold-300">{g.category}</span>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {light !== null && filtered[light] && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-jungle-950/95 p-4" onClick={() => setLight(null)}>
          <button className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Close"><X size={20} /></button>
          <button onClick={(e) => { e.stopPropagation(); step(-1); }} className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 md:left-8" aria-label="Previous"><ChevronLeft size={22} /></button>
          <figure className="max-h-[85vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <img src={img(filtered[light].image)} alt={filtered[light].title} className="max-h-[75vh] w-auto rounded-2xl object-contain shadow-2xl" />
            <figcaption className="mt-3 text-center text-sm font-semibold text-white">{filtered[light].title} <span className="text-gold-300">• {filtered[light].category}</span> <span className="text-white/50">({light + 1}/{filtered.length})</span></figcaption>
          </figure>
          <button onClick={(e) => { e.stopPropagation(); step(1); }} className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 md:right-8" aria-label="Next"><ChevronRight size={22} /></button>
        </div>
      )}
      <BookingCTA title="Come See It With Your Own Eyes" subtitle="Photos can't capture the scent of frangipani or the sound of the ocean — but your own journey can." />
    </div>
  );
}
