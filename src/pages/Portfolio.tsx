import React, { useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import { useSiteContent } from '../content/SiteContentContext';

const Portfolio: React.FC = () => {
  const { content } = useSiteContent();
  const [filter, setFilter] = useState<'all' | 'video' | 'graphic'>('all');

  const filteredProjects = content.projects.filter(
    project => filter === 'all' || project.category === filter
  );

  return (
    <div className="portfolio section">
      <div className="container">
        <div className="portfolio-header">
          <h2 className="gradient-heading">Portfolio</h2>
          <p>
            Browse through my complete collection of video editing and graphic design projects.
          </p>
        </div>
        
        <div className="portfolio-filters">
          <button
            onClick={() => setFilter('all')}
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          >
            All projects
          </button>
          <button
            onClick={() => setFilter('video')}
            className={`filter-btn ${filter === 'video' ? 'active' : ''}`}
          >
            Video editing
          </button>
          <button
            onClick={() => setFilter('graphic')}
            className={`filter-btn ${filter === 'graphic' ? 'active' : ''}`}
          >
            Graphic design
          </button>
        </div>
        
        {filteredProjects.length > 0 ? (
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p className="projects-empty">No projects in this category yet.</p>
        )}
      </div>
    </div>
  );
};

export default Portfolio;