import { useId, useState } from 'react';

import { Dropdown } from '../../../components/Dropdown';
import { Input } from '../../../components/Input';
import { Modal } from '../../../components/Modal';
import { useLocale } from '../../../hooks/useLocale';

import { MOCK_CITY_OPTIONS, MOCK_COORDINATOR_OPTIONS } from './mockOptions';
import * as Styled from './styles';

export type NewGroupFormValues = {
  name: string;
  cityId: string;
  coordinatorId: string | null;
};

export type NewGroupModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: NewGroupFormValues) => void;
};

export const NewGroupModal = ({ isOpen, onClose, onSave }: NewGroupModalProps) =>
  isOpen ? <NewGroupForm onClose={onClose} onSave={onSave} /> : null;

const NewGroupForm = ({ onClose, onSave }: Omit<NewGroupModalProps, 'isOpen'>) => {
  const text = useLocale().groups.newGroupModal;
  const nameId = useId();

  const [name, setName] = useState('');
  const [cityId, setCityId] = useState('');
  const [coordinatorId, setCoordinatorId] = useState('');

  const trimmedName = name.trim();
  const canSave = trimmedName !== '' && cityId !== '';

  const handleSave = () => {
    if (!canSave) return;

    onSave({ name: trimmedName, cityId, coordinatorId: coordinatorId || null });
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={text.title}
      description={text.description}
      onConfirm={handleSave}
      confirmText={text.save}
      confirmDisabled={!canSave}
      size="lg"
    >
      <Styled.Fields>
        <Input
          id={nameId}
          label={text.name.label}
          placeholder={text.name.placeholder}
          helperText={text.name.helperText}
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          data-autofocus
        />

        <Dropdown
          label={text.city.label}
          placeholder={text.city.placeholder}
          options={MOCK_CITY_OPTIONS}
          onSelect={setCityId}
          fullWidth
        />

        <Dropdown
          label={text.coordinator.label}
          placeholder={text.coordinator.placeholder}
          options={MOCK_COORDINATOR_OPTIONS}
          onSelect={setCoordinatorId}
          fullWidth
        />
      </Styled.Fields>
    </Modal>
  );
};
