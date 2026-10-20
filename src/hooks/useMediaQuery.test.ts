import { act, renderHook } from '@testing-library/react';
import { setMatchMedia } from '../test/matchMedia';
import { useMediaQuery } from './useMediaQuery';

const QUERY = '(max-width: 767px)';

describe('useMediaQuery', () => {
  it('diz se a media query bate', () => {
    setMatchMedia((query) => query === QUERY);

    const { result } = renderHook(() => useMediaQuery(QUERY));

    expect(result.current).toBe(true);
  });

  it('atualiza quando a tela muda de tamanho', () => {
    const { result } = renderHook(() => useMediaQuery(QUERY));
    expect(result.current).toBe(false);

    act(() => setMatchMedia(() => true));

    expect(result.current).toBe(true);
  });
});
