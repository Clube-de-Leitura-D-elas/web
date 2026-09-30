import { useCallback, useMemo, useState } from 'react';
import { LuTriangleAlert } from 'react-icons/lu';

import * as Styled from './styles';

import { Button } from '../../components/Button';
import { Dropdown, type DropdownItemList } from '../../components/Dropdown';
import { Input } from '../../components/Input';
import {
  Table,
  type TableColumn,
  type TablePage,
  type TablePageRequest,
} from '../../components/Table';
import { Tag } from '../../components/Tag';

import { useDebounce } from '../../hooks/useDebounce';
import { useLocale } from '../../hooks/useLocale';
import { interpolate, pluralize } from '../../locales';

import { getGroupGrid } from '../../services/groupListService';

import type { GroupFilters, GroupListItem, GroupOrder, GroupsSummary } from '../../types/groupList';

import { formatMeetingDate, formatMonthYear } from '../../utils/date';

export const Groups = () => {
  // =========================
  // Estados dos filtros
  // =========================
  const locale = useLocale();
  const [search, setSearch] = useState('');
  const [cityId, setCityId] = useState('');
  const [order, setOrder] = useState<GroupOrder>('name_asc');

  // Evita fazer uma requisição a cada tecla digitada
  const debouncedSearch = useDebounce(search, 400);

  // =========================
  // Opções dos filtros
  // =========================

  // Cidades e resumo vêm na mesma resposta da tabela (group-grid-web)
  const [cityOptions, setCityOptions] = useState<DropdownItemList[]>([
    { value: '', label: locale.groups.filters.cityAll },
  ]);
  const [groupsSummary, setGroupsSummary] = useState<GroupsSummary | null>(null);

  // =========================
  // Filtros
  // =========================

  const filters = useMemo<GroupFilters>(
    () => ({
      search: debouncedSearch,
      cityId,
      order,
    }),
    [debouncedSearch, cityId, order],
  );

  // =========================
  // Colunas da tabela
  // =========================

  const groupColumns: TableColumn[] = useMemo(
    () => [
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
    ],
    [locale],
  );

  // =========================
  // Busca dos grupos
  // =========================

  const fetchGroups = useCallback(
    async (request: TablePageRequest): Promise<TablePage> => {
      const { items, total, summary, cities } = await getGroupGrid(request, filters);

      setGroupsSummary(summary);
      setCityOptions([
        { value: '', label: locale.groups.filters.cityAll },
        ...cities.map((city) => ({ value: city.id, label: city.name })),
      ]);

      const rows = items.map((group: GroupListItem) => ({
        name: (
          <Styled.GroupInfo>
            <Styled.GroupName>{group.name}</Styled.GroupName>

            <Styled.GroupCreatedAt>
              {interpolate(locale.groups.table.createdAt, {
                date: formatMonthYear(group.createdAt),
              })}
            </Styled.GroupCreatedAt>
          </Styled.GroupInfo>
        ),

        city: group.city?.name ?? locale.groups.table.emptyCity,

        coordinator: group.coordinator ? (
          <Tag color="neutral">{group.coordinator}</Tag>
        ) : (
          <Tag color="warning">
            <LuTriangleAlert size={12} aria-hidden="true" />
            {locale.groups.table.emptyCoordinator}
          </Tag>
        ),

        members: group.members,

        nextMeeting: group.nextMeetingAt ? (
          formatMeetingDate(group.nextMeetingAt)
        ) : (
          <Tag color="warning">
            <LuTriangleAlert size={12} aria-hidden="true" />
            {locale.groups.table.emptyNextMeeting}
          </Tag>
        ),

        status:
          group.status === 'active' ? (
            <Tag color="success">{locale.groups.table.statusActive}</Tag>
          ) : (
            <Tag color="error">{locale.groups.table.statusClosed}</Tag>
          ),
      }));

      return { rows, total };
    },
    [filters, locale],
  );

  // =========================
  // Renderização
  // =========================

  return (
    <Styled.Container>
      {/* Cabeçalho */}
      <Styled.Header>
        <Styled.Title>{locale.groups.title}</Styled.Title>

        {groupsSummary && (
          <Styled.Subtitle>
            {interpolate(locale.groups.subtitle, {
              groups: pluralize(locale.groups.activeGroupsCount, groupsSummary.activeGroups),
              cities: pluralize(locale.groups.citiesCount, groupsSummary.cities),
            })}
          </Styled.Subtitle>
        )}
      </Styled.Header>

      {/* Filtros */}
      <Styled.FiltersBar>
        <Input
          id="search-group"
          label={locale.groups.filters.searchPlaceholder}
          placeholder={locale.groups.filters.searchPlaceholder}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <Dropdown
          placeholder={locale.groups.filters.cityAll}
          options={cityOptions}
          onSelect={(value) => setCityId(value)}
        />

        <Dropdown
          placeholder={
            order === 'name_asc'
              ? locale.groups.filters.sortNameAsc
              : locale.groups.filters.sortNameDesc
          }
          options={[
            {
              label: locale.groups.filters.sortNameAsc,
              value: 'name_asc',
            },
            {
              label: locale.groups.filters.sortNameDesc,
              value: 'name_desc',
            },
          ]}
          onSelect={(value) => setOrder(value as GroupOrder)}
        />

        <Button variant="primary" size="md" onClick={() => {}}>
          {locale.groups.newGroup}
        </Button>
      </Styled.FiltersBar>

      {/* Tabela */}
      <Styled.TableContainer>
        <Table
          columns={groupColumns}
          fetchPage={fetchGroups}
          pageSize={6}
          itemLabel={locale.groups.table.itemLabel}
        />
      </Styled.TableContainer>
    </Styled.Container>
  );
};
