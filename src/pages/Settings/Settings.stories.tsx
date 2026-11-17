import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, mocked, waitFor } from 'storybook/test';
import { MemoryRouter, Route, Routes } from 'react-router';
import { DefaultLayout } from '../../layouts/DefaultLayout';
import { locale } from '../../locales';
import { AuthServiceError } from '../../services/authErrors';
import { changePassword } from '../../services/authService';
import { CityServiceError } from '../../services/cityErrors';
import { getCityGrid, saveCity, updateCityStatus } from '../../services/cityService';
import type { CityListItem } from '../../types/city';
import { Settings } from '.';

const text = locale.settings.cities;
const REQUEST_DELAY = 300;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const normalize = (value: string) =>
  value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLocaleLowerCase('pt-BR').trim();

const zone = (id: string, name: string, activeGroups = 0, isActive = true) => ({
  id,
  name,
  isActive,
  activeGroups,
});

const cities: CityListItem[] = [
  {
    id: 'bh',
    name: 'Belo Horizonte',
    uf: 'MG',
    isActive: true,
    groups: 1,
    activeGroups: 1,
    zones: [zone('bh-pampulha', 'Pampulha'), zone('bh-savassi', 'Savassi', 1)],
  },
  {
    id: 'can',
    name: 'Canoas',
    uf: 'RS',
    isActive: true,
    groups: 0,
    activeGroups: 0,
    zones: [zone('can-centro', 'Centro')],
  },
  {
    id: 'cwb',
    name: 'Curitiba',
    uf: 'PR',
    isActive: false,
    groups: 0,
    activeGroups: 0,
    zones: [],
  },
  {
    id: 'poa',
    name: 'Porto Alegre',
    uf: 'RS',
    isActive: true,
    groups: 3,
    activeGroups: 2,
    zones: [
      zone('poa-centro', 'Centro Histórico', 1),
      zone('poa-leste', 'Zona Leste'),
      zone('poa-norte', 'Zona Norte', 1),
      zone('poa-sul', 'Zona Sul'),
      zone('poa-restinga', 'Restinga', 0, false),
    ],
  },
  {
    id: 'rec',
    name: 'Recife',
    uf: 'PE',
    isActive: true,
    groups: 1,
    activeGroups: 1,
    zones: [],
  },
  {
    id: 'sp',
    name: 'São Paulo',
    uf: 'SP',
    isActive: true,
    groups: 2,
    activeGroups: 2,
    zones: [zone('sp-oeste', 'Zona Oeste', 1), zone('sp-sul', 'Zona Sul', 1)],
  },
];

const meta = {
  title: 'Pages/Settings',
  component: Settings,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/configuracoes']}>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/configuracoes" element={<Story />} />
          </Route>
        </Routes>
      </MemoryRouter>
    ),
  ],
  beforeEach: () => {
    mocked(getCityGrid).mockImplementation(async ({ page, pageSize }, { search, uf, status }) => {
      await wait(REQUEST_DELAY);

      const term = normalize(search);
      const filtered = cities.filter(
        (city) =>
          (!uf || city.uf === uf) &&
          (status === 'all' || city.isActive === (status === 'active')) &&
          (!term ||
            normalize(city.name).includes(term) ||
            city.zones.some((item) => normalize(item.name).includes(term))),
      );

      return {
        items: filtered.slice((page - 1) * pageSize, page * pageSize),
        total: filtered.length,
        ufs: [...new Set(cities.map((city) => city.uf))].sort(),
        summary: {
          activeCities: cities.filter((city) => city.isActive).length,
          activeZones: cities
            .filter((city) => city.isActive)
            .flatMap((city) => city.zones)
            .filter((item) => item.isActive).length,
        },
      };
    });
    mocked(saveCity).mockImplementation(async () => {
      await wait(REQUEST_DELAY);
      return 'new-city';
    });
    mocked(updateCityStatus).mockImplementation(async (_cityId, isActive) => {
      await wait(REQUEST_DELAY);
      return isActive;
    });
    mocked(changePassword).mockImplementation(async () => {
      await wait(REQUEST_DELAY);
    });
  },
} satisfies Meta<typeof Settings>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Porto Alegre')).toBeInTheDocument();
    await expect(canvas.getByText('5 cidades ativas e 9 regiões')).toBeInTheDocument();
  },
};

export const Loading: Story = {
  beforeEach: () => {
    mocked(getCityGrid).mockImplementation(() => new Promise(() => {}));
  },
};

export const Empty: Story = {
  beforeEach: () => {
    mocked(getCityGrid).mockResolvedValue({
      items: [],
      total: 0,
      ufs: [],
      summary: { activeCities: 0, activeZones: 0 },
    });
  },
};

