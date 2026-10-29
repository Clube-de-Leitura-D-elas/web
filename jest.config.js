// Fuso fixo para os testes de data darem o mesmo resultado em qualquer máquina e na CI.
// Os workers do Jest herdam esta variável.
process.env.TZ = 'America/Sao_Paulo';

// Bibliotecas publicadas só como ESM, que o Jest (CommonJS) precisa transformar.
const ESM_PACKAGES = ['react-router', 'cookie-es'];

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  setupFiles: ['<rootDir>/src/test/polyfills.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.ts'],
  transform: {
    // O react-router usa `import.meta.hot` (HMR do Vite), que não existe em CommonJS.
    'node_modules[/\\\\].+\\.m?js$': [
      '@swc/jest',
      {
        jsc: {
          transform: { optimizer: { globals: { vars: { 'import.meta.hot': 'undefined' } } } },
        },
      },
    ],
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', tsx: true },
          transform: { react: { runtime: 'automatic' } },
        },
      },
    ],
  },
  transformIgnorePatterns: [`/node_modules/(?!(${ESM_PACKAGES.join('|')})/)`],
  moduleNameMapper: {
    // O client real lê `import.meta.env`, que não existe no Jest. Todo teste usa o stub,
    // e cada um define o que `supabase.functions.invoke` e `supabase.auth.*` respondem.
    '^(\\.{1,2}/)+(services/)?supabaseClient$': '<rootDir>/src/test/supabaseClientMock.ts',
    '\\.(png|jpe?g|gif|svg|webp)$': '<rootDir>/src/test/fileMock.ts',
    '\\.css$': '<rootDir>/src/test/styleMock.ts',
  },
  // Cada teste começa com os mocks zerados: um `mockResolvedValue` não vaza para o próximo.
  resetMocks: true,
  restoreMocks: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.stories.tsx',
    '!src/**/styles.ts',
    '!src/**/__mocks__/**',
    '!src/test/**',
    '!src/main.tsx',
    '!src/**/*.d.ts',
  ],
  coverageReporters: ['text-summary', 'lcov'],
};

export default config;
