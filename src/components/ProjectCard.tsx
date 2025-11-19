import React, { useState } from 'react';
import { Film, Image } from 'lucide-react';
import { Project } from '../types';
import ProjectModal from './ProjectModal';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="project-card"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="project-image">
          <img
            src={project.thumbnail}
            alt={project.title}
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