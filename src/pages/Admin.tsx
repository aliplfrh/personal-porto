import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useSiteContent } from '../content/SiteContentContext';
import { SiteContent, ExperienceEntry, ToolEntry } from '../content/types';
import { Project, ProjectCategory, PROJECT_CATEGORIES } from '../types';
import ImageUploadField from '../components/ImageUploadField';

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
    title: 'Untitled project',
    categories: [],
    thumbnail: '',
    description: '',
    tags: [],
    client: '',
    year: new Date().getFullYear(),
    role: '',
  };
}

const TABS = ['Hero', 'About', 'Experience', 'Tools', 'Projects', 'Resume'] as const;
type Tab = (typeof TABS)[number];

const Admin: React.FC = () => {
  const { content, refresh } = useSiteContent();
  const [session, setSession] = useState<Session | null>(() => loadSession());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [draft, setDraft] = useState<SiteContent>(content);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<Tab>('Projects');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeError, setResumeError] = useState('');

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
        if (res.status === 401) handleLogout();
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

  const handleResumeUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setResumeError('Please choose a PDF file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setResumeError('File must be under 5MB.');
      return;
    }
    setResumeError('');
    setResumeUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('key', 'resume');
      const res = await fetch('/.netlify/functions/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session?.token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setResumeError(data.error || 'Upload failed.');
        return;
      }
      setDraft((d) => ({ ...d, resumeUrl: data.url }));
    } catch {
      setResumeError('Could not reach the server.');
    } finally {
      setResumeUploading(false);
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
          <Link to="/" className="admin-back-link">Back to site</Link>
        </div>
      </div>
    );
  }

  const editingProject = draft.projects.find((p) => p.id === editingProjectId) || null;

  const updateEditingProject = (patch: Partial<Project>) => {
    setDraft({
      ...draft,
      projects: draft.projects.map((p) => (p.id === editingProjectId ? { ...p, ...patch } : p)),
    });
  };

  const addProject = () => {
    const p = emptyProject();
    setDraft({ ...draft, projects: [p, ...draft.projects] });
    setEditingProjectId(p.id);
  };

  const deleteProject = (id: string) => {
    if (!window.confirm('Delete this project? This takes effect once you save changes.')) return;
    setDraft({ ...draft, projects: draft.projects.filter((p) => p.id !== id) });
    if (editingProjectId === id) setEditingProjectId(null);
  };

  return (
    <div className="admin-page">
      <div className="admin-topbar">
        <h1>Edit portfolio</h1>
        <div className="admin-topbar-actions">
          <Link to="/" className="admin-back-link">View site</Link>
          <button className="admin-btn-ghost" onClick={handleLogout}>Log out</button>
          <button className="admin-btn-primary" onClick={handleSave} disabled={status === 'saving'}>
            {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved ✓' : 'Save changes'}
          </button>
        </div>
      </div>
      {status === 'error' && <p className="admin-error">Could not save. Try again.</p>}

      <div className="admin-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Hero' && (
        <section className="admin-section">
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
      )}

      {activeTab === 'About' && (
        <section className="admin-section">
          <h2>Bio paragraphs</h2>
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
      )}

      {activeTab === 'Experience' && (
        <>
          {([
            { key: 'workExperiences', label: 'Organization' },
            { key: 'studyExperiences', label: 'Studies' },
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
                  <ImageUploadField
                    label={key === 'studyExperiences' ? 'University logo' : 'Organization logo'}
                    value={item.logoSrc || ''}
                    onChange={(url) => {
                      const next = [...draft[key]];
                      next[i] = { ...next[i], logoSrc: url };
                      setDraft({ ...draft, [key]: next });
                    }}
                    token={session.token}
                  />
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
        </>
      )}

      {activeTab === 'Tools' && (
        <section className="admin-section">
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
      )}

      {activeTab === 'Projects' && !editingProject && (
        <section className="admin-section">
          <button className="admin-btn-add admin-btn-add-project" onClick={addProject}>
            + Add project
          </button>

          <div className="admin-project-list">
            {draft.projects.map((project) => (
              <div
                key={project.id}
                className="admin-project-row"
                onClick={() => setEditingProjectId(project.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setEditingProjectId(project.id);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="admin-project-row-thumb">
                  {project.thumbnail && <img src={project.thumbnail} alt="" />}
                </div>
                <div className="admin-project-row-info">
                  <span className="admin-project-row-title">{project.title || 'Untitled project'}</span>
                  <span className="admin-project-row-meta">
                    {project.categories
                      .map((c) => PROJECT_CATEGORIES.find((pc) => pc.value === c)?.label)
                      .filter(Boolean)
                      .join(', ') || 'No category yet'}
                    {' · '}
                    {project.year}
                  </span>
                </div>
                <button
                  className="admin-project-row-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteProject(project.id);
                  }}
                  aria-label={`Delete ${project.title}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {draft.projects.length === 0 && <p className="admin-empty-note">No projects yet.</p>}
          </div>
        </section>
      )}

      {activeTab === 'Projects' && editingProject && (
        <section className="admin-section">
          <button className="admin-back-link admin-back-btn" onClick={() => setEditingProjectId(null)}>
            ← Back to all projects
          </button>

          <div className="admin-card">
            <label>
              Title
              <input
                value={editingProject.title}
                onChange={(e) => updateEditingProject({ title: e.target.value })}
              />
            </label>

            <fieldset className="admin-fieldset">
              <legend>Categories (select all that apply)</legend>
              <div className="admin-checkbox-group">
                {PROJECT_CATEGORIES.map(({ value, label }) => (
                  <label key={value} className="admin-checkbox">
                    <input
                      type="checkbox"
                      checked={editingProject.categories.includes(value)}
                      onChange={(e) => {
                        const categories: ProjectCategory[] = e.target.checked
                          ? [...editingProject.categories, value]
                          : editingProject.categories.filter((c) => c !== value);
                        updateEditingProject({ categories });
                      }}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>

            <label>
              Description
              <textarea
                rows={3}
                value={editingProject.description}
                onChange={(e) => updateEditingProject({ description: e.target.value })}
              />
            </label>

            <label>
              Tags (comma separated)
              <input
                value={editingProject.tags.join(', ')}
                onChange={(e) =>
                  updateEditingProject({ tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })
                }
              />
            </label>

            <label>
              Client
              <input
                value={editingProject.client || ''}
                onChange={(e) => updateEditingProject({ client: e.target.value })}
              />
            </label>

            <label>
              Year
              <input
                value={String(editingProject.year)}
                onChange={(e) => updateEditingProject({ year: e.target.value })}
              />
            </label>

            <label>
              Role
              <input
                value={editingProject.role}
                onChange={(e) => updateEditingProject({ role: e.target.value })}
              />
            </label>

            <ImageUploadField
              label="Thumbnail"
              value={editingProject.thumbnail}
              onChange={(url) => updateEditingProject({ thumbnail: url })}
              token={session.token}
            />

            <button className="admin-btn-remove admin-btn-delete-project" onClick={() => deleteProject(editingProject.id)}>
              Delete this project
            </button>
          </div>

          <button className="admin-back-link admin-back-btn" onClick={() => setEditingProjectId(null)}>
            ← Back to all projects
          </button>
        </section>
      )}

      {activeTab === 'Resume' && (
        <section className="admin-section">
          <div className="admin-card">
            <p className="admin-resume-current">
              Current resume:{' '}
              <a href={draft.resumeUrl} target="_blank" rel="noopener noreferrer">
                {draft.resumeUrl}
              </a>
            </p>
            <input
              id="resume-upload-input"
              type="file"
              accept="application/pdf"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleResumeUpload(file);
                e.target.value = '';
              }}
            />
            <button
              type="button"
              className="admin-btn-ghost"
              disabled={resumeUploading}
              onClick={() => document.getElementById('resume-upload-input')?.click()}
            >
              {resumeUploading ? 'Uploading…' : 'Replace resume PDF'}
            </button>
            {resumeError && <p className="admin-error">{resumeError}</p>}
          </div>
        </section>
      )}

      <div className="admin-bottom-save">
        <button className="admin-btn-primary" onClick={handleSave} disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved ✓' : 'Save changes'}
        </button>
      </div>
    </div>
  );
};

export default Admin;
