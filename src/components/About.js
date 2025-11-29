import React from 'react';
import './About.css';
import profileImage from '../pfp.jpeg';

const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2>About Me</h2>
            <div className="about-description">
              <p>
                I'm a <span className="education-highlight">Sophomore at Southwestern College</span> studying Computer Science. I started programming at 15 and fell in love with systems design—now I build full-stack applications in Rust, Python, and JavaScript.
              </p>
              
              <p>
                I'm most interested in <span className="rust-highlight">systems programming and Rust</span>. I've built RESTful APIs, custom CPU emulators, and embedded sensor drivers. I like working at all levels of the stack, from low-level assembly to high-level web frameworks.
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
                  <p>
                    I'm actively seeking a <span className="career-highlight"> Summer 2026 software engineering internship </span> where I can apply my unique blend of technical skill and mission-driven focus to a team building meaningful projects.
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
            <div className="profile-card">
              <img src={profileImage} alt="Eli Perez" className="profile-image" />
            </div>

            <div className="highlights"> 
              <div className="highlight-item">
                <div className="highlight-number">38.5K+</div>
                <div className="highlight-label">Data Points Served</div>
              </div>
              <div className="highlight-item">
                <div className="highlight-number">3K+</div>
                <div className="highlight-label">Monthly Users</div>
              </div>
              <div className="highlight-item">
                <div className="highlight-number">100K+</div>
                <div className="highlight-label">People Reached</div>
              </div>
              <div className="highlight-item">
                <div className="highlight-number">4+</div>
                <div className="highlight-label">Years Programming</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;