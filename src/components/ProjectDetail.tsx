import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { projects } from '../data/projects';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <Link to="/portfolio" className="btn btn-primary">
            Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <Link to="/portfolio" className="inline-flex items-center text-gray-400 hover:text-accent-red mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          Back to Portfolio
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{project.title}</h1>
          
          <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-400">
            {project.client && (
              <div className="flex items-center">
                <User size={16} className="mr-2" />
                <span>Client: {project.client}</span>
              </div>
            )}
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              <span>Year: {project.year}</span>
            </div>
            <div className="flex items-center">
              <Tag size={16} className="mr-2" />
              <span>Role: {project.role}</span>
            </div>
          </div>

          {/* Main project content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left content */}
            <div className="lg:col-span-2">
              {project.category === 'video' && project.videoUrl && (
                <div className="w-full aspect-video bg-dark-surface mb-8 rounded-lg overflow-hidden">
                  <iframe
                    src={project.videoUrl}
                    allow="autoplay; fullscreen; picture-in-picture"
                    className="w-full h-full"
                    title={project.title}
                  ></iframe>
                </div>
              )}
              
              {project.category === 'graphic' && project.images && (
                <div className="grid grid-cols-1 gap-6 mb-8">
                  {project.images.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="overflow-hidden rounded-lg bg-dark-surface"
                    >
                      <img 
                        src={image} 
                        alt={`${project.title} - Image ${index + 1}`} 
                        className="w-full h-auto"
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Right content */}
            <div>
              <div className="card p-6 mb-8 sticky top-24">
                <h3 className="text-xl font-bold mb-4">Project Details</h3>
                <p className="text-gray-300 mb-6">{project.description}</p>
                
                <div className="mb-6">
                  <h4 className="text-sm text-gray-400 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1 rounded-full bg-dark-surface border border-dark-border text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Link to="/contact" className="btn btn-primary w-full text-center">
                  Discuss a Project
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetail;