import { Navigate, Outlet } from 'react-router';
import { useAdminAccess } from '../../hooks/useAdminAccess';
import { locale } from '../../locales';

export default function ProtectedAdminRoute() {
  const access = useAdminAccess();

  if (access === 'checking') {
    return <div>{locale.auth.loading}</div>;
  }

  if (access === 'denied') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
