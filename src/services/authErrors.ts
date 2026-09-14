export type AuthErrorCode = 'invalid_credentials' | 'unauthenticated' | 'unknown';

/**
 * Erro de domínio da autenticação. A mensagem é genérica de propósito: o erro original
 * (Supabase, edge function) fica só em `cause`, para depuração, e nunca chega à tela.
 */
export class AuthServiceError extends Error {
  readonly code: AuthErrorCode;

  constructor(code: AuthErrorCode, cause?: unknown) {
    super(`auth/${code}`, { cause });
    this.name = 'AuthServiceError';
    this.code = code;
  }
}
