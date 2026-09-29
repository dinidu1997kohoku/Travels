import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, Facebook, Instagram, Youtube, Twitter, MessageCircle } from 'lucide-react';
import PageHero from '../components/PageHero';
import { Reveal } from '../components/ui';
import { api, waLink } from '../lib/api';
import { useSettings } from '../lib/settings';
import type { Message } from '../lib/types';

const input = 'input-field';
const label = 'label-field';

export function Contact() {
  const { get } = useSettings();
  const brand = get('brand_name', 'Serendib Trails');
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState('');
  const [f, setF] = useState({ name: '', email: '', phone: '', country: '', subject: 'General enquiry', message: '' });
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (!f.name.trim() || !f.email.trim() || !f.message.trim()) return setErr('Please fill your name, email and message.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return setErr('Please enter a valid email.');
    setSending(true);
    try {
      await api<Message>('/api/messages', 'POST', { ...f, name: f.name.trim(), email: f.email.trim(), message: f.message.trim() });
      setOk(true);
      setF({ name: '', email: '', phone: '', country: '', subject: 'General enquiry', message: '' });
    } catch (e2: any) {
      setErr(e2?.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const cards = [
    { icon: MapPin, t: 'Visit Us', d: get('address', 'No. 42, Galle Road, Colombo 03, Sri Lanka') },
    { icon: Phone, t: 'Call / WhatsApp', d: `${get('phone', '+94 77 123 4567')} • WhatsApp ${get('whatsapp_display', '+94 77 123 4567')}` },
    { icon: Mail, t: 'Email', d: get('email', 'hello@serendibtrails.lk') },
    { icon: Clock, t: 'Working Hours', d: get('hours', 'Daily 8:00 AM – 10:00 PM (Sri Lanka time)') },
  ];

  return (
    <div>
      <PageHero title="Contact Us" subtitle="Questions, quotes or just a friendly hello — we reply fast, usually within a couple of hours." image="/images/dest-polonnaruwa.jpg" crumbs={[{ label: 'Contact' }]} />
      <section className="container-x section-pad">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <Reveal key={c.t} delay={i * 0.07}>
              <div className="card-hover h-full rounded-3xl border border-jungle-900/10 bg-white p-6 shadow-md">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean-600 to-jungle-800 text-white"><c.icon size={21} /></span>
                <h3 className="mt-4 font-extrabold text-jungle-950">{c.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-900/65">{c.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="h-full overflow-hidden rounded-[2rem] shadow-xl">
              <iframe
                title={`${brand} map`}
                src="https://www.google.com/maps?q=Galle+Road+Colombo+03+Sri+Lanka&output=embed"
                className="h-72 w-full border-0 lg:h-[46%]"
                loading="lazy"
              />
              <div className="bg-jungle-950 p-7 text-white lg:h-[54%]">
                <h3 className="font-display text-2xl font-semibold">{brand}</h3>
                <p className="mt-2 text-sm text-white/70">Licensed Sri Lanka tour operator • SLTDA Reg. No. SLTDA/SQA/TA/01234</p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {[
                    { icon: Facebook, href: get('facebook', 'https://facebook.com'), l: 'Facebook' },
                    { icon: Instagram, href: get('instagram', 'https://instagram.com'), l: 'Instagram' },
                    { icon: Youtube, href: get('youtube', 'https://youtube.com'), l: 'YouTube' },
                    { icon: Twitter, href: get('twitter', 'https://x.com'), l: 'X' },
                    { icon: Send, href: get('tiktok', 'https://tiktok.com'), l: 'TikTok' },
                  ].map((s) => (
                    <a key={s.l} href={s.href} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold transition hover:bg-gold-400 hover:text-jungle-950">
                      <s.icon size={14} /> {s.l}
                    </a>
                  ))}
                </div>
                <button onClick={() => window.open(waLink(get('whatsapp', '94771234567'), get('whatsapp_message', 'Hello! I would like to plan a Sri Lanka tour.')), '_blank')} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-white hover:bg-[#1fb857]">
                  <MessageCircle size={18} /> Chat on WhatsApp
                </button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <form onSubmit={submit} className="h-full rounded-[2rem] border border-jungle-900/10 bg-white p-6 shadow-xl md:p-8">
              <h3 className="font-display text-2xl font-semibold text-jungle-950">Send Us a Message</h3>
              <p className="mt-1 text-sm text-ink-900/55">We usually reply within 2–4 hours during working hours.</p>
              {ok ? (
                <div className="mt-5 rounded-2xl bg-emerald-50 p-6 text-center font-semibold text-emerald-800 ring-1 ring-emerald-600/20">
                  <CheckCircle2 size={30} className="mx-auto" />
                  <p className="mt-2">Message sent! We'll be in touch very soon.</p>
                  <button type="button" onClick={() => setOk(false)} className="mt-2 text-xs font-bold text-ocean-700 underline">Send another message</button>
                </div>
              ) : (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div><label className={label}>Name *</label><input className={input} value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Your name" /></div>
                  <div><label className={label}>Email *</label><input type="email" className={input} value={f.email} onChange={(e) => set('email', e.target.value)} placeholder="you@email.com" /></div>
                  <div><label className={label}>Phone</label><input className={input} value={f.phone} onChange={(e) => set('phone', e.target.value)} /></div>
                  <div><label className={label}>Country</label><input className={input} value={f.country} onChange={(e) => set('country', e.target.value)} /></div>
                  <div className="sm:col-span-2"><label className={label}>Subject</label>
                    <select className={input} value={f.subject} onChange={(e) => set('subject', e.target.value)}>
                      {['General enquiry', 'Tour package question', 'Custom tour request', 'Transport / vehicle hire', 'Hotel booking', 'Existing booking', 'Partnership', 'Feedback'].map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2"><label className={label}>Message *</label><textarea rows={5} className={input} value={f.message} onChange={(e) => set('message', e.target.value)} placeholder="How can we help you?" /></div>
                  {err && <p className="sm:col-span-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700">{err}</p>}
                  <button type="submit" disabled={sending} className="btn-ocean sm:col-span-2 disabled:opacity-60">{sending ? 'Sending...' : <><Send size={16} /> Send Message</>}</button>
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
