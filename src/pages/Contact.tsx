import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form would be processed here in a real application
    alert('Form submitted! In a real site, this would be connected to a backend or email service.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="pt-32 pb-16 min-h-screen">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Interested in working together? Fill out the form below and I'll get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact details */}
          <div className="lg:col-span-1">
            <div className="bg-dark-card border border-dark-border p-8 rounded-xl mb-8">
              <h2 className="text-2xl font-bold mb-6">Contact Info</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="text-accent-red mr-4 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="text-white font-medium mb-1">Email</h3>
                    <a href="mailto:hello@example.com" className="text-gray-400 hover:text-accent-red transition-colors">
                      hello@example.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="text-accent-red mr-4 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="text-white font-medium mb-1">Phone</h3>
                    <a href="tel:+15555555555" className="text-gray-400 hover:text-accent-red transition-colors">
                      +1 (555) 555-5555
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="text-accent-red mr-4 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="text-white font-medium mb-1">Location</h3>
                    <p className="text-gray-400">New York, NY</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-dark-card border border-dark-border p-8 rounded-xl">
              <h2 className="text-2xl font-bold mb-6">Project Inquiries</h2>
              <p className="text-gray-400 mb-4">
                Looking for video editing or graphic design services? Let's discuss your project needs.
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
                <li>Custom video editing</li>
                <li>Motion graphics</li>
                <li>Brand identity design</li>
                <li>Marketing materials</li>
              </ul>
              <p className="text-sm text-gray-500">
                Please provide project details in your message for a faster response.
              </p>
            </div>
          </div>
          
          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="bg-dark-card border border-dark-border p-8 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-300 mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="subject" className="block text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="Project Inquiry"
                />
              </div>
              
              <div className="mb-8">
                <label htmlFor="message" className="block text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="input resize-none"
                  placeholder="Tell me about your project..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="btn btn-primary w-full flex items-center justify-center"
              >
                <Send size={18} className="mr-2" />
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;