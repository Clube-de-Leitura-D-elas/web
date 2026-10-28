import { screen, within } from '@testing-library/react';
import { interpolate, locale } from '../../locales';
import {
  getParticipantById,
  getParticipantGroups,
  getParticipantPresence,
  updateParticipantStatus,
} from '../../services/participantService';
import { pending, renderWithProviders } from '../../test/render';
import type { Participant } from '../../types/participant';
import { ParticipantDetails } from '.';

jest.mock('../../services/participantService', () => ({
  getParticipantById: jest.fn(),
  getParticipantGroups: jest.fn(),
  getParticipantPresence: jest.fn(),
  updateParticipantStatus: jest.fn(),
  getCities: jest.fn().mockResolvedValue([]),
  getZones: jest.fn().mockResolvedValue([]),
}));

const text = locale.participant_details;

const participant: Participant = {
  id: 'p1',
  name: 'Joseane Alves',
  email: 'joseane.alves@gmail.com',
  instagram: '@joseane_alves',
  phone: '(51) 91234-5678',
  city: 'Porto Alegre',
  zone: 'Zona Leste',
  birthDate: '1990-10-24',
  job: 'Advogada',
  active: true,
  appRole: 'READER',
  entryDate: '2025-03-15',
  photo: null,
};

const renderPage = () =>
  renderWithProviders(<ParticipantDetails />, {
    route: '/participantes/p1',
    path: '/participantes/:participantId',
  });

beforeEach(() => {
  jest.mocked(getParticipantById).mockResolvedValue(participant);
  jest.mocked(getParticipantPresence).mockResolvedValue([
    { meetingId: 'm1', date: '2026-09-10', present: true },
    { meetingId: 'm2', date: '2026-09-08', present: false },
    { meetingId: 'm3', date: '2026-09-03', present: true },
  ]);
  jest.mocked(getParticipantGroups).mockResolvedValue({
    groups: [
      { id: 'g3', number: 3, city: 'São Paulo', isCoordinator: true, entryDate: '2024-03-01' },
      { id: 'g12', number: 12, city: null, isCoordinator: false, entryDate: null },
    ],
    total: 2,
  });
});

