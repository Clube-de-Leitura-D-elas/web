import { TextDecoder, TextEncoder } from 'node:util';

// O jsdom não traz TextEncoder/TextDecoder, e o react-router usa os dois já ao ser importado.
// Por isso este arquivo roda em `setupFiles`, antes de qualquer import do teste.
Object.assign(globalThis, { TextEncoder, TextDecoder });
