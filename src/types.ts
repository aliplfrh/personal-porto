export interface Project {
  id: string;
  title: string;
  category: 'video' | 'graphic';
  thumbnail: string;
  description: string;
  tags: string[];
  videoUrl?: string;
  videoType?: 'youtube' | 'vimeo';
  streamableId?: string;
  images?: string[];
  thumbnailImage?: string; // Optional thumbnail image for video projects
  client?: string;
  year: number;
  role: string;
}