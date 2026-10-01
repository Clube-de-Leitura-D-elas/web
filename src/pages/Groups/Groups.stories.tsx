import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../components/Button';
import { Dropdown } from '../../components/Dropdown';
import { Input } from '../../components/Input';
import { Table, type TableColumn, type TableRow } from '../../components/Table';
import { Tag } from '../../components/Tag';
import { useLocale } from '../../hooks/useLocale';
import { interpolate, pluralize } from '../../locales';
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
    coordinator: <Tag color="neutral">Joana A.</Tag>,
    members: 26,
    nextMeeting: <Tag color="warning">Sem data definida</Tag>,
    status: <Tag color="success">Ativo</Tag>,
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
    status: <Tag color="success">Ativo</Tag>,
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
    status: <Tag color="success">Ativo</Tag>,
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
    status: <Tag color="success">Ativo</Tag>,
  },
  {
    name: (
      <Styled.GroupInfo>
        <Styled.GroupName>Grupo 15 — Savassi</Styled.GroupName>
        <Styled.GroupCreatedAt>criado em jun/2026</Styled.GroupCreatedAt>
      </Styled.GroupInfo>
    ),
    city: 'Belo Horizonte',
    coordinator: null,
    members: 26,
    nextMeeting: null,
    status: <Tag color="success">Ativo</Tag>,
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
    nextMeeting: null,
    status: <Tag color="error">Inativo</Tag>,
  },
];

function GroupsStory() {
  const locale = useLocale();

  const [search, setSearch] = useState('');
  const [, setCity] = useState('');
  const [order, setOrder] = useState('name_asc');

  const cityCount = new Set(groupRows.map((group) => group.city)).size;

  const groupColumns: TableColumn[] = [
    {
      key: 'name',
      label: locale.groups.table.columns.name,
      align: 'left',
    },
    {
      key: 'city',
      label: locale.groups.table.columns.city,
      align: 'center',
    },
    {
      key: 'coordinator',
      label: locale.groups.table.columns.coordinator,
      align: 'center',
    },
    {
      key: 'members',
      label: locale.groups.table.columns.members,
      align: 'center',
    },
    {
      key: 'nextMeeting',
      label: locale.groups.table.columns.nextMeeting,
      align: 'center',
    },
    {
      key: 'status',
      label: locale.groups.table.columns.status,
      align: 'center',
    },
  ];

  const rows = groupRows.map((group) => ({
    ...group,

    coordinator: group.coordinator ?? (
      <Tag color="warning">{locale.groups.table.emptyCoordinator}</Tag>
    ),

    nextMeeting: group.nextMeeting ?? (
      <Tag color="warning">{locale.groups.table.emptyNextMeeting}</Tag>
    ),
  }));

  const cityOptions = [
    {
      label: locale.groups.filters.cityAll,
      value: '',
    },
    {
      label: 'Belo Horizonte',
      value: 'belo-horizonte',
    },
    {
      label: 'Florianópolis',
      value: 'florianopolis',
    },
    {
      label: 'Porto Alegre',
      value: 'porto-alegre',
    },
    {
      label: 'São Paulo',
      value: 'sao-paulo',
    },
  ];

  const orderOptions = [
    {
      label: locale.groups.filters.sortNameAsc,
      value: 'name_asc',
    },
    {
      label: locale.groups.filters.sortNameDesc,
      value: 'name_desc',
    },
  ];

  return (
    <Styled.Container>
      <Styled.Header>
        <Styled.Title>{locale.groups.title}</Styled.Title>

        <Styled.Subtitle>
          {interpolate(locale.groups.subtitle, {
            groups: pluralize(locale.groups.activeGroupsCount, groupRows.length),
            cities: pluralize(locale.groups.citiesCount, cityCount),
          })}
        </Styled.Subtitle>
      </Styled.Header>

      <Styled.FiltersBar>
        <Input
          id="storybook-group-search"
          label={locale.groups.filters.searchPlaceholder}
          placeholder={locale.groups.filters.searchPlaceholder}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <Dropdown
          placeholder={locale.groups.filters.cityAll}
          options={cityOptions}
          onSelect={setCity}
        />

        <Dropdown
          placeholder={
            order === 'name_asc'
              ? locale.groups.filters.sortNameAsc
              : locale.groups.filters.sortNameDesc
          }
          options={orderOptions}
          onSelect={setOrder}
        />

        <Button variant="primary" size="md">
          {locale.groups.newGroup}
        </Button>
      </Styled.FiltersBar>

      <Styled.TableContainer>
        <Table
          columns={groupColumns}
          rows={rows}
          pageSize={6}
          itemLabel={locale.groups.table.itemLabel}
        />
      </Styled.TableContainer>
    </Styled.Container>
  );
}

export const Default: Story = {};
