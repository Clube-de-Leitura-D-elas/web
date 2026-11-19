import { useCallback, useMemo, useRef, useState } from 'react';
import { LuPlus } from 'react-icons/lu';

import { ActionMenu } from '../../components/ActionMenu';
import { Button } from '../../components/Button';
import { Dropdown } from '../../components/Dropdown';
import { Input } from '../../components/Input';
import { Modal } from '../../components/Modal';
import {
  Table,
  type TableColumn,
  type TablePage,
  type TablePageRequest,
} from '../../components/Table';
import { Tag } from '../../components/Tag';
import { Toast, type ToastVariant } from '../../components/Toast';
import { useDebounce } from '../../hooks/useDebounce';
import { useLocale } from '../../hooks/useLocale';
import { interpolate, pluralize } from '../../locales';
import { CityServiceError } from '../../services/cityErrors';
import { getCityGrid, updateCityStatus } from '../../services/cityService';
import type { CitiesSummary, CityFilters, CityListItem, CityStatusFilter } from '../../types/city';
import { CityModal } from './CityModal';
import * as Styled from './styles';

const VISIBLE_ZONES = 3;
const MAX_SEARCH_LENGTH = 100;

type ToastState = { id: number; variant: ToastVariant; message: string };

export const CitiesSettings = () => {
  const {
    settings: { cities: text },
  } = useLocale();

  const [search, setSearch] = useState('');
  const [uf, setUf] = useState('');
  const [status, setStatus] = useState<CityStatusFilter>('all');
  const debouncedSearch = useDebounce(search, 400);

  const [ufs, setUfs] = useState<string[]>([]);
  const [summary, setSummary] = useState<CitiesSummary | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const latestRequest = useRef(0);
  const isChangingStatus = useRef(false);

  const [editing, setEditing] = useState<CityListItem | null | undefined>(undefined);
  const [deactivating, setDeactivating] = useState<CityListItem | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const filters = useMemo<CityFilters>(
    () => ({ search: debouncedSearch, uf, status }),
    [debouncedSearch, uf, status],
  );

  const showToast = (variant: ToastVariant, message: string) =>
    setToast({ id: Date.now(), variant, message });

  const refresh = () => setRefreshKey((key) => key + 1);

  const changeStatus = useCallback(
    async (city: CityListItem, isActive: boolean) => {
      if (isChangingStatus.current) return;
      isChangingStatus.current = true;
      setIsUpdatingStatus(true);

      try {
        await updateCityStatus(city.id, isActive);
        setDeactivating((current) => (current?.id === city.id ? null : current));
        setToast({
          id: Date.now(),
          variant: 'success',
          message: interpolate(isActive ? text.toast.reactivated : text.toast.deactivated, {
            name: city.name,
          }),
        });
        setRefreshKey((key) => key + 1);
      } catch (error) {
        console.error('update-city-status error', error);
        setDeactivating((current) => (current?.id === city.id ? null : current));
        setToast({
          id: Date.now(),
          variant: 'error',
          message:
            error instanceof CityServiceError && error.code === 'city_has_active_groups'
              ? interpolate(
                  error.activeGroups === null
                    ? text.toast.activeGroupsErrorWithoutCount
                    : pluralize(text.toast.activeGroupsError, error.activeGroups),
                  { name: city.name },
                )
              : text.toast.statusError,
        });
      } finally {
        isChangingStatus.current = false;
        setIsUpdatingStatus(false);
      }
    },
    [text],
  );

  const columns: TableColumn[] = useMemo(
    () => [
      { key: 'name', label: text.table.columns.name, align: 'left', width: '20%' },
      { key: 'uf', label: text.table.columns.uf, align: 'center', width: '10%' },
      { key: 'zones', label: text.table.columns.zones, align: 'center', width: '36%' },
      { key: 'groups', label: text.table.columns.groups, align: 'center', width: '10%' },
      { key: 'status', label: text.table.columns.status, align: 'center', width: '14%' },
      {
        key: 'actions',
        label: <Styled.VisuallyHidden>{text.table.columns.actions}</Styled.VisuallyHidden>,
        align: 'right',
        width: '4.5rem',
      },
    ],
    [text],
  );

  const fetchCities = useCallback(
    async (request: TablePageRequest): Promise<TablePage> => {
      const requestId = ++latestRequest.current;
      const response = await getCityGrid(request, filters);

      if (requestId === latestRequest.current) {
        setUfs(response.ufs);
        setSummary(response.summary);
      }

      const rows = response.items.map((city) => {
        const activeZones = city.zones.filter((zone) => zone.isActive);
        const hiddenZones = activeZones.length - VISIBLE_ZONES;
        const deactivateBlocked = city.activeGroups > 0;

        return {
          name: <Styled.CityName>{city.name}</Styled.CityName>,
          uf: (
            <Styled.UfCode title={text.ufs[city.uf as keyof typeof text.ufs]}>
              {city.uf}
            </Styled.UfCode>
          ),
          zones:
            activeZones.length > 0 ? (
              <Styled.ZoneTags>
                {activeZones.slice(0, VISIBLE_ZONES).map((zone) => (
                  <Tag key={zone.id} color="neutral">
                    {zone.name}
                  </Tag>
                ))}
                {hiddenZones > 0 && (
                  <Tag color="neutral">
                    <span aria-hidden>
                      {interpolate(text.table.moreZones, { count: hiddenZones })}
                    </span>
                    <Styled.VisuallyHidden>
                      {pluralize(text.table.moreZonesLabel, hiddenZones)}
                    </Styled.VisuallyHidden>
                  </Tag>
                )}
              </Styled.ZoneTags>
            ) : (
              <Styled.Muted>{text.table.noZones}</Styled.Muted>
            ),
          groups: city.groups,
          status: city.isActive ? (
            <Tag color="success">{text.table.statusActive}</Tag>
          ) : (
            <Tag color="error">{text.table.statusInactive}</Tag>
          ),
          actions: (
            <ActionMenu
              ariaLabel={interpolate(text.table.actionsAriaLabel, { name: city.name })}
              items={[
                { label: text.table.edit, onClick: () => setEditing(city) },
                city.isActive
                  ? {
                      label: text.table.deactivate,
                      variant: 'danger' as const,
                      disabled: deactivateBlocked,
                      hint: deactivateBlocked
                        ? pluralize(text.table.deactivateBlocked, city.activeGroups)
                        : undefined,
                      onClick: () => setDeactivating(city),
                    }
                  : {
                      label: text.table.reactivate,
                      onClick: () => void changeStatus(city, true),
                    },
              ]}
            />
          ),
        };
      });

      return { rows, total: response.total };
    },
    [filters, text, changeStatus],
  );

  const ufOptions = useMemo(
    () => [
      { value: '', label: text.filters.ufAll },
      ...ufs.map((code) => ({
        value: code,
        label: interpolate(text.filters.ufOption, { uf: code }),
      })),
    ],
    [ufs, text],
  );

  const statusOptions = useMemo(
    () => [
      { value: 'all', label: text.filters.statusAll },
      { value: 'active', label: text.filters.statusActive },
      { value: 'inactive', label: text.filters.statusInactive },
    ],
    [text],
  );

  return (
    <Styled.Section>
      <Styled.Toolbar>
        <Styled.SectionSummary>
          {summary &&
            interpolate(text.summary, {
              cities: pluralize(text.activeCitiesCount, summary.activeCities),
              zones: pluralize(text.activeZonesCount, summary.activeZones),
            })}
        </Styled.SectionSummary>

        <Button
          variant="primary"
          size="md"
          icon={<LuPlus aria-hidden />}
          onClick={() => setEditing(null)}
        >
          {text.newCity}
        </Button>
      </Styled.Toolbar>

      <Styled.FiltersBar>
        <Input
          id="search-city"
          label={text.filters.searchPlaceholder}
          placeholder={text.filters.searchPlaceholder}
          value={search}
          maxLength={MAX_SEARCH_LENGTH}
          onChange={(event) => setSearch(event.target.value)}
        />

        <Dropdown placeholder={text.filters.ufAll} options={ufOptions} onSelect={setUf} />

        <Dropdown
          placeholder={text.filters.statusAll}
          options={statusOptions}
          onSelect={(value) => setStatus(value as CityStatusFilter)}
        />
      </Styled.FiltersBar>

      <Styled.TableContainer>
        <Table
          reloadKey={refreshKey}
          columns={columns}
          fetchPage={fetchCities}
          pageSize={8}
          itemLabel={text.table.itemLabel}
        />
      </Styled.TableContainer>

      {editing !== undefined && (
        <CityModal
          city={editing}
          onClose={() => setEditing(undefined)}
          onSaved={(name) => {
            showToast(
              'success',
              interpolate(editing ? text.toast.updated : text.toast.created, { name }),
            );
            setEditing(undefined);
            refresh();
          }}
        />
      )}

      <Modal
        isOpen={deactivating !== null}
        onClose={() => {
          if (!isUpdatingStatus) setDeactivating(null);
        }}
        title={interpolate(text.deactivateModal.title, { name: deactivating?.name ?? '' })}
        description={interpolate(text.deactivateModal.description, {
          name: deactivating?.name ?? '',
        })}
        onConfirm={() => {
          if (deactivating) void changeStatus(deactivating, false);
        }}
        confirmText={
          isUpdatingStatus ? text.deactivateModal.confirming : text.deactivateModal.confirm
        }
        confirmDisabled={isUpdatingStatus}
        size="sm"
      />

      {toast && (
        <Toast key={toast.id} variant={toast.variant} onDismiss={() => setToast(null)}>
          {toast.message}
        </Toast>
      )}
    </Styled.Section>
  );
};
