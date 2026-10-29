import { useState } from 'react';
import { LuPlus } from 'react-icons/lu';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';

import { Button } from '../../../components/Button';
import { locale } from '../../../locales';
import { GroupServiceError } from '../../../services/groupErrors';

import { MOCK_COORDINATOR_OPTIONS } from './mockOptions';
import { NewGroupModal } from '.';

const text = locale.groups.newGroupModal;

const GROUP_NAME = 'Grupo - 43';

const CITY = {
  value: 'city-1',
  label: 'Porto Alegre',
};

const ZONE_NORTH = {
  value: 'zone-1',
  label: 'Porto Alegre — Zona Norte',
};

const ZONE_SOUTH = {
  value: 'zone-2',
  label: 'Porto Alegre — Zona Sul',
};

const CITY_SAO_PAULO = {
  value: 'city-2',
  label: 'São Paulo',
};

const LOCATION_OPTIONS = [CITY, ZONE_NORTH, ZONE_SOUTH, CITY_SAO_PAULO];

const COORDINATOR = MOCK_COORDINATOR_OPTIONS[0];

const loadMockOptions = async () =>
  [LOCATION_OPTIONS, MOCK_COORDINATOR_OPTIONS, 43] as [
    typeof LOCATION_OPTIONS,
    typeof MOCK_COORDINATOR_OPTIONS,
    number,
  ];

const meta = {
  title: 'Pages/Groups/NewGroupModal',
  component: NewGroupModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Modal de criação de grupos com Autocomplete para cidades e zonas.',
          '',
          'As opções são simuladas no Storybook.',
          'Na aplicação real, são carregadas pelo serviço de grupos.',
          '',
          'A pesquisa começa a partir de 3 caracteres e ignora acentos e caixa.',
          'O nome é gerado automaticamente, sem edição; o salvamento exige localização selecionada.',
          'A coordenadora é opcional.',
        ].join('\n'),
      },
    },
  },
  args: {
    isOpen: true,
    onClose: fn(),
    onSave: fn(),
    createGroupRequest: fn().mockResolvedValue({
      id: 'group-43',
      number: 43,
      description: CITY.label,
      cityId: CITY.value,
      zoneId: null,
      coordinatorId: null,
      createdAt: '2026-10-06T00:00:00.000Z',
    }),
    loadOptionsRequest: loadMockOptions,
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);

    return (
      <div style={{ padding: 24 }}>
        <Button icon={<LuPlus aria-hidden />} onClick={() => setIsOpen(true)}>
          {locale.groups.newGroup}
        </Button>

        <NewGroupModal
          isOpen={isOpen}
          createGroupRequest={args.createGroupRequest}
          loadOptionsRequest={args.loadOptionsRequest}
          onClose={() => {
            args.onClose();
            setIsOpen(false);
          }}
          onSave={() => {
            args.onSave();
            setIsOpen(false);
          }}
        />
      </div>
    );
  },
} satisfies Meta<typeof NewGroupModal>;

export default meta;

type Story = StoryObj<typeof meta>;
type PlayContext = Parameters<NonNullable<Story['play']>>[0];

const getSaveButton = ({ canvas }: PlayContext) => canvas.getByRole('button', { name: text.save });

const getCityInput = ({ canvas }: PlayContext) =>
  canvas.getByRole('combobox', { name: text.city.label });

const getNameInput = ({ canvas }: PlayContext) => canvas.getByLabelText(text.name.label);

const waitForLocations = async (context: PlayContext) => {
  await waitFor(() => expect(getCityInput(context)).toBeEnabled());
};

const selectLocation = async (
  context: PlayContext,
  search: string,
  option: { value: string; label: string },
) => {
  const { canvas, userEvent } = context;

  await waitForLocations(context);
  await userEvent.type(getCityInput(context), search);

  await userEvent.click(canvas.getByRole('option', { name: option.label }));
};

const fillRequiredFields = async (context: PlayContext) => {
  await selectLocation(context, 'porto', CITY);
};

const getCoordinatorTrigger = ({ canvas }: PlayContext) =>
  canvas.getByRole('button', {
    name: `${text.coordinator.label} ${text.coordinator.placeholder}`,
  });

export const Default: Story = {};

export const Closed: Story = {
  args: { isOpen: false },
};

export const SaveWithCity: Story = {
  play: async (context) => {
    const { args, userEvent } = context;

    await expect(getSaveButton(context)).toBeDisabled();

    await fillRequiredFields(context);

    await expect(getNameInput(context)).toHaveValue(GROUP_NAME);
    await expect(getNameInput(context)).toBeDisabled();
    await expect(getCityInput(context)).toHaveValue(CITY.label);
    await expect(getSaveButton(context)).toBeEnabled();

    await userEvent.click(getSaveButton(context));

    await waitFor(() =>
      expect(args.createGroupRequest).toHaveBeenCalledWith({
        cityId: CITY.value,
        coordinatorId: null,
      }),
    );

    await waitFor(() => expect(args.onSave).toHaveBeenCalled());
  },
};

