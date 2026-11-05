import React, { useState, useRef } from 'react';
import { useSiteContent } from '../content/SiteContentContext';
import { ExperienceEntry } from '../content/types';
import Reveal from '../components/Reveal';

const TimelineItem: React.FC<ExperienceEntry> = ({ date, title, subtitle, description, logoSrc }) => {
  return (
    <div className="timeline-item">
      <span className="timeline-marker">
        {logoSrc && <img src={logoSrc} alt="" />}
      </span>
      <div className="timeline-date">{date}</div>
      <h4 className="timeline-title">{title}</h4>
      <div className="timeline-subtitle">{subtitle}</div>
      {description && (
        <p className="timeline-description">{description}</p>
      )}
    </div>
  );
};

const ExperienceSection: React.FC<{ workExperiences: ExperienceEntry[]; studyExperiences: ExperienceEntry[] }> = ({
  workExperiences,
  studyExperiences,
}) => {
  const [activeTab, setActiveTab] = useState('studies');
  const experiencesToShow = activeTab === 'studies' ? studyExperiences : workExperiences;

  const tabs = [
    { id: 'work', label: 'Organisation' },
    { id: 'studies', label: 'Studies' },
  ];

  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Roving focus: Left/Right (and Home/End) move between tabs, per WAI-ARIA tabs pattern.
  const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();

    const nextIndex =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? tabs.length - 1
          : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;

    const nextTab = tabs[nextIndex];
    setActiveTab(nextTab.id);
    tabRefs.current[nextTab.id]?.focus();
  };

  return (
    <div className="experience">
      <h3>Experience</h3>

      <div className="tabs" role="tablist" aria-label="Experience type">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => { tabRefs.current[tab.id] = el; }}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls="experience-panel"
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(event) => onTabKeyDown(event, index)}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        id="experience-panel"
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        tabIndex={0}
        className="timeline"
      >
        {experiencesToShow.map((item, index) => (
          <Reveal key={item.id} delay={index} from="left">
            <TimelineItem {...item} />
          </Reveal>
        ))}
      </div>
    </div>
  );
};

const About: React.FC = () => {
  const { content } = useSiteContent();

  return (
    <div className="about section">
      <div className="container">
        <Reveal from="right">
          <div className="about-content">
            <div className="about-text">
              <h2 className="gradient-heading">About me</h2>
              {content.about.bioParagraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div className="about-image">
              <img
                src="https://i.imgur.com/K35klRx.jpeg"
                alt="About me"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <ExperienceSection
            workExperiences={content.workExperiences}
            studyExperiences={content.studyExperiences}
          />
        </Reveal>

        <Reveal delay={2}>
          <div className="tools">
            <h3>Tools and technologies</h3>
            <div className="tools-grid">
              {content.tools.map((tool, i) => (
                <div className="tool-item" key={i}>
                  <img src={tool.iconUrl} alt={tool.name} />
                  <span>{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default About;
