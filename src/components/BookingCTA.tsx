import { Link } from 'react-router-dom';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { Reveal } from './ui';
import { waLink } from '../lib/api';
import { useSettings } from '../lib/settings';

export default function BookingCTA({
  title = 'Ready for the Journey of a Lifetime?',
  subtitle = 'Tell us your dream Sri Lanka itinerary — our local travel experts reply within a few hours with a personalised quote.',
  image = '/images/culture-fishermen.jpg',
}: {
  title?: string;
  subtitle?: string;
  image?: string;
}) {
  const { get } = useSettings();
  return (
    <section className="container-x section-pad">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] shadow-2xl shadow-jungle-950/25">
          <img src={image} alt="Sri Lanka" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-jungle-950/95 via-jungle-950/75 to-jungle-950/30" />
          <div className="relative grid items-center gap-8 p-8 md:grid-cols-[1.4fr_1fr] md:p-14">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-gold-400/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gold-300 backdrop-blur">
                Free travel consultation
              </span>
              <h2 className="font-display mt-4 text-3xl font-semibold text-white md:text-5xl">{title}</h2>
              <p className="mt-4 max-w-xl text-white/75">{subtitle}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/booking" className="btn-gold">
                  Request Booking <ArrowRight size={16} />
                </Link>
                <Link to="/plan-trip" className="btn-outline-light">
                  Plan Custom Tour
                </Link>
              </div>
            </div>
            <div className="glass rounded-3xl border border-white/20 p-6 text-white">
              <h3 className="font-display text-xl font-semibold">Prefer to chat?</h3>
              <p className="mt-1 text-sm text-white/70">We are online on WhatsApp 8 AM – 10 PM Sri Lanka time.</p>
              <button
                onClick={() => window.open(waLink(get('whatsapp', '94771234567'), get('whatsapp_message', 'Hello! I would like to plan a Sri Lanka tour.')), '_blank')}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-white transition hover:bg-[#1fb857]"
              >
                <MessageCircle size={18} /> WhatsApp Us Now
              </button>
              <a href={`tel:${get('phone', '+94 77 123 4567').replace(/\s/g, '')}`} className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10">
                Call {get('phone', '+94 77 123 4567')}
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
