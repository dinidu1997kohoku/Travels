import { useEffect, useMemo, useState } from 'react';
import {
  LayoutDashboard, MapPin, Package, Car, BedDouble, CalendarCheck, Wand2, Star, FileText,
  HelpCircle, Image as ImageIcon, Mail, MessageSquare, Settings as SettingsIcon, Tag, LogOut,
  Plus, Pencil, Trash2, X, Search, Eye, Lock, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { api } from '../lib/api';

const ADMIN_KEY = 'st-admin-auth';
const DEFAULT_PASSWORD = 'serendib2026';

const TABS = [
  { k: 'dashboard', l: 'Dashboard', icon: LayoutDashboard },
  { k: 'users', l: 'Users', icon: Lock },
  { k: 'bookings', l: 'Bookings', icon: CalendarCheck },
  { k: 'custom', l: 'Custom Tours', icon: Wand2 },
  { k: 'inquiries', l: 'Vehicle Inquiries', icon: MessageSquare },
  { k: 'messages', l: 'Contact Messages', icon: Mail },
  { k: 'destinations', l: 'Destinations', icon: MapPin },
  { k: 'packages', l: 'Packages', icon: Package },
  { k: 'vehicles', l: 'Vehicles', icon: Car },
  { k: 'hotels', l: 'Hotels', icon: BedDouble },
  { k: 'reviews', l: 'Reviews', icon: Star },
  { k: 'blogs', l: 'Blog', icon: FileText },
  { k: 'faqs', l: 'FAQs', icon: HelpCircle },
  { k: 'gallery', l: 'Gallery', icon: ImageIcon },
  { k: 'offers', l: 'Offers', icon: Tag },
  { k: 'settings', l: 'Site Settings', icon: SettingsIcon },
];

const STATUS_COLORS: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-800',
  Contacted: 'bg-sky-100 text-sky-800',
  Confirmed: 'bg-emerald-100 text-emerald-800',
  Completed: 'bg-violet-100 text-violet-800',
  Cancelled: 'bg-red-100 text-red-700',
  New: 'bg-amber-100 text-amber-800',
  Read: 'bg-sky-100 text-sky-800',
  Replied: 'bg-emerald-100 text-emerald-800',
};

const BOOKING_STATUSES = ['Pending', 'Contacted', 'Confirmed', 'Completed', 'Cancelled'];

const ENDPOINTS: Record<string, string> = {
  destinations: '/api/destinations',
  packages: '/api/packages',
  vehicles: '/api/vehicles',
  hotels: '/api/hotels',
  bookings: '/api/bookings',
  custom: '/api/custom-tours',
  reviews: '/api/reviews',
  blogs: '/api/blogs',
  faqs: '/api/faqs',
  gallery: '/api/gallery',
  messages: '/api/messages',
  inquiries: '/api/inquiries',
  offers: '/api/offers',
  settings: '/api/settings',
  users: '/api/users',
};

