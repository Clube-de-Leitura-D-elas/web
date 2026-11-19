import { useMemo, useState } from 'react';

import { Autocomplete } from '../../components/Autocomplete';
import { Modal } from '../../components/Modal';
import { useLocale } from '../../hooks/useLocale';
import { interpolate } from '../../locales';
import type {
  GroupDetails,
  GroupFormValues,
  GroupOption,
  GroupZoneOption,
} from '../../types/group';

import * as Styled from './styles';

type GroupModalProps = {
  isOpen: boolean;
  group: GroupDetails;
  groupName: string;
  cities: GroupOption[];
  zones: GroupZoneOption[];
  onClose: () => void;
  onConfirm: (values: GroupFormValues) => void;
  saving?: boolean;
  error?: string | null;
};

const findIdByName = (options: GroupOption[], name: string | null) =>
  name ? (options.find((option) => option.name === name)?.id ?? null) : null;

const toAutocompleteOptions = (options: GroupOption[]) =>
  options.map(({ id, name }) => ({ value: id, label: name }));

export const GroupModal = (props: GroupModalProps) =>
  props.isOpen ? <GroupModalContent {...props} /> : null;

const GroupModalContent = ({
  group,
  groupName,
  cities,
  zones,
  onClose,
  onConfirm,
  saving = false,
  error = null,
}: GroupModalProps) => {
  const locale = useLocale();
  const modalLocale = locale.group_details.modal;

  const [cityChoice, setCityChoice] = useState<string | null | undefined>(undefined);
  const [zoneChoice, setZoneChoice] = useState<string | null | undefined>(undefined);

  const initialCityId = findIdByName(cities, group.city);
  const cityId = cityChoice === undefined ? initialCityId : cityChoice;

  // só as zonas da cidade escolhida: "Zona Sul" existe em mais de uma cidade
  const cityZones = useMemo(() => zones.filter((zone) => zone.cityId === cityId), [zones, cityId]);
  const zoneId =
    zoneChoice !== undefined
      ? zoneChoice
      : cityId === initialCityId
        ? findIdByName(cityZones, group.zone)
        : null;

  const cityOptions = useMemo(() => toAutocompleteOptions(cities), [cities]);
  const zoneOptions = useMemo(() => toAutocompleteOptions(cityZones), [cityZones]);

  const handleCityChange = (value: string | null) => {
    setCityChoice(value);
    setZoneChoice(null);
  };

  const handleConfirm = () => {
    if (cityId === null || saving) return;

    const city = cities.find((option) => option.id === cityId);
    if (!city) return;

    onConfirm({
      description: city.name,
      city_id: city.id,
      zone_id: zoneId,
    });
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={modalLocale.title}
      description={interpolate(modalLocale.description, { name: groupName })}
      onConfirm={handleConfirm}
      confirmText={saving ? modalLocale.saving : modalLocale.save}
      confirmDisabled={cityId === null || saving}
      size="md"
    >
      <Styled.ModalForm>
        <Styled.FormRow>
          <Autocomplete
            id="group-city"
            label={modalLocale.city}
            placeholder={modalLocale.placeCity}
            options={cityOptions}
            value={cityId}
            onChange={handleCityChange}
            minCharacters={1}
            required
          />

          <Autocomplete
            id="group-zone"
            label={modalLocale.zone}
            placeholder={modalLocale.placeZone}
            options={zoneOptions}
            value={zoneId}
            onChange={setZoneChoice}
            minCharacters={1}
          />
        </Styled.FormRow>

        {cityId === null && <Styled.FormHint>{modalLocale.requiredHint}</Styled.FormHint>}

        {error && <Styled.FormError role="alert">{error}</Styled.FormError>}
      </Styled.ModalForm>
    </Modal>
  );
};
