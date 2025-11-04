import React from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";
import "./style/Contact.css";

function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-container">
        {/* Left: Form */}
        <div className="contact-form">
          <h1>Contact Us</h1>
          <p>Have a question or want to work together? Drop me a message!</p>
          <form>
            <div className="form-group">
              <input type="text" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Your Email" required />
            </div>
            <div className="form-group">
              <textarea rows="5" placeholder="Your Message" required></textarea>
            </div>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>

        {/* Right: Info */}
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>You can also reach out through these platforms:</p>
          <ul>
            <li><FaEnvelope /> contact@myapp.com</li>
            <li><FaPhoneAlt /> +91 98765 43210</li>
            <li><FaMapMarkerAlt /> New Delhi, India</li>
          </ul>

          <div className="social-links">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedin /></a>
            <a href="https://github.com" target="_blank" rel="noreferrer"><FaGithub /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
