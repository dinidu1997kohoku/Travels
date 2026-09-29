import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ChevronLeft, ChevronRight, MapPin, ShieldCheck, Users, Headset, BadgeDollarSign,
  Sparkles, MessageCircle, Car, Compass, Palmtree, Mountain, Waves, Landmark, Binoculars, ChevronDown,
} from 'lucide-react';
import { useResource, waLink, img, arr, fmtUSD } from '../lib/api';
import { useSettings } from '../lib/settings';
import { useLang } from '../i18n/lang';
import {
  Reveal, SectionHeading, Loader, DestinationCard, PackageCard, ReviewCard, Stars,
} from '../components/ui';
import BookingCTA from '../components/BookingCTA';
import type { Destination, TourPackage, Review, GalleryItem, Offer, Vehicle } from '../lib/types';

const DEFAULT_HEROES = [
  { img: '/images/hero.jpg', kicker: 'Sigiriya • Cultural Triangle', title: 'The Island of Endless Wonder', sub: 'Ancient fortresses, misty tea hills, wild safaris and golden beaches — all in one magical island.' },
  { img: '/images/dest-ella.jpg', kicker: 'Ella • Hill Country', title: 'Ride the Most Beautiful Railway on Earth', sub: 'Cross the Nine Arch Bridge and wind through emerald tea estates on an unforgettable train journey.' },
  { img: '/images/dest-mirissa.jpg', kicker: 'Mirissa • South Coast', title: 'Turquoise Seas & Coconut Dreams', sub: 'Whale watching, surfing and barefoot sunsets on the palm-fringed shores of the south coast.' },
  { img: '/images/dest-yala.jpg', kicker: 'Yala • Wild South', title: 'Meet Leopards & Gentle Giants', sub: 'Game drives through untamed wilderness with expert trackers and luxury 4x4 safaris.' },
];

const STATS = [
  { n: '14+', l: 'Years of Experience' },
  { n: '12k+', l: 'Happy Travellers' },
  { n: '60+', l: 'Curated Itineraries' },
  { n: '4.9', l: 'Average Rating' },
];

const WHY = [
  { icon: BadgeDollarSign, t: 'Honest, Transparent Pricing', d: 'No hidden charges, no commission traps. Clear quotes in USD with everything itemised before you pay a cent.' },
  { icon: ShieldCheck, t: 'Licensed & Fully Insured', d: 'Registered with the Sri Lanka Tourism Development Authority. Modern insured fleet with vetted chauffeur-guides.' },
  { icon: Users, t: 'Local Expert Team', d: 'English-speaking national guides, careful drivers and 24/7 on-tour support from our Colombo travel desk.' },
  { icon: Headset, t: '24/7 Traveller Support', d: 'Flight delayed? Plans changed? One WhatsApp message and our team rearranges everything — day or night.' },
];

const CATS = [
  { icon: Landmark, t: 'Culture', d: 'Ancient cities & temples', to: '/packages?cat=Cultural', img: '/images/dest-anuradhapura.jpg' },
  { icon: Waves, t: 'Beaches', d: 'Surf, whales & sunsets', to: '/packages?cat=Beach', img: '/images/dest-mirissa.jpg' },
  { icon: Binoculars, t: 'Wildlife', d: 'Leopards & elephants', to: '/packages?cat=Wildlife', img: '/images/dest-yala.jpg' },
  { icon: Mountain, t: 'Adventure', d: 'Hikes, trains & rafting', to: '/packages?cat=Adventure', img: '/images/dest-ella.jpg' },
];

