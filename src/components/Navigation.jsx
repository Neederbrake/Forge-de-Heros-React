import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <nav className="main-nav">
      <Link to="/parties" className="main-nav-link">Groupes</Link>
      <Link to="/characters" className="main-nav-link">Personnages</Link>
    </nav>
  );
}

export default Navigation;
