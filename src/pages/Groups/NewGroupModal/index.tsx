import { useEffect, useId, useState } from 'react';

import { Autocomplete } from '../../../components/Autocomplete';
import { Dropdown } from '../../../components/Dropdown';
import { Input } from '../../../components/Input';
import { Modal } from '../../../components/Modal';
import { useLocale } from '../../../hooks/useLocale';
import { interpolate } from '../../../locales';
import { GroupServiceError } from '../../../services/groupErrors';
import {
  getGroupFormOptions,
  type CityOrZoneOption,
  type CoordinatorOption,
} from '../../../services/groupFormService';
import { createGroup } from '../../../services/groupService';

import * as Styled from './styles';

type CreateGroupRequest = typeof createGroup;
type LoadOptionsRequest = () => Promise<[CityOrZoneOption[], CoordinatorOption[], number]>;

const loadOptions = async (): ReturnType<LoadOptionsRequest> => {
  const { citiesAndZones, coordinators, nextGroupNumber } = await getGroupFormOptions();
  return [citiesAndZones, coordinators, nextGroupNumber];
};

export type NewGroupModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  createGroupRequest?: CreateGroupRequest;
  loadOptionsRequest?: LoadOptionsRequest;
};

export const NewGroupModal = ({
  isOpen,
  onClose,
  onSave,
  createGroupRequest = createGroup,
  loadOptionsRequest = loadOptions,
}: NewGroupModalProps) =>
  isOpen ? (
    <NewGroupForm
      onClose={onClose}
      onSave={onSave}
      createGroupRequest={createGroupRequest}
      loadOptionsRequest={loadOptionsRequest}
    />
  ) : null;

type NewGroupFormProps = Omit<
  NewGroupModalProps,
  'isOpen' | 'createGroupRequest' | 'loadOptionsRequest'
> & {
  createGroupRequest: CreateGroupRequest;
  loadOptionsRequest: LoadOptionsRequest;
};

const NewGroupForm = ({
  onClose,
  onSave,
  createGroupRequest,
  loadOptionsRequest,
}: NewGroupFormProps) => {
  const text = useLocale().groups.newGroupModal;
  const nameId = useId();

  const [nextGroupNumber, setNextGroupNumber] = useState<number | null>(null);
  const [cityId, setCityId] = useState('');
  const [coordinatorId, setCoordinatorId] = useState('');

  const [cityOptions, setCityOptions] = useState<CityOrZoneOption[]>([]);
  const [coordinatorOptions, setCoordinatorOptions] = useState<CoordinatorOption[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [citiesAndZones, coordinators, number] = await loadOptionsRequest();

        if (!active) return;

        setCityOptions(citiesAndZones);
        setCoordinatorOptions(coordinators);
        setNextGroupNumber(number);
        setLoadError(null);
      } catch (error) {
        console.error('new-group options loading error', error);

        if (!active) return;

        setLoadError(text.errors.loadOptions);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [loadOptionsRequest, text.errors.loadOptions]);

  const validCity = cityOptions.some((option) => option.value === cityId);

  const canSave = nextGroupNumber !== null && validCity && !isLoading && !loadError && !isSaving;

  const handleSave = async () => {
    if (!canSave) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      await createGroupRequest({
        cityId,
        coordinatorId: coordinatorId || null,
      });

      onSave();
    } catch (error) {
      setSaveError(
        error instanceof GroupServiceError && error.code === 'duplicate_number'
          ? text.errors.duplicate
          : text.errors.generic,
      );
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
      title={text.title}
      description={text.description}
      onConfirm={handleSave}
      confirmText={isSaving ? text.saving : text.save}
      confirmDisabled={!canSave}
      size="lg"
    >
      <Styled.Fields>
        <Input
          id={nameId}
          label={text.name.label}
          placeholder={text.name.loading}
          helperText={text.name.helperText}
          value={
            nextGroupNumber === null
              ? ''
              : interpolate(text.name.template, {
                  number: String(nextGroupNumber).padStart(2, '0'),
                })
          }
          disabled
          fullWidth
        />

        <Autocomplete
          label={text.city.label}
          placeholder={text.city.placeholder}
          options={cityOptions}
          value={cityId || null}
          onChange={(value) => setCityId(value ?? '')}
          minCharacters={3}
          noResultsText={text.city.noResults}
          helperText={isLoading ? text.city.loading : undefined}
          error={loadError ?? undefined}
          disabled={isLoading || !!loadError || isSaving}
          required
        />

        <Dropdown
          label={text.coordinator.label}
          placeholder={text.coordinator.placeholder}
          options={coordinatorOptions}
          onSelect={setCoordinatorId}
          fullWidth
        />

        {saveError && <Styled.ErrorMessage role="alert">{saveError}</Styled.ErrorMessage>}

        {loadError && <Styled.ErrorMessage role="alert">{loadError}</Styled.ErrorMessage>}
      </Styled.Fields>
    </Modal>
  );
};
