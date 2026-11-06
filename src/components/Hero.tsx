import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, FileText } from 'lucide-react';
import { useSiteContent } from '../content/SiteContentContext';
import GlassPrismHero from './ui/glass-prism-hero';

/**
 * The hero is a full-viewport glass-prism scene: a beam of light refracts
 * through a WebGL prism over the visitor's dot grid. Everything it says comes
 * from the admin-editable hero content, and the CTAs reuse the site's own
 * monochrome button styles. Scrolling turns the prism and dims the light, so
 * the page hands off seamlessly to the intro statement below.
 */
const Hero: React.FC = () => {
  const { content } = useSiteContent();

  return (
    <GlassPrismHero
      headline={content.hero.greeting}
      eyebrow={content.hero.status}
      description={content.hero.bio}
      accent="#ffffff"
      actions={
        <>
          <Link to="/portofolio" className="hero-cta hero-cta-primary">
            View works
            <ArrowUpRight size={16} />
          </Link>
          <a
            href={content.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-cta hero-cta-secondary"
          >
            Resume
            <FileText size={16} />
          </a>
        </>
      }
    />
  );
};

export default Hero;
