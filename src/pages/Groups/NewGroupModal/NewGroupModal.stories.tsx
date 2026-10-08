import { useState } from 'react';
import { LuPlus } from 'react-icons/lu';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Button } from '../../../components/Button';
import { locale } from '../../../locales';

import { MOCK_CITY_OPTIONS, MOCK_COORDINATOR_OPTIONS } from './mockOptions';
import { NewGroupModal } from '.';

const text = locale.groups.newGroupModal;

const GROUP_NAME = 'Grupo 43';
const CITY = MOCK_CITY_OPTIONS[0];
const COORDINATOR = MOCK_COORDINATOR_OPTIONS[0];

const meta = {
  title: 'Pages/Groups/NewGroupModal',
  component: NewGroupModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Modal "Criar novo grupo", aberto pelo botão "+ Novo grupo" da tela de Grupos.',
          '',
          '"Salvar grupo" só habilita com número válido e cidade/zona preenchidos;',
          'a coordenadora é opcional. Cancelar, X e Esc fecham sem salvar, e o formulário volta',
          'vazio na próxima abertura. As opções dos dropdowns ainda são mock (`mockOptions.ts`).',
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
    loadOptionsRequest: fn().mockResolvedValue([MOCK_CITY_OPTIONS, MOCK_COORDINATOR_OPTIONS]),
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
          onClose={() => {
            args.onClose();
            setIsOpen(false);
          }}
          createGroupRequest={args.createGroupRequest}
          loadOptionsRequest={args.loadOptionsRequest}
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

const getCityTrigger = ({ canvas }: PlayContext, value = text.city.placeholder) =>
  canvas.getByRole('button', { name: `${text.city.label} ${value}` });

const getCoordinatorTrigger = ({ canvas }: PlayContext) =>
  canvas.getByRole('button', { name: `${text.coordinator.label} ${text.coordinator.placeholder}` });

const fillRequiredFields = async (context: PlayContext) => {
  const { canvas, userEvent } = context;

  await userEvent.type(canvas.getByLabelText(text.name.label), GROUP_NAME);
  await userEvent.click(getCityTrigger(context));
  await userEvent.click(canvas.getByRole('option', { name: CITY.label }));
};

const expectClosedAndResetOnReopen = async (context: PlayContext) => {
  const { canvas, userEvent } = context;

  await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
  await expect(context.args.onSave).not.toHaveBeenCalled();

  await userEvent.click(canvas.getByRole('button', { name: locale.groups.newGroup }));

  await expect(canvas.getByLabelText(text.name.label)).toHaveValue('');
  await expect(getCityTrigger(context)).toBeInTheDocument();
  await expect(getSaveButton(context)).toBeDisabled();
};

export const Default: Story = {};

export const Closed: Story = {
  args: { isOpen: false },
};

export const SaveEnablesWithRequiredFields: Story = {
  play: async (context) => {
    const { canvas, userEvent, args } = context;

    await expect(getSaveButton(context)).toBeDisabled();

    await userEvent.type(canvas.getByLabelText(text.name.label), '   ');
    await userEvent.click(getCityTrigger(context));
    await userEvent.click(canvas.getByRole('option', { name: CITY.label }));
    await expect(getSaveButton(context)).toBeDisabled();

    await userEvent.clear(canvas.getByLabelText(text.name.label));
    await userEvent.type(canvas.getByLabelText(text.name.label), GROUP_NAME);
    await expect(getSaveButton(context)).toBeEnabled();

    await userEvent.click(getSaveButton(context));

    await expect(args.createGroupRequest).toHaveBeenCalledWith({
      name: GROUP_NAME,
      cityId: CITY.value,
      coordinatorId: null,
    });
    await expect(args.onSave).toHaveBeenCalledWith();
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
  },
};

export const NameAloneDoesNotEnableSave: Story = {
  play: async (context) => {
    const { canvas, userEvent } = context;

    await userEvent.type(canvas.getByLabelText(text.name.label), GROUP_NAME);
    await userEvent.click(getCoordinatorTrigger(context));
    await userEvent.click(canvas.getByRole('option', { name: COORDINATOR.label }));

    await expect(getSaveButton(context)).toBeDisabled();
  },
};

export const InvalidGroupNumberDoesNotEnableSave: Story = {
  play: async (context) => {
    const { canvas, userEvent } = context;

    await userEvent.type(canvas.getByLabelText(text.name.label), 'Grupo 43 — Moinhos de Vento');
    await userEvent.click(getCityTrigger(context));
    await userEvent.click(canvas.getByRole('option', { name: CITY.label }));

    await expect(getSaveButton(context)).toBeDisabled();
    await expect(canvas.getByText(text.name.invalid)).toBeInTheDocument();
  },
};

export const SaveWithCoordinator: Story = {
  play: async (context) => {
    const { canvas, userEvent, args } = context;

    await fillRequiredFields(context);
    await userEvent.click(getCoordinatorTrigger(context));
    await userEvent.click(canvas.getByRole('option', { name: COORDINATOR.label }));
    await userEvent.click(getSaveButton(context));

    await expect(args.createGroupRequest).toHaveBeenCalledWith({
      name: GROUP_NAME,
      cityId: CITY.value,
      coordinatorId: COORDINATOR.value,
    });
    await expect(args.onSave).toHaveBeenCalledWith();
  },
};

export const CancelClosesAndResets: Story = {
  play: async (context) => {
    await fillRequiredFields(context);
    await context.userEvent.click(context.canvas.getByRole('button', { name: 'Cancelar' }));

    await expectClosedAndResetOnReopen(context);
  },
};

export const CloseIconClosesAndResets: Story = {
  play: async (context) => {
    await fillRequiredFields(context);
    await context.userEvent.click(context.canvas.getByRole('button', { name: 'Fechar' }));

    await expectClosedAndResetOnReopen(context);
  },
};

export const EscapeClosesAndResets: Story = {
  play: async (context) => {
    await fillRequiredFields(context);
    await context.userEvent.keyboard('{Escape}');

    await expectClosedAndResetOnReopen(context);
  },
};

export const FocusTrap: Story = {
  args: { isOpen: false },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: locale.groups.newGroup });
    await userEvent.click(trigger);

    const closeButton = canvas.getByRole('button', { name: 'Fechar' });
    const nameInput = canvas.getByLabelText(text.name.label);
    const cancelButton = canvas.getByRole('button', { name: 'Cancelar' });

    await expect(nameInput).toHaveFocus();

    await userEvent.tab({ shift: true });
    await expect(closeButton).toHaveFocus();

    await userEvent.tab({ shift: true });
    await expect(cancelButton).toHaveFocus();

    await userEvent.tab();
    await expect(closeButton).toHaveFocus();

    for (let step = 0; step < 6; step += 1) {
      await userEvent.tab();
      await expect(canvas.getByRole('dialog')).toContainElement(
        document.activeElement as HTMLElement,
      );
    }

    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveFocus();
  },
};

