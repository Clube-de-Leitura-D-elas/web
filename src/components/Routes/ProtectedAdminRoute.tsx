import { Navigate, Outlet } from 'react-router';
import { useEffect, useState } from 'react';
import { getProfileByCurrentUser, hasAdminRole } from '../../services/authService';

export default function ProtectedAdminRoute() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadRole() {
      try {
        const profile = await getProfileByCurrentUser();
        if (!active) return;
        setIsAdmin(hasAdminRole(profile?.app_role));
      } catch {
        if (!active) return;
        setIsAdmin(false);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadRole();

    return () => {
      active = false;
    };
  }, []);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
