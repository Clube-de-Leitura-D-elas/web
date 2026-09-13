import { Route, Routes } from 'react-router';
import { DefaultLayout } from './layouts/DefaultLayout';
import { Participants } from './pages/Participants';

export const App = () => (
  <Routes>
    <Route element={<DefaultLayout />}>
      {/* para páginas com sidebar coloque aqui */}
      <Route path="/participantes" element={<Participants />} />
    </Route>

    {/* para páginas sem sidebar coloque aqui*/}
  </Routes>
);
