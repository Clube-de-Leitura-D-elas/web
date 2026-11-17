import { isAuthApiError } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import { AuthServiceError, type AuthErrorCode } from './authErrors';
import { readFunctionErrorBody } from './functionError';
import { ADMIN_ROLES, APP_ROLES, type AppRole } from '../types/auth';
import { clearCalendarCache } from './calendarService';

export type LoginPayload = {
  email: string;
  password: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
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

const PASSWORD_ERROR_CODES: readonly AuthErrorCode[] = [
  'wrong_password',
  'same_password',
  'weak_password',
  'too_many_attempts',
];

export async function changePassword({ currentPassword, newPassword }: ChangePasswordPayload) {
  const { data, error } = await supabase.functions.invoke<{ changed: boolean }>(
    'change-password-web',
    { body: { current_password: currentPassword, new_password: newPassword } },
  );

  if (error) {
    const body = await readFunctionErrorBody(error);
    const code = PASSWORD_ERROR_CODES.find((known) => known === body?.code);
    if (code) throw new AuthServiceError(code, error);
    throw toAuthServiceError(error);
  }

  if (!data?.changed) throw toAuthServiceError(new Error('change-password-web returned no data'));
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw toAuthServiceError(error);
  }

  clearCalendarCache();
}

/** Avisa quando a sessão termina: logout (nesta ou em outra aba) ou token que não pôde ser renovado. */
export function onSignOut(callback: () => void) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') {
      clearCalendarCache();
      callback();
    }
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

export async function getCurrentUserProfile(): Promise<{
  name: string;
  photoUrl: string | null;
} | null> {
  const { data, error } = await supabase.functions.invoke('get-user-profile-web');

  if (error) {
    throw toAuthServiceError(error);
  }

  if (!data?.success || !data.profile) {
    return null;
  }

  return {
    name: data.profile.name ?? '',
    photoUrl: data.profile.photoUrl ?? null,
  };
}
