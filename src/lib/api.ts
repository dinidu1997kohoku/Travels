import { useCallback, useEffect, useState } from 'react';

export async function api<T = any>(path: string, method = 'GET', body?: any): Promise<T> {
  const res = await fetch(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data as T;
}

export function useResource<T = any>(path: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const d = await api<T[]>(path);
      setData(Array.isArray(d) ? d : []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [path]);
  useEffect(() => {
    refresh();
  }, [refresh]);
  return { data, loading, error, refresh };
}

export const fmtUSD = (n: any): string => {
  if (n === null || n === undefined || n === '') return '';
  const num = Number(n);
  if (Number.isNaN(num)) return '';
  return `$${num.toLocaleString('en-US')}`;
};

export const img = (src?: string | null, fallback = '/images/hero.jpg'): string =>
  src && src.trim() ? src : fallback;

export const arr = (v: any): string[] => {
  if (Array.isArray(v)) return v.filter(Boolean).map(String);
  if (v === null || v === undefined || v === '') return [];
  return [String(v)];
};

export const waLink = (phone: string, text: string): string =>
  `https://wa.me/${(phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
