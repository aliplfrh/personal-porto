import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Project } from '../types';
import { Film, Image } from 'lucide-react';
import ProjectModal from './ProjectModal';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{ y: -8, transition: { duration: 0.3 } }}
        className="card group cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative overflow-hidden aspect-video">
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
          <div className="absolute top-4 right-4 bg-dark-bg/80 backdrop-blur-sm p-2 rounded-full">
            {project.category === 'video' ? (
              <Film size={18} className="text-accent-red" />
            ) : (
              <Image size={18} className="text-accent-red" />
            )}
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent-red transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 rounded-full bg-dark-surface border border-dark-border text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      <ProjectModal
        project={project}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ProjectCard;