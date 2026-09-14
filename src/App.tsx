import { Route, Routes } from 'react-router';
import { DefaultLayout } from './layouts/DefaultLayout';
import { ParticipantDetails } from './pages/Participant';

export const App = () => (
  <Routes>
    <Route element={<DefaultLayout />}>
      {/* outras páginas com sidebar */}

      <Route path="/participantes/:participantId" element={<ParticipantDetails />} />
    </Route>

    {/* páginas sem sidebar */}
  </Routes>
);
