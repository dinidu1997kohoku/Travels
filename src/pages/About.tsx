import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Eye, Award, Users, Car, Headset, ShieldCheck, MapPin, Leaf } from 'lucide-react';
import PageHero from '../components/PageHero';
import BookingCTA from '../components/BookingCTA';
import { Reveal, SectionHeading } from '../components/ui';
import { useSettings } from '../lib/settings';

const VALUES = [
  { icon: Heart, t: 'Travellers First', d: 'We design every trip as if our own family were travelling — honest advice, even when it means a smaller sale.' },
  { icon: Leaf, t: 'Responsible Tourism', d: 'Local guesthouses, village experiences and plastic-free touring that puts money into community hands.' },
  { icon: ShieldCheck, t: 'Safety Always', d: 'Licensed, insured and audited annually. Speed-monitored vehicles and 24/7 emergency support on every tour.' },
  { icon: Award, t: 'Quality Obsessed', d: 'We personally re-inspect hotels, restaurants and routes every season — no outdated recommendations, ever.' },
];

const TEAM = [
  { n: 'Nuwan & Dilani Perera', r: 'Founders', d: 'Former national guides who started with one van in 2012 and a big dream — now leading a 25-person travel family.', img: '/images/culture-fishermen.jpg' },
  { n: 'Our Chauffeur-Guides', r: '12 Licensed Driver-Guides', d: 'English, German, French & Russian speaking guides trained in first aid, wildlife and Sri Lankan history.', img: '/images/vehicle-van.jpg' },
  { n: 'Travel Design Desk', r: 'Colombo Office, 24/7', d: 'Itinerary designers and on-tour support reachable on WhatsApp from first enquiry to final farewell.', img: '/images/dest-kandy.jpg' },
];

const TIMELINE = [
  ['2012', 'One van, two guides', 'Nuwan and Dilani run their first Cultural Triangle tour for a German couple — who still send Christmas cards.'],
  ['2015', 'Licensed tour operator', 'Registered with the Sri Lanka Tourism Development Authority; fleet grows to 5 vehicles.'],
  ['2018', '10,000th traveller', 'We celebrate with a beach party in Mirissa and launch tailor-made honeymoon journeys.'],
  ['2021', 'Bouncing back stronger', 'New hygiene-certified fleet, flexible cancellation promise and contactless everything.'],
  ['2024', 'Award-winning year', 'Named among the island\'s top-rated boutique operators with a 4.9★ average across 1,200+ reviews.'],
  ['2026', 'Today', '25 travel experts, 14 vehicles and one promise — your best holiday yet.'],
];

