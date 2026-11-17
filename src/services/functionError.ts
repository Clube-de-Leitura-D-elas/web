import { FunctionsHttpError } from '@supabase/functions-js';

export async function readFunctionErrorBody(
  error: unknown,
): Promise<Record<string, unknown> | null> {
  if (!(error instanceof FunctionsHttpError)) return null;

  try {
    const body: unknown = await error.context.json();
    return body !== null && typeof body === 'object' ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

// Extrai a mensagem `{ error: "..." }` devolvida pela edge function, quando existir.
export async function readFunctionErrorMessage(error: unknown): Promise<string | null> {
  const body = await readFunctionErrorBody(error);
  return typeof body?.error === 'string' && body.error ? body.error : null;
}
