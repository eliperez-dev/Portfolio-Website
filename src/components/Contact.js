import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to a backend service
    // For now, we'll create a mailto link
    const subject = encodeURIComponent(formData.subject || 'Portfolio Contact');
    const body = encodeURIComponent(
      `${formData.message}`
    );
    window.location.href = `mailto:eliperez0024@gmail.com?subject=${subject}&body=${body}`;
  };

  const contactInfo = [
    {
      icon: '',
      label: 'Email',
      value: 'eliperez0024@gmail.com',
      link: 'mailto:eliperez0024@gmail.com'
    },
    {
      icon: '',
      label: 'Location',
      value: 'San Diego, CA',
      link: null
    },
    {
      icon: '',
      label: 'LinkedIn',
      value: 'linkedin.com/in/eliperez-dev',
      link: 'https://www.linkedin.com/in/eliperez-dev/'
    },
    {
      icon: '',
      label: 'GitHub',
      value: 'github.com/eliperez-dev',
      link: 'https://github.com/eliperez-dev'
    }
  ];

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="section-header">
          <h2 className="code-heading">Get In Touch</h2>
          <p className="section-subtitle">
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="info-header">
              <h3>My Links</h3>
            </div>

            <div className="contact-methods">
              {contactInfo.map((info) => (
                <div key={info.label} className="contact-method">
                  <div className="method-icon">{info.icon}</div>
                  <div className="method-content">
                    <div className="method-label">{info.label}</div>
                    {info.link ? (
                      <a 
                        href={info.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="method-value link"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <div className="method-value">{info.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>

          <div className="contact-form-section">
            <div className="form-header">
              <h3>Send a Message</h3>
            </div>
              <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Message me! (Will open your email client)..."
                ></textarea>
              </div>

              <button type="submit" className="btn-primary submit-btn">
                <span>Send Message</span>
                <span className="send-icon">→</span>
              </button>
            </form>
          </div>
        </div>

        <div className="terminal-footer">
          <div className="terminal-content">
            <p>© 2025 Eli Perez</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;