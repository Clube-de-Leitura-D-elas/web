type MediaQueryResolver = (query: string) => boolean;

const listeners = new Set<() => void>();
let resolve: MediaQueryResolver = () => false;

/**
 * O jsdom não implementa `window.matchMedia`. Este polyfill responde `false` para toda media
 * query (tela de desktop); para simular outra tela, passe quais queries batem:
 *
 *   setMatchMedia((query) => query === MOBILE_QUERY);
 *
 * Chamadas feitas depois que a tela já renderizou avisam quem assinou o `change`.
 */
export function setMatchMedia(resolver: MediaQueryResolver) {
  resolve = resolver;
  listeners.forEach((listener) => listener());
}

export function installMatchMedia() {
  resolve = () => false;
  listeners.clear();

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string): MediaQueryList =>
      ({
        media: query,
        get matches() {
          return resolve(query);
        },
        onchange: null,
        addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
        removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
        addListener: (listener: () => void) => listeners.add(listener),
        removeListener: (listener: () => void) => listeners.delete(listener),
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList,
  });
}
