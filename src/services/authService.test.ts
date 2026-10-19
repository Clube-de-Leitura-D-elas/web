import { AuthApiError } from '@supabase/supabase-js';
import { AuthServiceError } from './authErrors';
import {
  getCurrentUserRole,
  hasAdminRole,
  onSignOut,
  signInWithPassword,
  signOut,
} from './authService';
import { supabase } from './supabaseClient';

const auth = jest.mocked(supabase.auth);

const expectAuthError = async (promise: Promise<unknown>, code: AuthServiceError['code']) => {
  const error = await promise.catch((err: unknown) => err);
  expect(error).toBeInstanceOf(AuthServiceError);
  expect(error).toHaveProperty('code', code);
};

beforeEach(() => {
  // erros desconhecidos são registrados no console; aqui só poluiriam a saída
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
  it('encerra a sessão', async () => {
    auth.signOut.mockResolvedValue({ error: null });

    await expect(signOut()).resolves.toBeUndefined();
    expect(auth.signOut).toHaveBeenCalled();
  });

  it('lança erro de domínio quando o Supabase falha', async () => {
    auth.signOut.mockResolvedValue({ error: new Error('falhou') } as never);

    await expectAuthError(signOut(), 'unknown');
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

  it('avisa só quando o evento é SIGNED_OUT', () => {
    const { emit } = setup();
    const callback = jest.fn();

    onSignOut(callback);
    emit('TOKEN_REFRESHED');
    emit('SIGNED_IN');
    expect(callback).not.toHaveBeenCalled();

    emit('SIGNED_OUT');
    expect(callback).toHaveBeenCalledTimes(1);
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
