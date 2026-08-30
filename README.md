# Clube de Leitura D'Elas — Web

Plataforma web responsiva para gestão e organização do Clube de Leitura D'Elas.

## Tecnologia

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) como build tool e dev server
- [React Router](https://reactrouter.com/) para navegação
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) para padronização de código
- [Yarn](https://classic.yarnpkg.com/) (1.x) como gerenciador de pacotes

## Pré-requisitos

- **Node.js** 22.12 ou superior
- **Yarn** 1.x (`npm install --global yarn`)

## Como rodar

```bash
yarn install   # instala as dependências
yarn dev       # sobe o dev server em http://localhost:5173
```

## Scripts

| Comando             | Descrição                                            |
| ------------------- | ---------------------------------------------------- |
| `yarn dev`          | Inicia o servidor de desenvolvimento com hot reload  |
| `yarn build`        | Checa os tipos e gera o build de produção em `dist/` |
| `yarn preview`      | Serve localmente o build de produção                 |
| `yarn typecheck`    | Roda o compilador TypeScript sem gerar arquivos      |
| `yarn lint`         | Analisa o código com ESLint                          |
| `yarn lint:fix`     | Corrige automaticamente o que o ESLint conseguir     |
| `yarn format`       | Formata todos os arquivos com Prettier               |
| `yarn format:check` | Verifica a formatação sem alterar arquivos           |

## Estrutura de pastas

```
src/
├── assets/       # imagens, fontes e ícones
├── components/   # componentes reutilizáveis
├── hooks/        # hooks customizados (useAlgo)
├── pages/        # um componente por rota
├── services/     # integração com a API / backend
├── types/        # tipos e interfaces compartilhados
├── App.tsx       # tabela de rotas
├── main.tsx      # ponto de entrada (React root + Router)
└── index.css     # estilos globais
```

Novas rotas devem ser criadas em `src/pages/` e registradas em `src/App.tsx`.

## Documentação

Para acessar a documentação do projeto, [clique aqui](https://tools.ages.pucrs.br/clube-de-leitura-d-elas/wiki/-/wikis/home).

## Semestre

AGES 2026/2 — Turma 3JK5JK
