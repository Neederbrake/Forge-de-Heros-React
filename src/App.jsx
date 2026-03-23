import { Navigate, Route, Routes } from 'react-router-dom';
import ListeGroupe from './pages/ListeGroupe.jsx';
import DetailGroupe from './pages/DetailGroupe.jsx';
import './App.css';

function App() {
  return (
    <div className="app">
      <h1>Forge de Heros</h1>
      <Routes>
        <Route path="/" element={<Navigate to="/groupes" replace />} />
        <Route path="/groupes" element={<ListeGroupe />} />
        <Route path="/groupes/:id" element={<DetailGroupe />} />
      </Routes>
    </div>
  );
}

export default App;