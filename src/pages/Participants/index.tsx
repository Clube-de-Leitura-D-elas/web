import { useState, useEffect, useCallback, useMemo } from 'react';
import { LuArrowUpDown } from 'react-icons/lu';
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
import { interpolate, pluralize } from '../../locales';
import {
  getParticipantsPage,
  getPendingParticipantsPage,
  approvePendingParticipant,
  rejectPendingParticipant,
} from '../../services/participantListService';
import { getParticipantFilterOptions } from '../../services/filterOptionsService';
import type {
  ActiveGroupsSummary,
  ParticipantFilters,
  ParticipantListItem,
  PendingParticipantListItem,
  ParticipantOrder,
} from '../../types/participantList';

type ParticipantsTab = 'participants' | 'requests';

export const Participants = () => {
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<ParticipantsTab>('participants');

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
  const [groupsSummary, setGroupsSummary] = useState<ActiveGroupsSummary | null>(null);

  useEffect(() => {
    getParticipantFilterOptions()
      .then(({ cityOptions, groupOptions, summary }) => {
        setCityOptions(cityOptions);
        setGroupOptions(groupOptions);
        setGroupsSummary(summary);
      })
      .catch(console.error);
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

  const pendingFilters = useMemo(
    () => ({ search: debouncedSearch, order }),
    [debouncedSearch, order],
  );

  const toggleSort = () => {
    setOrder((prev) => (prev === 'name_asc' ? 'name_desc' : 'name_asc'));
  };

  // --- ABA 1: PARTICIPANTES ---
  const participantColumns: TableColumn[] = useMemo(
    () => [
      { key: 'name', label: locale.participants.table.columns.name, align: 'left' },
      { key: 'groups', label: locale.participants.table.columns.groups, align: 'center' },
      {
        key: 'attendance',
        label: locale.participants.table.columns.attendance,
        align: 'center',
      },
      { key: 'status', label: locale.participants.table.columns.status, align: 'center' },
    ],
    [locale],
  );

  const fetchParticipants = useCallback(
    async (request: TablePageRequest): Promise<TablePage> => {
      const { items, total } = await getParticipantsPage(request, filters);

      const rows = items.map((p: ParticipantListItem) => {
        const groupCount = p.group_users?.length ?? 0;
        return {
          name: (
            <Styled.ParticipantLink to={`/participantes/${p.id}`}>{p.name}</Styled.ParticipantLink>
          ),
          groups: (
            <Tag color="neutral">
              {groupCount === 1
                ? locale.participants.table.groupCountSingle
                : interpolate(locale.participants.table.groupsCount, { count: groupCount })}
            </Tag>
          ),
          attendance: (
            <Styled.AttendanceList>{locale.participants.table.emptyValue}</Styled.AttendanceList>
          ),
          status: (
            <Styled.StatusBadge $active={p.is_active}>
              {p.is_active
                ? locale.participants.table.statusActive
                : locale.participants.table.statusInactive}
            </Styled.StatusBadge>
          ),
        };
      });

      return { rows, total };
    },
    [filters, locale],
  );

  // --- ABA 2: SOLICITAÇÕES ---
  const handleApprove = async (id: string) => {
    try {
      await approvePendingParticipant(id);
    } catch (err) {
      console.error(err);
    } finally {
      setRequestsReloadKey((k) => k + 1);
      setParticipantsReloadKey((k) => k + 1);
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
      { key: 'name', label: locale.participants.requests.columns.name, align: 'left' },
      { key: 'city', label: locale.participants.requests.columns.city, align: 'center' },
      { key: 'contact', label: locale.participants.requests.columns.contact, align: 'center' },
      {
        key: 'actions',
        label: locale.participants.requests.columns.actions,
        align: 'right',
        width: '12rem',
      },
    ],
    [locale],
  );

  const fetchPendingParticipants = useCallback(
    async (request: TablePageRequest): Promise<TablePage> => {
      const { items, total } = await getPendingParticipantsPage(request, pendingFilters);

      const rows = items.map((p: PendingParticipantListItem) => ({
        name: <Styled.ParticipantName>{p.name}</Styled.ParticipantName>,
        city: p.city || locale.participants.table.emptyValue,
        contact: (
          <Styled.Contact>
            <span>{p.phone_number}</span>
            {p.instagram_user && (
              <Styled.ContactSecondary>@{p.instagram_user}</Styled.ContactSecondary>
            )}
          </Styled.Contact>
        ),
        actions: (
          <Styled.RequestActions>
            <Button
              size="sm"
              variant="secondary"
              aria-label={interpolate(locale.participants.requests.rejectAriaLabel, {
                name: p.name,
              })}
              onClick={() => handleReject(p.id)}
            >
              {locale.participants.requests.reject}
            </Button>
            <Button
              size="sm"
              variant="primary"
              aria-label={interpolate(locale.participants.requests.approveAriaLabel, {
                name: p.name,
              })}
              onClick={() => handleApprove(p.id)}
            >
              {locale.participants.requests.approve}
            </Button>
          </Styled.RequestActions>
        ),
      }));

      return { rows, total };
    },
    [pendingFilters, locale],
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
              itemLabel={locale.participants.table.itemLabel}
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
              itemLabel={locale.participants.requests.itemLabel}
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
        {groupsSummary && (
          <Styled.Subtitle>
            {interpolate(locale.participants.subtitle, {
              groups: pluralize(locale.participants.activeGroupsCount, groupsSummary.groups),
              cities: pluralize(locale.participants.citiesCount, groupsSummary.cities),
            })}
          </Styled.Subtitle>
        )}
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
          disabled={activeTab === 'requests'}
        />
        <Dropdown
          placeholder={locale.participants.filters.groupAll}
          options={groupOptions}
          onSelect={(val) => setGroupId(val)}
          disabled={activeTab === 'requests'}
        />
        <Styled.SortButton type="button" onClick={toggleSort}>
          <LuArrowUpDown aria-hidden />
          {order === 'name_asc'
            ? locale.participants.filters.sortNameAsc
            : locale.participants.filters.sortNameDesc}
        </Styled.SortButton>
      </Styled.FiltersBar>

      <Tabs
        tabs={tabsConfig}
        active={activeTab}
        onChange={(value) => setActiveTab(value as ParticipantsTab)}
        size="lg"
      />
    </Styled.Container>
  );
};
