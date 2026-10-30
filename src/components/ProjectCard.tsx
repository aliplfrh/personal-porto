import React, { useState } from 'react';
import { Film, Image } from 'lucide-react';
import { Project } from '../types';
import ProjectModal from './ProjectModal';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="project-card"
        onClick={() => setIsModalOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsModalOpen(true);
          }
        }}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
      >
        <div className="project-image">
          <img
            src={project.thumbnail}
            alt={project.title}
            loading="lazy"
            decoding="async"
          />
          <div className="project-category">
            {project.category === 'video' ? (
              <>
                <Film size={14} style={{ marginRight: '4px' }} />
                Video
              </>
            ) : (
              <>
                <Image size={14} style={{ marginRight: '4px' }} />
                Graphic
              </>
            )}
          </div>
        </div>
        <div className="project-content">
          <h3 className="project-title">{project.title}</h3>
          <p className="project-description">{project.description}</p>
          <div className="project-tags">
            {project.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="project-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <ProjectModal
        project={project}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ProjectCard;