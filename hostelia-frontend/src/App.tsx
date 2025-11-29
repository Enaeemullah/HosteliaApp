import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import Dashboard from './pages/Dashboard';
import HostelsPage from './pages/Hostels';
import RoomsPage from './pages/Rooms';
import StudentsPage from './pages/Students';
import FeePage from './pages/Fees';
import ClientReleases from './pages/ClientReleases';
import { ProtectedRoute } from './components/ProtectedRoute';

const App = () => (
  <Routes>
    <Route path="/releases" element={<ClientReleases />} />
    <Route path="/signin" element={<SignIn />} />
    <Route path="/signup" element={<SignUp />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/hostels" element={<HostelsPage />} />
      <Route path="/rooms" element={<RoomsPage />} />
      <Route path="/students" element={<StudentsPage />} />
      <Route path="/fees" element={<FeePage />} />
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default App;
