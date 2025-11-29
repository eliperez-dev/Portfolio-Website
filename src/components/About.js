import React from 'react';
import './About.css';
import profileImage from '../pfp.jpeg';

const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2 className="code-heading">About Me</h2>
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-buttons">
                  <span className="btn-red"></span>
                  <span className="btn-yellow"></span>
                  <span className="btn-green"></span>
                </div>
                <div className="terminal-title">eli@portfolio:~$ cat about_me.txt</div>
              </div>
              <div className="terminal-content">
                <div className="about-description">
                  <p>
                    I'm a mission driven software engineer, currently studying computer science at <span className="education-highlight">Southwestern Community College </span>.
                    My journey in programming started at the age of 15, with my facination of low-level computing and systems design,
                    which has since evolved into a passion for building impactful software solutions.
                  </p>
                  
                  <p>
                    What sets me apart is my deep love for <span className="rust-highlight">systems programming</span> and 
                    <span className="rust-highlight"> Rust</span>. I've built everything from RESTful APIs serving thousands 
                    of users to <span className="rust-highlight">entiely custom 8-bit microcontrollers</span>  with complete instruction sets. I enjoy working at all levels of the stack, 
                    from low-level assembly to high level web frameworks.
                  </p>


                  <p>My open-source project, <span className="organization-highlight">"Until Every Cage is Empty"</span>,
                    is making a significant real-world impact by providing a critical data resource
                    to animal rights <span className="organization-highlight">
                      activists</span>, <span className="organization-highlight">
                      researchers</span>, and <span className="organization-highlight">
                      organizations</span>. Its value to the community has been recognized through features in vegan newsletters and promotions by major activist organizations,
                    including <span className="organization-highlight">PETA and CAFT</span>.</p>
                    
                    <p> 
                    As the lead engineer,
                    I developed this full-stack application in <span className="rust-highlight">Rust + Vanilla JS</span> to serve over <span className="achievement-highlight">38,000 data points</span> to more than <span className="achievement-highlight">3,000 monthly users</span>,
                    creating the first-of-its-kind global database that exposes the scale of the animal agriculture industry.
                    The project's potential for direct, tangible impact was also recently recognized by The Pollination Project Foundation,
                    which awarded it a competitive <span className="achievement-highlight">$1,000 seed grant</span> to support its continued development.
                    </p>
                </div>
              </div>
            </div>

            {/* <div className="achievements">
              <h3>Recent Achievements</h3>
              <ul>
                <li>
                  <span className="achievement-icon">🚀</span>
                  <div>
                    <strong>Open Source Impact</strong>
                    <p>Built mapping application serving 22,000+ data points to global users</p>
                  </div>
                </li>
                <li>
                  <span className="achievement-icon">🏆</span>
                  <div>
                    <strong>AP Computer Science Exam</strong>
                    <p>Achieved highest possible score (5) -- self studied</p>
                  </div>
                </li>
                <li>
                  <span className="achievement-icon">🎺</span>
                  <div>
                    <strong>Sweetwater District Honors Band</strong>
                    <p>First Chair Trumpet for 2 years, 6 years total participation</p>
                  </div>
                </li>
              </ul>
            </div> */}
          </div>

          <div className="about-visual">
            <div className="stats-card">
              <div className="terminal-header">
                <div className="terminal-buttons">
                  <span className="btn-red"></span>
                  <span className="btn-yellow"></span>
                  <span className="btn-green"></span>
                </div>
                <div className="terminal-title">me.jpeg</div>
              </div>
              <div className="stats-content">
                <img src={profileImage} alt="Eli Perez" className="profile-image" />
              </div>
            </div>

            <div className="quick-facts">
              <div className="fact-item">
                <div className="fact-number">38K+</div>
                <div className="fact-label">Data Points Served</div>
              </div>
              <div className="fact-item">
                <div className="fact-number">4+</div>
                <div className="fact-label">Years Programming</div>
              </div>
              <div className="fact-item">
                <div className="fact-number">3,000+</div>
                <div className="fact-label">Monthly users</div>
              </div>
              <div className="fact-item">
                <div className="fact-number">High-Impact</div>
                <div className="fact-label">Crowd Sourced Projects</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;