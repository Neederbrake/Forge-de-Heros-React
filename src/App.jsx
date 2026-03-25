import { Navigate, Route, Routes } from 'react-router-dom';
import GroupList from './pages/GroupList.jsx';
import GroupDetail from './pages/GroupDetail.jsx';
import CharacterList from './pages/CharacterList.jsx';
import CharacterDetail from './pages/CharacterDetail.jsx';
import Navigation from './components/Navigation.jsx';
import './App.css';

function App() {
  return (
    <div style={styles.app}>
      <h1 style={styles.title}>Forge de Heros</h1>
      <Navigation />
      <Routes>
        <Route path="/" element={<Navigate to="/parties" replace />} />
        <Route path="/parties" element={<GroupList />} />
        <Route path="/parties/:id" element={<GroupDetail />} />
        <Route path="/characters" element={<CharacterList />} />
        <Route path="/characters/:id" element={<CharacterDetail />} />
      </Routes>
    </div>
  );
}

const styles = {
  app: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '16px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    marginTop: '0',
    color: '#333',
  },
};

export default App;