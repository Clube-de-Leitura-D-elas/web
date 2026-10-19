import type { SupabaseClient } from '@supabase/supabase-js';

// Substitui `src/services/supabaseClient.ts` em todos os testes (ver `moduleNameMapper` no
// jest.config.js). O `functions` é um objeto fixo, ao contrário do client real, que cria um novo
// a cada acesso — assim o teste consegue configurar e conferir as chamadas:
//
//   jest.mocked(supabase.functions.invoke).mockResolvedValue({ data, error: null });
export const supabase = {
  functions: { invoke: jest.fn() },
  auth: {
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChange: jest.fn(),
    getClaims: jest.fn(),
  },
} as unknown as SupabaseClient;
