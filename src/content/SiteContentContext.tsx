import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { SiteContent } from './types';
import { defaultContent } from './defaultContent';

interface SiteContentContextValue {
  content: SiteContent;
  loading: boolean;
  refresh: () => void;
}

const SiteContentContext = createContext<SiteContentContextValue>({
  content: defaultContent,
  loading: false,
  refresh: () => {},
});

export const useSiteContent = () => useContext(SiteContentContext);

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch('/.netlify/functions/content')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data === 'object') {
          // Merge over defaults so any field missing from a saved edit still falls back cleanly.
          setContent((prev) => ({ ...defaultContent, ...prev, ...data }));
        }
      })
      .catch(() => {
        // No function available (e.g. local dev without `netlify dev`) — defaults are already in state.
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SiteContentContext.Provider value={{ content, loading, refresh: load }}>
      {children}
    </SiteContentContext.Provider>
  );
};
