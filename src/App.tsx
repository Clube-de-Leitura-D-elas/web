import { Route, Routes } from 'react-router';
import { ProtectedAdminRoute } from './components/Routes/ProtectedAdminRoute';
import { DefaultLayout } from './layouts/DefaultLayout';
import { LoginPage } from './pages/Login';
import { NotFound } from './pages/NotFound';

export const App = () => (
  <Routes>
    <Route element={<ProtectedAdminRoute />}>
      <Route path="/" element={<DefaultLayout />}>
        {/* para páginas com sidebar coloque aqui */}
      </Route>
    </Route>

    {/* para páginas sem sidebar coloque aqui*/}
    <Route path="/login" element={<LoginPage />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);
