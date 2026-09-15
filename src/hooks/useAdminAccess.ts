import { useEffect, useState } from 'react';
import { getCurrentUserRole, hasAdminRole, onSignOut } from '../services/authService';

export type AdminAccess = 'checking' | 'allowed' | 'denied';

/**
 * Diz se a usuária logada tem acesso ao painel de gestão.
 * Começa em `checking`, e volta para `denied` se a sessão terminar enquanto a tela está aberta.
 */
export const useAdminAccess = (): AdminAccess => {
  const [access, setAccess] = useState<AdminAccess>('checking');

  useEffect(() => {
    let active = true;

    async function checkAccess() {
      try {
        const appRole = await getCurrentUserRole();
        if (active) setAccess(hasAdminRole(appRole) ? 'allowed' : 'denied');
      } catch {
        if (active) setAccess('denied');
      }
    }

    checkAccess();

    const unsubscribe = onSignOut(() => {
      if (active) setAccess('denied');
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return access;
};
