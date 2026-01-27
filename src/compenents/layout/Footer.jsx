import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Brand / About */}
        <div className="footer-col footer-brand">
          <div className="footer-logo">UI</div>
          <p className="footer-desc">
            Clean, modern UI components built with performance and scalability
            in mind.
          </p>
        </div>

        {/* Primary Links */}
        <div className="footer-col">
          <h4 className="footer-heading">Explore</h4>
          <ul className="footer-links">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/card">Cards</a>
            </li>
            <li>
              <a href="/blog">Blog</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
          </ul>
        </div>

        {/* Support / Legal */}
        <div className="footer-col">
          <h4 className="footer-heading">Support</h4>
          <ul className="footer-links">
            <li>
              <a href="/contact">Contact</a>
            </li>
            <li>
              <a href="/faq">FAQ</a>
            </li>
            <li>
              <a href="/privacy">Privacy Policy</a>
            </li>
            <li>
              <a href="/terms">Terms & Conditions</a>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div className="footer-col">
          <h4 className="footer-heading">Connect</h4>
          <ul className="footer-social">
            <li>
              <a href="#" aria-label="GitHub">
                GitHub
              </a>
            </li>
            <li>
              <a href="#" aria-label="LinkedIn">
                LinkedIn
              </a>
            </li>
            <li>
              <a href="#" aria-label="Twitter">
                Twitter
              </a>
            </li>
            <li>
              <a href="#" aria-label="Email">
                Email
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p>© 2026 UI. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