export const KeyboardOnly: Story = {
  args: { isOpen: false },
  play: async (context) => {
    const { canvas, userEvent, args } = context;
    const secondCity = MOCK_CITY_OPTIONS[1];

    canvas.getByRole('button', { name: locale.groups.newGroup }).focus();
    await userEvent.keyboard('{Enter}');

    const nameInput = canvas.getByLabelText(text.name.label);
    await expect(nameInput).toHaveFocus();
    await userEvent.type(nameInput, GROUP_NAME, { skipClick: true });
    await userEvent.tab();
    await expect(getCityTrigger(context)).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('option', { name: CITY.label })).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    await expect(canvas.getByRole('dialog')).toBeInTheDocument();
    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();
    await expect(getCityTrigger(context)).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    await expect(getCityTrigger(context, secondCity.label)).toHaveFocus();
    await expect(getSaveButton(context)).toBeEnabled();

    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    await expect(getSaveButton(context)).toHaveFocus();
    await userEvent.keyboard('{Enter}');

    await expect(args.createGroupRequest).toHaveBeenCalledWith({
      name: GROUP_NAME,
      cityId: secondCity.value,
      coordinatorId: null,
    });
    await expect(args.onSave).toHaveBeenCalledWith();
  },
};

export const DragFromInputDoesNotClose: Story = {
  play: async ({ canvas, userEvent }) => {
    const nameInput = canvas.getByLabelText(text.name.label);
    const overlay = canvas.getByRole('dialog').parentElement as HTMLElement;

    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: nameInput },
      { target: overlay },
      { keys: '[/MouseLeft]', target: overlay },
    ]);
    await expect(canvas.getByRole('dialog')).toBeInTheDocument();

    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: overlay },
      { target: nameInput },
      { keys: '[/MouseLeft]', target: nameInput },
    ]);
    await expect(canvas.getByRole('dialog')).toBeInTheDocument();

    await userEvent.click(overlay);
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
  },
};

export const MenuClosesWhenFocusLeaves: Story = {
  play: async (context) => {
    const { canvas, userEvent } = context;

    await userEvent.click(getCityTrigger(context));
    await expect(canvas.getByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.tab({ shift: true });
    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();
    await expect(getCityTrigger(context)).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('option', { name: CITY.label })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();
    await expect(getCoordinatorTrigger(context)).toHaveFocus();

    await userEvent.click(getCoordinatorTrigger(context));
    await userEvent.click(canvas.getByRole('option', { name: COORDINATOR.label }));
    await expect(
      canvas.getByRole('button', { name: `${text.coordinator.label} ${COORDINATOR.label}` }),
    ).toHaveFocus();
  },
};