// field schema: [key, label, type]  types: text, textarea, number, bool, date, csv, json, status, readonly
type F = [string, string, string];
const SCHEMAS: Record<string, { list: string[]; fields: F[] }> = {
  destinations: {
    list: ['name', 'province', 'region', 'featured'],
    fields: [
      ['name', 'Name', 'text'], ['slug', 'Slug', 'text'], ['province', 'Province / Location', 'text'],
      ['region', 'Region (North/Central/South...)', 'text'], ['short_intro', 'Short intro', 'text'],
      ['description', 'Full description (blank line = paragraph)', 'textarea'], ['image', 'Image URL', 'text'],
      ['attractions', 'Attractions', 'csv'], ['activities', 'Activities', 'csv'], ['categories', 'Categories', 'csv'],
      ['best_time', 'Best time to visit', 'textarea'],
      ['latitude', 'Latitude', 'number'], ['longitude', 'Longitude', 'number'], ['featured', 'Featured', 'bool'],
    ],
  },
  packages: {
    list: ['name', 'category', 'duration_label', 'price_usd', 'featured'],
    fields: [
      ['name', 'Name', 'text'], ['slug', 'Slug', 'text'], ['category', 'Category', 'text'],
      ['price_usd', 'Price USD (blank = contact)', 'number'], ['price_note', 'Price note', 'text'],
      ['duration_days', 'Duration (days)', 'number'], ['duration_label', 'Duration label', 'text'],
      ['destinations', 'Destinations', 'csv'], ['image', 'Image URL', 'text'],
      ['short_desc', 'Short description', 'text'], ['description', 'Full description', 'textarea'],
      ['itinerary', 'Itinerary JSON [{"day","title","detail"}]', 'json'],
      ['activities', 'Activities', 'csv'], ['accommodation', 'Accommodation info', 'textarea'],
      ['transport', 'Transport info', 'textarea'], ['included', 'Included', 'csv'], ['excluded', 'Excluded', 'csv'],
      ['terms', 'Terms & conditions', 'textarea'], ['featured', 'Featured', 'bool'],
      ['discount_pct', 'Discount %', 'number'], ['rating', 'Rating', 'number'], ['reviews_count', 'Reviews count', 'number'],
    ],
  },
  vehicles: {
    list: ['name', 'type', 'passengers', 'price_per_day_usd'],
    fields: [
      ['name', 'Name', 'text'], ['type', 'Type (Car/Van/SUV...)', 'text'], ['image', 'Image URL', 'text'],
      ['passengers', 'Passenger capacity', 'number'], ['luggage', 'Luggage capacity', 'text'],
      ['ac', 'Air conditioning', 'bool'], ['driver_included', 'Driver included', 'bool'],
      ['price_per_day_usd', 'Price/day USD (blank = contact)', 'number'], ['price_note', 'Price note', 'text'],
      ['features', 'Features', 'csv'],
    ],
  },
  hotels: {
    list: ['name', 'type', 'destination', 'price_range'],
    fields: [
      ['name', 'Name', 'text'], ['type', 'Type', 'text'], ['location', 'Location', 'text'],
      ['destination', 'Destination', 'text'], ['image', 'Image URL', 'text'], ['description', 'Description', 'textarea'],
      ['facilities', 'Facilities', 'csv'], ['price_range', 'Price range text', 'text'],
      ['price_from_usd', 'Price from USD', 'number'], ['nearby', 'Nearby attractions', 'csv'], ['rating', 'Rating', 'number'],
    ],
  },
  bookings: {
    list: ['ref', 'full_name', 'package_name', 'arrival_date', 'status'],
    fields: [
      ['ref', 'Reference', 'readonly'], ['full_name', 'Full name', 'text'], ['country', 'Country', 'text'],
      ['email', 'Email', 'text'], ['phone', 'Phone', 'text'], ['whatsapp', 'WhatsApp', 'text'],
      ['package_name', 'Package', 'text'], ['arrival_date', 'Arrival', 'date'], ['departure_date', 'Departure', 'date'],
      ['adults', 'Adults', 'number'], ['children', 'Children', 'number'], ['accommodation', 'Accommodation', 'text'],
      ['vehicle', 'Vehicle', 'text'], ['airport_pickup', 'Airport pickup', 'bool'],
      ['special_requests', 'Special requests', 'textarea'], ['message', 'Message', 'textarea'],
      ['status', 'Status', 'status'], ['admin_notes', 'Private notes', 'textarea'],
    ],
  },
  custom: {
    list: ['ref', 'full_name', 'arrival_date', 'status'],
    fields: [
      ['ref', 'Reference', 'readonly'], ['full_name', 'Full name', 'text'], ['email', 'Email', 'text'],
      ['phone', 'Phone', 'text'], ['country', 'Country', 'text'], ['destinations', 'Destinations', 'csv'],
      ['arrival_date', 'Arrival', 'date'], ['departure_date', 'Departure', 'date'],
      ['adults', 'Adults', 'number'], ['children', 'Children', 'number'], ['accommodation', 'Accommodation', 'text'],
      ['vehicle', 'Vehicle', 'text'], ['airport_pickup', 'Airport pickup', 'bool'], ['activities', 'Activities', 'csv'],
      ['budget', 'Budget', 'text'], ['special_requirements', 'Special requirements', 'textarea'],
      ['status', 'Status', 'status'], ['admin_notes', 'Private notes', 'textarea'],
    ],
  },
  inquiries: {
    list: ['vehicle_name', 'name', 'pickup_date', 'status'],
    fields: [
      ['name', 'Name', 'text'], ['email', 'Email', 'text'], ['phone', 'Phone', 'text'], ['country', 'Country', 'text'],
      ['vehicle_name', 'Vehicle', 'text'], ['pickup_date', 'Pickup date', 'date'], ['return_date', 'Return date', 'date'],
      ['pickup_location', 'Pickup location', 'text'], ['passengers', 'Passengers', 'number'],
      ['message', 'Message', 'textarea'], ['status', 'Status', 'status'],
    ],
  },
  messages: {
    list: ['name', 'subject', 'created_at', 'status'],
    fields: [
      ['name', 'Name', 'readonly'], ['email', 'Email', 'readonly'], ['phone', 'Phone', 'readonly'],
      ['country', 'Country', 'readonly'], ['subject', 'Subject', 'readonly'], ['message', 'Message', 'readonly'],
      ['status', 'Status', 'msgstatus'],
    ],
  },
  reviews: {
    list: ['name', 'country', 'rating', 'approved'],
    fields: [
      ['name', 'Name', 'text'], ['country', 'Country', 'text'], ['avatar', 'Avatar initial', 'text'],
      ['rating', 'Rating (1-5)', 'number'], ['package_name', 'Tour package', 'text'], ['title', 'Headline', 'text'],
      ['experience', 'Experience', 'textarea'], ['tour_date', 'Tour date', 'text'],
      ['featured', 'Featured', 'bool'], ['approved', 'Approved (visible)', 'bool'],
    ],
  },
  blogs: {
    list: ['title', 'category', 'published'],
    fields: [
      ['title', 'Title', 'text'], ['slug', 'Slug', 'text'], ['category', 'Category', 'text'],
      ['image', 'Image URL', 'text'], ['excerpt', 'Excerpt', 'textarea'],
      ['content', 'Content (blank line = paragraph, ### = heading)', 'textarea'],
      ['author', 'Author', 'text'], ['read_minutes', 'Read minutes', 'number'], ['published', 'Published', 'bool'],
    ],
  },
  faqs: {
    list: ['question', 'category', 'sort_order'],
    fields: [
      ['category', 'Category', 'text'], ['question', 'Question', 'text'], ['answer', 'Answer', 'textarea'], ['sort_order', 'Sort order', 'number'],
    ],
  },
  gallery: {
    list: ['title', 'category'],
    fields: [['title', 'Title', 'text'], ['category', 'Category', 'text'], ['image', 'Image URL', 'text']],
  },
  offers: {
    list: ['title', 'discount', 'valid_until', 'active'],
    fields: [
      ['title', 'Title', 'text'], ['description', 'Description', 'textarea'], ['discount', 'Discount badge', 'text'],
      ['valid_until', 'Valid until', 'date'], ['package_id', 'Package ID (optional)', 'number'],
      ['image', 'Image URL', 'text'], ['active', 'Active', 'bool'],
    ],
  },
  settings: {
    list: ['key', 'value'],
    fields: [['key', 'Key', 'readonly'], ['value', 'Value', 'textarea']],
  },
  users: {
    list: ['name', 'email', 'role', 'created_at'],
    fields: [
      ['name', 'Full Name', 'text'],
      ['email', 'Email', 'text'],
      ['password', 'Password', 'text'],
      ['role', 'Role', 'role'],
    ],
  },
};

