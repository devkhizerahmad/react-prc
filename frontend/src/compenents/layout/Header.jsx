import { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header({ isMenuOpen, setIsMenuOpen }) {
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">UI</div>

        <nav className={`nav ${isMenuOpen ? "open" : ""}`}>
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>
          <Link to="/card" onClick={closeMenu}>
            Cards
          </Link>
          <Link to="/about" onClick={closeMenu}>
            About
          </Link>
          <Link to="/contact" onClick={closeMenu}>
            Contact
          </Link>
          <Link to="/blog" onClick={closeMenu}>
            Blog
          </Link>
        </nav>

        <button
          className={`menu-button ${isMenuOpen ? "open" : ""}`}
          aria-label="Toggle menu"
          onClick={toggleMenu}
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>
    </header>
  );
}

export default Header;
