import React from 'react';
import { GraduationCap, MapPin } from 'lucide-react';
import { useSiteContent } from '../content/SiteContentContext';
import { ExperienceEntry } from '../content/types';
import Reveal from '../components/Reveal';
import '../components/ProfileSections.css';

// Up to two letters from the entry name, used as a monochrome watermark until a
// real logo is uploaded in the admin panel.
const initialsOf = (title: string) => {
  const letters = title
    .split(/\s+/)
    .map((word) => word.match(/\p{L}/u)?.[0])
    .filter((letter): letter is string => Boolean(letter));
  if (letters.length === 0) return '';
  return (letters[0] + (letters.length > 1 ? letters[letters.length - 1] : '')).toUpperCase();
};

const ExperienceList: React.FC<{ items: ExperienceEntry[] }> = ({ items }) => (
  <ul className="prf-history-list">
    {items.map((item, index) => (
      <li key={item.id}>
        <Reveal delay={index % 3}>
          <article className="prf-history-card">
            <div className="prf-history-watermark" aria-hidden="true">
              {item.logoSrc ? (
                <img
                  src={item.logoSrc}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  onError={(event) => { event.currentTarget.hidden = true; }}
                />
              ) : (
                <span className="prf-history-watermark-mark">{initialsOf(item.title)}</span>
              )}
            </div>
            <p className="prf-history-date">{item.date}</p>
            <div className="prf-history-identity">
              <div>
                <h4 className="prf-history-title">{item.title}</h4>
                <p className="prf-history-subtitle">{item.subtitle}</p>
              </div>
            </div>
            {item.description && <p className="prf-history-description">{item.description}</p>}
          </article>
        </Reveal>
      </li>
    ))}
  </ul>
);

const About: React.FC = () => {
  const { content } = useSiteContent();
  const studyEntry = content.studyExperiences[0];
  const stats = [
    { label: 'Projects in portfolio', value: content.projects.length },
    { label: 'Creative tools', value: content.tools.length },
    { label: 'Organisation experiences', value: content.workExperiences.length },
  ];

  return (
    <div className="prf-section prf-about-section">
      <div className="prf-container">
        <Reveal>
          <p className="prf-eyebrow"><span>About me</span></p>
        </Reveal>

        <div className="prf-about-top">
          <Reveal className="prf-reveal-block">
            <h2 className="prf-about-statement">
              Cinematic edits.<br />
              Expressive design.<br />
              <span>Stories that connect.</span>
            </h2>
          </Reveal>

          <div className="prf-about-detail">
            <div className="prf-about-bio">
              {content.about.bioParagraphs.map((paragraph, index) => (
                <Reveal key={index} delay={index % 3}>
                  <p>{paragraph}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={1}>
              <ul className="prf-about-pills">
                <li className="prf-about-pill">
                  <MapPin size={14} aria-hidden="true" />
                  <span>Malang, Indonesia</span>
                </li>
                {studyEntry && (
                  <li className="prf-about-pill">
                    <GraduationCap size={14} aria-hidden="true" />
                    <span>{studyEntry.title} · {studyEntry.subtitle}</span>
                  </li>
                )}
              </ul>
            </Reveal>
          </div>
        </div>

        <Reveal>
          <dl className="prf-stats">
            {stats.map((stat) => (
              <div className="prf-stat" key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal>
          <h2 className="prf-history-section-heading">Experience &amp; education</h2>
        </Reveal>
        <div className="prf-history-grid">
          <section aria-labelledby="prf-experience-heading">
            <Reveal>
              <h3 className="prf-history-heading" id="prf-experience-heading">Organisation</h3>
            </Reveal>
            <ExperienceList items={content.workExperiences} />
          </section>
          <section aria-labelledby="prf-education-heading">
            <Reveal delay={1}>
              <h3 className="prf-history-heading" id="prf-education-heading">Education</h3>
            </Reveal>
            <ExperienceList items={content.studyExperiences} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
