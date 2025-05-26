import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// --- Data for the Experience Section ---
// !! IMPORTANT: Replace logoSrc paths with your actual image locations !!
const workExperiences = [
  {
    id: 'work1',
    date: 'Jan 2069',
    title: 'woop woopp',
    subtitle: 'woppwopp',
    description: 'Web Design; Web Development; Wordpress + Elementor.',
    logoSrc: 'https://i.imgur.com/pxSB012.png' // EXAMPLE PATH - REPLACE
  },
  {
    id: 'work2',
    date: 'August 2024 - Present',
    title: 'Nol Derajat Film',
    subtitle: 'Staff',
    description: "Organization about film and film making.",
    logoSrc: 'https://i.imgur.com/bR28g7Z.png' // EXAMPLE PATH - REPLACE
  },
];

const studyExperiences = [
  {
    id: 'study1',
    date: 'August 2024 - Present',
    title: 'Universitas Brawijaya',
    subtitle: 'Studying in Animal Science',
    description: null,
    logoSrc: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Logo_Universitas_Brawijaya.svg' // EXAMPLE PATH - REPLACE
  },
  {
    id: 'study2',
    date: 'August 2021 - Juli 2024',
    title: 'SMAN 1 Srengat',
    subtitle: 'Math and Science',
    description: null,
    logoSrc: 'https://upload.wikimedia.org/wikipedia/id/6/60/LOGO_SMANGAT.png' // EXAMPLE PATH - REPLACE
  },
];


// --- Reusable Timeline Item Component (Corrected Centering Logic) ---
interface TimelineItemProps {
    id: string;
    date: string;
    title: string;
    subtitle: string;
    description?: string | null;
    logoSrc?: string;
}

// Constants for positioning - MUST match ExperienceSection
const LINE_LEFT_OFFSET_PX = 30; // Absolute horizontal position for the line and icon centers from the container's *padding edge*.
const ICON_SIZE_PX = 42;
// Calculate space needed to the left of the text: Line Pos + Half Icon + Gap
// Example: 30 + (42/2) + 24 (1.5rem) = 75px. Use Tailwind class >= this (e.g., pl-20 = 80px).
const TEXT_PADDING_LEFT_CLASS = "pl-20"; // Adjust this for gap control

