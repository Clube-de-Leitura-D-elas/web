import type { SupabaseClient } from '@supabase/supabase-js';

// Usado pelo Storybook no lugar do client real, que exige as variáveis de ambiente do Supabase.
// Os services que dependem dele também são mockados em .storybook/preview.tsx.
export const supabase = {} as SupabaseClient;
