import { Route, Routes } from 'react-router';
import { DefaultLayout } from './layouts/DefaultLayout';
import { NotFound } from './pages/NotFound';

export const App = () => (
  <Routes>
    <Route element={<DefaultLayout />}>{/* para páginas com sidebar coloque aqui */}</Route>

    {/* para páginas sem sidebar coloque aqui*/}
    <Route path="*" element={<NotFound />} />
  </Routes>
);
