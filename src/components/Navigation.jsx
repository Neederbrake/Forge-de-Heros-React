import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav style={styles.nav}>
      <Link to="/parties" style={styles.link}>Groupes</Link>
      <Link to="/characters" style={styles.link}>Personnages</Link>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
    padding: '12px',
    backgroundColor: '#f5f5f5',
    borderRadius: '6px',
    borderBottom: '2px solid #ddd',
  },
  link: {
    color: '#1976d2',
    textDecoration: 'none',
    fontWeight: '600',
    padding: '8px 12px',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
  },
};

export default Navigation;
