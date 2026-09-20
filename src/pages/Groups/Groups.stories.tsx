import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { LuEllipsisVertical } from 'react-icons/lu';

import { Button } from '../../components/Button';
import { Dropdown } from '../../components/Dropdown';
import { Input } from '../../components/Input';
import { Table, type TableRow } from '../../components/Table';
import { Tag } from '../../components/Tag';
import * as Styled from './styles';

const meta = {
  title: 'Pages/Groups',
  component: GroupsStory,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof GroupsStory>;

export default meta;

type Story = StoryObj<typeof meta>;

const groupRows: TableRow[] = [
  {
    name: (
      <Styled.GroupInfo>
        <Styled.GroupName>Grupo 03 — Pinheiros</Styled.GroupName>
        <Styled.GroupCreatedAt>criado em mar/2024</Styled.GroupCreatedAt>
      </Styled.GroupInfo>
    ),
    city: 'São Paulo',
    coordinator: <Tag color="neutral">Joanae A.</Tag>,
    members: 26,
    nextMeeting: <Tag color="warning">Sem data definida</Tag>,
    actions: (
      <Styled.ActionButton type="button" aria-label="Ações do grupo">
        <LuEllipsisVertical aria-hidden="true" />
      </Styled.ActionButton>
    ),
  },
  {
    name: (
      <Styled.GroupInfo>
        <Styled.GroupName>Grupo 07 — Centro</Styled.GroupName>
        <Styled.GroupCreatedAt>criado em mar/2024</Styled.GroupCreatedAt>
      </Styled.GroupInfo>
    ),
    city: 'Porto Alegre',
    coordinator: <Tag color="neutral">Simone F.</Tag>,
    members: 28,
    nextMeeting: '24 ago, 19h',
    actions: (
      <Styled.ActionButton type="button" aria-label="Ações do grupo">
        <LuEllipsisVertical aria-hidden="true" />
      </Styled.ActionButton>
    ),
  },
  {
    name: (
      <Styled.GroupInfo>
        <Styled.GroupName>Grupo 09 — Trindade</Styled.GroupName>
        <Styled.GroupCreatedAt>criado em mar/2024</Styled.GroupCreatedAt>
      </Styled.GroupInfo>
    ),
    city: 'Florianópolis',
    coordinator: <Tag color="neutral">Vera B.</Tag>,
    members: 22,
    nextMeeting: '31 ago, 11h',
    actions: (
      <Styled.ActionButton type="button" aria-label="Ações do grupo">
        <LuEllipsisVertical aria-hidden="true" />
      </Styled.ActionButton>
    ),
  },
  {
    name: (
      <Styled.GroupInfo>
        <Styled.GroupName>Grupo 12 — Moinhos</Styled.GroupName>
        <Styled.GroupCreatedAt>criado em mai/2024</Styled.GroupCreatedAt>
      </Styled.GroupInfo>
    ),
    city: 'Porto Alegre',
    coordinator: <Tag color="neutral">Rita C.</Tag>,
    members: 30,
    nextMeeting: '02 set, 15h',
    actions: (
      <Styled.ActionButton type="button" aria-label="Ações do grupo">
        <LuEllipsisVertical aria-hidden="true" />
      </Styled.ActionButton>
    ),
  },
  {
    name: (
      <Styled.GroupInfo>
        <Styled.GroupName>Grupo 15 — Savassi</Styled.GroupName>
        <Styled.GroupCreatedAt>criado em jun/2026</Styled.GroupCreatedAt>
      </Styled.GroupInfo>
    ),
    city: 'Belo Horizonte',
    coordinator: <Tag color="warning">Sem coordenadora</Tag>,
    members: 26,
    nextMeeting: <Tag color="warning">Sem data definida</Tag>,
    actions: (
      <Styled.ActionButton type="button" aria-label="Ações do grupo">
        <LuEllipsisVertical aria-hidden="true" />
      </Styled.ActionButton>
    ),
  },
  {
    name: (
      <Styled.GroupInfo>
        <Styled.GroupName>Grupo 18 — Menino Deus</Styled.GroupName>
        <Styled.GroupCreatedAt>criado em jul/2026</Styled.GroupCreatedAt>
      </Styled.GroupInfo>
    ),
    city: 'Porto Alegre',
    coordinator: <Tag color="neutral">Carolina W.</Tag>,
    members: 15,
    nextMeeting: <Tag color="warning">Sem data definida</Tag>,
    actions: (
      <Styled.ActionButton type="button" aria-label="Ações do grupo">
        <LuEllipsisVertical aria-hidden="true" />
      </Styled.ActionButton>
    ),
  },
];

const groupColumns = [
  {
    key: 'name',
    label: 'NOME DO GRUPO',
    align: 'left' as const,
  },
  {
    key: 'city',
    label: 'CIDADE',
    align: 'center' as const,
  },
  {
    key: 'coordinator',
    label: 'COORDENADORA',
    align: 'center' as const,
  },
  {
    key: 'members',
    label: 'MEMBRAS',
    align: 'center' as const,
  },
  {
    key: 'nextMeeting',
    label: 'PRÓXIMO ENCONTRO',
    align: 'center' as const,
  },
  {
    key: 'actions',
    label: 'AÇÕES',
    align: 'right' as const,
    width: '4rem',
  },
];

const cityOptions = [
  { label: 'Todas', value: 'all' },
  { label: 'Belo Horizonte', value: 'belo-horizonte' },
  { label: 'Florianópolis', value: 'florianopolis' },
  { label: 'Porto Alegre', value: 'porto-alegre' },
  { label: 'São Paulo', value: 'sao-paulo' },
];

const orderOptions = [
  { label: 'Nome (A–Z)', value: 'name_asc' },
  { label: 'Nome (Z–A)', value: 'name_desc' },
];

function GroupsStory() {
  const [search, setSearch] = useState('');
  //const [city, setCity] = useState('all');
  //const [order, setOrder] = useState('name_asc');

  const cityCount = new Set(groupRows.map((group) => group.city)).size;

  return (
    <Styled.Container>
      <Styled.Header>
        <Styled.Title>Grupos</Styled.Title>

        <Styled.Subtitle>
          {groupRows.length} grupos ativos em {cityCount} cidades
        </Styled.Subtitle>
      </Styled.Header>

      <Styled.FiltersBar>
        <Input
          id="storybook-group-search"
          label="Buscar por nome ou cidade"
          placeholder="Buscar por nome ou cidade"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <Dropdown
          placeholder="Cidade: todas"
          options={cityOptions}
          //onSelect={setCity}
          onSelect={() => {}}
        />

        <Dropdown
          placeholder="Ordenar: Nome (A–Z)"
          options={orderOptions}
          //onSelect={setOrder}
          onSelect={() => {}}
        />

        <Button variant="primary" size="md">
          Novo grupo
        </Button>
      </Styled.FiltersBar>

      <Styled.TableContainer>
        <Table columns={groupColumns} rows={groupRows} pageSize={6} itemLabel="grupos" />
      </Styled.TableContainer>
    </Styled.Container>
  );
}

export const Default: Story = {};
