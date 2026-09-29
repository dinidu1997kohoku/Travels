import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from './api';
import type { Setting } from './types';

const SettingsCtx = createContext<{ map: Record<string, string>; loading: boolean }>({
  map: {},
  loading: true,
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api<Setting[]>('/api/settings')
      .then((rows) => {
        const m: Record<string, string> = {};
        (rows || []).forEach((r) => {
          m[r.key] = r.value;
        });
        setMap(m);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  return <SettingsCtx.Provider value={{ map, loading }}>{children}</SettingsCtx.Provider>;
}

export function useSettings() {
  const { map, loading } = useContext(SettingsCtx);
  const get = (k: string, fb = ''): string => (map[k] !== undefined && map[k] !== '' ? map[k] : fb);
  return { settings: map, loading, get };
}
