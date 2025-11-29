import React, { useState, useEffect } from 'react';
import './Projects.css';
import ImageGallery from './ImageGallery';
import projectsData from '../data/projects.json';

const Projects = () => {
  const [activeProject, setActiveProject] = useState(0);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const loadGalleries = async () => {
      const updatedProjects = await Promise.all(
        projectsData.map(async (project) => {
          if (project.galleryFolder) {
            try {
              const response = await fetch(`/galleries/${project.galleryFolder}/index.json`);
              const data = await response.json();
              const gallery = data.images.map(
                (img) => `/galleries/${project.galleryFolder}/${img}`
              );
              return { ...project, gallery };
            } catch (error) {
              console.error(`Failed to load gallery for ${project.galleryFolder}:`, error);
              return { ...project, gallery: [] };
            }
          }
          return project;
        })
      );
      setProjects(updatedProjects);
    };

    loadGalleries();
  }, []);



  return (
    <section id="projects" className="projects">
      <div className="container">
        <div className="section-header">
          <h2 className="code-heading">Featured Projects</h2>
        </div>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <div 
              key={project.id} 
              className={`project-card ${activeProject === index ? 'active' : ''}`}
              onClick={() => setActiveProject(index)}
            >
              <div className="project-media">
                {project.gallery && project.gallery.length > 0 ? (
                  <ImageGallery 
                    images={project.gallery}
                    altText={project.title}
                  />
                ) : (
                  <div className="placeholder-container">
                    <div className="placeholder-content">
                      <span className="placeholder-text">
                        {project.title}
                      </span>
                      <small className="placeholder-note">
                        Gallery images coming soon
                      </small>
                    </div>
                  </div>
                )}
              </div>

              <div className="project-content">
                <div className="project-header">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-subtitle">{project.subtitle}</p>
                </div>

                <p className="project-description">{project.description}</p>

                <div className="project-features">
                  <h4>Key Features:</h4>
                  <ul>
                    {project.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="project-tech">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="tech-tag">{tech}</span>
                  ))}
                </div>

                <div className="project-links">
                  {project.links.live && (
                    <a 
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      Live Website
                    </a>
                  )}
                  <a 
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    View Code
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;