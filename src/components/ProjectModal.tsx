import React, { useEffect } from 'react';
import { X, Calendar, User, Tag, ExternalLink } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={handleContentClick} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <h2 id="modal-title" style={{ margin: 0 }}>{project.title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 'var(--space-400)' }}>
          <div style={{ marginBottom: 'var(--space-400)' }}>
            {project.category === 'video' ? (
              <div>
                <div
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: 'var(--bg-surface-higher)',
                    marginBottom: 'var(--space-200)',
                  }}
                >
                  <img
                    src={project.thumbnailImage || project.thumbnail}
                    alt={`${project.title} thumbnail`}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
                {project.streamableId && (
                  <a
                    href={`https://streamable.com/${project.streamableId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 'var(--space-75)',
                      color: 'var(--accent)',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: 'var(--text-sm)',
                    }}
                  >
                    Watch preview
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            ) : (
              project.images && (
                <div style={{ display: 'grid', gap: 'var(--space-200)' }}>
                  {project.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${project.title} image ${index + 1}`}
                      style={{ width: '100%', height: 'auto', borderRadius: '8px', display: 'block' }}
                    />
                  ))}
                </div>
              )
            )}
          </div>

          <div style={{ marginBottom: 'var(--space-400)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-200)' }}>About the project</h3>
            <p style={{ marginBottom: 0 }}>{project.description}</p>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-300)',
              marginBottom: 'var(--space-400)',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-tertiary)',
            }}
          >
            {project.client && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-75)' }}>
                <User size={16} /> Client: {project.client}
              </span>
            )}
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-75)' }}>
              <Calendar size={16} /> Year: {project.year}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-75)' }}>
              <Tag size={16} /> Role: {project.role}
            </span>
          </div>

          <div>
            <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-200)' }}>Technologies and tools</h3>
            <div className="project-tags">
              {project.tags.map((tag, index) => (
                <span key={index} className="project-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
