import { screen, within } from '@testing-library/react';
import { interpolate, locale } from '../../locales';
import { getEventDetails } from '../../services/eventService';
import { pending, renderWithProviders } from '../../test/render';
import type { EventDetails as EventDetailsData } from '../../types/event';
import { EventDetails } from '.';

jest.mock('../../services/eventService', () => ({
  getEventDetails: jest.fn(),
}));

const text = locale.event_details;

const event: EventDetailsData = {
  id: 'e1',
  // 22h UTC = 19h em São Paulo
  startsAt: '2026-08-22T22:00:00Z',
  group: { id: 'g1', name: 'Grupo 03 — Pinheiros', city: 'São Paulo' },
  book: { id: 'b1', title: 'Dom Casmurro', author: 'Machado de Assis', coverUrl: null },
  location: {
    name: 'Livraria da Vila — Pinheiros',
    address: 'Rua Fradique Coutinho, 915 — São Paulo, SP',
  },
  host: { id: 'u1', name: 'Beatriz Souza', photoUrl: null },
  attendance: { present: 1, absent: 1, total: 2 },
  participants: [
    { id: 'p1', name: 'Joseane Alves', photoUrl: null, attended: true },
    { id: 'p2', name: 'Camila Ferreira', photoUrl: null, attended: false },
  ],
};

const renderPage = () =>
  renderWithProviders(<EventDetails />, {
    route: '/eventos/e1',
    path: '/eventos/:eventId',
  });

beforeEach(() => {
  jest.mocked(getEventDetails).mockResolvedValue(event);
});

describe('EventDetails', () => {
  it('mostra o carregamento', () => {
    jest.mocked(getEventDetails).mockReturnValue(pending());

    renderPage();

    expect(screen.getByText(text.loading)).toBeInTheDocument();
  });

  it('mostra "não encontrado" quando o evento não carrega', async () => {
    // a página registra o erro no console; silencia para não poluir a saída
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.mocked(getEventDetails).mockRejectedValue(new Error('EVENT_NOT_FOUND'));

    renderPage();

    expect(await screen.findByText(text.notFoundTitle)).toBeInTheDocument();
    expect(screen.getByText(text.notFoundDescription)).toBeInTheDocument();
  });

  it('busca o evento pelo id da rota e mostra o cabeçalho', async () => {
    renderPage();

    expect(await screen.findByText(event.group.name)).toBeInTheDocument();
    expect(getEventDetails).toHaveBeenCalledWith('e1');
    expect(screen.getByText(/São Paulo • 22 de Agosto, 19h/)).toBeInTheDocument();
  });

  describe('seção Local e anfitriã', () => {
    it('mostra o local e a anfitriã do evento', async () => {
      renderPage();
      await screen.findByText(event.group.name);

      const section = within(screen.getByRole('region', { name: text.sections.placeAndHost }));
      expect(section.getByText('Livraria da Vila — Pinheiros')).toBeInTheDocument();
      expect(section.getByText('Rua Fradique Coutinho, 915 — São Paulo, SP')).toBeInTheDocument();
      expect(section.getByRole('link', { name: 'Beatriz Souza' })).toHaveAttribute(
        'href',
        '/participantes/u1',
      );
      expect(section.queryByText(text.comingSoon)).not.toBeInTheDocument();
    });

    it('mostra os estados vazios quando o evento não tem local nem anfitriã', async () => {
      jest.mocked(getEventDetails).mockResolvedValue({ ...event, location: null, host: null });

      renderPage();
      await screen.findByText(event.group.name);

      const section = within(screen.getByRole('region', { name: text.sections.placeAndHost }));
      expect(section.getByText(text.placeAndHost.locationEmpty)).toBeInTheDocument();
      expect(section.getByText(text.placeAndHost.hostEmpty)).toBeInTheDocument();
    });

    it('mantém "Em breve" na seção que ainda não existe', async () => {
      renderPage();
      await screen.findByText(event.group.name);

      // só a de fotos (CLU-207)
      expect(screen.getAllByText(text.comingSoon)).toHaveLength(1);
    });
  });

  describe('seção Participação', () => {
    it('mostra o resumo e as listas de presentes e ausentes', async () => {
      renderPage();
      await screen.findByText(event.group.name);

      const section = within(screen.getByRole('region', { name: text.sections.participation }));
      expect(
        section.getByText(
          interpolate(text.participation.summary, { present: 1, total: 2, percent: 50 }),
        ),
      ).toBeInTheDocument();
      expect(section.getByText('Joseane Alves')).toBeInTheDocument();
      expect(section.getByText('Camila Ferreira')).toBeInTheDocument();
      expect(section.queryByText(text.comingSoon)).not.toBeInTheDocument();
    });

    it('mostra o estado vazio quando a presença não foi registrada', async () => {
      jest
        .mocked(getEventDetails)
        .mockResolvedValue({ ...event, attendance: null, participants: [] });

      renderPage();
      await screen.findByText(event.group.name);

      const section = within(screen.getByRole('region', { name: text.sections.participation }));
      expect(section.getByText(text.participation.empty)).toBeInTheDocument();
    });
  });

  describe('navegação', () => {
    it('"Ver grupo" leva para a tela do grupo', async () => {
      const { user } = renderPage();
      await screen.findByText(event.group.name);

      await user.click(screen.getByRole('button', { name: text.groupLink }));

      expect(screen.getByTestId('location')).toHaveTextContent('/grupos/g1');
    });

    it('"Voltar" leva para o grupo quando o link foi aberto direto', async () => {
      const { user } = renderPage();
      await screen.findByText(event.group.name);

      await user.click(screen.getByRole('button', { name: text.back }));

      expect(screen.getByTestId('location')).toHaveTextContent('/grupos/g1');
    });
  });
});
