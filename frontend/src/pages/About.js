import React from "react";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";
import developerImg from "../images/developer.jpg";
import "./style/About.css"; // external CSS
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="about-page">
      <div className="about-container">
        <img src={developerImg} alt="MERN Developer" className="profile-img" />

        <div className="about-text">
          <h1>About Us</h1>
          <h2>Hi, I'm a MERN Stack Developer</h2>
          <p>
            Welcome to our eCommerce platform! I specialize in building fast,
            secure, and scalable applications using the MERN stack — MongoDB,
            Express.js, React, and Node.js.
          </p>
          <p>
            This project focuses on delivering smooth, modern shopping
            experiences with smart backend logic and clean user interfaces.
            My goal is to turn great ideas into fully functional and beautiful
            products that people love to use.
          </p>

      <Link to="/contact"className="cta-btn">Contact</Link>

          <div className="social-links">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <FaLinkedin />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <FaGithub />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
