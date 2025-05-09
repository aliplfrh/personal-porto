import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Tag, ExternalLink } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const renderVideo = () => {
    if (!project.streamableId) return null;

    return (
      <div className="space-y-4">
        <div className="rounded-lg overflow-hidden bg-dark-surface">
          {project.thumbnailImage && (
            <div className="w-full">
              <img
                src={project.thumbnailImage}
                alt={`${project.title} thumbnail`}
                className="w-full h-auto"
              />
            </div>
          )}
          <div className="aspect-video">
            <iframe
              src={`https://streamable.com/e/${project.streamableId}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={project.title}
            />
          </div>
        </div>
        <a
          href={`https://streamable.com/${project.streamableId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-accent-red hover:text-accent-red-light transition-colors"
        >
          <span className="mr-2">Preview</span>
          <ExternalLink size={16} />
        </a>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={handleContentClick}
            className="bg-dark-card border border-dark-border rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 z-10 bg-dark-card/80 backdrop-blur-sm border-b border-dark-border p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">{project.title}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-dark-surface rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-8">
                {project.category === 'video' ? (
                  renderVideo()
                ) : (
                  project.images && (
                    <div className="grid gap-4">
                      {project.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${project.title} - Image ${index + 1}`}
                          className="w-full h-auto rounded-lg"
                        />
                      ))}
                    </div>
                  )
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">About the Project</h3>
                  <p className="text-gray-300">{project.description}</p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
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

                <div>
                  <h3 className="text-sm font-semibold mb-2">Technologies & Tools</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-dark-surface border border-dark-border rounded-full text-sm text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;