export const LoadError: Story = {
  beforeEach: () => {
    mocked(getCityGrid).mockRejectedValue(new Error('500'));
  },
};

export const NewCity: Story = {
  play: async ({ canvas, userEvent }) => {
    await canvas.findByText('Porto Alegre');

    await userEvent.click(canvas.getByRole('button', { name: text.newCity }));
    const dialog = await canvas.findByRole('dialog', { name: text.modal.createTitle });

    await userEvent.type(canvas.getByLabelText(text.modal.name.label), 'Gravataí');
    await userEvent.type(canvas.getByRole('combobox', { name: text.modal.uf.label }), 'RS');
    await userEvent.click(await canvas.findByRole('option', { name: 'RS — Rio Grande do Sul' }));
    await userEvent.click(canvas.getByRole('button', { name: text.modal.zones.add }));
    await userEvent.type(canvas.getByLabelText('Região 1'), 'Centro');

    await expect(dialog).toBeInTheDocument();
  },
};

export const EditCity: Story = {
  play: async ({ canvas, userEvent }) => {
    await canvas.findByText('Porto Alegre');

    await userEvent.click(canvas.getByRole('button', { name: 'Ações de Porto Alegre' }));
    await userEvent.click(canvas.getByRole('menuitem', { name: text.table.edit }));

    await expect(
      await canvas.findByRole('dialog', { name: 'Editar Porto Alegre' }),
    ).toBeInTheDocument();
  },
};

export const DuplicateCity: Story = {
  beforeEach: () => {
    mocked(saveCity).mockRejectedValue(new CityServiceError('duplicate_city'));
  },
  play: async ({ canvas, userEvent }) => {
    await canvas.findByText('Porto Alegre');

    await userEvent.click(canvas.getByRole('button', { name: text.newCity }));
    await userEvent.type(canvas.getByLabelText(text.modal.name.label), 'porto alegre');
    await userEvent.type(canvas.getByRole('combobox', { name: text.modal.uf.label }), 'RS');
    await userEvent.click(await canvas.findByRole('option', { name: 'RS — Rio Grande do Sul' }));
    await userEvent.click(canvas.getByRole('button', { name: text.modal.save }));

    await expect(
      await canvas.findByText('Já existe uma cidade com esse nome em RS.'),
    ).toBeInTheDocument();
  },
};

export const DeactivateCity: Story = {
  play: async ({ canvas, userEvent }) => {
    await canvas.findByText('Canoas');

    await userEvent.click(canvas.getByRole('button', { name: 'Ações de Canoas' }));
    await userEvent.click(canvas.getByRole('menuitem', { name: text.table.deactivate }));

    await expect(
      await canvas.findByRole('dialog', { name: 'Desativar Canoas?' }),
    ).toBeInTheDocument();
  },
};

export const DeactivateBlocked: Story = {
  play: async ({ canvas, userEvent }) => {
    await canvas.findByText('Porto Alegre');

    await userEvent.click(canvas.getByRole('button', { name: 'Ações de Porto Alegre' }));

    await waitFor(() =>
      expect(
        canvas.getByRole('menuitem', { name: new RegExp(text.table.deactivate) }),
      ).toHaveAttribute('aria-disabled', 'true'),
    );
  },
};

const password = locale.settings.password;

export const PasswordTab: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('tab', { name: locale.settings.tabs.password }));

    await expect(canvas.getByLabelText(password.current.label)).toBeInTheDocument();
  },
};

export const PasswordChanged: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('tab', { name: locale.settings.tabs.password }));
    await userEvent.type(canvas.getByLabelText(password.current.label), 'ClubeDelas@123');
    await userEvent.type(canvas.getByLabelText(password.new.label), 'NovaSenha@2026');
    await userEvent.type(canvas.getByLabelText(password.confirm.label), 'NovaSenha@2026');
    await userEvent.click(canvas.getByRole('button', { name: password.submit }));

    await expect(await canvas.findByText(password.success)).toBeInTheDocument();
  },
};

export const PasswordWrongCurrent: Story = {
  beforeEach: () => {
    mocked(changePassword).mockRejectedValue(new AuthServiceError('wrong_password'));
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('tab', { name: locale.settings.tabs.password }));
    await userEvent.type(canvas.getByLabelText(password.current.label), 'senha-errada');
    await userEvent.type(canvas.getByLabelText(password.new.label), 'NovaSenha@2026');
    await userEvent.type(canvas.getByLabelText(password.confirm.label), 'NovaSenha@2026');
    await userEvent.click(canvas.getByRole('button', { name: password.submit }));

    await expect(await canvas.findByText(password.errors.wrongPassword)).toBeInTheDocument();
  },
};
