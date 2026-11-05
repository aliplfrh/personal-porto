import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSiteContent } from '../content/SiteContentContext';
import { PROJECT_CATEGORIES } from '../types';
import Reveal from '../components/Reveal';

const EASE = [0.22, 1, 0.36, 1] as const;

const WorksIndex: React.FC = () => {
  const { content } = useSiteContent();
  const [activeId, setActiveId] = useState<string | null>(null);
  const projects = content.projects;

  return (
    <motion.div
      className="works-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <div className="works-bg" aria-hidden="true">
        {projects.map((project) => (
          <div
            key={project.id}
            className="works-bg-image"
            style={{
              backgroundImage: `url(${project.thumbnailImage || project.thumbnail})`,
              opacity: activeId === project.id ? 1 : 0,
            }}
          />
        ))}
        <div className="works-bg-overlay" />
      </div>

      <div className="works-header">
        <h1>Works</h1>
        <p>A collection of cinematic edits and visual identity projects.</p>
      </div>

      {PROJECT_CATEGORIES.map(({ value, label }) => {
        const group = projects.filter((p) => p.categories.includes(value));
        if (group.length === 0) return null;

        return (
          <div className="works-group" key={value}>
            <Reveal from="fade">
              <h2 className="works-group-title">{label}</h2>
            </Reveal>
            <ul className="works-list" onMouseLeave={() => setActiveId(null)}>
              {group.map((project, index) => (
                <li
                  key={project.id}
                  className={`works-row ${activeId && activeId !== project.id ? 'is-dimmed' : ''}`}
                >
                  <Reveal delay={index} from="up" amount={0.15}>
                    <Link
                      to={`/portofolio/${project.id}`}
                      onMouseEnter={() => setActiveId(project.id)}
                      onFocus={() => setActiveId(project.id)}
                      onBlur={() => setActiveId(null)}
                    >
                      <span className="works-row-thumb" aria-hidden="true">
                        <img src={project.thumbnailImage || project.thumbnail} alt="" loading="lazy" />
                      </span>
                      <span className="works-row-title">{project.title}</span>
                      <span className="works-row-meta">
                        {project.client && <span>{project.client}</span>}
                        <span>{project.year}</span>
                      </span>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      {projects.length === 0 && (
        <p className="projects-empty">No works published yet.</p>
      )}
    </motion.div>
  );
};

export default WorksIndex;
