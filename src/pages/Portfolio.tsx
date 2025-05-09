import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/projects';

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'video' | 'graphic'>('all');
  
  const filteredProjects = projects.filter(
    project => filter === 'all' || project.category === filter
  );

  return (
    <div className="min-h-screen py-24">
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Portfolio</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Browse through my complete collection of video editing and graphic design projects.
          </p>
        </motion.div>
        
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-dark-surface/50 backdrop-blur-sm rounded-full p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                filter === 'all'
                  ? 'bg-accent-red text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All Projects
            </button>
            <button
              onClick={() => setFilter('video')}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                filter === 'video'
                  ? 'bg-accent-red text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Video Editing
            </button>
            <button
              onClick={() => setFilter('graphic')}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                filter === 'graphic'
                  ? 'bg-accent-red text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Graphic Design
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;