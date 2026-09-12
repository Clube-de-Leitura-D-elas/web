import { Route, Routes } from 'react-router';
import { DefaultLayout } from './layouts/DefaultLayout';
import { Calendar } from './pages/Calendar';
import { Groups } from './pages/Groups';
import { Home } from './pages/Home';
import { Participants } from './pages/Participants';
import { Settings } from './pages/Settings';

export const App = () => (
  <Routes>
    <Route element={<DefaultLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/calendario" element={<Calendar />} />
      <Route path="/grupos" element={<Groups />} />
      <Route path="/participantes" element={<Participants />} />
      <Route path="/configuracoes" element={<Settings />} />
    </Route>

    {/* para páginas sem sidebar coloque aqui abaixo  */}
  </Routes>
);
