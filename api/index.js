import supabase from './db-client.js';

function makeRef(prefix) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}-${s}`;
}

const TABLES = {
  blogs: { table: 'blogs', order: { column: 'id', ascending: true } },
  bookings: { table: 'bookings', order: { column: 'id', ascending: false }, ref: 'SER', require: ['full_name', 'email'] },
  'custom-tours': { table: 'custom_tours', order: { column: 'id', ascending: false }, ref: 'CUS', require: ['full_name', 'email'] },
  destinations: { table: 'destinations', order: { column: 'id', ascending: true } },
  faqs: { table: 'faqs', order: { column: 'sort_order', ascending: true } },
  gallery: { table: 'gallery_items', order: { column: 'id', ascending: true } },
  hotels: { table: 'hotels', order: { column: 'id', ascending: true } },
  inquiries: { table: 'inquiries', order: { column: 'id', ascending: false }, require: ['name', 'email'], status: 'Pending' },
  messages: { table: 'messages', order: { column: 'id', ascending: false }, require: ['name', 'email', 'message'], status: 'New' },
  offers: { table: 'offers', order: { column: 'id', ascending: true } },
  packages: { table: 'packages', order: { column: 'id', ascending: true } },
  reviews: { table: 'reviews', order: { column: 'id', ascending: false } },
  settings: { table: 'settings', order: { column: 'id', ascending: true } },
  users: { table: 'users', order: { column: 'id', ascending: true } },
  vehicles: { table: 'vehicles', order: { column: 'id', ascending: true } },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname.replace(/^\/api\/?/, '').replace(/\/$/, '');
  const config = TABLES[path];

  if (!config) return res.status(404).json({ error: 'Not found' });

  const TABLE = config.table;
  const ORDER = config.order;

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from(TABLE).select('*').order(ORDER.column, { ascending: ORDER.ascending });
      if (error) throw error;
      if (path === 'users') {
        const safeData = data.map(({ password, ...rest }) => rest);
        return res.status(200).json(safeData);
      }
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      if (path === 'settings') {
        const { key, value } = req.body || {};
        if (!key) return res.status(400).json({ error: 'key is required' });
        const { data: existing } = await supabase.from(TABLE).select('id').eq('key', key).maybeSingle();
        if (existing) {
          const { data, error } = await supabase.from(TABLE).update({ value }).eq('key', key).select().single();
          if (error) throw error;
          return res.status(200).json(data);
        }
        const { data, error } = await supabase.from(TABLE).insert({ key, value }).select().single();
        if (error) throw error;
        return res.status(201).json(data);
      }

      if (path === 'users') {
        const { id, created_at, updated_at, ...payload } = req.body || {};
        if (!payload.name || !payload.email || !payload.password) {
          return res.status(400).json({ error: 'Name, email and password are required' });
        }
        if (!payload.role || !['admin', 'staff'].includes(payload.role)) {
          payload.role = 'staff';
        }
        const { data, error } = await supabase.from(TABLE).insert(payload).select().single();
        if (error) throw error;
        const { password, ...safeData } = data;
        return res.status(201).json(safeData);
      }

      const { id, created_at, ref, status, admin_notes, ...payload } = req.body || {};

      if (config.require) {
        const missing = config.require.filter((f) => !payload[f]);
        if (missing.length) return res.status(400).json({ error: `${missing.join(', ')} ${missing.length > 1 ? 'are' : 'is'} required` });
      }

      const row = { ...payload };
      if (config.ref) row.ref = makeRef(config.ref);
      if (config.status) row.status = config.status;
      if (path === 'bookings' || path === 'custom-tours') row.admin_notes = '';

      const { data, error } = await supabase.from(TABLE).insert(row).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, created_at, updated_at, ...payload } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id is required' });
      if (path === 'users') {
        const { password, ...rest } = payload;
        const updateData = { ...rest };
        if (password) updateData.password = password;
        const { data, error } = await supabase.from(TABLE).update(updateData).eq('id', id).select().single();
        if (error) throw error;
        const { password: _, ...safeData } = data;
        return res.status(200).json(safeData);
      }
      const { data, error } = await supabase.from(TABLE).update(payload).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { error } = await supabase.from(TABLE).delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(`API error (${path}):`, err);
    return res.status(500).json({ error: err.message });
  }
}
