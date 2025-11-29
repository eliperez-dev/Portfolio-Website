import React, { useState, useEffect } from 'react';
import './Hero.css';

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = "Hello, I'm Eli Perez";

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  return (
    <section id="hero" className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-intro">
            <h1 className="hero-title">
              {displayText}
              <span className="cursor">|</span>
            </h1>
            <p className="hero-role">Full-Stack Engineer • Rust • Systems Programming</p>
            <p className="hero-meta">
              Software Engineer Intern at Fish Defender | Sophomore at Southwestern College
            </p>
            <p className="hero-description">
              I build full-stack applications in Rust, Python, and JavaScript, from RESTful APIs to custom CPU architectures. Currently seeking <span className="rust-highlight">Summer 2026 internships</span>.
            </p>
          </div>
          
          <div className="hero-actions">
            <a href="#projects" className="btn-secondary">
              View My Work
            </a>
            <a href="#contact" className="btn-secondary">
              Get In Touch
            </a>
            <a 
              href="/PerezEli_Resume_2025.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Download Resume
            </a>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="skills-showcase">
            <div className="skill-category">
              <h4>Core Skills</h4>
              <div className="skill-list">
                <span>Rust</span>
                <span>Systems Programming</span>
                <span>Full-Stack Development</span>
              </div>
            </div>
            <div className="skill-category">
              <h4>Languages & Tools</h4>
              <div className="skill-list">
                <span>Python</span>
                <span>TypeScript</span>
                <span>Assembly</span>
                <span>Embedded Rust</span>
              </div>
            </div>
            <div className="skill-category">
              <h4>Experience</h4>
              <div className="skill-list">
                <span>REST APIs</span>
                <span>CPU Architecture</span>
                <span>Geospatial Mapping</span>
                <span>IoT Systems</span>
                <span>AI Integration</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;