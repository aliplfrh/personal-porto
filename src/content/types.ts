import { Project } from '../types';

export interface ExperienceEntry {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  description?: string | null;
}

export interface ToolEntry {
  name: string;
  iconUrl: string;
}

export interface SiteContent {
  hero: {
    greeting: string;
    status: string;
    bio: string;
  };
  about: {
    bioParagraphs: string[];
  };
  workExperiences: ExperienceEntry[];
  studyExperiences: ExperienceEntry[];
  tools: ToolEntry[];
  projects: Project[];
}
