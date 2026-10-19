import { act, renderHook } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('devolve o valor inicial na hora', () => {
    const { result } = renderHook(() => useDebounce('a'));

    expect(result.current).toBe('a');
  });

  it('só atualiza depois do atraso', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'ab' });
    act(() => jest.advanceTimersByTime(299));
    expect(result.current).toBe('a');

    act(() => jest.advanceTimersByTime(1));
    expect(result.current).toBe('ab');
  });

  it('reinicia a contagem a cada mudança e fica só com o último valor', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'ab' });
    act(() => jest.advanceTimersByTime(300));
    rerender({ value: 'abc' });
    act(() => jest.advanceTimersByTime(300));
    expect(result.current).toBe('a');

    act(() => jest.advanceTimersByTime(100));
    expect(result.current).toBe('abc');
  });
});