export const SaveWithZone: Story = {
  play: async (context) => {
    const { args, userEvent } = context;

    await selectLocation(context, 'porto', ZONE_SOUTH);

    await expect(getCityInput(context)).toHaveValue(ZONE_SOUTH.label);

    await userEvent.click(getSaveButton(context));

    await waitFor(() =>
      expect(args.createGroupRequest).toHaveBeenCalledWith({
        cityId: ZONE_SOUTH.value,
        coordinatorId: null,
      }),
    );
  },
};

export const SearchWithoutAccents: Story = {
  play: async (context) => {
    const { canvas, userEvent } = context;

    await waitForLocations(context);
    await userEvent.type(getCityInput(context), 'SAO');

    await expect(
      canvas.getByRole('option', {
        name: CITY_SAO_PAULO.label,
      }),
    ).toBeInTheDocument();
  },
};

export const CityNotFound: Story = {
  play: async (context) => {
    const { canvas, userEvent } = context;

    await waitForLocations(context);

    await userEvent.type(getCityInput(context), 'cidade inexistente');

    await expect(canvas.getByText(text.city.noResults)).toBeInTheDocument();

    await expect(getSaveButton(context)).toBeDisabled();
  },
};

export const TextWithoutSelection: Story = {
  play: async (context) => {
    await waitForLocations(context);

    await context.userEvent.type(getCityInput(context), 'Porto Alegre');

    await expect(getSaveButton(context)).toBeDisabled();
  },
};

export const ChangeInvalidatesSelection: Story = {
  play: async (context) => {
    await fillRequiredFields(context);

    await expect(getSaveButton(context)).toBeEnabled();

    await context.userEvent.type(getCityInput(context), ' alterado');

    await expect(getSaveButton(context)).toBeDisabled();
  },
};

export const GeneratedNameAloneDoesNotEnableSave: Story = {
  play: async (context) => {
    await waitForLocations(context);
    await expect(getNameInput(context)).toHaveValue(GROUP_NAME);
    await expect(getSaveButton(context)).toBeDisabled();
  },
};

export const FirstGroupUsesLeadingZero: Story = {
  args: {
    loadOptionsRequest: fn().mockResolvedValue([LOCATION_OPTIONS, MOCK_COORDINATOR_OPTIONS, 1]),
  },
  play: async (context) => {
    await waitForLocations(context);
    await expect(getNameInput(context)).toHaveValue('Grupo - 01');
  },
};

export const GeneratedNameCannotBeEdited: Story = {
  play: async (context) => {
    await waitForLocations(context);

    await expect(getNameInput(context)).toHaveValue(GROUP_NAME);
    await expect(getNameInput(context)).toBeDisabled();
  },
};

export const SaveWithCoordinator: Story = {
  play: async (context) => {
    const { canvas, userEvent, args } = context;

    await fillRequiredFields(context);

    await userEvent.click(getCoordinatorTrigger(context));

    await userEvent.click(
      canvas.getByRole('option', {
        name: COORDINATOR.label,
      }),
    );

    await userEvent.click(getSaveButton(context));

    await waitFor(() =>
      expect(args.createGroupRequest).toHaveBeenCalledWith({
        cityId: CITY.value,
        coordinatorId: COORDINATOR.value,
      }),
    );
  },
};

export const KeyboardOnly: Story = {
  play: async (context) => {
    const { canvas, userEvent } = context;

    await waitForLocations(context);

    const cityInput = getCityInput(context);
    cityInput.focus();

    await userEvent.type(cityInput, 'porto');

    await expect(canvas.getByRole('listbox')).toBeInTheDocument();

    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Escape}');

    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();

    await expect(canvas.getByRole('dialog')).toBeInTheDocument();

    await userEvent.keyboard('{ArrowDown}{Enter}');

    await expect(cityInput).toHaveValue(CITY.label);
    await expect(getSaveButton(context)).toBeEnabled();
  },
};

export const SaveErrorOnDuplicate: Story = {
  args: {
    createGroupRequest: fn().mockRejectedValue(new GroupServiceError('duplicate_number')),
  },
  play: async (context) => {
    const { canvas, userEvent, args } = context;

    await fillRequiredFields(context);
    await userEvent.click(getSaveButton(context));

    await waitFor(() => expect(canvas.getByRole('alert')).toHaveTextContent(text.errors.duplicate));

    await expect(args.onSave).not.toHaveBeenCalled();
    await expect(getSaveButton(context)).toBeEnabled();
  },
};

export const SaveErrorOnGenericFailure: Story = {
  args: {
    createGroupRequest: fn().mockRejectedValue(new Error('internal server error')),
  },
  play: async (context) => {
    const { canvas, userEvent, args } = context;

    await fillRequiredFields(context);
    await userEvent.click(getSaveButton(context));

    await waitFor(() => expect(canvas.getByRole('alert')).toHaveTextContent(text.errors.generic));

    await expect(args.onSave).not.toHaveBeenCalled();
    await expect(getSaveButton(context)).toBeEnabled();
  },
};

export const LoadOptionsError: Story = {
  args: {
    loadOptionsRequest: fn().mockRejectedValue(new Error('network failure')),
  },
  play: async (context) => {
    await waitFor(() =>
      expect(context.canvas.getByRole('alert')).toHaveTextContent(text.errors.loadOptions),
    );

    await expect(getSaveButton(context)).toBeDisabled();
  },
};