const TimelineItem: React.FC<TimelineItemProps> = ({ date, title, subtitle, description, logoSrc }) => {
  return (
    // This single div is the item container.
    // Relative positioning for the absolute icon.
    // Padding left ('pl-20') ONLY affects where the text content starts.
    // Padding bottom ('pb-10') adds space below this item.
    <div className={`relative ${TEXT_PADDING_LEFT_CLASS} pb-10 last:pb-0`}>

      {/* Icon - Positioned absolutely relative to the TimelineItem div above */}
      <div
        className="absolute top-0 flex items-center justify-center w-[42px] h-[42px] bg-gray-800 rounded-full border-2 border-gray-600 overflow-hidden z-10" // z-10 ensures icon is visually above the line
        style={{
          // Position the icon's horizontal CENTER exactly over the line's position.
          // 'left' positions the element's reference point (default top-left).
          // 'transform' shifts the element relative to its own size AFTER positioning.
          // Setting left = line offset, then translating X by -50% centers it.
          left: `${LINE_LEFT_OFFSET_PX}px`,
          transform: 'translateX(-50%)',
        }}
      >
        {logoSrc ? (
          <img src={logoSrc} alt={`${title} Logo`} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-700"></div> // Placeholder
        )}
      </div>

      {/* Content - Sits naturally within the TimelineItem div, starting after the padding-left */}
      <div> {/* No extra classes needed here unless for specific styling */}
        <span className="block text-sm text-gray-400 mb-1">{date}</span>
        <h3 className="text-lg font-semibold text-white mb-0.5">{title}</h3>
        <h4 className="text-base font-normal text-gray-300 mb-2">{subtitle}</h4>
        {description && (
          <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
};


// --- Experience Section Component ---
const ExperienceSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('studies');
  const experiencesToShow: TimelineItemProps[] = activeTab === 'studies' ? studyExperiences : workExperiences;

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-semibold mb-8 text-gray-100">Experience</h2>

      {/* Tabs Container (keep as is) */}
      <div className="flex items-center gap-x-6 mb-6">
         {/* ... buttons ... */}
         <button
          onClick={() => setActiveTab('work')}
          className={`py-2 px-6 text-base font-medium rounded-lg transition-colors duration-200 ease-in-out ${
            activeTab === 'work'
              ? 'bg-white text-black shadow'
              : 'bg-transparent text-gray-400 hover:text-white'
          }`}
        >
          Organization
        </button>
        <button
          onClick={() => setActiveTab('studies')}
          className={`py-2 px-6 text-base font-medium rounded-lg transition-colors duration-200 ease-in-out ${
            activeTab === 'studies'
              ? 'bg-white text-black shadow'
              : 'bg-transparent text-gray-400 hover:text-white'
          }`}
        >
          Studies
        </button>
      </div>

      {/* Timeline Content Area */}
      {/* This container is relative, holds the single line and items */}
      {/* p-8 provides overall padding; pt-10 ensures space above first item */}
      <div className="relative bg-dark-card/30 backdrop-blur-sm border border-white/10 rounded-lg p-8 pt-10">

        {/* === The Single Vertical Line === */}
        <div
            className="absolute top-10 bottom-10 w-0.5 bg-gray-600" // Adjust top/bottom padding if needed
            // Position the line at the defined horizontal offset
            style={{ left: `${LINE_LEFT_OFFSET_PX}px` }}
        ></div>
        {/* ================================ */}

        {/* Render Timeline Items */}
        {/* Each item's icon will be centered over the line above */}
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


// --- Main About Component (Original Structure) ---
const About: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    // === MODIFIED HERE: Using classes from your ORIGINAL About component ===
    <div className="min-h-screen py-24">
      {/* Using classes from your ORIGINAL About component */}
      <div className="container relative z-10 mx-auto px-4"> {/* Added mx-auto px-4 */}
        <div className="max-w-4xl mx-auto">
          {/* Using classes from your ORIGINAL About component */}
          <motion.div
            ref={ref} // Apply ref here
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
          >
            {/* Original About Me Title - Assuming dark text needed */}
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">About Me</h2>
            {/* Original About Me Text - Adjusted for likely dark text */}
            <div className="max-w-none mb-12"> {/* Removed prose-invert */}
              <p className="text-gray-600 dark:text-gray-300 text-lg">
               I'm a Visual Artist specializing in cinematic video editing and expressive design.
                With 3+ years of experience, I craft emotionally rich content that connects, inspires,
                and leaves a lasting impression. My work centers on cinematic editing, expressive color grading,
                and building cohesive visual identities across mediums.
              </p>
            </div>

            {/* === Experience Section === */}
            <ExperienceSection />
            {/* === OLD Organization and Studies sections were REMOVED === */}


{/* === Tools Section (Updated Styling - Slightly Larger) === */}
            {/* Container for title and spacing */}
            <div className="mb-12">
              {/* Title - adjust color if needed */}
              <h2 className="text-2xl font-bold mb-8 text-gray-100 dark:text-gray-100">Tools</h2>
              {/* Flex container for wrapping items - Adjusted gap slightly */}
              <div className="flex flex-wrap gap-x-8 gap-y-5"> {/* Increased gap */}
                 {/* Tool items - Larger icon, base text, adjusted spacing */}
                 <div className="flex items-center space-x-3"> {/* Increased space-x */}
                  <img src="https://www.adobe.com/content/dam/cc/icons/premiere.svg" alt="Premiere Pro" className="w-6 h-6" /> {/* Increased icon size */}
                  <span className="text-base text-gray-300 dark:text-gray-300">Premiere Pro</span> {/* Changed to text-base */}
                </div>
                <div className="flex items-center space-x-3">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/9/90/DaVinci_Resolve_17_logo.svg" alt="DaVinci Resolve" className="w-6 h-6" />
                  <span className="text-base text-gray-300 dark:text-gray-300">DaVinci Resolve</span>
                </div>
                <div className="flex items-center space-x-3">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/4/48/Logo_AffinityDesigner.svg" alt="Affinity Designer" className="w-6 h-6" />
                  <span className="text-base text-gray-300 dark:text-gray-300">Affinity Designer</span>
                </div>
                <div className="flex items-center space-x-3">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/59/Logo_AffinityPhoto.svg" alt="Affinity Photo" className="w-6 h-6" />
                  <span className="text-base text-gray-300 dark:text-gray-300">Affinity Photo</span>
                </div>
                <div className="flex items-center space-x-3">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" alt="Figma" className="w-6 h-6" />
                  <span className="text-base text-gray-300 dark:text-gray-300">Figma</span>
                </div>
                <div className="flex items-center space-x-3">
                  <img src="https://upload.wikimedia.org/wikipedia/en/b/bb/Canva_Logo.svg" alt="Canva" className="w-6 h-6" />
                  <span className="text-base text-gray-300 dark:text-gray-300">Canva</span>
                </div>
                <div className="flex items-center space-x-3">
                  <img src="https://upload.wikimedia.org/wikipedia/en/a/a0/Capcut-logo.svg" alt="CapCut" className="w-6 h-6" />
                  <span className="text-base text-gray-300 dark:text-gray-300">CapCut</span>
                </div>
                 {/* Add any other tools using the same structure */}
              </div>
            </div>
            {/* === End of Tools Section === */}
            {/* === End of Tools Section === */}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;