import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { SiteContent } from './types';
import { defaultContent } from './defaultContent';
import { Project } from '../types';

// Older saved content (from before multi-category support) has a single
// `category: 'video' | 'graphic'` field instead of `categories: ProjectCategory[]`.
// Backfill it on read so existing saved projects keep working without a manual re-save.
function normalizeProject(project: Project & { category?: 'video' | 'graphic' }): Project {
  if (Array.isArray(project.categories) && project.categories.length > 0) {
    return project;
  }
  const fallback = project.category === 'graphic' ? 'graphic-design' : 'video-editing';
  return { ...project, categories: [fallback] };
}

function normalizeContent(data: Partial<SiteContent>): Partial<SiteContent> {
  if (!Array.isArray(data.projects)) return data;
  return { ...data, projects: data.projects.map(normalizeProject) };
}

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
          const normalized = normalizeContent(data);
          // Merge over defaults so any field missing from a saved edit still falls back cleanly.
          setContent((prev) => ({ ...defaultContent, ...prev, ...normalized }));
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
