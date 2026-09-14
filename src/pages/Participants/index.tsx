import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import * as Styled from './styles';
import { Input } from '../../components/Input';
import { Dropdown, type DropdownItemList } from '../../components/Dropdown';
import { Tabs } from '../../components/Tab';
import {
  Table,
  type TableColumn,
  type TablePageRequest,
  type TablePage,
} from '../../components/Table';
import { Tag } from '../../components/Tag';
import { Button } from '../../components/Button';
import { useDebounce } from '../../hooks/useDebounce';
import { useLocale } from '../../hooks/useLocale';
import {
  getParticipantsPage,
  getPendingParticipantsPage,
  approvePendingParticipant,
  rejectPendingParticipant,
} from '../../services/participantListService';
import { getCityOptions, getGroupOptions } from '../../services/filterOptionsService';
import type {
  ParticipantFilters,
  ParticipantListItem,
  PendingParticipantListItem,
  ParticipantOrder,
} from '../../types/participantList';

export const Participants = () => {
  const locale = useLocale();
  const navigate = useNavigate();

  // Estados dos filtros
  const [search, setSearch] = useState('');
  const [cityId, setCityId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [order, setOrder] = useState<ParticipantOrder>('name_asc');

  // Debounce para evitar excesso de requisições ao digitar
  const debouncedSearch = useDebounce(search, 400);

  // Chaves de recarregamento para invalidar cache da tabela após mutações
  const [participantsReloadKey, setParticipantsReloadKey] = useState(0);
  const [requestsReloadKey, setRequestsReloadKey] = useState(0);

  // Opções dos Dropdowns carregadas do backend
  const [cityOptions, setCityOptions] = useState<DropdownItemList[]>([]);
  const [groupOptions, setGroupOptions] = useState<DropdownItemList[]>([]);

  useEffect(() => {
    getCityOptions().then(setCityOptions).catch(console.error);
    getGroupOptions().then(setGroupOptions).catch(console.error);
  }, []);

  // Objeto de filtros memoizado
  const filters = useMemo<ParticipantFilters>(
    () => ({
      search: debouncedSearch,
      cityId,
      groupId,
      order,
    }),
    [debouncedSearch, cityId, groupId, order],
  );

  const toggleSort = () => {
    setOrder((prev) => (prev === 'name_asc' ? 'name_desc' : 'name_asc'));
  };

  // --- ABA 1: PARTICIPANTES ---
  const participantColumns: TableColumn[] = useMemo(
    () => [
      { key: 'name', label: 'NOME COMPLETO', align: 'left' },
      { key: 'groups', label: 'GRUPOS', align: 'center' },
      { key: 'attendance', label: 'PRESENÇA (ÚLTIMOS 3)', align: 'center' },
      { key: 'status', label: 'STATUS', align: 'center' },
      { key: 'actions', label: '', align: 'right', width: '3rem' },
    ],
    [],
  );

  const fetchParticipants = useCallback(
    async (request: TablePageRequest): Promise<TablePage> => {
      const { items, total } = await getParticipantsPage(request, filters);

      const rows = items.map((p: ParticipantListItem) => {
        const groupCount = p.group_users?.length ?? 0;
        return {
          name: (
            <Styled.ParticipantNameCell
              onClick={() => navigate(`/participantes/${p.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <span>{p.name}</span>
            </Styled.ParticipantNameCell>
          ),
          groups: (
            <Tag color="neutral">{groupCount === 1 ? '1 grupo' : `${groupCount} grupos`}</Tag>
          ),
          attendance: <Styled.AttendanceList>—</Styled.AttendanceList>,
          status: (
            <Styled.StatusBadge $active={p.is_active}>
              {p.is_active
                ? locale.participants.table.statusActive
                : locale.participants.table.statusInactive}
            </Styled.StatusBadge>
          ),
          actions: (
            <Styled.ActionButton type="button" aria-label="Ações da participante">
              ⋮
            </Styled.ActionButton>
          ),
        };
      });

      return { rows, total };
    },
    [filters, locale, navigate],
  );

  // --- ABA 2: SOLICITAÇÕES ---
  const handleApprove = async (id: string) => {
    try {
      await approvePendingParticipant(id);
      setRequestsReloadKey((k) => k + 1);
      setParticipantsReloadKey((k) => k + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectPendingParticipant(id);
      setRequestsReloadKey((k) => k + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const pendingColumns: TableColumn[] = useMemo(
    () => [
      { key: 'name', label: 'NOME COMPLETO', align: 'left' },
      { key: 'city', label: 'CIDADE', align: 'center' },
      { key: 'contact', label: 'CONTATO', align: 'center' },
      { key: 'actions', label: 'AÇÕES', align: 'right', width: '12rem' },
    ],
    [],
  );

  const fetchPendingParticipants = useCallback(
    async (request: TablePageRequest): Promise<TablePage> => {
      const { items, total } = await getPendingParticipantsPage(request, filters);

      const rows = items.map((p: PendingParticipantListItem) => ({
        name: (
          <Styled.ParticipantNameCell
            onClick={() => navigate(`/participantes/solicitacoes/${p.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <span>{p.name}</span>
          </Styled.ParticipantNameCell>
        ),
        city: p.city || '—',
        contact: (
          <div>
            <div>{p.phone_number}</div>
            {p.instagram_user && <small style={{ color: '#6B7280' }}>@{p.instagram_user}</small>}
          </div>
        ),
        actions: (
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <Button size="sm" variant="secondary" onClick={() => handleReject(p.id)}>
              Recusar
            </Button>
            <Button size="sm" variant="primary" onClick={() => handleApprove(p.id)}>
              Aceitar
            </Button>
          </div>
        ),
      }));

      return { rows, total };
    },
    [filters, navigate],
  );

  const tabsConfig = useMemo(
    () => [
      {
        value: 'participants',
        label: locale.participants.tabs.participants,
        children: (
          <Styled.TableContainer>
            <Table
              key={participantsReloadKey}
              columns={participantColumns}
              fetchPage={fetchParticipants}
              pageSize={6}
              itemLabel="participantes cadastradas"
            />
          </Styled.TableContainer>
        ),
      },
      {
        value: 'requests',
        label: locale.participants.tabs.requests,
        children: (
          <Styled.TableContainer>
            <Table
              key={requestsReloadKey}
              columns={pendingColumns}
              fetchPage={fetchPendingParticipants}
              pageSize={6}
              itemLabel="solicitações pendentes"
            />
          </Styled.TableContainer>
        ),
      },
    ],
    [
      locale,
      participantsReloadKey,
      participantColumns,
      fetchParticipants,
      requestsReloadKey,
      pendingColumns,
      fetchPendingParticipants,
    ],
  );

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
          options={cityOptions}
          onSelect={(val) => setCityId(val)}
        />
        <Dropdown
          placeholder={locale.participants.filters.groupAll}
          options={groupOptions}
          onSelect={(val) => setGroupId(val)}
        />
        <Styled.SortButton type="button" onClick={toggleSort}>
          ⇅ {order === 'name_asc' ? 'Nome (A–Z)' : 'Nome (Z–A)'}
        </Styled.SortButton>
      </Styled.FiltersBar>

      <Tabs tabs={tabsConfig} defaultActive="participants" size="lg" />
    </Styled.Container>
  );
};
