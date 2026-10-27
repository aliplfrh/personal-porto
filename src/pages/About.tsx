import React, { useState } from 'react';

// Data for the Experience Section
const workExperiences = [
  {
    id: 'work2',
    date: 'August 2024 - Present',
    title: 'Nol Derajat Film',
    subtitle: 'Staff HUMI',
    description: "Organization about film and film making.",
    logoSrc: 'https://i.imgur.com/bR28g7Z.png'
  },
];

const studyExperiences = [
  {
    id: 'study1',
    date: 'August 2024 - Present',
    title: 'Universitas Brawijaya',
    subtitle: 'Studying in Animal Science',
    description: null,
    logoSrc: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Logo_Universitas_Brawijaya.svg'
  },
  {
    id: 'study2',
    date: 'August 2021 - Juli 2024',
    title: 'SMAN 1 Srengat',
    subtitle: 'Math and Science',
    description: null,
    logoSrc: 'https://upload.wikimedia.org/wikipedia/id/6/60/LOGO_SMANGAT.png'
  },
];

interface TimelineItemProps {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  description?: string | null;
  logoSrc?: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ date, title, subtitle, description }) => {
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

const ExperienceSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('studies');
  const experiencesToShow: TimelineItemProps[] = activeTab === 'studies' ? studyExperiences : workExperiences;

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
          <TimelineItem
            key={item.id}
            id={item.id}
            date={item.date}
            title={item.title}
            subtitle={item.subtitle}
            description={item.description}
            logoSrc={item.logoSrc}
          />
        ))}
      </div>
    </div>
  );
};

const About: React.FC = () => {
  return (
    <div className="about section">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2 className="gradient-heading">About me</h2>
            <p>
              I'm a Visual Artist specializing in cinematic video editing and expressive design.
              With 3+ years of experience, I craft emotionally rich content that connects, inspires,
              and leaves a lasting impression.
            </p>
            <p>
              My work centers on cinematic editing, expressive color grading,
              and building cohesive visual identities across mediums.
            </p>
          </div>
          
          <div className="about-image">
            <img
              src="https://i.imgur.com/K35klRx.jpeg"
              alt="About me"
            />
          </div>
        </div>

        <ExperienceSection />

        <div className="tools">
          <h3>Tools and technologies</h3>
          <div className="tools-grid">
            <div className="tool-item">
              <img src="https://www.adobe.com/content/dam/cc/icons/premiere.svg" alt="Premiere Pro" />
              <span>Premiere Pro</span>
            </div>
            <div className="tool-item">
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/90/DaVinci_Resolve_17_logo.svg" alt="DaVinci Resolve" />
              <span>DaVinci Resolve</span>
            </div>
            <div className="tool-item">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/48/Logo_AffinityDesigner.svg" alt="Affinity Designer" />
              <span>Affinity Designer</span>
            </div>
            <div className="tool-item">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/59/Logo_AffinityPhoto.svg" alt="Affinity Photo" />
              <span>Affinity Photo</span>
            </div>
            <div className="tool-item">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" alt="Figma" />
              <span>Figma</span>
            </div>
            <div className="tool-item">
              <img src="https://upload.wikimedia.org/wikipedia/en/b/bb/Canva_Logo.svg" alt="Canva" />
              <span>Canva</span>
            </div>
            <div className="tool-item">
              <img src="https://upload.wikimedia.org/wikipedia/en/a/a0/Capcut-logo.svg" alt="CapCut" />
              <span>CapCut</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;