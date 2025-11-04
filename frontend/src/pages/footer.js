// src/pages/footer.js
import React from 'react';
import './style/footer.css';

// ✅ Importing images from src/images folder
import visaImg from '../images/visa.png';
import mastercardImg from '../images/mastercard.png';
import paytmImg from '../images/paytm.png';
import upiImg from '../images/upi.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Company Info */}
        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/careers">Careers</a></li>
            <li><a href="/blog">Blog</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className="footer-section">
          <h4>Customer Service</h4>
          <ul>
            <li><a href="/faq">FAQs</a></li>
            <li><a href="/returns">Return Policy</a></li>
            <li><a href="/shipping">Shipping Info</a></li>
            <li><a href="/track">Track Order</a></li>
            <li><a href="/payments">Payment Methods</a></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/men">Men</a></li>
            <li><a href="/women">Women</a></li>
            <li><a href="/kids">Kids</a></li>
            <li><a href="/sale">Sale</a></li>
            <li><a href="/new">New Arrivals</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-section">
          <h4>Subscribe</h4>
          <p>Get latest offers & updates</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe</button>
          </form>

          {/* Social Icons */}
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">
        <p>© 2025 Mahakalbhakt. All rights reserved.</p>
        <div className="payment-icons">
          <img src={visaImg} alt="Visa" className="payment-icon visa-icon" />
          <img src={mastercardImg} alt="MasterCard" className="payment-icon mastercard-icon" />
          <img src={paytmImg} alt="Paytm" className="payment-icon paytm-icon" />
          <img src={upiImg} alt="UPI" className="payment-icon upi-icon" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
