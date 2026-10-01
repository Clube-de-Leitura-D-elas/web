import { supabase } from './supabaseClient';

export async function invokeGet<T>(
  name: string,
  params: Record<string, string | number>,
): Promise<T> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '') query.set(key, String(value));
  });

  const { data, error } = await supabase.functions.invoke<T>(`${name}?${query}`, {
    method: 'GET',
  });
  if (error) throw error;
  return data as T;
}
