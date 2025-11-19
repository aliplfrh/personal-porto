import React from 'react';
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

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '2rem'
      }}
    >
      <div
        className="modal-content"
        onClick={handleContentClick}
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
      >
        <div
          className="modal-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.5rem',
            borderBottom: '1px solid #eee',
            position: 'sticky',
            top: 0,
            backgroundColor: '#fff'
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>{project.title}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '4px'
            }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            {project.category === 'video' ? (
              <div>
                <div style={{ borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f5f5f5', marginBottom: '1rem' }}>
                  <img
                    src={project.thumbnailImage || project.thumbnail}
                    alt={`${project.title} thumbnail`}
                    style={{ width: '100%', height: 'auto' }}
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
                      color: '#e63946',
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}
                  >
                    <span style={{ marginRight: '0.5rem' }}>Watch Preview</span>
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            ) : (
              project.images && (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {project.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${project.title} - Image ${index + 1}`}
                      style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                    />
                  ))}
                </div>
              )
            )}
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>About the Project</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>{project.description}</p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', fontSize: '0.9rem', color: '#666' }}>
            {project.client && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <User size={16} style={{ marginRight: '0.5rem' }} />
                <span>Client: {project.client}</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Calendar size={16} style={{ marginRight: '0.5rem' }} />
              <span>Year: {project.year}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Tag size={16} style={{ marginRight: '0.5rem' }} />
              <span>Role: {project.role}</span>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Technologies & Tools</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    padding: '0.4rem 0.8rem',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    color: '#666'
                  }}
                >
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