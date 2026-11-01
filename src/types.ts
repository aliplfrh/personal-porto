export type ProjectCategory = 'graphic-design' | 'video-editing' | 'videographer';

export const PROJECT_CATEGORIES: { value: ProjectCategory; label: string }[] = [
  { value: 'graphic-design', label: 'Graphic design' },
  { value: 'video-editing', label: 'Video Editing' },
  { value: 'videographer', label: 'Videographer' },
];

export interface Project {
  id: string;
  title: string;
  categories: ProjectCategory[];
  thumbnail: string;
  description: string;
  tags: string[];
  videoUrl?: string;
  videoType?: 'youtube' | 'vimeo';
  streamableId?: string;
  thumbnailImage?: string;
  images?: string[];
  client?: string;
  year: number | string;
  role: string;
}