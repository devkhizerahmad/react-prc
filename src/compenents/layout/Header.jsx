import { Link } from 'react-router-dom';
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <div className="logo">UI Practice</div>

        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/cards">Cards</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