export function About() {
  const { get } = useSettings();
  const brand = get('brand_name', 'Serendib Trails');
  return (
    <div>
      <PageHero title={`About ${brand}`} subtitle="A family-run Sri Lankan tour company crafting private, honest and unforgettable island journeys since 2012." image="/images/culture-dance.jpg" crumbs={[{ label: 'About Us' }]} />

      <section className="container-x section-pad grid items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <div className="relative">
            <img src="/images/dest-sigiriya.jpg" alt="Sigiriya" className="rounded-[2rem] shadow-2xl" />
            <div className="absolute -bottom-6 -left-4 rounded-2xl bg-gold-400 px-6 py-4 text-jungle-950 shadow-xl md:-left-8">
              <p className="font-display text-3xl font-bold">12,000+</p>
              <p className="text-xs font-bold uppercase tracking-widest">Happy travellers hosted</p>
            </div>
          </div>
        </Reveal>
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-jungle-900/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-ocean-700">Our Story</span>
            <h2 className="font-display mt-4 text-3xl font-semibold text-jungle-950 md:text-4xl">From One Van to the Island's Most Loved Boutique Operator</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-5 space-y-4 leading-relaxed text-ink-900/70">
              <p>{brand} began in 2012 when Nuwan, a national tourist guide, and Dilani, a hotel manager, decided travellers deserved something better than rushed group buses and commission-stop shopping tours. Their idea was simple: private journeys with a friend-like local guide, honest prices and the freedom to linger where your heart smiles.</p>
              <p>Fourteen years later we are a 25-person family of guides, drivers, designers and dreamers — still family-run, still answering every WhatsApp personally, and still obsessed with that moment a traveller sees Sigiriya at sunrise for the first time.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-jungle-950 py-16 md:py-24">
        <div className="container-x grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-[2rem] bg-white/5 p-8 ring-1 ring-white/10 md:p-10">
              <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gold-400 p-3.5 text-jungle-950"><Heart size={24} /></span>
              <h3 className="font-display mt-5 text-3xl font-semibold text-white">Our Mission</h3>
              <p className="mt-3 leading-relaxed text-white/75">To give every guest an authentic, safe and deeply personal experience of Sri Lanka — while ensuring tourism genuinely benefits local families, from village homestays to lagoon fishermen.</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-[2rem] bg-white/5 p-8 ring-1 ring-white/10 md:p-10">
              <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-ocean-500 p-3.5 text-white"><Eye size={24} /></span>
              <h3 className="font-display mt-5 text-3xl font-semibold text-white">Our Vision</h3>
              <p className="mt-3 leading-relaxed text-white/75">To be the most trusted name in Sri Lankan travel worldwide — proof that a small island company with a big heart can set the global standard for private touring.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-x section-pad">
        <SectionHeading eyebrow="What We Stand For" title="Our Values" subtitle="The promises stitched into every itinerary, every pickup and every goodbye hug at the airport." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <Reveal key={v.t} delay={i * 0.08}>
              <div className="card-hover h-full rounded-3xl border border-jungle-900/10 bg-white p-7 shadow-md">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean-600 to-jungle-800 text-white"><v.icon size={22} /></span>
                <h3 className="font-display mt-4 text-xl font-semibold text-jungle-950">{v.t}</h3>
                <p className="mt-2 text-sm text-ink-900/60">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-sand-100/60 py-16 md:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Meet the Family" title="Guides, Drivers & Care Crew" subtitle="Licensed, background-checked and hospitality-trained — the people travellers write home about." />
          <div className="grid gap-6 md:grid-cols-3">
            {TEAM.map((m, i) => (
              <Reveal key={m.n} delay={i * 0.08}>
                <div className="card-hover img-zoom overflow-hidden rounded-3xl bg-white shadow-lg">
                  <div className="aspect-[16/10] overflow-hidden"><img src={m.img} alt={m.n} className="h-full w-full object-cover" loading="lazy" /></div>
                  <div className="p-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-ocean-700">{m.r}</p>
                    <h3 className="font-display mt-1 text-xl font-semibold text-jungle-950">{m.n}</h3>
                    <p className="mt-2 text-sm text-ink-900/60">{m.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-8 grid gap-4 rounded-3xl bg-jungle-950 p-7 text-white md:grid-cols-3 md:p-8">
              <p className="flex items-start gap-3 text-sm"><Users size={20} className="shrink-0 text-gold-300" /> All guides hold National Tourist Guide Lecturer licences + first-aid certification.</p>
              <p className="flex items-start gap-3 text-sm"><Car size={20} className="shrink-0 text-gold-300" /> Drivers average 9 years on tourist routes with defensive-driving refreshers yearly.</p>
              <p className="flex items-start gap-3 text-sm"><Headset size={20} className="shrink-0 text-gold-300" /> 24/7 on-tour hotline — a human answers in under 5 minutes, day or night.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-x section-pad">
        <SectionHeading eyebrow="Since 2012" title="Our Journey So Far" />
        <div className="relative mx-auto max-w-3xl">
          <span className="absolute bottom-0 left-5 top-0 w-0.5 bg-gradient-to-b from-gold-400 via-ocean-600 to-jungle-900 md:left-1/2" />
          {TIMELINE.map(([y, t, d], i) => (
            <Reveal key={y}>
              <div className={`relative flex gap-5 pb-8 md:w-1/2 ${i % 2 ? 'md:ml-auto md:flex-row-reverse md:pl-10 md:text-left' : 'md:pr-10 md:text-right'} pl-14 md:pl-0`}>
                <span className="absolute left-5 top-1 flex h-4 w-4 -translate-x-1/2 items-center justify-center md:left-auto md:right-auto md:translate-x-0" style={i % 2 ? { left: '-8px' } : { right: '-8px', left: 'auto' }}>
                  <span className="h-4 w-4 rounded-full border-4 border-sand-50 bg-gold-400 shadow" />
                </span>
                <div className={`w-full rounded-2xl border border-jungle-900/10 bg-white p-5 shadow-md ${i % 2 ? '' : 'md:mr-0'}`}>
                  <p className="font-display text-2xl font-bold text-ocean-700">{y}</p>
                  <h4 className="font-bold text-jungle-950">{t}</h4>
                  <p className="mt-1 text-sm text-ink-900/60">{d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-6 text-center">
          <Link to="/booking" className="btn-gold">Become Part of Our Story <ArrowRight size={16} /></Link>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-900/50"><MapPin size={13} /> Colombo • Kandy • Galle • Ella — serving the whole island</p>
        </Reveal>
      </section>
      <BookingCTA />
    </div>
  );
}
