import { act, renderHook, waitFor } from '@testing-library/react';
import { AuthServiceError } from '../services/authErrors';
import { getCurrentUserRole, onSignOut } from '../services/authService';
import { pending } from '../test/render';
import { useAdminAccess } from './useAdminAccess';

jest.mock('../services/authService', () => ({
  ...jest.requireActual('../services/authService'),
  getCurrentUserRole: jest.fn(),
  onSignOut: jest.fn(),
}));

let emitSignOut: () => void;
const unsubscribe = jest.fn();

beforeEach(() => {
  jest.mocked(onSignOut).mockImplementation((listener) => {
    emitSignOut = listener;
    return unsubscribe;
  });
});

describe('useAdminAccess', () => {
  it('começa em checking enquanto o papel é consultado', () => {
    jest.mocked(getCurrentUserRole).mockReturnValue(pending());

    const { result } = renderHook(() => useAdminAccess());

    expect(result.current).toBe('checking');
  });

  it.each(['MANAGER', 'FOUNDER'] as const)('libera o acesso para %s', async (role) => {
    jest.mocked(getCurrentUserRole).mockResolvedValue(role);

    const { result } = renderHook(() => useAdminAccess());

    await waitFor(() => expect(result.current).toBe('allowed'));
  });

  it('nega o acesso para leitora', async () => {
    jest.mocked(getCurrentUserRole).mockResolvedValue('READER');

    const { result } = renderHook(() => useAdminAccess());

    await waitFor(() => expect(result.current).toBe('denied'));
  });

  it('nega o acesso quando não há sessão', async () => {
    jest.mocked(getCurrentUserRole).mockRejectedValue(new AuthServiceError('unauthenticated'));

    const { result } = renderHook(() => useAdminAccess());

    await waitFor(() => expect(result.current).toBe('denied'));
  });

  it('volta para denied quando a sessão termina com a tela aberta', async () => {
    jest.mocked(getCurrentUserRole).mockResolvedValue('MANAGER');
    const { result } = renderHook(() => useAdminAccess());
    await waitFor(() => expect(result.current).toBe('allowed'));

    act(() => emitSignOut());

    expect(result.current).toBe('denied');
  });

  it('cancela a assinatura do logout ao desmontar', () => {
    jest.mocked(getCurrentUserRole).mockReturnValue(pending());

    const { unmount } = renderHook(() => useAdminAccess());
    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });
});
