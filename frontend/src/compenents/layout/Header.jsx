import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { useAppSelector } from "../../app/hooks";
import { useLogoutMutation } from "../../features/auth/authApi";

function Header({ isMenuOpen, setIsMenuOpen }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state?.auth);
  const [logout] = useLogoutMutation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      closeMenu();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">UI</div>

        <nav className={`nav ${isMenuOpen ? "open" : ""}`}>
          {!isAuthenticated ? (
            <>
              <Link to="/login" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/signup" onClick={closeMenu}>
                Signup
              </Link>
            </>
          ) : (
            <>
              <Link to="/" onClick={closeMenu}>
                Home
              </Link>
              <Link to="/card" onClick={closeMenu}>
                Cards
              </Link>
              <Link className="logout-btn" onClick={handleLogout}>
                Logout
              </Link>
            </>
          )}
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
