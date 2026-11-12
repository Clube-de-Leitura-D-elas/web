import { useState } from 'react';
import { LuCheck, LuTriangleAlert } from 'react-icons/lu';
import { useLocale } from '../../hooks/useLocale';
import { interpolate } from '../../locales';
import { Button } from '../Button';
import { Dropdown } from '../Dropdown';
import { Modal } from '../Modal';
import * as Styled from './styles';

export type CoordinatorCandidate = {
  id: string;
  name: string;
};

export type RemoveFromGroupModalProps = {
  isOpen: boolean;
  personName: string;
  groupLabel: string;
  isCoordinator: boolean;
  candidates?: CoordinatorCandidate[];
  saving?: boolean;
  error?: string | null;
  onClose: () => void;
  onConfirm: (newCoordinatorId: string | null) => void;
};

export const RemoveFromGroupModal = (props: RemoveFromGroupModalProps) =>
  props.isOpen ? <RemoveFromGroupModalContent {...props} /> : null;

const RemoveFromGroupModalContent = ({
  personName,
  groupLabel,
  isCoordinator,
  candidates = [],
  saving = false,
  error = null,
  onClose,
  onConfirm,
}: RemoveFromGroupModalProps) => {
  const { removeFromGroup: text } = useLocale();
  const [newCoordinatorId, setNewCoordinatorId] = useState<string | null>(null);

  const blocked = isCoordinator && newCoordinatorId === null;
  const firstName = personName.split(' ')[0];

  const handleClose = () => {
    if (!saving) onClose();
  };

  return (
    <Modal
      isOpen
      onClose={handleClose}
      title={interpolate(text.title, { name: personName, group: groupLabel })}
      description={text.description}
    >
      <Styled.Content>
        <Styled.KeepList>
          <li>
            <LuCheck aria-hidden />
            {text.keepsHistory}
          </li>
          <li>
            <LuCheck aria-hidden />
            {text.keepsProfile}
          </li>
        </Styled.KeepList>

        {isCoordinator && (
          <Styled.Warning>
            <Styled.WarningText>
              <LuTriangleAlert aria-hidden />
              {candidates.length > 0
                ? interpolate(text.coordinatorWarning, { name: firstName })
                : interpolate(text.noCandidates, { name: firstName })}
            </Styled.WarningText>

            {candidates.length > 0 && (
              <Dropdown
                label={text.newCoordinator}
                placeholder={text.newCoordinatorPlaceholder}
                options={candidates.map(({ id, name }) => ({ value: id, label: name }))}
                onSelect={setNewCoordinatorId}
                fullWidth
              />
            )}
          </Styled.Warning>
        )}

        {error && <Styled.Error role="alert">{error}</Styled.Error>}

        <Styled.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={saving}>
            {text.cancel}
          </Button>
          <Button
            variant="danger"
            disabled={blocked || saving}
            onClick={() => onConfirm(isCoordinator ? newCoordinatorId : null)}
          >
            {saving ? text.removing : text.confirm}
          </Button>
        </Styled.Footer>
      </Styled.Content>
    </Modal>
  );
};
