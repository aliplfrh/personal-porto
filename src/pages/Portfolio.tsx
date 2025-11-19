import React, { useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/projects';

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'video' | 'graphic'>('all');
  
  const filteredProjects = projects.filter(
    project => filter === 'all' || project.category === filter
  );

  return (
    <div className="portfolio section">
      <div className="container">
        <div className="portfolio-header">
          <h2>Portfolio</h2>
          <p>
            Browse through my complete collection of video editing and graphic design projects.
          </p>
        </div>
        
        <div className="portfolio-filters">
          <button
            onClick={() => setFilter('all')}
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          >
            All Projects
          </button>
          <button
            onClick={() => setFilter('video')}
            className={`filter-btn ${filter === 'video' ? 'active' : ''}`}
          >
            Video Editing
          </button>
          <button
            onClick={() => setFilter('graphic')}
            className={`filter-btn ${filter === 'graphic' ? 'active' : ''}`}
          >
            Graphic Design
          </button>
        </div>
        
        <div className="projects-grid">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;