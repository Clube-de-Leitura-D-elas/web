import type { Meta, StoryObj } from '@storybook/react-vite';
import styled, { css } from 'styled-components';
import { Tag } from '../Tag/Tag';
import { Table, type TableColumn, type TableRow } from '.';

const GroupName = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

const GroupTitle = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
`;

const GroupCaption = styled.span`
  ${({ theme }) => css`
    color: ${theme.textMuted};
    font-size: 0.6875rem;
  `}
`;

const WarningBadge = styled.span`
  ${({ theme }) => css`
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    background-color: ${theme.warningLight};
    color: ${theme.warningDark};
    font-size: 0.6875rem;
    font-weight: 700;
    line-height: 1rem;
    white-space: nowrap;
  `}
`;

const Actions = styled.span`
  ${({ theme }) => css`
    color: ${theme.textMuted};
    font-size: 1.125rem;
    font-weight: 700;
  `}
`;

const simpleColumns: TableColumn[] = [
  { key: 'book', label: 'Livro' },
  { key: 'author', label: 'Autora' },
  { key: 'year', label: 'Ano' },
];

const simpleRows: TableRow[] = [
  { book: 'Torto Arado', author: 'Itamar Vieira Junior', year: 2019 },
  { book: 'Quarto de Despejo', author: 'Carolina Maria de Jesus', year: 1960 },
  { book: 'A Hora da Estrela', author: 'Clarice Lispector', year: 1977 },
  { book: 'Um Defeito de Cor', author: 'Ana Maria Gonçalves', year: 2006 },
];

const groupColumns: TableColumn[] = [
  { key: 'name', label: 'Nome do grupo', width: '24%', align: 'left' },
  { key: 'city', label: 'Cidade', align: 'left' },
  { key: 'coordinator', label: 'Coordenadora', align: 'left' },
  { key: 'members', label: 'Membras', align: 'left' },
  { key: 'nextMeeting', label: 'Próximo encontro', align: 'left' },
  { key: 'actions', label: 'Ações', align: 'right' },
];

const groups = [
  {
    name: 'Grupo 03 — Pinheiros',
    createdAt: 'mar/2024',
    city: 'São Paulo',
    coordinator: 'Joseane A.',
    members: 26,
    nextMeeting: null,
  },
  {
    name: 'Grupo 07 — Centro',
    createdAt: 'mar/2024',
    city: 'Porto Alegre',
    coordinator: 'Simone F.',
    members: 28,
    nextMeeting: '24 ago, 19h',
  },
  {
    name: 'Grupo 09 — Trindade',
    createdAt: 'mar/2024',
    city: 'Florianópolis',
    coordinator: 'Vera B.',
    members: 22,
    nextMeeting: '31 ago, 11h',
  },
  {
    name: 'Grupo 12 — Moinhos',
    createdAt: 'mai/2024',
    city: 'Porto Alegre',
    coordinator: 'Rita C.',
    members: 30,
    nextMeeting: '02 set, 15h',
  },
  {
    name: 'Grupo 15 — Savassi',
    createdAt: 'jun/2026',
    city: 'Belo Horizonte',
    coordinator: null,
    members: 26,
    nextMeeting: null,
  },
  {
    name: 'Grupo 03 — Pinheiros',
    createdAt: 'mar/2024',
    city: 'São Paulo',
    coordinator: 'Carolina W.',
    members: 15,
    nextMeeting: null,
  },
];

/** 42 linhas (7 páginas), repetindo os 6 grupos do Figma. */
const groupRows: TableRow[] = Array.from({ length: 42 }, (_, index) => {
  const group = groups[index % groups.length];
  return {
    name: (
      <GroupName>
        <GroupTitle>{group.name}</GroupTitle>
        <GroupCaption>criado em {group.createdAt}</GroupCaption>
      </GroupName>
    ),
    city: group.city,
    coordinator: group.coordinator ? (
      <Tag color="neutral">{group.coordinator}</Tag>
    ) : (
      <WarningBadge>⚠ Sem coordenadora</WarningBadge>
    ),
    members: group.members,
    nextMeeting: group.nextMeeting ?? <WarningBadge>⚠ Sem data definida</WarningBadge>,
    actions: <Actions>⋮</Actions>,
  };
});

const meta = {
  title: 'Componentes/Table',
  component: Table,
  parameters: {
    docs: {
      description: {
        component: [
          'Tabela paginada. Recebe todas as linhas e mostra `pageSize` por página.',
          '',
          '### Como importar',
          '',
          '```tsx',
          "import { Table } from '../components/Table';",
          '```',
          '',
          '### Como usar',
          '',
          'Cada linha é um objeto cujas chaves são as `key` das colunas. O valor pode ser texto, número ou JSX.',
          'Por padrão as colunas têm a mesma largura e o conteúdo é centralizado; use `width` e `align` para mudar uma coluna.',
          '',
          '```tsx',
          '<Table',
          '  columns={[',
          "    { key: 'name', label: 'Nome', width: '16rem', align: 'left' },",
          "    { key: 'role', label: 'Papel' },",
          "    { key: 'actions', label: 'Ações', align: 'right' },",
          '  ]}',
          "  rows={[{ name: 'Joseane', role: <Tag>Gestora</Tag>, actions: '⋮' }]}",
          '  itemLabel="membras"',
          '/>',
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    columns: { description: 'Colunas: `key`, `label`, `width?` e `align?`.' },
    rows: { description: 'Linhas: `{ [column.key]: ReactNode }`.' },
    pageSize: { control: { type: 'number', min: 1 }, description: 'Linhas por página. Padrão: 6.' },
    itemLabel: { control: 'text', description: 'Nome dos itens no resumo do rodapé.' },
  },
  args: { columns: simpleColumns, rows: simpleRows },
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Padrão: colunas com a mesma largura e conteúdo centralizado. */
export const Default: Story = {};

/** Réplica do frame do Figma: alinhamento à esquerda e ações à direita. */
export const RegisteredGroups: Story = {
  args: {
    columns: groupColumns,
    rows: groupRows,
    itemLabel: 'grupos cadastrados',
  },
};

/** Sem linhas: mostra a mensagem de tabela vazia. */
export const Empty: Story = {
  args: { rows: [] },
};
