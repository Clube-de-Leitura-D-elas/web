import { Route, Routes } from 'react-router';
import ProtectedAdminRoute from './components/Routes/ProtectedAdminRoute.tsx';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home.tsx';
import NotFound from './pages/NotFound.tsx';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedAdminRoute />}>
        <Route path="/admin" element={<AdminPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
