import { Route, Routes } from 'react-router';
import { ProtectedAdminRoute } from './components/Routes/ProtectedAdminRoute';
import { DefaultLayout } from './layouts/DefaultLayout';
import { LoginPage } from './pages/Login';
import { NotFound } from './pages/NotFound';
import { ParticipantDetails } from './pages/Participant';
import { Participants } from './pages/Participants';
import { Groups } from './pages/Groups';

export const App = () => (
  <Routes>
    <Route element={<ProtectedAdminRoute />}>
      <Route path="/" element={<DefaultLayout />}>
        {/* para páginas com sidebar coloque aqui */}
        <Route path="/participantes" element={<Participants />} />
        <Route path="/participantes/:participantId" element={<ParticipantDetails />} />
        <Route path="/grupos" element={<Groups />} />
      </Route>
    </Route>

    {/* para páginas sem sidebar coloque aqui */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);
