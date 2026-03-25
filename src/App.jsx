import { Navigate, Route, Routes, Link } from 'react-router-dom';
import ListeGroupe from './pages/ListeGroupe.jsx';
import DetailGroupe from './pages/DetailGroupe.jsx';
import ListePersonnage from './pages/ListePersonnage.jsx';
import DetailPersonnage from './pages/DetailPersonnage.jsx';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Forge de Héros</h1>
        <nav className="main-nav">
          <Link to="/personnages" className="nav-link">Personnages</Link>
          <Link to="/groupes" className="nav-link">Groupes</Link>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/personnages" replace />} />
          <Route path="/personnages" element={<ListePersonnage />} />
          <Route path="/personnages/:id" element={<DetailPersonnage />} />
          <Route path="/groupes" element={<ListeGroupe />} />
          <Route path="/groupes/:id" element={<DetailGroupe />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;