import { Route, Routes } from 'react-router';
import { DefaultLayout } from './layouts/DefaultLayout';

export const App = () => (
  <Routes>
    <Route element={<DefaultLayout />}>{/* para páginas com sidebar coloque aqui */}</Route>

    {/* para páginas sem sidebar coloque aqui*/}
  </Routes>
);