const SETTING_LABELS: Record<string, string> = {
  brand_name: 'Business name', phone: 'Telephone', whatsapp: 'WhatsApp number (digits only, with country code)',
  whatsapp_display: 'WhatsApp display text', whatsapp_message: 'Default WhatsApp message', email: 'Email address',
  address: 'Address', hours: 'Working hours', facebook: 'Facebook URL', instagram: 'Instagram URL',
  youtube: 'YouTube URL', twitter: 'X (Twitter) URL', tiktok: 'TikTok URL', about_short: 'Footer short description',
  home_welcome_title: 'Homepage welcome title', home_welcome_text: 'Homepage welcome text',
};

function toFormValue(v: any, type: string): any {
  if (type === 'csv') return Array.isArray(v) ? v.join(', ') : v || '';
  if (type === 'json') return typeof v === 'string' ? v : JSON.stringify(v ?? [], null, 1);
  if (type === 'bool') return !!v;
  if (v === null || v === undefined) return '';
  return v;
}

function fromFormValue(v: any, type: string): any {
  if (type === 'csv') return String(v || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (type === 'json') {
    try { return JSON.parse(v || '[]'); } catch { return []; }
  }
  if (type === 'number') return v === '' || v === null ? null : Number(v);
  if (type === 'bool') return !!v;
  if (type === 'readonly') return undefined;
  return v;
}

function cellPreview(v: any): string {
  if (v === null || v === undefined) return '—';
  if (typeof v === 'boolean') return v ? 'Yes' : '—';
  if (Array.isArray(v)) return v.slice(0, 3).join(', ') + (v.length > 3 ? '…' : '');
  const s = String(v);
  return s.length > 60 ? s.slice(0, 60) + '…' : s;
}

export function Admin() {
  const [authed, setAuthed] = useState(() => { try { return localStorage.getItem(ADMIN_KEY) === '1'; } catch { return false; } });
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [tab, setTab] = useState('dashboard');
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});
  const [formErr, setFormErr] = useState('');
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [page, setPage] = useState(0);
  const PER_PAGE = 12;

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwErr('');
    try {
      const found = await api<any>('/api/login', 'POST', { email, password: pw });
      if (found) {
        try { localStorage.setItem(ADMIN_KEY, '1'); localStorage.setItem('st-user-email', found.email); localStorage.setItem('st-user-role', found.role); } catch {}
        setAuthed(true);
      } else {
        setPwErr('Invalid email or password.');
      }
    } catch {
      setPwErr('Invalid email or password.');
    }
  };

  const load = async (t: string) => {
    if (t === 'dashboard') return;
    setLoading(true);
    try {
      const d = await api<any[]>(ENDPOINTS[t]);
      setRows(Array.isArray(d) ? d : []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (authed) { setPage(0); setQ(''); load(tab); } }, [tab, authed]);

  useEffect(() => {
    if (!authed) return;
    (async () => {
      const keys = ['bookings', 'custom', 'inquiries', 'messages', 'destinations', 'packages', 'vehicles', 'hotels', 'reviews', 'blogs', 'faqs', 'gallery', 'offers', 'users'];
      const c: Record<string, number> = {};
      await Promise.all(keys.map(async (k) => {
        try { const d = await api<any[]>(ENDPOINTS[k]); c[k] = Array.isArray(d) ? d.length : 0; } catch { c[k] = 0; }
      }));
      setCounts(c);
    })();
  }, [authed, tab]);

  const schema = SCHEMAS[tab];
  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const needle = q.toLowerCase();
    return rows.filter((r) => JSON.stringify(r).toLowerCase().includes(needle));
  }, [rows, q]);
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const openNew = () => {
    const f: Record<string, any> = {};
    schema.fields.forEach(([k, , t]) => { f[k] = toFormValue(undefined, t); });
    setForm(f); setIsNew(true); setEditing({}); setFormErr('');
  };
  const openEdit = (r: any) => {
    const f: Record<string, any> = {};
    schema.fields.forEach(([k, , t]) => { f[k] = toFormValue(r[k], t); });
    setForm(f); setIsNew(false); setEditing(r); setFormErr('');
  };

  const save = async () => {
    setFormErr('');
    setSaving(true);
    try {
      if (tab === 'settings') {
        await api(ENDPOINTS.settings, 'PUT', { key: editing.key, value: String(form.value ?? '') });
      } else if (tab === 'users') {
        const payload: Record<string, any> = {};
        schema.fields.forEach(([k, , t]) => {
          const v = fromFormValue(form[k], t);
          if (v !== undefined && v !== '') payload[k] = v;
        });
        if (isNew) {
          await api(ENDPOINTS[tab], 'POST', payload);
        } else {
          const updateData: Record<string, any> = { id: editing.id };
          if (payload.name) updateData.name = payload.name;
          if (payload.email) updateData.email = payload.email;
          if (payload.password) updateData.password = payload.password;
          if (payload.role) updateData.role = payload.role;
          await api(ENDPOINTS[tab], 'PUT', updateData);
        }
      } else {
        const payload: Record<string, any> = {};
        schema.fields.forEach(([k, , t]) => {
          const v = fromFormValue(form[k], t);
          if (v !== undefined) payload[k] = v;
        });
        if (isNew) await api(ENDPOINTS[tab], 'POST', payload);
        else await api(ENDPOINTS[tab], 'PUT', { id: editing.id, ...payload });
      }
      setEditing(null);
      await load(tab);
    } catch (e: any) {
      setFormErr(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (r: any) => {
    const label = tab === 'users' ? 'user' : tab.slice(0, -1);
    if (!confirm(`Delete this ${label}? This cannot be undone.`)) return;
    try {
      await api(ENDPOINTS[tab], 'DELETE', { id: r.id });
      await load(tab);
    } catch (e: any) {
      alert(e?.message || 'Delete failed');
    }
  };

  const quickStatus = async (r: any, status: string) => {
    try {
      await api(ENDPOINTS[tab], 'PUT', { id: r.id, status });
      await load(tab);
    } catch (e: any) {
      alert(e?.message || 'Update failed');
    }
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-jungle-950 px-4 pt-20">
        <form onSubmit={login} className="w-full max-w-sm rounded-[2rem] bg-white p-8 shadow-2xl">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-jungle-950 text-gold-300"><Lock size={24} /></span>
          <h1 className="font-display mt-4 text-center text-2xl font-semibold text-jungle-950">Owner Area</h1>
          <p className="mt-1 text-center text-sm text-ink-900/55">Private management area for Serendib Trails.</p>
          <label className="label-field mt-6">Email</label>
          <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" autoFocus />
          <label className="label-field mt-4">Password</label>
          <input type="password" className="input-field" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Enter your password" />
          {pwErr && <p className="mt-2 text-sm font-semibold text-red-600">{pwErr}</p>}
          <button type="submit" className="btn-ocean mt-4 w-full">Sign In</button>

        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-100 pt-20">
      <div className="mx-auto flex max-w-[1400px] gap-0 px-0 md:px-4 md:py-6 lg:gap-6">
        {/* Sidebar */}
        <button onClick={() => setSidebarOpen((o) => !o)} className="fixed bottom-24 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-jungle-950 text-white shadow-xl lg:hidden" aria-label="Menu">
          {sidebarOpen ? <X size={20} /> : <LayoutDashboard size={20} />}
        </button>
        <aside className={`fixed inset-y-0 left-0 z-30 w-64 transform overflow-y-auto bg-jungle-950 p-4 pt-24 transition lg:static lg:z-auto lg:transform-none lg:rounded-3xl lg:p-4 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <p className="px-3 pb-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold-300">Management</p>
          {TABS.map((t) => (
            <button key={t.k} onClick={() => { setTab(t.k); setSidebarOpen(false); }} className={`mb-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${tab === t.k ? 'bg-gold-400 text-jungle-950' : 'text-white/80 hover:bg-white/10'}`}>
              <t.icon size={17} />
              <span className="flex-1 text-left">{t.l}</span>
              {counts[t.k] !== undefined && <span className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold ${tab === t.k ? 'bg-jungle-950/15' : 'bg-white/10'}`}>{counts[t.k]}</span>}
            </button>
          ))}
          <button onClick={() => { try { localStorage.removeItem(ADMIN_KEY); localStorage.removeItem('st-user-email'); localStorage.removeItem('st-user-role'); } catch {} setAuthed(false); }} className="mt-3 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-300 hover:bg-white/10">
            <LogOut size={17} /> Sign Out
          </button>
        </aside>

        {/* Main */}
        <main className="min-h-[80vh] flex-1 rounded-3xl bg-white p-4 shadow-lg md:p-7">
          {tab === 'dashboard' ? (
            <Dashboard counts={counts} go={setTab} />
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="font-display text-2xl font-semibold text-jungle-950 md:text-3xl">{TABS.find((t) => t.k === tab)?.l}</h1>
                  <p className="text-sm text-ink-900/55">{filtered.length} record{filtered.length === 1 ? '' : 's'}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-900/40" />
                    <input value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} placeholder="Search..." className="input-field !w-44 !pl-9 !py-2" />
                  </div>
                  {tab !== 'messages' && tab !== 'settings' && (
                    <button onClick={openNew} className="inline-flex items-center gap-1.5 rounded-full bg-jungle-900 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-jungle-800">
                      <Plus size={15} /> Add New
                    </button>
                  )}
                </div>
              </div>

              {loading ? (
                <p className="py-16 text-center text-sm font-semibold text-ink-900/50">Loading...</p>
              ) : paged.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-jungle-900/20 bg-sand-50 py-14 text-center text-sm text-ink-900/55 mt-6">No records found.</p>
              ) : (
                <div className="mt-5 overflow-x-auto rounded-2xl border border-jungle-900/10">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead>
                      <tr className="bg-jungle-950 text-white">
                        {schema.list.map((c) => (
                          <th key={c} className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-wider">{tab === 'settings' ? (SETTING_LABELS[c] || c) : c.replace(/_/g, ' ')}</th>
                        ))}
                        <th className="px-4 py-3 text-right text-[11px] font-extrabold uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paged.map((r) => (
                        <tr key={r.id} className="border-t border-jungle-900/10 odd:bg-sand-50/60 hover:bg-jungle-50/50">
                          {schema.list.map((c) => (
                            <td key={c} className="max-w-[280px] truncate px-4 py-3">
                              {c === 'status' ? (
                                ['bookings', 'custom', 'inquiries'].includes(tab) ? (
                                  <select value={r.status || 'Pending'} onChange={(e) => quickStatus(r, e.target.value)} className={`rounded-full px-2.5 py-1 text-xs font-bold outline-none ${STATUS_COLORS[r.status] || 'bg-gray-100'}`}>
                                    {BOOKING_STATUSES.map((s) => <option key={s}>{s}</option>)}
                                  </select>
                                ) : (
                                  <select value={r.status || 'New'} onChange={(e) => quickStatus(r, e.target.value)} className={`rounded-full px-2.5 py-1 text-xs font-bold outline-none ${STATUS_COLORS[r.status] || 'bg-gray-100'}`}>
                                    {['New', 'Read', 'Replied'].map((s) => <option key={s}>{s}</option>)}
                                  </select>
                                )
                              ) : c === 'approved' || c === 'published' || c === 'featured' || c === 'active' ? (
                                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${r[c] ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>{r[c] ? 'Yes' : 'No'}</span>
                              ) : (
                                <span className="text-ink-900/80">{cellPreview(tab === 'settings' && c === 'key' ? (SETTING_LABELS[r.key] || r.key) : r[c])}</span>
                              )}
                            </td>
                          ))}
                          <td className="px-4 py-3">
                            <span className="flex justify-end gap-1.5">
                              <button onClick={() => openEdit(r)} title="View / Edit" className="flex h-8 w-8 items-center justify-center rounded-full bg-ocean-600/10 text-ocean-700 hover:bg-ocean-600 hover:text-white"><Pencil size={14} /></button>
                              {tab !== 'settings' && (
                                <button onClick={() => remove(r)} title="Delete" className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"><Trash2 size={14} /></button>
                              )}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {pages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="flex h-9 w-9 items-center justify-center rounded-full border border-jungle-900/15 disabled:opacity-40"><ChevronLeft size={16} /></button>
                  <span className="text-xs font-bold text-ink-900/60">Page {page + 1} of {pages}</span>
                  <button disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)} className="flex h-9 w-9 items-center justify-center rounded-full border border-jungle-900/15 disabled:opacity-40"><ChevronRight size={16} /></button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Editor modal */}
      {editing && tab !== 'dashboard' && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-jungle-950/70 p-0 sm:items-center sm:p-6" onClick={() => setEditing(null)}>
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white p-6 sm:rounded-3xl md:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold text-jungle-950">{isNew ? 'Add New' : 'Edit'} — {TABS.find((t) => t.k === tab)?.l}</h2>
              <button onClick={() => setEditing(null)} className="flex h-9 w-9 items-center justify-center rounded-full bg-sand-100 hover:bg-sand-200"><X size={17} /></button>
            </div>
            {['bookings', 'custom', 'inquiries', 'messages'].includes(tab) && !isNew && (
              <p className="mt-2 rounded-xl bg-sky-50 px-4 py-2.5 text-xs font-semibold text-sky-800">Customer enquiry — review details, update the status and add private notes.</p>
            )}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {schema.fields.map(([k, lbl, t]) => (
                <div key={k} className={t === 'textarea' || t === 'json' ? 'sm:col-span-2' : ''}>
                  <label className="label-field">{tab === 'settings' && k === 'key' ? 'Setting' : tab === 'settings' && k === 'value' ? (SETTING_LABELS[editing.key] || editing.key) : lbl}</label>
                  {t === 'textarea' ? (
                    <textarea rows={t === k ? 3 : 3} className="input-field" value={form[k] ?? ''} onChange={(e) => setForm((p) => ({ ...p, [k]: e.target.value }))} disabled={k === 'message' && tab === 'messages'} />
                  ) : t === 'json' ? (
                    <textarea rows={6} className="input-field font-mono !text-xs" value={form[k] ?? ''} onChange={(e) => setForm((p) => ({ ...p, [k]: e.target.value }))} />
                  ) : t === 'bool' ? (
                    <button type="button" onClick={() => setForm((p) => ({ ...p, [k]: !p[k] }))} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${form[k] ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>
                      <span className={`flex h-5 w-9 items-center rounded-full p-0.5 transition ${form[k] ? 'justify-end bg-emerald-500' : 'justify-start bg-gray-300'}`}><span className="h-4 w-4 rounded-full bg-white" /></span>
                      {form[k] ? 'Yes' : 'No'}
                    </button>
                  ) : t === 'status' ? (
                    <select className="input-field" value={form[k] ?? 'Pending'} onChange={(e) => setForm((p) => ({ ...p, [k]: e.target.value }))}>
                      {BOOKING_STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  ) : t === 'msgstatus' ? (
                    <select className="input-field" value={form[k] ?? 'New'} onChange={(e) => setForm((p) => ({ ...p, [k]: e.target.value }))}>
                      {['New', 'Read', 'Replied'].map((s) => <option key={s}>{s}</option>)}
                    </select>
                  ) : t === 'readonly' ? (
                    <p className="rounded-xl bg-sand-100 px-4 py-2.5 text-sm font-semibold text-ink-900/70">{tab === 'settings' ? (SETTING_LABELS[form[k]] || form[k]) : String(form[k] ?? '—')}</p>
                  ) : t === 'role' ? (
                    <select className="input-field" value={form[k] ?? 'staff'} onChange={(e) => setForm((p) => ({ ...p, [k]: e.target.value }))}>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : t === 'number' ? (
                    <input type="number" step="any" className="input-field" value={form[k] ?? ''} onChange={(e) => setForm((p) => ({ ...p, [k]: e.target.value }))} />
                  ) : t === 'date' ? (
                    <input type="date" className="input-field" value={(form[k] || '').slice(0, 10)} onChange={(e) => setForm((p) => ({ ...p, [k]: e.target.value }))} />
                  ) : (
                    <input className="input-field" value={form[k] ?? ''} onChange={(e) => setForm((p) => ({ ...p, [k]: e.target.value }))} />
                  )}
                  {(k === 'attractions' || k === 'activities' || k === 'categories' || k === 'destinations' || k === 'included' || k === 'excluded' || k === 'features' || k === 'facilities' || k === 'nearby') && (
                    <p className="mt-1 text-[11px] text-ink-900/45">Comma-separated values</p>
                  )}
                  {k === 'slug' && <p className="mt-1 text-[11px] text-ink-900/45">URL-friendly, e.g. sigiriya-day-tour</p>}
                </div>
              ))}
            </div>
            {formErr && <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700">{formErr}</p>}
            <div className="mt-5 flex gap-2.5">
              <button onClick={() => setEditing(null)} className="flex-1 rounded-full border border-jungle-900/20 px-6 py-3 text-sm font-bold text-jungle-900">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 rounded-full bg-jungle-900 px-6 py-3 text-sm font-bold text-white hover:bg-jungle-800 disabled:opacity-60">{saving ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Dashboard({ counts, go }: { counts: Record<string, number>; go: (t: string) => void }) {
  const [recent, setRecent] = useState<any[]>([]);
  useEffect(() => {
    api<any[]>('/api/bookings').then((d) => setRecent((d || []).slice(0, 5))).catch(() => {});
  }, []);
  const cards = [
    { k: 'bookings', l: 'Booking Requests', icon: CalendarCheck, c: 'from-ocean-600 to-jungle-800' },
    { k: 'custom', l: 'Custom Tour Plans', icon: Wand2, c: 'from-gold-500 to-sunset-500' },
    { k: 'inquiries', l: 'Vehicle Inquiries', icon: MessageSquare, c: 'from-violet-500 to-purple-700' },
    { k: 'messages', l: 'Contact Messages', icon: Mail, c: 'from-rose-500 to-red-600' },
    { k: 'destinations', l: 'Destinations', icon: MapPin, c: 'from-emerald-500 to-teal-700' },
    { k: 'packages', l: 'Tour Packages', icon: Package, c: 'from-sky-500 to-blue-700' },
    { k: 'vehicles', l: 'Vehicles', icon: Car, c: 'from-slate-500 to-slate-700' },
    { k: 'hotels', l: 'Hotels', icon: BedDouble, c: 'from-amber-500 to-orange-600' },
    { k: 'reviews', l: 'Reviews', icon: Star, c: 'from-yellow-500 to-amber-600' },
    { k: 'blogs', l: 'Blog Articles', icon: FileText, c: 'from-cyan-500 to-teal-600' },
    { k: 'faqs', l: 'FAQs', icon: HelpCircle, c: 'from-indigo-500 to-violet-600' },
    { k: 'gallery', l: 'Gallery Photos', icon: ImageIcon, c: 'from-pink-500 to-rose-600' },
  ];
  return (
    <>
      <h1 className="font-display text-2xl font-semibold text-jungle-950 md:text-3xl">Welcome back, Owner 👋</h1>
      <p className="mt-1 text-sm text-ink-900/55">Here's what's happening across your website today.</p>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {cards.map((c) => (
          <button key={c.k} onClick={() => go(c.k)} className="group rounded-2xl bg-gradient-to-br p-[1px] text-left shadow-sm transition hover:shadow-lg" style={{ backgroundImage: undefined }}>
            <span className={`block rounded-2xl bg-gradient-to-br ${c.c} p-4 text-white`}>
              <c.icon size={22} />
              <span className="mt-3 block text-3xl font-extrabold">{counts[c.k] ?? '—'}</span>
              <span className="block text-xs font-bold uppercase tracking-wider opacity-90">{c.l}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-jungle-900/10 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-jungle-950">Latest booking requests</h2>
          <button onClick={() => go('bookings')} className="flex items-center gap-1 text-xs font-bold text-ocean-700"><Eye size={14} /> View all</button>
        </div>
        <div className="mt-3 space-y-2">
          {recent.length === 0 && <p className="py-6 text-center text-sm text-ink-900/50">No bookings yet — they will appear here instantly.</p>}
          {recent.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-sand-50 px-4 py-2.5 text-sm">
              <span className="font-bold text-jungle-950">{r.ref} — {r.full_name}</span>
              <span className="text-xs text-ink-900/60">{r.package_name} • {r.arrival_date}</span>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${STATUS_COLORS[r.status] || 'bg-gray-100'}`}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
