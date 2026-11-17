import { AuthApiError, AuthWeakPasswordError } from '@supabase/supabase-js';
import { AuthServiceError } from './authErrors';
import {
  changePassword,
  getCurrentUserRole,
  hasAdminRole,
  onSignOut,
  signInWithPassword,
  signOut,
} from './authService';
import { supabase } from './supabaseClient';
import { clearCalendarCache } from './calendarService';

jest.mock('./calendarService', () => ({
  clearCalendarCache: jest.fn(),
}));

const auth = jest.mocked(supabase.auth);

const expectAuthError = async (promise: Promise<unknown>, code: AuthServiceError['code']) => {
  const error = await promise.catch((err: unknown) => err);
  expect(error).toBeInstanceOf(AuthServiceError);
  expect(error).toHaveProperty('code', code);
};

beforeEach(() => {
  jest.clearAllMocks();

  // Erros desconhecidos são registrados no console; aqui só poluiriam a saída.
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('signInWithPassword', () => {
  it('envia e-mail e senha e devolve a usuária', async () => {
    const user = { id: 'user-1' };
    auth.signInWithPassword.mockResolvedValue({ data: { user }, error: null } as never);

    await expect(signInWithPassword({ email: 'a@b.com', password: '123' })).resolves.toBe(user);
    expect(auth.signInWithPassword).toHaveBeenCalledWith({ email: 'a@b.com', password: '123' });
  });

  it('traduz credenciais inválidas para o código invalid_credentials', async () => {
    auth.signInWithPassword.mockResolvedValue({
      data: { user: null },
      error: new AuthApiError('Invalid login credentials', 400, 'invalid_credentials'),
    } as never);

    await expectAuthError(
      signInWithPassword({ email: 'a@b.com', password: 'x' }),
      'invalid_credentials',
    );
  });

  it('trata qualquer outro erro como unknown, sem expor a mensagem original', async () => {
    const original = new Error('network down');
    auth.signInWithPassword.mockResolvedValue({ data: { user: null }, error: original } as never);

    const error = await signInWithPassword({ email: 'a@b.com', password: 'x' }).catch((e) => e);

    expect(error).toBeInstanceOf(AuthServiceError);
    expect(error.code).toBe('unknown');
    expect(error.message).not.toContain('network');
    expect(error.cause).toBe(original);
  });
});

describe('signOut', () => {
  it('encerra a sessão e limpa o cache do calendário', async () => {
    auth.signOut.mockResolvedValue({ error: null });

    await expect(signOut()).resolves.toBeUndefined();

    expect(auth.signOut).toHaveBeenCalled();
    expect(clearCalendarCache).toHaveBeenCalledTimes(1);
  });

  it('lança erro de domínio quando o Supabase falha', async () => {
    auth.signOut.mockResolvedValue({ error: new Error('falhou') } as never);

    await expectAuthError(signOut(), 'unknown');

    expect(clearCalendarCache).not.toHaveBeenCalled();
  });
});

describe('onSignOut', () => {
  const setup = () => {
    const unsubscribe = jest.fn();
    let emit: (event: string) => void = () => {};
    auth.onAuthStateChange.mockImplementation((listener) => {
      emit = (event) => listener(event as never, null);
      return { data: { subscription: { unsubscribe } } } as never;
    });
    return { unsubscribe, emit: (event: string) => emit(event) };
  };

  it('avisa e limpa o cache somente quando o evento é SIGNED_OUT', () => {
    const { emit } = setup();
    const callback = jest.fn();

    onSignOut(callback);

    emit('TOKEN_REFRESHED');
    emit('SIGNED_IN');

    expect(callback).not.toHaveBeenCalled();
    expect(clearCalendarCache).not.toHaveBeenCalled();

    emit('SIGNED_OUT');

    expect(callback).toHaveBeenCalledTimes(1);
    expect(clearCalendarCache).toHaveBeenCalledTimes(1);
  });

  it('devolve uma função que cancela a assinatura', () => {
    const { unsubscribe } = setup();

    const stop = onSignOut(jest.fn());
    stop();

    expect(unsubscribe).toHaveBeenCalled();
  });
});

describe('getCurrentUserRole', () => {
  it('lê o papel da claim app_role', async () => {
    auth.getClaims.mockResolvedValue({
      data: { claims: { app_role: 'MANAGER' } },
      error: null,
    } as never);

    await expect(getCurrentUserRole()).resolves.toBe('MANAGER');
  });

  it('devolve null quando a claim não é um papel conhecido', async () => {
    auth.getClaims.mockResolvedValue({
      data: { claims: { app_role: 'ADMIN' } },
      error: null,
    } as never);

    await expect(getCurrentUserRole()).resolves.toBeNull();
  });

  it('lança unauthenticated quando não há sessão', async () => {
    auth.getClaims.mockResolvedValue({ data: null, error: null } as never);

    await expectAuthError(getCurrentUserRole(), 'unauthenticated');
  });

  it('lança erro de domínio quando o token não pode ser validado', async () => {
    auth.getClaims.mockResolvedValue({ data: null, error: new Error('jwt inválido') } as never);

    await expectAuthError(getCurrentUserRole(), 'unknown');
  });
});

describe('hasAdminRole', () => {
  it.each([
    ['MANAGER', true],
    ['FOUNDER', true],
    ['READER', false],
    [null, false],
    [undefined, false],
  ] as const)('%s → %s', (role, expected) => {
    expect(hasAdminRole(role)).toBe(expected);
  });
});

describe('changePassword', () => {
  const payload = { currentPassword: 'atual-123', newPassword: 'nova-senha-456' };

  beforeEach(() => {
    auth.getClaims.mockResolvedValue({
      data: { claims: { email: 'gestora@clube.com' } },
      error: null,
    } as never);
    auth.signInWithPassword.mockResolvedValue({ data: { user: {} }, error: null } as never);
    auth.updateUser.mockResolvedValue({ data: { user: {} }, error: null } as never);
  });

  it('confere a senha atual com o e-mail da sessão e grava a nova', async () => {
    await expect(changePassword(payload)).resolves.toBeUndefined();

    expect(auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'gestora@clube.com',
      password: 'atual-123',
    });
    expect(auth.updateUser).toHaveBeenCalledWith({ password: 'nova-senha-456' });
  });

  it('traduz senha atual errada para wrong_password e não troca', async () => {
    auth.signInWithPassword.mockResolvedValue({
      data: { user: null },
      error: new AuthApiError('Invalid login credentials', 400, 'invalid_credentials'),
    } as never);

    await expectAuthError(changePassword(payload), 'wrong_password');
    expect(auth.updateUser).not.toHaveBeenCalled();
  });

  it('traduz senha igual à atual para same_password', async () => {
    auth.updateUser.mockResolvedValue({
      data: { user: null },
      error: new AuthApiError('same', 422, 'same_password'),
    } as never);

    await expectAuthError(changePassword(payload), 'same_password');
  });

  it('traduz senha fraca para weak_password', async () => {
    auth.updateUser.mockResolvedValue({
      data: { user: null },
      error: new AuthWeakPasswordError('weak', 422, ['length']),
    } as never);

    await expectAuthError(changePassword(payload), 'weak_password');
  });

  it('falha como unauthenticated quando a sessão não tem e-mail', async () => {
    auth.getClaims.mockResolvedValue({ data: null, error: null } as never);

    await expectAuthError(changePassword(payload), 'unauthenticated');
    expect(auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it('trata outros erros como unknown', async () => {
    auth.updateUser.mockResolvedValue({
      data: { user: null },
      error: new AuthApiError('boom', 500, 'unexpected_failure'),
    } as never);

    await expectAuthError(changePassword(payload), 'unknown');
  });
});
