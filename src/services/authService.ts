import { isAuthApiError } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import { AuthServiceError } from './authErrors';
import { ADMIN_ROLES, type AppRole, type UserProfile } from '../types/auth';

export type LoginPayload = {
  email: string;
  password: string;
};

type UserProfileResponse = {
  profile: UserProfile | null;
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

export async function getProfileByCurrentUser(): Promise<UserProfile | null> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw toAuthServiceError(sessionError);
  }

  if (!session) {
    throw new AuthServiceError('unauthenticated');
  }

  // O invoke já envia o token da sessão e resolve a URL a partir do client.
  const { data, error } = await supabase.functions.invoke<UserProfileResponse>('get-user-profile', {
    method: 'GET',
  });

  if (error) {
    throw toAuthServiceError(error);
  }

  return data?.profile ?? null;
}

export function hasAdminRole(appRole?: AppRole) {
  return !!appRole && ADMIN_ROLES.has(appRole);
}
