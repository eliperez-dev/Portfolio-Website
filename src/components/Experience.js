import React from 'react';
import './Experience.css';

const Experience = () => {
  const experiences = [
    {
      id: 2,
      title: "Lead Embedded Software Engineer",
      company: "IEEE Student Branch at Southwestern College",
      period: "November 2025 - Present",
      location: "Chula Vista, CA",
      description: "Spearheading the technical strategy for the chapter's Embedded Systems division, preparing for 2026 autonomous robotics competitions.",
      highlights: [
        "System Architecture: Defining the software roadmap for autonomous aerial robotics and ensuring memory safety and concurrency in flight control systems.",
        "Hardware Selection: Leading the evaluation and integration planning for flight controllers, IMUs, and sensor fusion hardware.",
        "Team Enablement: Establishing development standards and organizing technical workshops to prepare the engineering team for collaborative firmware development."
      ]
    },
    {
      id: 1,
      title: "Software Engineer Intern",
      company: "Fish Defender",
      period: "October 2025 - December 2025",
      location: "Remote",
      description: "Building a serverless mapping application to help activists find fish-friendly dive locations.",
      highlights: [
        "Vanilla JS frontend for visualizing and filtering data points",
        "Serverless backend on Cloudflare Workers",
        "Google Sheets API integration for data management",
        "Technical roadmap and delivery timeline management"
      ],
    }
  ];

  const education = {
    school: "Southwestern College", 
    location: "Chula Vista, CA",
    degree: "A.S. in Computer Science (For transfer)",
    period: "Expected May 2026",
    gpa: "3.41 GPA",
    highlights: [
      "Data Structures & Algorithms",
      "Object-Oriented Programming", 
      "Computer Architecture"
    ]
  };

  return (
    <section id="experience" className="experience">
      <div className="container">
        <div className="section-header">
          <h2 className="code-heading">Experience & Education</h2>
        </div>

        <div className="experience-content">
          {/* Professional Experience */}
          <div className="subsection">
            <h3>Work Experience</h3>
            <div className="cards-grid">
              {experiences.map((exp) => (
                <div key={exp.id} className="info-card">
                  <div className="card-header">
                    <h4 className="card-title">{exp.title}</h4>
                    <p className="card-subtitle">{exp.company}</p>
                  </div>
                  
                  <div className="card-meta">
                    <span>{exp.period}</span>
                    <span>{exp.location}</span>
                  </div>

                  <p className="card-description">{exp.description}</p>

                  <ul className="highlights-list">
                    {exp.highlights.map((highlight, i) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="subsection">
            <h3>Education</h3>
            <div className="cards-grid">
              <div className="info-card">
                <div className="card-header">
                  <h4 className="card-title">{education.school}</h4>
                  <p className="card-subtitle">{education.degree}</p>
                </div>
                
                <div className="card-meta">
                  <span>{education.period}</span>
                  <span>{education.location}</span>
                  <span className="gpa-badge">{education.gpa}</span>
                </div>

                <div className="highlights-section">
                  <p className="highlights-label">Key Courses:</p>
                  <ul className="highlights-list">
                    {education.highlights.map((highlight, i) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Experience;