import { useEffect, useId, useState } from 'react';

import { FunctionsHttpError } from '@supabase/functions-js';
import { Dropdown } from '../../../components/Dropdown';
import { Input } from '../../../components/Input';
import { Modal } from '../../../components/Modal';
import { useLocale } from '../../../hooks/useLocale';
import {
  getGroupFormOptions,
  type CityOrZoneOption,
  type CoordinatorOption,
} from '../../../services/groupFormService';
import { createGroup } from '../../../services/groupService';

import * as Styled from './styles';

const GROUP_NUMBER = /^(?:grupo\s*)?\d{1,9}$/i;
type CreateGroupRequest = typeof createGroup;
type LoadOptionsRequest = () => Promise<[CityOrZoneOption[], CoordinatorOption[]]>;

const loadOptions = async (): ReturnType<LoadOptionsRequest> => {
  const { citiesAndZones, coordinators } = await getGroupFormOptions();
  return [citiesAndZones, coordinators];
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

  const [name, setName] = useState('');
  const [cityId, setCityId] = useState('');
  const [coordinatorId, setCoordinatorId] = useState('');
  const [cityOptions, setCityOptions] = useState<CityOrZoneOption[]>([]);
  const [coordinatorOptions, setCoordinatorOptions] = useState<CoordinatorOption[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [citiesAndZones, coordinators] = await loadOptionsRequest();
        if (!active) return;
        setCityOptions(citiesAndZones);
        setCoordinatorOptions(coordinators);
      } catch (error) {
        console.error('new-group options loading error', error);
        if (!active) return;
        const message = error instanceof Error ? error.message : 'erro desconhecido';
        setLoadError(`Não foi possível carregar as opções: ${message}`);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [loadOptionsRequest]);

  const trimmedName = name.trim();
  const isGroupNumberValid = GROUP_NUMBER.test(trimmedName);
  const nameError = trimmedName !== '' && !isGroupNumberValid ? text.name.invalid : undefined;
  const canSave = isGroupNumberValid && cityId !== '' && !isSaving;

  const handleSave = async () => {
    if (!canSave) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      await createGroupRequest({
        name: trimmedName,
        cityId,
        coordinatorId: coordinatorId || null,
      });
      onSave();
    } catch (error) {
      const isDuplicate =
        error instanceof FunctionsHttpError && error.context?.response?.status === 409;
      setSaveError(
        isDuplicate
          ? 'Já existe um grupo com esse número. Escolha outro.'
          : 'Não foi possível criar o grupo. Tente novamente.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={text.title}
      description={text.description}
      onConfirm={handleSave}
      confirmText={isSaving ? 'Salvando...' : text.save}
      confirmDisabled={!canSave}
      size="lg"
    >
      <Styled.Fields>
        <Input
          id={nameId}
          label={text.name.label}
          placeholder={text.name.placeholder}
          helperText={text.name.helperText}
          error={nameError}
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          data-autofocus
        />

        <Dropdown
          label={text.city.label}
          placeholder={text.city.placeholder}
          options={cityOptions}
          onSelect={setCityId}
          fullWidth
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
