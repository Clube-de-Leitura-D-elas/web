import { useState, useMemo } from 'react';
import * as Styled from './styles';
import { Input } from '../../components/Input';
import { Dropdown } from '../../components/Dropdown';
import { Tabs } from '../../components/Tab';
import { Table, type TableColumn, type TableRow } from '../../components/Table';
import { Tag } from '../../components/Tag';
import { locale } from '../../locales';

type ParticipantMock = {
  id: string;
  name: string;
  isCoordinator: boolean;
  groups: number;
  recentAttendance: ('P' | 'F')[];
  status: 'active' | 'inactive';
};

const MOCK_PARTICIPANTS: ParticipantMock[] = [
  {
    id: '1',
    name: 'Joseane Alves',
    isCoordinator: true,
    groups: 3,
    recentAttendance: ['P', 'F', 'P'],
    status: 'active',
  },
  {
    id: '2',
    name: 'Mariana Souza',
    isCoordinator: false,
    groups: 1,
    recentAttendance: ['P', 'F', 'P'],
    status: 'inactive',
  },
  {
    id: '3',
    name: 'Beatriz Santos',
    isCoordinator: false,
    groups: 2,
    recentAttendance: ['P', 'P', 'P'],
    status: 'active',
  },
  {
    id: '4',
    name: 'Carla Mendes',
    isCoordinator: false,
    groups: 3,
    recentAttendance: ['F', 'P', 'P'],
    status: 'active',
  },
  {
    id: '5',
    name: 'Teresa Rocha',
    isCoordinator: false,
    groups: 3,
    recentAttendance: ['P', 'P', 'F'],
    status: 'active',
  },
  {
    id: '6',
    name: 'Helena Oliveira',
    isCoordinator: false,
    groups: 1,
    recentAttendance: ['P', 'P', 'P'],
    status: 'inactive',
  },
  {
    id: '7',
    name: 'Marta Vieira',
    isCoordinator: false,
    groups: 1,
    recentAttendance: ['P', 'P', 'F'],
    status: 'active',
  },
];

export const Participants = () => {
  const [search, setSearch] = useState('');
  const [, setSelectedCity] = useState('');
  const [, setSelectedGroup] = useState('');

  const columns: TableColumn[] = [
    { key: 'name', label: 'NOME COMPLETO', align: 'left' },
    { key: 'groups', label: 'GRUPOS', align: 'center' },
    { key: 'attendance', label: 'PRESENÇA (ÚLTIMOS 3)', align: 'center' },
    { key: 'status', label: 'STATUS', align: 'center' },
    { key: 'actions', label: '', align: 'right', width: '3rem' },
  ];

  const filteredParticipants = useMemo(() => {
    return MOCK_PARTICIPANTS.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const rows: TableRow[] = useMemo(() => {
    return filteredParticipants.map((p) => ({
      name: (
        <Styled.ParticipantNameCell>
          <span>{p.name}</span>
          {p.isCoordinator && <Tag color="primary">{locale.participants.table.coordinator}</Tag>}
        </Styled.ParticipantNameCell>
      ),
      groups: (
        <Tag color="neutral">
          {p.groups > 1 ? `${p.groups} grupos` : locale.participants.table.groupCountSingle}
        </Tag>
      ),
      attendance: (
        <Styled.AttendanceList>
          {p.recentAttendance.map((status, index) => (
            <Styled.AttendanceBadge key={index} $type={status}>
              {status}
            </Styled.AttendanceBadge>
          ))}
        </Styled.AttendanceList>
      ),
      status: (
        <Styled.StatusBadge $active={p.status === 'active'}>
          {p.status === 'active'
            ? locale.participants.table.statusActive
            : locale.participants.table.statusInactive}
        </Styled.StatusBadge>
      ),
      actions: (
        <Styled.ActionButton type="button" aria-label="Ações da participante">
          ⋮
        </Styled.ActionButton>
      ),
    }));
  }, [filteredParticipants]);

  const tabsConfig = [
    {
      value: 'participants',
      label: locale.participants.tabs.participants,
      children: (
        <Styled.TableContainer>
          <Table columns={columns} rows={rows} pageSize={6} itemLabel="participantes cadastradas" />
        </Styled.TableContainer>
      ),
    },
    {
      value: 'requests',
      label: locale.participants.tabs.requests,
      children: (
        <div style={{ padding: '2rem 0', color: '#6B7280' }}>
          {/* Aba de Solicitações preparada para ser plugada na próxima issue */}
          Nenhuma solicitação pendente.
        </div>
      ),
    },
  ];

  return (
    <Styled.Container>
      <Styled.Header>
        <Styled.Title>{locale.participants.title}</Styled.Title>
        <Styled.Subtitle>42 grupos ativos em 7 cidades</Styled.Subtitle>
      </Styled.Header>

      <Styled.FiltersBar>
        <Input
          id="search-participant"
          label={locale.participants.filters.searchPlaceholder}
          placeholder={locale.participants.filters.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Dropdown
          placeholder={locale.participants.filters.cityAll}
          options={[
            { label: 'Todas as cidades', value: '' },
            { label: 'Porto Alegre', value: 'poa' },
          ]}
          onSelect={(val) => setSelectedCity(val)}
        />
        <Dropdown
          placeholder={locale.participants.filters.groupAll}
          options={[
            { label: 'Todos os grupos', value: '' },
            { label: 'Grupo 1', value: 'g1' },
          ]}
          onSelect={(val) => setSelectedGroup(val)}
        />
        <Styled.SortButton type="button">
          ⇅ {locale.participants.filters.sortName}
        </Styled.SortButton>
      </Styled.FiltersBar>

      <Tabs tabs={tabsConfig} defaultActive="participants" size="lg" />
    </Styled.Container>
  );
};
