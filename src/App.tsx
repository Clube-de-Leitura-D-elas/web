import { Route, Routes } from 'react-router';
import Books from './pages/example_books/index.tsx';
import Home from './pages/Home.tsx';
import NotFound from './pages/NotFound.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/livros" element={<Books />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