function Hero() {
  const [i, setI] = useState(0);
  const { get } = useSettings();
  const { t } = useLang();
  const { data: heroes } = useResource<any>('/api/heroes');
  const slides = heroes?.length ? heroes : DEFAULT_HEROES;
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % slides.length), 6500);
    return () => clearInterval(id);
  }, [slides.length]);
  const h = slides[i] || DEFAULT_HEROES[0];
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        >
          <img src={h.img} alt={h.title} className="h-full w-full object-cover" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-jungle-950/95 via-jungle-950/35 to-jungle-950/45" />
      <div className="absolute inset-0 bg-gradient-to-r from-jungle-950/70 via-transparent to-transparent" />

      <div className="container-x relative pb-28 pt-40">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-gold-300 backdrop-blur">
              <Sparkles size={13} /> {t('hero.badge')}
            </span>
            <p className="mt-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-white/80">
              <MapPin size={15} className="text-gold-300" /> {h.kicker}
            </p>
            <h1 className="font-display mt-3 text-5xl font-semibold leading-[1.05] text-white text-shadow-hero sm:text-6xl md:text-7xl">
              {h.title}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/85">{h.sub}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/booking" className="btn-gold">
                {t('common.bookNow')} <ArrowRight size={16} />
              </Link>
              <Link to="/packages" className="btn-outline-light">
                {t('common.explore')} Packages
              </Link>
              <button
                onClick={() => window.open(waLink(get('whatsapp', '94771234567'), get('whatsapp_message', 'Hello! I would like to plan a Sri Lanka tour.')), '_blank')}
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-[#1fb857]"
              >
                <MessageCircle size={17} /> WhatsApp
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex items-center gap-3">
          {slides.map((x, idx) => (
            <button
              key={x.title}
              onClick={() => setI(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${idx === i ? 'w-12 bg-gold-400' : 'w-6 bg-white/35 hover:bg-white/60'}`}
            />
          ))}
          <div className="ml-4 hidden gap-2 sm:flex">
            <button onClick={() => setI((i - 1 + slides.length) % slides.length)} aria-label="Previous" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white hover:text-jungle-900">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setI((i + 1) % slides.length)} aria-label="Next" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white hover:text-jungle-900">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0">
        <div className="glass-dark border-t border-white/10">
          <div className="container-x grid grid-cols-2 gap-4 py-5 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.l} className="text-center sm:text-left">
                <p className="font-display text-2xl font-bold text-gold-300 md:text-3xl">{s.n}</p>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-32 left-1/2 hidden -translate-x-1/2 text-white/60 lg:block">
        <ChevronDown size={26} />
      </motion.div>
    </section>
  );
}

function CategoryTiles() {
  return (
    <section className="container-x section-pad !pb-0">
      <SectionHeading eyebrow="Travel Styles" title="How Do You Want to Experience Sri Lanka?" subtitle="From sacred cities to surf breaks — pick your passion and we will design the perfect route." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CATS.map((c, idx) => (
          <Reveal key={c.t} delay={idx * 0.08}>
            <Link to={c.to} className="card-hover img-zoom group relative block overflow-hidden rounded-3xl shadow-lg">
              <div className="aspect-[4/5] w-full overflow-hidden">
                <img src={c.img} alt={c.t} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-jungle-950/90 via-jungle-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-gold-300 backdrop-blur">
                  <c.icon size={20} />
                </span>
                <h3 className="font-display text-2xl font-semibold text-white">{c.t}</h3>
                <p className="text-sm text-white/70">{c.d}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Marquee() {
  const words = ['Sigiriya', 'Kandy', 'Ella', 'Mirissa', 'Galle', 'Yala', 'Nuwara Eliya', 'Trincomalee', 'Anuradhapura', 'Polonnaruwa'];
  const row = [...words, ...words];
  return (
    <div className="mt-16 overflow-hidden border-y border-jungle-900/10 bg-jungle-950 py-4 md:mt-24">
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-8 text-sm font-bold uppercase tracking-[0.25em] text-white/70">
            {w} <Palmtree size={15} className="text-gold-400" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { data: dests, loading: dl } = useResource<Destination>('/api/destinations');
  const { data: pkgs, loading: pl } = useResource<TourPackage>('/api/packages');
  const { data: revs } = useResource<Review>('/api/reviews');
  const { data: gallery } = useResource<GalleryItem>('/api/gallery');
  const { data: offers } = useResource<Offer>('/api/offers');
  const { data: vehicles } = useResource<Vehicle>('/api/vehicles');
  const { get } = useSettings();

  const featuredDests = useMemo(() => {
    const f = (dests || []).filter((d) => d.featured);
    return (f.length ? f : dests || []).slice(0, 4);
  }, [dests]);
  const featuredPkgs = useMemo(() => {
    const f = (pkgs || []).filter((p) => p.featured);
    return (f.length ? f : pkgs || []).slice(0, 3);
  }, [pkgs]);
  const approvedRevs = useMemo(() => (revs || []).filter((r) => r.approved).slice(0, 3), [revs]);
  const activeOffers = useMemo(() => (offers || []).filter((o) => o.active).slice(0, 3), [offers]);
  const avgRating = useMemo(() => {
    const a = (revs || []).filter((r) => r.approved);
    if (!a.length) return 4.9;
    return a.reduce((s, r) => s + Number(r.rating || 5), 0) / a.length;
  }, [revs]);

  return (
    <div>
      <Hero />

      {/* Welcome */}
      <section className="container-x section-pad grid items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <div className="relative">
            <img src="/images/culture-fishermen.jpg" alt="Stilt fishermen at sunset" className="rounded-[2rem] shadow-2xl" />
            <img src="/images/dest-kandy.jpg" alt="Kandy" className="absolute -bottom-8 -right-4 hidden w-56 rounded-3xl border-4 border-sand-50 shadow-xl sm:block animate-float" />
            <div className="absolute -left-3 top-6 rounded-2xl bg-jungle-950 px-5 py-4 text-white shadow-xl md:-left-8">
              <p className="font-display text-3xl font-bold text-gold-300">14+</p>
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/70">Years guiding<br />the island</p>
            </div>
          </div>
        </Reveal>
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-jungle-900/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-ocean-700">
              <Compass size={13} /> Ayubowan — Welcome
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-display mt-4 text-3xl font-semibold leading-tight text-jungle-950 md:text-5xl">
              {get('home_welcome_title', 'Your Trusted Local Partner for Unforgettable Sri Lanka Holidays')}
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 leading-relaxed text-ink-900/70">
              {get('home_welcome_text', 'We are a Colombo-based, family-run tour company with over 14 years of experience showing travellers the very best of our island home. From the moment we meet you at the airport with a garland of frangipani, every hotel, driver, guide and hidden viewpoint is hand-picked for you.')}
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <ul className="mt-6 space-y-3 text-sm font-medium text-ink-900/75">
              {['Private tours with your own chauffeur-guide — never mixed groups', 'Hand-checked hotels, from beach cabanas to luxury villas', 'Flexible itineraries: change plans any day, free of stress'].map((x) => (
                <li key={x} className="flex items-start gap-2.5">
                  <ShieldCheck size={17} className="mt-0.5 shrink-0 text-ocean-600" /> {x}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/about" className="btn-ocean">Our Story <ArrowRight size={16} /></Link>
              <Link to="/reviews" className="inline-flex items-center gap-2 rounded-full border border-jungle-900/20 px-6 py-3 text-sm font-bold text-jungle-900 transition hover:bg-jungle-900 hover:text-white">
                <Stars rating={avgRating} size={14} /> {avgRating.toFixed(1)} Guest Rating
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Marquee />
      <CategoryTiles />

      {/* Featured destinations */}
      <section className="container-x section-pad">
        <SectionHeading eyebrow="Where to Go" title="Featured Destinations" subtitle="Ten places that make travellers fall in love with Sri Lanka — which will steal your heart?" />
        {dl ? <Loader /> : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredDests.map((d, i) => <DestinationCard key={d.id} d={d} delay={i * 0.07} />)}
          </div>
        )}
        <Reveal className="mt-10 text-center">
          <Link to="/destinations" className="btn-ocean">All Destinations <ArrowRight size={16} /></Link>
        </Reveal>
      </section>

      {/* Popular packages */}
      <section className="bg-jungle-950 py-16 md:py-24 relative overflow-hidden">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-ocean-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <SectionHeading light eyebrow="Best Sellers" title="Popular Tour Packages" subtitle="Our most-loved itineraries — fully private, fully flexible, and priced honestly." />
          {pl ? <Loader label="Loading packages..." /> : (
            <div className="grid gap-6 md:grid-cols-3">
              {featuredPkgs.map((p, i) => <PackageCard key={p.id} p={p} delay={i * 0.08} />)}
            </div>
          )}
          <Reveal className="mt-10 text-center">
            <Link to="/packages" className="btn-gold">View All Packages <ArrowRight size={16} /></Link>
          </Reveal>
        </div>
      </section>

      {/* Transport strip */}
      <section className="container-x section-pad">
        <SectionHeading eyebrow="Travel in Comfort" title="Tourism Transport Services" subtitle="Late-model air-conditioned vehicles with careful, English-speaking drivers — airport pickups to full island tours." />
        <div className="grid gap-5 md:grid-cols-3">
          {(vehicles || []).slice(0, 3).map((v, i) => (
            <Reveal key={v.id} delay={i * 0.08}>
              <div className="card-hover flex items-center gap-4 rounded-3xl border border-jungle-900/10 bg-white p-4 shadow-md">
                <img src={img(v.image, '/images/vehicle-car.jpg')} alt={v.name} className="h-24 w-28 shrink-0 rounded-2xl object-cover" loading="lazy" />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-ocean-700">{v.type}</p>
                  <h3 className="font-display truncate text-lg font-semibold text-jungle-950">{v.name}</h3>
                  <p className="text-xs text-ink-900/55">{v.passengers} seats • {v.ac ? 'A/C' : 'Non-A/C'} • Driver included</p>
                  <p className="mt-1 text-sm font-extrabold text-jungle-900">
                    {v.price_per_day_usd ? <>{fmtUSD(v.price_per_day_usd)}<span className="text-xs font-medium text-ink-900/50"> /day</span></> : <span className="text-sm text-ocean-700">{v.price_note || 'Contact for Price'}</span>}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
          {!(vehicles || []).length && (
            <Reveal className="md:col-span-3">
              <div className="flex flex-col items-center gap-4 rounded-3xl bg-jungle-950 p-10 text-center text-white">
                <Car size={36} className="text-gold-300" />
                <p className="max-w-xl">Cars, vans, SUVs and coaches with professional drivers for airport transfers, day trips and multi-day tours across the island.</p>
                <Link to="/transport" className="btn-gold">Explore Fleet <ArrowRight size={16} /></Link>
              </div>
            </Reveal>
          )}
        </div>
        {!!(vehicles || []).length && (
          <Reveal className="mt-8 text-center">
            <Link to="/transport" className="btn-ocean">Full Fleet & Rates <ArrowRight size={16} /></Link>
          </Reveal>
        )}
      </section>

      {/* Why us */}
      <section className="bg-sand-100/60 py-16 md:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Why Serendib Trails" title="Reasons Travellers Choose Us" subtitle="Thousands of five-star journeys — built on local knowledge, honest service and genuine care." />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w, i) => (
              <Reveal key={w.t} delay={i * 0.08}>
                <div className="card-hover h-full rounded-3xl bg-white p-7 shadow-md">
                  <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean-600 to-jungle-800 p-3.5 text-white shadow-lg">
                    <w.icon size={22} />
                  </span>
                  <h3 className="font-display mt-5 text-xl font-semibold text-jungle-950">{w.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-900/60">{w.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Offers */}
      {activeOffers.length > 0 && (
        <section className="container-x section-pad">
          <SectionHeading eyebrow="Special Offers" title="Limited-Time Travel Deals" subtitle="Seasonal discounts on our favourite itineraries — book early, travel happy." />
          <div className="grid gap-6 md:grid-cols-3">
            {activeOffers.map((o, i) => (
              <Reveal key={o.id} delay={i * 0.08}>
                <div className="card-hover relative overflow-hidden rounded-3xl shadow-xl">
                  <img src={img(o.image, '/images/dest-galle.jpg')} alt={o.title} className="h-64 w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-jungle-950/95 via-jungle-950/40 to-transparent" />
                  <span className="absolute right-4 top-4 rounded-full bg-sunset-500 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white shadow">
                    {o.discount}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-display text-xl font-semibold text-white">{o.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-white/75">{o.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gold-300">Valid until {o.valid_until ? new Date(o.valid_until).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</span>
                      <Link to={o.package_id ? `/packages` : '/booking'} className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-white hover:text-gold-300">
                        Claim <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="bg-jungle-50/60 py-16 md:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Guest Stories" title="Loved by Travellers Worldwide" subtitle={`${(revs || []).filter((r) => r.approved).length || '1200'}+ verified reviews with an average rating of ${avgRating.toFixed(1)} out of 5.`} />
          <div className="grid gap-6 md:grid-cols-3">
            {approvedRevs.map((r, i) => <ReviewCard key={r.id} r={r} delay={i * 0.08} />)}
          </div>
          <Reveal className="mt-10 text-center">
            <Link to="/reviews" className="btn-ocean">Read All Reviews <ArrowRight size={16} /></Link>
          </Reveal>
        </div>
      </section>

      {/* Gallery strip */}
      <section className="container-x section-pad">
        <SectionHeading eyebrow="Postcards" title="Glimpses of Paradise" subtitle="A taste of the beaches, mountains, wildlife and culture waiting for you." />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {(gallery || []).slice(0, 8).map((g, i) => (
            <Reveal key={g.id} delay={(i % 4) * 0.06}>
              <Link to="/gallery" className="img-zoom block overflow-hidden rounded-2xl shadow-md">
                <img src={img(g.image)} alt={g.title} className={`w-full object-cover ${i % 4 === 0 || i % 4 === 3 ? 'aspect-[3/4]' : 'aspect-square'}`} loading="lazy" />
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center">
          <Link to="/gallery" className="btn-ocean">Open Gallery <ArrowRight size={16} /></Link>
        </Reveal>
      </section>

      {/* Itinerary teaser */}
      <section className="container-x !pb-0">
        <Reveal>
          <div className="grid overflow-hidden rounded-[2rem] bg-jungle-950 shadow-2xl md:grid-cols-2">
            <div className="p-8 md:p-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gold-300">
                <Sparkles size={13} /> 100% Tailor-Made
              </span>
              <h2 className="font-display mt-4 text-3xl font-semibold text-white md:text-4xl">Can't Find Your Perfect Trip? We'll Build It With You.</h2>
              <p className="mt-4 text-white/70">Pick your destinations, dates, hotels and activities — our designers craft a day-by-day itinerary with honest pricing, usually within 24 hours.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {(arr((pkgs || [])[0]?.destinations).length ? ['Sigiriya', 'Kandy', 'Ella', 'Mirissa', 'Yala', 'Galle'] : []).map((d) => (
                  <span key={d} className="rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-semibold text-white/80">{d}</span>
                ))}
              </div>
              <Link to="/plan-trip" className="btn-gold mt-7">Start Planning <ArrowRight size={16} /></Link>
            </div>
            <div className="relative min-h-72">
              <img src="/images/dest-nuwaraeliya.jpg" alt="Tea country" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-r from-jungle-950 via-jungle-950/20 to-transparent" />
            </div>
          </div>
        </Reveal>
      </section>

      <BookingCTA />
    </div>
  );
}
