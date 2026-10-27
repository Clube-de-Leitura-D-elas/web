import { useMemo, useState } from 'react';

import { Autocomplete } from '../../components/Autocomplete';
import { Input } from '../../components/Input';
import { Modal } from '../../components/Modal';
import { locale } from '../../locales';
import type {
  Participant,
  ParticipantFormValues,
  ParticipantOption,
} from '../../types/participant';

import * as Styled from './styles';

type ParticipantModalProps = {
  isOpen: boolean;
  participant: Participant;
  cities: ParticipantOption[];
  zones: ParticipantOption[];
  onClose: () => void;
  onConfirm: (values: ParticipantFormValues) => void;
  saving?: boolean;
  error?: string | null;
};

const findIdByName = (options: ParticipantOption[], name: string | null) =>
  name ? (options.find((option) => option.name === name)?.id ?? null) : null;

const toAutocompleteOptions = (options: ParticipantOption[]) =>
  options.map(({ id, name }) => ({ value: id, label: name }));

export const ParticipantModal = (props: ParticipantModalProps) =>
  props.isOpen ? <ParticipantModalContent {...props} /> : null;

const ParticipantModalContent = ({
  participant,
  cities,
  zones,
  onClose,
  onConfirm,
  saving = false,
  error = null,
}: ParticipantModalProps) => {
  const modalLocale = locale.participant_details.modal;

  const isFounder = participant.appRole === 'FOUNDER';

  const [name, setName] = useState(participant.name);
  const [email, setEmail] = useState(participant.email);
  const [phone, setPhone] = useState(participant.phone ?? '');
  const [instagram, setInstagram] = useState(participant.instagram ?? '');
  const [birthDate, setBirthDate] = useState(participant.birthDate?.slice(0, 10) ?? '');
  const [job, setJob] = useState(participant.job ?? '');
  const [isManager, setIsManager] = useState(participant.appRole === 'MANAGER');

  const [cityChoice, setCityChoice] = useState<string | null | undefined>(undefined);
  const [zoneChoice, setZoneChoice] = useState<string | null | undefined>(undefined);

  const cityId = cityChoice === undefined ? findIdByName(cities, participant.city) : cityChoice;
  const zoneId = zoneChoice === undefined ? findIdByName(zones, participant.zone) : zoneChoice;

  const cityOptions = useMemo(() => toAutocompleteOptions(cities), [cities]);
  const zoneOptions = useMemo(() => toAutocompleteOptions(zones), [zones]);

  const isValid =
    Boolean(name.trim()) &&
    Boolean(email.trim()) &&
    Boolean(phone.trim()) &&
    Boolean(birthDate) &&
    cityId !== null;

  const handleConfirm = () => {
    if (!isValid || saving) return;

    const city = cities.find((option) => option.id === cityId);
    if (!city) return;

    const zone = zoneId ? zones.find((option) => option.id === zoneId) : undefined;

    onConfirm({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      instagram: instagram.trim(),
      cityId: city.id,
      city: city.name,
      zoneId: zone?.id ?? null,
      zone: zone?.name ?? null,
      birthDate,
      job: job.trim(),
      appRole: isFounder ? 'FOUNDER' : isManager ? 'MANAGER' : 'READER',
    });
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={modalLocale.title}
      description={modalLocale.description}
      onConfirm={handleConfirm}
      confirmText={saving ? modalLocale.saving : modalLocale.save}
      confirmDisabled={!isValid || saving}
      size="lg"
    >
      <Styled.ModalForm>
        <Input
          id="participant-name"
          label={modalLocale.name}
          placeholder={modalLocale.placeName}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <Input
          id="participant-email"
          label={modalLocale.email}
          placeholder={modalLocale.placeEmail}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <Styled.FormRow>
          <Input
            id="participant-phone"
            label={modalLocale.telephone}
            placeholder={modalLocale.placeTelephone}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />

          <Input
            id="participant-instagram"
            label={modalLocale.instagram}
            placeholder={modalLocale.placeInstagram}
            value={instagram}
            onChange={(event) => setInstagram(event.target.value)}
          />
        </Styled.FormRow>

        <Styled.FormRow>
          <Autocomplete
            id="participant-city"
            label={modalLocale.city}
            placeholder={modalLocale.placeCity}
            options={cityOptions}
            value={cityId}
            onChange={setCityChoice}
            minCharacters={1}
            helperText={modalLocale.cityHint}
            required
          />

          <Autocomplete
            id="participant-zone"
            label={modalLocale.zone}
            placeholder={modalLocale.placeZone}
            options={zoneOptions}
            value={zoneId}
            onChange={setZoneChoice}
            minCharacters={1}
          />
        </Styled.FormRow>

        <Styled.FormRow>
          <Input
            id="participant-birthday"
            label={modalLocale.birthday}
            type="date"
            value={birthDate}
            onChange={(event) => setBirthDate(event.target.value)}
          />

          <Input
            id="participant-job"
            label={modalLocale.job}
            placeholder={modalLocale.placeJob}
            value={job}
            onChange={(event) => setJob(event.target.value)}
          />
        </Styled.FormRow>

        {!isFounder && (
          <Styled.CheckboxField htmlFor="participant-app-role">
            <Styled.Checkbox
              id="participant-app-role"
              type="checkbox"
              checked={isManager}
              onChange={(event) => setIsManager(event.target.checked)}
            />
            <span>{modalLocale.appRole}</span>
          </Styled.CheckboxField>
        )}

        {!isValid && <Styled.FormHint>{modalLocale.requiredHint}</Styled.FormHint>}

        {error && <Styled.FormError role="alert">{error}</Styled.FormError>}
      </Styled.ModalForm>
    </Modal>
  );
};
