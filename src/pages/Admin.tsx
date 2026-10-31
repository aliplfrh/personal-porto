import React, { useEffect, useState } from 'react';
import { useSiteContent } from '../content/SiteContentContext';
import { SiteContent, ExperienceEntry, ToolEntry } from '../content/types';
import { Project } from '../types';

const SESSION_KEY = 'admin_session';

interface Session {
  token: string;
  expiresAt: number;
}

function loadSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: Session = JSON.parse(raw);
    if (session.expiresAt < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

function emptyExperience(): ExperienceEntry {
  return { id: `exp-${Date.now()}`, date: '', title: '', subtitle: '', description: '' };
}

function emptyTool(): ToolEntry {
  return { name: '', iconUrl: '' };
}

function emptyProject(): Project {
  return {
    id: `project-${Date.now()}`,
    title: '',
    category: 'video',
    thumbnail: '',
    description: '',
    tags: [],
    client: '',
    year: new Date().getFullYear(),
    role: '',
  };
}

const Admin: React.FC = () => {
  const { content, refresh } = useSiteContent();
  const [session, setSession] = useState<Session | null>(() => loadSession());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [draft, setDraft] = useState<SiteContent>(content);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Load the current live content into the draft once it arrives.
  useEffect(() => {
    setDraft(content);
  }, [content]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');
    try {
      const res = await fetch('/.netlify/functions/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Login failed');
        return;
      }
      const newSession: Session = { token: data.token, expiresAt: data.expiresAt };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
      setSession(newSession);
    } catch {
      setLoginError('Could not reach the server. Try again.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  const handleSave = async () => {
    if (!session) return;
    setStatus('saving');
    try {
      const res = await fetch('/.netlify/functions/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify(draft),
      });
      if (!res.ok) {
        if (res.status === 401) {
          handleLogout();
        }
        setStatus('error');
        return;
      }
      setStatus('saved');
      refresh();
      setTimeout(() => setStatus('idle'), 2500);
    } catch {
      setStatus('error');
    }
  };

  if (!session) {
    return (
      <div className="admin-page">
        <div className="admin-login">
          <h1>Admin login</h1>
          <form onSubmit={handleLogin}>
            <label>
              Username
              <input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
            </label>
            <label>
              Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            {loginError && <p className="admin-error">{loginError}</p>}
            <button type="submit" className="admin-btn-primary" disabled={loggingIn}>
              {loggingIn ? 'Logging in…' : 'Log in'}
            </button>
          </form>
          <a href="#home" className="admin-back-link">Back to site</a>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-topbar">
        <h1>Edit portfolio</h1>
        <div className="admin-topbar-actions">
          <a href="#home" className="admin-back-link">View site</a>
          <button className="admin-btn-ghost" onClick={handleLogout}>Log out</button>
          <button className="admin-btn-primary" onClick={handleSave} disabled={status === 'saving'}>
            {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved ✓' : 'Save changes'}
          </button>
        </div>
      </div>
      {status === 'error' && <p className="admin-error">Could not save. Try again.</p>}

      <section className="admin-section">
        <h2>Hero</h2>
        <label>
          Greeting
          <input
            value={draft.hero.greeting}
            onChange={(e) => setDraft({ ...draft, hero: { ...draft.hero, greeting: e.target.value } })}
          />
        </label>
        <label>
          Status
          <input
            value={draft.hero.status}
            onChange={(e) => setDraft({ ...draft, hero: { ...draft.hero, status: e.target.value } })}
          />
        </label>
        <label>
          Bio
          <textarea
            rows={3}
            value={draft.hero.bio}
            onChange={(e) => setDraft({ ...draft, hero: { ...draft.hero, bio: e.target.value } })}
          />
        </label>
      </section>

      <section className="admin-section">
        <h2>About — bio paragraphs</h2>
        {draft.about.bioParagraphs.map((p, i) => (
          <div className="admin-row" key={i}>
            <textarea
              rows={3}
              value={p}
              onChange={(e) => {
                const next = [...draft.about.bioParagraphs];
                next[i] = e.target.value;
                setDraft({ ...draft, about: { bioParagraphs: next } });
              }}
            />
            <button
              className="admin-btn-remove"
              onClick={() => {
                const next = draft.about.bioParagraphs.filter((_, idx) => idx !== i);
                setDraft({ ...draft, about: { bioParagraphs: next } });
              }}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          className="admin-btn-add"
          onClick={() => setDraft({ ...draft, about: { bioParagraphs: [...draft.about.bioParagraphs, ''] } })}
        >
          + Add paragraph
        </button>
      </section>

      {([
        { key: 'workExperiences', label: 'Experience — Organization' },
        { key: 'studyExperiences', label: 'Experience — Studies' },
      ] as const).map(({ key, label }) => (
        <section className="admin-section" key={key}>
          <h2>{label}</h2>
          {draft[key].map((item, i) => (
            <div className="admin-card" key={item.id}>
              <label>
                Title
                <input
                  value={item.title}
                  onChange={(e) => {
                    const next = [...draft[key]];
                    next[i] = { ...next[i], title: e.target.value };
                    setDraft({ ...draft, [key]: next });
                  }}
                />
              </label>
              <label>
                Subtitle
                <input
                  value={item.subtitle}
                  onChange={(e) => {
                    const next = [...draft[key]];
                    next[i] = { ...next[i], subtitle: e.target.value };
                    setDraft({ ...draft, [key]: next });
                  }}
                />
              </label>
              <label>
                Date
                <input
                  value={item.date}
                  onChange={(e) => {
                    const next = [...draft[key]];
                    next[i] = { ...next[i], date: e.target.value };
                    setDraft({ ...draft, [key]: next });
                  }}
                />
              </label>
              <label>
                Description (optional)
                <textarea
                  rows={2}
                  value={item.description || ''}
                  onChange={(e) => {
                    const next = [...draft[key]];
                    next[i] = { ...next[i], description: e.target.value };
                    setDraft({ ...draft, [key]: next });
                  }}
                />
              </label>
              <button
                className="admin-btn-remove"
                onClick={() => setDraft({ ...draft, [key]: draft[key].filter((_, idx) => idx !== i) })}
              >
                Remove entry
              </button>
            </div>
          ))}
          <button
            className="admin-btn-add"
            onClick={() => setDraft({ ...draft, [key]: [...draft[key], emptyExperience()] })}
          >
            + Add entry
          </button>
        </section>
      ))}

      <section className="admin-section">
        <h2>Tools and technologies</h2>
        {draft.tools.map((tool, i) => (
          <div className="admin-row" key={i}>
            <input
              placeholder="Name"
              value={tool.name}
              onChange={(e) => {
                const next = [...draft.tools];
                next[i] = { ...next[i], name: e.target.value };
                setDraft({ ...draft, tools: next });
              }}
            />
            <input
              placeholder="Icon URL"
              value={tool.iconUrl}
              onChange={(e) => {
                const next = [...draft.tools];
                next[i] = { ...next[i], iconUrl: e.target.value };
                setDraft({ ...draft, tools: next });
              }}
            />
            <button
              className="admin-btn-remove"
              onClick={() => setDraft({ ...draft, tools: draft.tools.filter((_, idx) => idx !== i) })}
            >
              Remove
            </button>
          </div>
        ))}
        <button className="admin-btn-add" onClick={() => setDraft({ ...draft, tools: [...draft.tools, emptyTool()] })}>
          + Add tool
        </button>
      </section>

      <section className="admin-section">
        <h2>Portfolio projects</h2>
        {draft.projects.map((project, i) => (
          <div className="admin-card" key={project.id}>
            <label>
              Title
              <input
                value={project.title}
                onChange={(e) => {
                  const next = [...draft.projects];
                  next[i] = { ...next[i], title: e.target.value };
                  setDraft({ ...draft, projects: next });
                }}
              />
            </label>
            <label>
              Category
              <select
                value={project.category}
                onChange={(e) => {
                  const next = [...draft.projects];
                  next[i] = { ...next[i], category: e.target.value as Project['category'] };
                  setDraft({ ...draft, projects: next });
                }}
              >
                <option value="video">Video</option>
                <option value="graphic">Graphic</option>
              </select>
            </label>
            <label>
              Description
              <textarea
                rows={2}
                value={project.description}
                onChange={(e) => {
                  const next = [...draft.projects];
                  next[i] = { ...next[i], description: e.target.value };
                  setDraft({ ...draft, projects: next });
                }}
              />
            </label>
            <label>
              Tags (comma separated)
              <input
                value={project.tags.join(', ')}
                onChange={(e) => {
                  const next = [...draft.projects];
                  next[i] = { ...next[i], tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) };
                  setDraft({ ...draft, projects: next });
                }}
              />
            </label>
            <label>
              Client
              <input
                value={project.client || ''}
                onChange={(e) => {
                  const next = [...draft.projects];
                  next[i] = { ...next[i], client: e.target.value };
                  setDraft({ ...draft, projects: next });
                }}
              />
            </label>
            <label>
              Year
              <input
                value={String(project.year)}
                onChange={(e) => {
                  const next = [...draft.projects];
                  next[i] = { ...next[i], year: e.target.value };
                  setDraft({ ...draft, projects: next });
                }}
              />
            </label>
            <label>
              Role
              <input
                value={project.role}
                onChange={(e) => {
                  const next = [...draft.projects];
                  next[i] = { ...next[i], role: e.target.value };
                  setDraft({ ...draft, projects: next });
                }}
              />
            </label>
            <label>
              Thumbnail URL
              <input
                value={project.thumbnail}
                onChange={(e) => {
                  const next = [...draft.projects];
                  next[i] = { ...next[i], thumbnail: e.target.value };
                  setDraft({ ...draft, projects: next });
                }}
              />
            </label>
            <button
              className="admin-btn-remove"
              onClick={() => setDraft({ ...draft, projects: draft.projects.filter((_, idx) => idx !== i) })}
            >
              Remove project
            </button>
          </div>
        ))}
        <button
          className="admin-btn-add"
          onClick={() => setDraft({ ...draft, projects: [...draft.projects, emptyProject()] })}
        >
          + Add project
        </button>
      </section>

      <div className="admin-bottom-save">
        <button className="admin-btn-primary" onClick={handleSave} disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved ✓' : 'Save changes'}
        </button>
      </div>
    </div>
  );
};

export default Admin;
