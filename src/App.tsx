import { Route, Routes } from 'react-router';
import ProtectedAdminRoute from './components/Routes/ProtectedAdminRoute';
import { DefaultLayout } from './layouts/DefaultLayout';
import LoginPage from './pages/Login';

export const App = () => (
  <Routes>
    <Route element={<ProtectedAdminRoute />}>
      <Route path="/" element={<DefaultLayout />}>
        {/* para páginas com sidebar coloque aqui */}
      </Route>
    </Route>

    {/* para páginas sem sidebar coloque aqui*/}
    <Route path="/login" element={<LoginPage />} />
  </Routes>
);
