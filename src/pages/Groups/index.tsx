import { useState } from 'react';
import { LuEllipsisVertical } from 'react-icons/lu';
import * as Styled from './styles';
import { Input } from '../../components/Input';
import { Dropdown } from '../../components/Dropdown';
import { Button } from '../../components/Button';
import { Tag } from '../../components/Tag';
import { TbAlertTriangle } from 'react-icons/tb';
import { Table, type TableColumn, type TableRow } from '../../components/Table';

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
    nextMeeting: (
      <Tag color="warning">
        <TbAlertTriangle />
        Sem data definida
      </Tag>
    ),
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
    coordinator: (
      <Tag color="warning">
        <TbAlertTriangle />
        Sem coordenadora
      </Tag>
    ),
    members: 26,
    nextMeeting: (
      <Tag color="warning">
        <TbAlertTriangle />
        Sem data definida
      </Tag>
    ),
    actions: (
      <Styled.ActionButton type="button" aria-label="Ações do grupo">
        <LuEllipsisVertical aria-hidden="true" />
      </Styled.ActionButton>
    ),
  },

  {
    name: (
      <Styled.GroupInfo>
        <Styled.GroupName>Grupo 03 — Pinheiros</Styled.GroupName>
        <Styled.GroupCreatedAt>criado em mar/2024</Styled.GroupCreatedAt>
      </Styled.GroupInfo>
    ),
    city: 'São Paulo',
    coordinator: <Tag color="neutral">Carolina W.</Tag>,
    members: 15,
    nextMeeting: (
      <Tag color="warning">
        <TbAlertTriangle />
        Sem data definida
      </Tag>
    ),
    actions: (
      <Styled.ActionButton type="button" aria-label="Ações do grupo">
        <LuEllipsisVertical aria-hidden="true" />
      </Styled.ActionButton>
    ),
  },
];

export const Groups = () => {
  const [search, setSearch] = useState('');
  //const [city, setCity] = useState('');
  //const [order, setOrder] = useState('name_asc');

  const orderOptions = [
    { label: 'Nome (A–Z)', value: 'name_asc' },
    { label: 'Nome (Z–A)', value: 'name_desc' },
  ];

  const groupColumns: TableColumn[] = [
    {
      key: 'name',
      label: 'NOME DO GRUPO',
      align: 'left',
    },
    {
      key: 'city',
      label: 'CIDADE',
      align: 'center',
    },
    {
      key: 'coordinator',
      label: 'COORDENADORA',
      align: 'center',
    },
    {
      key: 'members',
      label: 'MEMBRAS',
      align: 'center',
    },
    {
      key: 'nextMeeting',
      label: 'PRÓXIMO ENCONTRO',
      align: 'center',
    },
    {
      key: 'actions',
      label: 'AÇÕES',
      align: 'right',
      width: '3rem',
    },
  ];
  const groupCount = groupRows.length;

  const cityCount = new Set(groupRows.map((group) => group.city)).size;

  return (
    <Styled.Container>
      <Styled.Header>
        <Styled.Title>Grupos</Styled.Title>
        <Styled.Subtitle>
          {groupCount} grupos ativos em {cityCount} cidades
        </Styled.Subtitle>
      </Styled.Header>

      <Styled.FiltersBar>
        <Input
          id="search-group"
          label="Buscar por nome ou cidade"
          placeholder="Buscar por nome ou cidade"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <Dropdown
          placeholder="Cidade: todas"
          options={[]}
          //onSelect={(value) => setCity(value)}
          onSelect={() => {}}
        />

        <Dropdown
          placeholder="Ordenar: Nome (A–Z)"
          options={orderOptions}
          //onSelect={(value) => setOrder(value)}
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
};
