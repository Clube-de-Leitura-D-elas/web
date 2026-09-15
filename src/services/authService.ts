import { isAuthApiError } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import { AuthServiceError } from './authErrors';
import { ADMIN_ROLES, APP_ROLES, type AppRole } from '../types/auth';

export type LoginPayload = {
  email: string;
  password: string;
};

/** Troca o erro original por um erro de domínio, registrando o original só no console. */
function toAuthServiceError(error: unknown) {
  if (isAuthApiError(error) && error.code === 'invalid_credentials') {
    return new AuthServiceError('invalid_credentials', error);
  }

  console.error('[authService]', error);
  return new AuthServiceError('unknown', error);
}

export async function signInWithPassword(payload: LoginPayload) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  });

  if (error) {
    throw toAuthServiceError(error);
  }

  return data.user;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw toAuthServiceError(error);
  }
}

/** Avisa quando a sessão termina: logout (nesta ou em outra aba) ou token que não pôde ser renovado. */
export function onSignOut(callback: () => void) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') callback();
  });

  return () => subscription.unsubscribe();
}

const isAppRole = (value: unknown): value is AppRole =>
  typeof value === 'string' && APP_ROLES.has(value as AppRole);

/**
 * Papel da usuária logada, lido da claim `app_role` do token (preenchida pelo
 * `custom_access_token_hook` no banco). O `getClaims` valida a assinatura do token.
 * Uma mudança de papel só aparece aqui depois do próximo refresh do token.
 */
export async function getCurrentUserRole(): Promise<AppRole | null> {
  const { data, error } = await supabase.auth.getClaims();

  if (error) {
    throw toAuthServiceError(error);
  }

  if (!data) {
    throw new AuthServiceError('unauthenticated');
  }

  const appRole: unknown = data.claims.app_role;
  return isAppRole(appRole) ? appRole : null;
}

export function hasAdminRole(appRole?: AppRole | null) {
  return !!appRole && ADMIN_ROLES.has(appRole);
}
