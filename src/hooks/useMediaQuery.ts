import { useCallback, useSyncExternalStore } from 'react';

/**
 * Diz se a tela bate com uma media query e atualiza quando a janela muda de tamanho.
 *
 *   const isMobile = useMediaQuery('(max-width: 767px)');
 */
export const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
};
