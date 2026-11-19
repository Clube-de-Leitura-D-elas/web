import { FunctionsHttpError } from '@supabase/functions-js';

type FunctionErrorBody = Record<string, unknown> | null;

const parsedBodies = new WeakMap<FunctionsHttpError, Promise<FunctionErrorBody>>();

const parseBody = async (error: FunctionsHttpError): Promise<FunctionErrorBody> => {
  try {
    const body: unknown = await error.context.json();
    return body !== null && typeof body === 'object' ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
};

export function readFunctionErrorBody(error: unknown): Promise<FunctionErrorBody> {
  if (!(error instanceof FunctionsHttpError)) return Promise.resolve(null);

  let body = parsedBodies.get(error);
  if (!body) {
    body = parseBody(error);
    parsedBodies.set(error, body);
  }
  return body;
}

// Extrai a mensagem `{ error: "..." }` devolvida pela edge function, quando existir.
export async function readFunctionErrorMessage(error: unknown): Promise<string | null> {
  const body = await readFunctionErrorBody(error);
  return typeof body?.error === 'string' && body.error ? body.error : null;
}
