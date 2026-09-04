# Clube de Leitura D'Elas — Web

Plataforma web responsiva para gestão e organização do Clube de Leitura D'Elas.

> **É a sua primeira vez com desenvolvimento web?** Comece por aqui e siga na ordem.
> Qualquer dúvida, chame a liderança técnica — é para isso que ela existe.

## Tecnologia

Você não precisa dominar tudo isso agora. A lista serve para você saber o nome das coisas quando
for pesquisar.

| Ferramenta                                                       | Para que serve no projeto                                  |
| ---------------------------------------------------------------- | ---------------------------------------------------------- |
| [React](https://react.dev/)                                      | Monta a tela em pedaços reutilizáveis (os "componentes")   |
| [TypeScript](https://www.typescriptlang.org/)                    | JavaScript com tipos: o editor avisa o erro antes de rodar |
| [Vite](https://vite.dev/)                                        | Servidor de desenvolvimento e empacotador                  |
| [React Router](https://reactrouter.com/)                         | Controla qual página aparece em cada endereço              |
| [styled-components](https://styled-components.com/)              | Escreve o CSS dentro do TypeScript                         |
| [Storybook](https://storybook.js.org/)                           | Catálogo onde você vê e testa cada componente sozinho      |
| [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) | Apontam erros e formatam o código no padrão do time        |
| [Yarn](https://classic.yarnpkg.com/)                             | Instala as bibliotecas do projeto                          |

---

## 1. Antes de começar

Você precisa de duas coisas instaladas na sua máquina:

- **Node.js** 22.12 ou superior — [baixe aqui](https://nodejs.org/) (versão LTS)
- **Yarn** 1.x — depois de instalar o Node, rode `npm install --global yarn`

Confira se deu certo (os dois comandos precisam responder com um número de versão):

```bash
node -v    # precisa ser v22.12.0 ou maior
yarn -v    # precisa ser 1.x, ex.: 1.22.22
```

## 2. Como rodar o projeto

**Só na primeira vez** (e sempre que alguém adicionar uma biblioteca nova), instale as
dependências. Isso cria a pasta `node_modules/`, que é grande e **não** vai para o Git:

```bash
yarn install
```

Depois, para trabalhar no dia a dia:

```bash
yarn dev
```

Abra **http://localhost:5173** no navegador. A página recarrega sozinha toda vez que você salvar
um arquivo — não precisa parar e rodar de novo.

Para encerrar o servidor, aperte `Ctrl + C` no terminal.

## 3. Como rodar a documentação (`yarn docs`)

O Storybook é um catálogo que mostra **cada componente isolado**, fora das telas do sistema. É
onde você vai desenvolver os componentes de UI: dá para ver todas as variações lado a lado, mexer
nas props por um painel e conferir o modo claro e o escuro sem precisar montar uma tela inteira. Rode no terminal:

```bash
yarn docs
```

Abra **http://localhost:6006**. Na barra lateral estão os componentes; clique em **Tag** para ver
um exemplo já pronto.

Dicas da interface:

- **Ícone de pincel** (barra de cima) — alterna entre tema claro e escuro.
- **Aba Controls** (barra de baixo) — muda as props do componente ao vivo.

O `yarn dev` e o `yarn docs` são independentes: dá para deixar os dois rodando ao mesmo tempo, em
dois terminais.

## 4. Antes de abrir um Merge Request

Rode os três comandos abaixo. Se algum reclamar, corrija antes de pedir revisão:

```bash
yarn lint        # procura erros e más práticas
yarn typecheck   # confere se os tipos do TypeScript batem
yarn format      # formata o código no padrão do time
```

## Todos os scripts

| Comando             | Descrição                                            |
| ------------------- | ---------------------------------------------------- |
| `yarn dev`          | Inicia o servidor de desenvolvimento com hot reload  |
| `yarn docs`         | Inicia o Storybook (catálogo de componentes)         |
| `yarn docs:build`   | Gera o Storybook estático em `storybook-static/`     |
| `yarn build`        | Checa os tipos e gera o build de produção em `dist/` |
| `yarn preview`      | Serve localmente o build de produção                 |
| `yarn typecheck`    | Roda o compilador TypeScript sem gerar arquivos      |
| `yarn lint`         | Analisa o código com ESLint                          |
| `yarn lint:fix`     | Corrige automaticamente o que o ESLint conseguir     |
| `yarn format`       | Formata todos os arquivos com Prettier               |
| `yarn format:check` | Verifica a formatação sem alterar arquivos           |

---

## Estrutura de pastas

```
.storybook/          # configuração do Storybook (não precisa mexer)
src/
├── assets/          # imagens, ícones e fontes
├── components/      # componentes reutilizáveis (uma pasta por componente)
├── hooks/           # hooks customizados
├── pages/           # uma pasta/arquivo por tela do sistema
├── services/        # conversa com o backend (chamadas de API)
├── theme/           # cores do tema, estilos globais e provider
├── types/           # tipos TypeScript usados em vários lugares
├── App.tsx          # lista de rotas: qual endereço mostra qual página
└── main.tsx         # ponto de entrada da aplicação
```

### O que vai em cada pasta

| Pasta         | O que colocar aqui                                                                                                    |
| ------------- | --------------------------------------------------------------------------------------------------------------------- |
| `components/` | Peças de UI reutilizáveis, que aparecem em mais de uma tela: botão, input, modal, tabela. Uma pasta por componente.   |
| `pages/`      | Telas inteiras, ligadas a um endereço (`/login`, `/livros`). Uma página monta a tela combinando vários `components/`. |
| `hooks/`      | Lógica em React reaproveitada entre componentes. Sempre começam com `use` (ex.: `useThemeMode`).                      |
| `services/`   | Funções que buscam e enviam dados para o backend. O componente chama o service; nunca faz `fetch` direto.             |
| `types/`      | `type` e `interface` usados por vários arquivos (ex.: `Livro`, `Usuaria`). Tipo usado num arquivo só fica nele mesmo. |
| `theme/`      | As cores do sistema e os estilos globais. Veja a seção **Tema** abaixo.                                               |
| `assets/`     | Arquivos estáticos: logo, ilustrações, ícones em SVG.                                                                 |

**Na dúvida entre `components/` e `pages/`:** se tem endereço próprio no navegador, é página. Se é
uma peça que a página usa por dentro, é componente.

### Criou uma tela nova?

1. Crie o arquivo em `src/pages/`.
2. Registre a rota em `src/App.tsx`.

---

## Componentes de UI

Cada componente mora na própria pasta, com **três arquivos** e sempre os mesmos nomes:

```
src/components/Tag/
├── Tag.tsx           # o componente
├── styles.ts         # todo o estilo (nome fixo, em todo componente)
└── Tag.stories.tsx   # as stories do Storybook
```

O Tag tem ainda um quarto arquivo, `Tag.example.tsx`, com exemplos prontos de import e das
variantes. É só material de consulta — os seus componentes não precisam de um.

**`src/components/Tag/` é o exemplo de referência.** Antes de começar o seu componente, abra os
três arquivos dele — eles foram escritos para serem copiados.

| Componente | Situação                        |
| ---------- | ------------------------------- |
| `Tag`      | ✅ pronto — use como referência |
| `Button`   | a implementar                   |
| `Input`    | a implementar                   |
| `Dropdown` | a implementar                   |
| `Modal`    | a implementar                   |
| `Table`    | a implementar                   |

As pastas dos componentes a implementar já existem, com os três arquivos criados e um cabeçalho
explicando o que fazer em cada um. Você preenche o conteúdo.

### As quatro convenções

**1. O estilo vem sempre de `styles.ts`, importado como `Styled`.**

```tsx
import * as Styled from './styles';

// ...
return <Styled.Container>{label}</Styled.Container>;
```

**2. Componente é `export const`, nunca `export default`.** E o conteúdo de texto vai por
`children`, não por uma prop.

```tsx
// src/components/Tag/Tag.tsx
export const Tag = ({ children, color = 'primary' }: TagProps) => (
  <Styled.Container $color={color}>{children}</Styled.Container>
);
```

Quem usa importa pelo nome, entre chaves:

```tsx
import { Tag } from '../components/Tag/Tag';

<Tag>Gestora</Tag>
<Tag color="primary">Coordenadora</Tag>
<Tag color="neutral">Ficção</Tag>;
```

**3. Cor sempre pelo tema, nunca hex fixo.** É isso que faz o modo escuro funcionar sozinho.

```ts
// ✅ certo
background-color: ${({ theme }) => theme.surfaceBrandSoft};

// ❌ errado — quebra no modo escuro
background-color: #fce8f0;
```

Medidas (padding, raio, tamanho de fonte) **não** são tokens: vão direto no CSS, com o valor do
Figma.

**4. Prop que só serve para estilo leva cifrão (`$color`).** O cifrão avisa o styled-components
que a prop é dele e não deve virar atributo HTML. Sem isso o React reclama no console.

```ts
export const Container = styled.span<{ $color: TagColor }>`
  ${({ theme, $color }) =>
    $color === 'primary'
      ? css`
          color: ${theme.textBrand};
        `
      : css`
          color: ${theme.text};
        `}
`;
```

### Como implementar o seu componente

1. Leia o card no Kanban e o frame do componente no Figma.
2. Abra a pasta do componente e leia o cabeçalho dos três arquivos.
3. Comece pelo `styles.ts`, criando os `styled` que o componente vai usar; depois monte o
   componente no `X.tsx` importando com `import * as Styled from './styles';`.
4. Rode `yarn docs` e desenvolva olhando o Storybook.
5. Em `X.stories.tsx`, apague a story `Placeholder` e crie uma story por variante.
6. Confira o componente no tema claro **e** no escuro (ícone de pincel).
7. Antes de abrir o MR: `yarn lint && yarn typecheck && yarn format`.

---

## Tema

O tema fica em `src/theme/theme.ts` e tem **só cores** — 33 tokens, os mesmos do Figma, nos modos
claro e escuro. Dentro de qualquer `styles.ts` o `theme` chega pronto e tipado (o autocomplete
lista todas as cores):

```ts
import styled from 'styled-components';

export const Container = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.textOnBrand};

  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }
`;
```

### Tokens disponíveis

| Grupo        | Chaves                                                                                         |
| ------------ | ---------------------------------------------------------------------------------------------- |
| Fundos       | `background`, `backgroundSubtle`                                                               |
| Superfícies  | `surface`, `surfaceSunken`, `surfaceBrandSoft`                                                 |
| Bordas       | `border`, `borderStrong`, `borderBrand`                                                        |
| Texto        | `text`, `textMuted`, `textInverse`, `textBrand`, `textOnBrand`                                 |
| Sobreposição | `overlayScrim`                                                                                 |
| Ações        | `primary`, `primaryHover`, `primaryPressed`, `danger`, `disabledBg`, `disabledFg`, `focusRing` |
| Feedback     | `success`, `warning`, `error`, `info` — cada um com `…Light` e `…Dark`                         |

Há ainda `theme.mode` (`'light'` ou `'dark'`), para o caso raro de um componente precisar se
comportar diferente no escuro.

### Alternar claro/escuro

Na aplicação, pelo hook:

```tsx
import { useThemeMode } from '../hooks/useThemeMode';

const { mode, toggleMode } = useThemeMode();
```

A escolha fica salva no `localStorage`; na primeira visita vale a preferência do sistema
operacional.

No Storybook, use o **ícone de pincel** na barra de ferramentas. Todo componente deve ficar
correto nos dois modos — é parte da revisão do MR.

> **Atenção:** 13 tokens ainda não têm valor oficial no modo escuro no Figma. Eles estão
> preenchidos com um valor derivado e marcados com `// TODO` no `src/theme/theme.ts`, aguardando
> confirmação do design. Afetam principalmente os tokens de feedback (`…Light` / `…Dark`),
> o `overlayScrim` e o `primaryPressed`.

## Documentação

Para acessar a documentação do projeto, [clique aqui](https://tools.ages.pucrs.br/clube-de-leitura-d-elas/wiki/-/wikis/home).

## Semestre

AGES 2026/2 — Turma 3JK5JK
