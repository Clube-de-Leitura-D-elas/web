import { FunctionsHttpError } from '@supabase/functions-js';

// Extrai a mensagem `{ error: "..." }` devolvida pela edge function, quando existir.
export async function readFunctionErrorMessage(error: unknown): Promise<string | null> {
  if (!(error instanceof FunctionsHttpError)) return null;

  try {
    const body = await error.context.json();
    return typeof body?.error === 'string' && body.error ? body.error : null;
  } catch {
    return null;
  }
}