describe('ParticipantDetails', () => {
  it('mostra o carregamento', () => {
    jest.mocked(getParticipantById).mockReturnValue(pending());

    renderPage();

    expect(screen.getByText(text.loading)).toBeInTheDocument();
  });

  it('mostra o erro quando os dados não carregam', async () => {
    jest.mocked(getParticipantById).mockRejectedValue(new Error('404'));

    renderPage();

    expect(await screen.findByText(text.loadError)).toBeInTheDocument();
  });

  it('busca a participante e a presença pelo id da rota', async () => {
    renderPage();

    expect(await screen.findByText('Joseane Alves')).toBeInTheDocument();
    expect(getParticipantById).toHaveBeenCalledWith('p1');
    expect(getParticipantPresence).toHaveBeenCalledWith('p1');
    expect(screen.getByText(text.status.active)).toBeInTheDocument();
  });

  it('monta os links de contato', async () => {
    renderPage();
    await screen.findByText('Joseane Alves');

    const label = (template: string) => interpolate(template, { name: 'Joseane Alves' });
    expect(screen.getByRole('link', { name: label(text.contact.emailAria) })).toHaveAttribute(
      'href',
      'mailto:joseane.alves@gmail.com',
    );
    expect(screen.getByRole('link', { name: label(text.contact.instagramAria) })).toHaveAttribute(
      'href',
      'https://instagram.com/joseane_alves',
    );
    expect(screen.getByRole('link', { name: label(text.contact.phoneAria) })).toHaveAttribute(
      'href',
      'tel:+5551912345678',
    );
  });

  it('esconde contatos que a participante não informou', async () => {
    jest
      .mocked(getParticipantById)
      .mockResolvedValue({ ...participant, instagram: null, phone: null });

    renderPage();
    await screen.findByText('Joseane Alves');

    expect(screen.getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual([
      'mailto:joseane.alves@gmail.com',
    ]);
  });

  it('mostra presença, cidade, zona, aniversário, entrada e trabalho', async () => {
    renderPage();
    await screen.findByText('Joseane Alves');

    expect(
      screen.getByRole('img', {
        name: interpolate(text.details.presenceAria, { present: 2, total: 3 }),
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('Porto Alegre')).toBeInTheDocument();
    expect(screen.getByText('Zona Leste')).toBeInTheDocument();
    expect(screen.getByText('24/10')).toBeInTheDocument();
    expect(screen.getByText('15/03/2025')).toBeInTheDocument();
    expect(screen.getByText('Advogada')).toBeInTheDocument();

    // cada dado com o próprio rótulo ("Cidade" também é coluna da tabela de grupos)
    expect(screen.getByText(text.details.zone)).toBeInTheDocument();
    expect(screen.getByText(text.details.birthday)).toBeInTheDocument();
    expect(screen.getByText(text.details.entryDate)).toBeInTheDocument();
    expect(screen.getByText(text.details.occupation)).toBeInTheDocument();
  });

  it('mostra a foto da participante, ou um ícone quando não tem', async () => {
    jest
      .mocked(getParticipantById)
      .mockResolvedValue({ ...participant, photo: 'https://cdn.exemplo.com/joseane.jpg' });

    const { container, unmount } = renderPage();
    await screen.findByText('Joseane Alves');
    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      'https://cdn.exemplo.com/joseane.jpg',
    );
    unmount();

    jest.mocked(getParticipantById).mockResolvedValue(participant);
    const view = renderPage();
    await screen.findByText('Joseane Alves');
    expect(view.container.querySelector('img')).not.toBeInTheDocument();
  });

  it('usa "não informado" para os dados vazios', async () => {
    jest.mocked(getParticipantById).mockResolvedValue({
      ...participant,
      zone: null,
      birthDate: null,
      entryDate: null,
      job: null,
    });
    jest.mocked(getParticipantGroups).mockResolvedValue({ groups: [], total: 0 });

    renderPage();
    await screen.findByText('Joseane Alves');

    // zona, aniversário, data de entrada e trabalho
    expect(screen.getAllByText(text.notInformed)).toHaveLength(4);
  });

  it('lista os grupos com a função da participante', async () => {
    renderPage();

    const coordinatorRow = (await screen.findByText('3')).closest('tr')!;
    expect(within(coordinatorRow).getByText(text.groups.roles.coordinator)).toBeInTheDocument();
    expect(within(coordinatorRow).getByText('São Paulo')).toBeInTheDocument();
    expect(within(coordinatorRow).getByText('01/03/2024')).toBeInTheDocument();

    const memberRow = screen.getByText('12').closest('tr')!;
    expect(within(memberRow).getByText(text.groups.roles.member)).toBeInTheDocument();
    expect(within(memberRow).getByText(text.groups.emptyValue)).toBeInTheDocument();
    expect(getParticipantGroups).toHaveBeenCalledWith('p1', 1, 5);
  });

  it('inativa a participante', async () => {
    jest.mocked(updateParticipantStatus).mockResolvedValue(false);
    const { user } = renderPage();

    await user.click(await screen.findByRole('button', { name: text.status.deactivate }));

    expect(updateParticipantStatus).toHaveBeenCalledWith('p1', false);
    expect(await screen.findByRole('button', { name: text.status.activate })).toBeInTheDocument();
    expect(screen.getByText(text.status.inactive)).toBeInTheDocument();
  });

  it('avisa quando o status não pôde ser alterado', async () => {
    jest.mocked(updateParticipantStatus).mockRejectedValue(new Error('500'));
    const { user } = renderPage();

    await user.click(await screen.findByRole('button', { name: text.status.deactivate }));

    expect(await screen.findByText(text.updateStatusError)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: text.status.deactivate })).toBeEnabled();
  });
});
