import React, { useState } from 'react';
import { useSiteContent } from '../content/SiteContentContext';
import { ExperienceEntry } from '../content/types';

const TimelineItem: React.FC<ExperienceEntry> = ({ date, title, subtitle, description }) => {
  return (
    <div className="timeline-item">
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

  return (
    <div className="experience">
      <h3>Experience</h3>

      <div className="tabs">
        <button
          onClick={() => setActiveTab('work')}
          className={`tab-btn ${activeTab === 'work' ? 'active' : ''}`}
        >
          Organization
        </button>
        <button
          onClick={() => setActiveTab('studies')}
          className={`tab-btn ${activeTab === 'studies' ? 'active' : ''}`}
        >
          Studies
        </button>
      </div>

      <div className="timeline">
        {experiencesToShow.map((item) => (
          <TimelineItem key={item.id} {...item} />
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

        <ExperienceSection
          workExperiences={content.workExperiences}
          studyExperiences={content.studyExperiences}
        />

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
      </div>
    </div>
  );
};

export default About;
