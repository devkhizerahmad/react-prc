import { Link } from 'react-router-dom';
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <div className="logo">UI</div>

        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/cards">Cards</Link>
        </nav>
        <button className='menu-button'>☰</button> 
      </div>
    </header>
  );
}

export default Header;
