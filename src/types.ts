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
  client?: string;
  year: number;
  role: string;
}