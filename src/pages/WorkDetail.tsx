import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { useSiteContent } from '../content/SiteContentContext';
import { PROJECT_CATEGORIES } from '../types';
import Reveal from '../components/Reveal';

const EASE = [0.22, 1, 0.36, 1] as const;

const WorkDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { content } = useSiteContent();
  const projects = content.projects;

  const index = projects.findIndex((p) => p.id === slug);
  const project = projects[index];

  if (!project) {
    return <Navigate to="/portofolio" replace />;
  }

  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const heroImage = project.thumbnailImage || project.thumbnail;

  return (
    <motion.div
      className="work-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <Link to="/portofolio" className="work-back">
        <ArrowLeft size={16} />
        All works
      </Link>

      <div className="work-hero">
        <img src={heroImage} alt={project.title} />
      </div>

      <div className="work-body">
        <div className="work-main">
          <h1 className="gradient-heading">{project.title}</h1>

          <Reveal from="fade">
            <div className="work-block">
              <h2>Description</h2>
              <p>{project.description}</p>
            </div>
          </Reveal>

          {project.role && (
            <Reveal from="fade" delay={1}>
              <div className="work-block">
                <h2>Credits</h2>
                <div className="work-credit-row">
                  <span>Role</span>
                  <span>{project.role}</span>
                </div>
              </div>
            </Reveal>
          )}

          {project.streamableId && (
            <Reveal from="fade" delay={2}>
              <a
                href={`https://streamable.com/${project.streamableId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="work-watch-link"
              >
                Watch the film
                <ExternalLink size={16} />
              </a>
            </Reveal>
          )}

          {project.images && project.images.length > 0 && (
            <Reveal from="fade" delay={3}>
              <div className="work-block">
                <h2>Gallery</h2>
                <div className="work-gallery">
                  {project.images.map((img, i) => (
                    <img key={i} src={img} alt={`${project.title} — frame ${i + 1}`} loading="lazy" />
                  ))}
                </div>
              </div>
            </Reveal>
          )}
        </div>

        <Reveal from="left" amount={0.1}>
          <aside className="work-info">
          <h2>Info</h2>
          {project.client && (
            <div className="work-info-row">
              <span>Client</span>
              <span>{project.client}</span>
            </div>
          )}
          <div className="work-info-row work-info-tags">
            <span>Work</span>
            <span className="project-tags">
              {project.categories.map((cat) => (
                <span key={cat} className="project-tag">
                  {PROJECT_CATEGORIES.find((c) => c.value === cat)?.label || cat}
                </span>
              ))}
            </span>
          </div>
          <div className="work-info-row">
            <span>Year</span>
            <span>{project.year}</span>
          </div>
          {project.tags.length > 0 && (
            <div className="work-info-row work-info-tags">
              <span>Tools</span>
              <span className="project-tags">
                {project.tags.map((tag, i) => (
                  <span key={i} className="project-tag">{tag}</span>
                ))}
              </span>
            </div>
          )}
          </aside>
        </Reveal>
      </div>

      <Reveal from="fade" amount={0.1}>
        <nav className="work-nav" aria-label="More works">
          <Link to={`/portofolio/${prev.id}`} className="work-nav-link work-nav-prev">
            <ArrowLeft size={16} />
            <div>
              <span className="work-nav-label">Previous</span>
              <span className="work-nav-title">{prev.title}</span>
            </div>
          </Link>
          <Link to={`/portofolio/${next.id}`} className="work-nav-link work-nav-next">
            <div>
              <span className="work-nav-label">Next</span>
              <span className="work-nav-title">{next.title}</span>
            </div>
            <ArrowRight size={16} />
          </Link>
        </nav>
      </Reveal>
    </motion.div>
  );
};

export default WorkDetail;
