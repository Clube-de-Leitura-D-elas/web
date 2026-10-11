export type GroupErrorCode = 'duplicate_number' | 'unknown';

/**
 * Erro de domínio dos grupos. A mensagem é genérica de propósito: o erro original
 * fica só em `cause`, para depuração, e nunca chega à tela.
 */
export class GroupServiceError extends Error {
  readonly code: GroupErrorCode;

  constructor(code: GroupErrorCode, cause?: unknown) {
    super(`groups/${code}`, { cause });
    this.name = 'GroupServiceError';
    this.code = code;
  }
}
