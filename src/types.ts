export interface Project {
  id: string;
  title: string;
  category: 'video' | 'graphic';
  thumbnail: string;
  description: string;
  tags: string[];
  videoUrl?: string;
  videoType?: 'youtube' | 'vimeo';
  images?: string[];
  thumbnailImage?: string;
  client?: string;
  year: number;
  role: string;
}