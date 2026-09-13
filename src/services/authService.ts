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
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw userError ?? new Error('Usuário não autenticado');
  }

  const { data, error } = await supabase
    .from('users')
    .select('id, user_id, name, email, app_role')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as UserProfile | null;
}

export function hasAdminRole(appRole?: AppRole) {
  return appRole === 'MANAGER' || appRole === 'FOUNDER';
}
