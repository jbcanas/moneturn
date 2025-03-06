import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Books } from './pages/books';
import { Authors } from './pages/authors';
import { SearchResults } from './pages/search-results';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/books" element={<Books />} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/" element={<Navigate to="/books" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
