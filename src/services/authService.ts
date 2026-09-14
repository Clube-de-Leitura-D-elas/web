import { supabase } from './supabaseClient';
import type { AppRole, UserProfile } from '../types/auth';

export type LoginPayload = {
  email: string;
  password: string;
};

export async function signInWithPassword(payload: LoginPayload) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  });

  if (error) {
    throw error;
  }

  return data.user;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  return data.session;
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  return user;
}

export async function getProfileByCurrentUser(): Promise<UserProfile | null> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.access_token) {
    throw sessionError ?? new Error('Usuário não autenticado');
  }

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-user-profile`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    const payload = await response.json().catch(() => undefined);
    throw new Error(payload?.error ?? 'Não foi possível carregar o perfil');
  }

  const body = await response.json();
  return body.profile as UserProfile | null;
}

export function hasAdminRole(appRole?: AppRole) {
  return appRole === 'FOUNDER';
}
