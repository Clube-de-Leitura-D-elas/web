import { useId, useMemo, useRef, useState } from 'react';
import { LuPlus } from 'react-icons/lu';

import { Autocomplete } from '../../../components/Autocomplete';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Modal } from '../../../components/Modal';
import { Tag } from '../../../components/Tag';
import { useLocale } from '../../../hooks/useLocale';
import { interpolate, pluralize } from '../../../locales';
import { CityServiceError } from '../../../services/cityErrors';
import { saveCity } from '../../../services/cityService';
import type { CityListItem } from '../../../types/city';

import * as Styled from './styles';
import { normalizeText } from '../../../utils/text';

type ZoneRow = {
  key: string;
  id: string | null;
  name: string;
  isActive: boolean;
  activeGroups: number;
};

export type CityModalProps = {
  city: CityListItem | null;
  onClose: () => void;
  onSaved: (name: string) => void;
  saveRequest?: typeof saveCity;
};

export const CityModal = ({ city, onClose, onSaved, saveRequest = saveCity }: CityModalProps) => {
  const {
    settings: {
      cities: { modal: text, ufs },
    },
  } = useLocale();
  const baseId = useId();
  const nextZoneKey = useRef(0);

  const [name, setName] = useState(city?.name ?? '');
  const [uf, setUf] = useState(city?.uf ?? '');
  const [zones, setZones] = useState<ZoneRow[]>(
    () => city?.zones.map((zone) => ({ ...zone, key: zone.id })) ?? [],
  );
  const [submitted, setSubmitted] = useState(false);
  const [checkedZoneKeys, setCheckedZoneKeys] = useState<ReadonlySet<string>>(() => new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [duplicateCityUf, setDuplicateCityUf] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const ufOptions = useMemo(
    () =>
      Object.entries(ufs).map(([code, ufName]) => ({
        value: code,
        label: interpolate(text.uf.option, { uf: code, name: ufName }),
      })),
    [ufs, text.uf.option],
  );

  const zoneErrors = useMemo(() => {
    const seen = new Set<string>();

    return zones.map((zone) => {
      const normalized = normalizeText(zone.name);
      if (!normalized) return text.errors.zoneRequired;
      if (seen.has(normalized)) return text.errors.zoneDuplicate;
      seen.add(normalized);
      return null;
    });
  }, [zones, text.errors]);

  const nameError = !name.trim()
    ? text.errors.nameRequired
    : duplicateCityUf
      ? interpolate(text.errors.duplicateCity, { uf: duplicateCityUf })
      : null;
  const ufError = uf ? null : text.errors.ufRequired;
  const isValid = !nameError && !ufError && zoneErrors.every((error) => error === null);

  const updateZone = (key: string, changes: Partial<ZoneRow>) =>
    setZones((current) =>
      current.map((zone) => (zone.key === key ? { ...zone, ...changes } : zone)),
    );

  const addZone = () => {
    nextZoneKey.current += 1;
    setZones((current) => [
      ...current,
      { key: `new-${nextZoneKey.current}`, id: null, name: '', isActive: true, activeGroups: 0 },
    ]);
  };

  const removeZone = (key: string) =>
    setZones((current) => current.filter((zone) => zone.key !== key));

  const handleSave = async () => {
    setSubmitted(true);
    setCheckedZoneKeys(new Set(zones.map((zone) => zone.key)));
    if (!isValid || isSaving) return;

    setIsSaving(true);
    setSaveError(null);

    const trimmedName = name.trim().replace(/\s+/g, ' ');

    try {
      await saveRequest({
        cityId: city?.id ?? null,
        name: trimmedName,
        uf,
        zones: zones.map((zone) => ({
          id: zone.id,
          name: zone.name.trim().replace(/\s+/g, ' '),
          isActive: zone.isActive,
        })),
      });
      onSaved(trimmedName);
    } catch (error) {
      if (error instanceof CityServiceError && error.code === 'duplicate_city') {
        setDuplicateCityUf(uf);
      } else if (error instanceof CityServiceError && error.code === 'duplicate_zone') {
        setSaveError(text.errors.duplicateZone);
      } else if (error instanceof CityServiceError && error.code === 'zone_has_active_groups') {
        setSaveError(interpolate(text.errors.zoneHasActiveGroups, { zone: error.zone ?? '' }));
      } else {
        console.error('save-city error', error);
        setSaveError(text.errors.generic);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={() => {
        if (!isSaving) onClose();
      }}
      title={city ? interpolate(text.editTitle, { name: city.name }) : text.createTitle}
      description={text.description}
      onConfirm={handleSave}
      confirmText={isSaving ? text.saving : text.save}
      confirmDisabled={isSaving}
      size="lg"
    >
      <Styled.Fields>
        <Input
          id={`${baseId}-name`}
          label={text.name.label}
          placeholder={text.name.placeholder}
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setDuplicateCityUf(null);
          }}
          error={submitted || duplicateCityUf ? (nameError ?? undefined) : undefined}
          disabled={isSaving}
          required
          fullWidth
          data-autofocus
        />

        <Autocomplete
          id={`${baseId}-uf`}
          label={text.uf.label}
          placeholder={text.uf.placeholder}
          options={ufOptions}
          value={uf || null}
          onChange={(value) => {
            setUf(value ?? '');
            setDuplicateCityUf(null);
          }}
          minCharacters={1}
          maxSuggestions={ufOptions.length}
          noResultsText={text.uf.noResults}
          error={submitted ? (ufError ?? undefined) : undefined}
          selectOnFocus
          disabled={isSaving}
          required
        />

        <Styled.ZonesSection>
          <Styled.ZonesTitle>{text.zones.title}</Styled.ZonesTitle>
          <Styled.ZonesDescription>{text.zones.description}</Styled.ZonesDescription>

          {zones.length === 0 ? (
            <Styled.EmptyZones>{text.zones.empty}</Styled.EmptyZones>
          ) : (
            <Styled.ZoneList>
              {zones.map((zone, index) => {
                const label = interpolate(text.zones.label, { index: index + 1 });
                const zoneName = zone.name.trim() || label;
                const blocked = zone.id !== null && zone.isActive && zone.activeGroups > 0;

                return (
                  <Styled.ZoneRow key={zone.key}>
                    <Input
                      id={`${baseId}-zone-${zone.key}`}
                      label={label}
                      placeholder={text.zones.placeholder}
                      value={zone.name}
                      onChange={(event) => updateZone(zone.key, { name: event.target.value })}
                      error={
                        checkedZoneKeys.has(zone.key) ? (zoneErrors[index] ?? undefined) : undefined
                      }
                      helperText={
                        blocked ? pluralize(text.zones.blockedHint, zone.activeGroups) : undefined
                      }
                      disabled={isSaving}
                      fullWidth
                    />

                    <Styled.ZoneActions>
                      {zone.id === null ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={interpolate(text.zones.removeLabel, { name: zoneName })}
                          onClick={() => removeZone(zone.key)}
                          disabled={isSaving}
                        >
                          {text.zones.remove}
                        </Button>
                      ) : zone.isActive ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={interpolate(text.zones.deactivateLabel, { name: zoneName })}
                          onClick={() => updateZone(zone.key, { isActive: false })}
                          disabled={isSaving || blocked}
                        >
                          {text.zones.deactivate}
                        </Button>
                      ) : (
                        <>
                          <Tag color="neutral">{text.zones.inactiveTag}</Tag>
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label={interpolate(text.zones.reactivateLabel, { name: zoneName })}
                            onClick={() => updateZone(zone.key, { isActive: true })}
                            disabled={isSaving}
                          >
                            {text.zones.reactivate}
                          </Button>
                        </>
                      )}
                    </Styled.ZoneActions>
                  </Styled.ZoneRow>
                );
              })}
            </Styled.ZoneList>
          )}

          <Styled.AddZone>
            <Button
              variant="secondary"
              size="sm"
              icon={<LuPlus aria-hidden />}
              onClick={addZone}
              disabled={isSaving}
            >
              {text.zones.add}
            </Button>
          </Styled.AddZone>
        </Styled.ZonesSection>

        {saveError && <Styled.ErrorMessage role="alert">{saveError}</Styled.ErrorMessage>}
      </Styled.Fields>
    </Modal>
  );
};
