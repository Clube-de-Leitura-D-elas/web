# AGENTS.md — Web

Instruções para agentes de IA (Claude Code, Copilot, Cursor) e para o revisor automático
(CodeRabbit). É a fonte única das regras do repositório: o `CLAUDE.md` e o
`.github/copilot-instructions.md` só apontam para cá. O `README.md` continua sendo o guia
passo a passo para pessoas, com exemplos maiores.

Quem revisa um PR usa as seções **Regras** e **Checklist de review** como critério. Uma regra
quebrada é achado de review, mesmo que o código "funcione". As regras valem para o código novo ou
alterado no PR; quem revisa não exige refactor de código que o PR não tocou.

Onde o `README.md` e este arquivo divergirem, vale este arquivo. Alguns trechos do README estão
desatualizados (o exemplo `supabase.from('livros')` e os nomes de arquivo da seção de
componentes).

## O que é este repositório

Painel web do Clube de Leitura D'Elas, usado pela coordenação. React + TypeScript + Vite,
styled-components, React Router, Storybook e Jest + Testing Library. O backend é o Supabase do
repositório [`backend`](https://github.com/Clube-de-Leitura-D-elas/backend).

```
src/
├── components/   # peças de UI reutilizáveis, uma pasta por componente
├── pages/        # uma pasta por tela, com rota em App.tsx
├── layouts/      # moldura das telas (DefaultLayout = menu lateral + conteúdo)
├── services/     # toda a comunicação com o backend
├── hooks/        # hooks customizados (sempre `use...`)
├── locales/      # textos da interface (pt-BR.json)
├── theme/        # tokens de cor
├── types/        # tipos usados por vários arquivos
├── utils/        # funções puras (ex.: formatação de datas em utils/date.ts)
├── assets/       # imagens, ícones e fontes
└── test/         # setup e utilitários do Jest
```

## Comandos

```bash
yarn install        # instala dependências e os hooks do Husky
yarn dev            # servidor local
yarn docs           # Storybook
yarn test           # Jest
yarn typecheck && yarn lint && yarn format:check   # o mesmo que o pre-push e o CI rodam
```

## Regras

### Componentes

- Uma pasta por componente em `src/components/<Nome>/`, com `index.tsx` (o componente),
  `styles.ts`, `<Nome>.stories.tsx` e `<Nome>.test.tsx`. `src/components/Tag/` e
  `src/components/Button/` são as referências.
- Estilo sempre em `styles.ts`, importado como `import * as Styled from './styles';`.
- Componentes, páginas e hooks usam `export const`, nunca `export default`. As exceções são as
  stories (`export default meta`, exigido pelo Storybook) e os arquivos de configuração
  (`vite.config.ts`, `eslint.config.js` etc.).
- Texto de conteúdo entra por `children`.
- Cor só pelo tema (`${({ theme }) => theme.primary}`), nunca hex solto. Medidas (padding, raio,
  fonte) vão direto no CSS, com o valor do Figma.
- Prop que só serve para estilo leva cifrão (`$color`).
- Componente novo ou alterado tem story, uma por variante.
- Antes de criar um componente, confira se já existe um em `src/components/` que resolve.

### Páginas e rotas

- Tela nova: `src/pages/<Nome>/index.tsx` (nome em inglês), rota em `src/App.tsx`. Tela com menu
  lateral fica dentro do `<Route path="/" element={<DefaultLayout />}>`, que por sua vez está
  dentro do `<ProtectedAdminRoute>`: rota fora dele é pública. A página não coloca `<main>` nem
  padding externo. Se aparece no menu, entra em `NAV_ITEMS` em `src/components/Sidebar/Sidebar.tsx`.

### Textos

- Todo texto fixo da interface vem de `src/locales/pt-BR.json`, via `locale` (de
  `src/locales`) ou `useLocale()`, com `interpolate` para variáveis. Texto escrito direto no JSX
  é achado de review.
- Datas na tela passam pelos formatadores de `src/utils/date.ts`, que já tratam o fuso. Não
  formate data na mão no componente.

### Comunicação com o backend

- Componentes e páginas nunca importam o `supabaseClient`; tudo passa por `src/services/`.
- O painel chama as **Edge Functions** com `supabase.functions.invoke` (GET pelo helper
  `invokeGet`). Functions novas exclusivas do painel terminam em `-web`; várias antigas não
  seguem esse padrão. Acesso direto a tabela
  (`supabase.from(...)`) só existe para `cities`, `zones` e `users`, as únicas com leitura
  liberada para `authenticated`; para o resto o banco recusa.
- O service segue o contrato da function no backend: nome, método, nomes dos campos do body e
  formato da resposta. Ao mudar ou renomear uma function, procure o nome antigo no repositório
  inteiro (services, testes, mocks de `services/__mocks__`, stories) e troque em todos.
- Trate o `error` da chamada (`if (error) throw error;`). Para mostrar na tela a mensagem que a
  function devolveu, não crie mais uma cópia de `readFunctionErrorMessage` (já duplicada em
  `groupService.ts` e `participantService.ts`): extraia para um helper compartilhado em
  `src/services/` e reuse.

### Testes

- O teste fica ao lado do arquivo testado, com final `.test.ts(x)`.
- Telas e componentes: `renderWithProviders` (de `src/test/render.tsx`) e consultas pelo que a
  usuária vê (`getByRole`, `getByLabelText`, textos de `locale`), nunca por classe CSS.
- Telas que chamam o backend: `jest.mock('../../services/<service>', () => ({ ... }))` sempre com
  a função de fábrica. Sem ela o Jest usa os mocks de `services/__mocks__`, que são do Storybook.
- Services: o `supabaseClient` já é um stub; configure com
  `jest.mocked(supabase.functions.invoke).mockResolvedValue({ data, error: null })` e confira o
  nome da function e o body da chamada.
- Mudança de comportamento vem com teste novo ou atualizado.

### Estilo

- ESLint e Prettier decidem a formatação; não brigue com eles.
- Comentários em pt-BR e só quando essenciais: o porquê que o código não mostra ou a armadilha que
  quebra em silêncio.

## Checklist de review

1. O PR faz o que a descrição promete, e o código novo é usado?
2. O contrato com o backend bate com a function de lá (nome, body, resposta)? Sobrou referência
   ao nome antigo?
3. Algum texto fixo fora do `locale`, cor fora do tema ou `export default` em componente, página
   ou hook?
4. Componente novo tem `styles.ts` e story? Já existia algo parecido?
5. Os testes cobrem a mudança e consultam pelo que aparece na tela?
6. Estados de carregamento, vazio e erro estão tratados na tela?

## Branches, commits e PR

- Branch base `develop`; `main` fica para as versões apresentadas aos stakeholders.
- Branch: `<type>/CLU-<numero>-<descricao-curta>` (o Linear vincula branch, PR e issue).
- Commits em [Conventional Commits](https://www.conventionalcommits.org/), em inglês e no
  imperativo: `feat(button): add primary and secondary variants`. Types: `feat`, `fix`,
  `refactor`, `test`, `chore`, `docs`, `ci`, `component`.
- PR com o template do repositório preenchido. O CI roda `typecheck`, `lint`, `format:check` e
  os testes; ele precisa estar verde.
