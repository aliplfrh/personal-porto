import { SiteContent } from './types';
import { projects } from '../data/projects';

export const defaultContent: SiteContent = {
  hero: {
    greeting: "Hey, I'm Alief",
    status: 'Available for work',
    bio: "I'm a Visual Artist specializing in cinematic video editing and expressive design. Weaving together the art of video editing and graphic design, crafting cinematic experiences that stir emotion and leave a lasting impression.",
  },
  about: {
    bioParagraphs: [
      "I'm a Visual Artist specializing in cinematic video editing and expressive design. With 3+ years of experience, I craft emotionally rich content that connects, inspires, and leaves a lasting impression.",
      'My work centers on cinematic editing, expressive color grading, and building cohesive visual identities across mediums.',
    ],
  },
  workExperiences: [
    {
      id: 'work1',
      date: 'Ongoing',
      title: 'Apatte62',
      subtitle: 'Creative Media Branding',
      description: 'Apatte62 is a student organization at Universitas Brawijaya that runs Mekano 3D, a 3D printing service.',
    },
    {
      id: 'work2',
      date: 'August 2024 - October 2025',
      title: 'Nol Derajat Film',
      subtitle: 'Staff HUMI',
      description: 'Organization about film and film making.',
    },
  ],
  studyExperiences: [
    {
      id: 'study1',
      date: 'August 2024 - Present',
      title: 'Universitas Brawijaya',
      subtitle: 'Studying in Animal Science',
      description: null,
    },
    {
      id: 'study2',
      date: 'August 2021 - Juli 2024',
      title: 'SMAN 1 Srengat',
      subtitle: 'Math and Science',
      description: null,
    },
  ],
  tools: [
    { name: 'Premiere Pro', iconUrl: 'https://www.adobe.com/content/dam/cc/icons/premiere.svg' },
    { name: 'DaVinci Resolve', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/90/DaVinci_Resolve_17_logo.svg' },
    { name: 'Affinity Designer', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Logo_AffinityDesigner.svg' },
    { name: 'Affinity Photo', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Logo_AffinityPhoto.svg' },
    { name: 'Figma', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg' },
    { name: 'Canva', iconUrl: 'https://upload.wikimedia.org/wikipedia/en/b/bb/Canva_Logo.svg' },
    { name: 'CapCut', iconUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a0/Capcut-logo.svg' },
  ],
  projects,
};
