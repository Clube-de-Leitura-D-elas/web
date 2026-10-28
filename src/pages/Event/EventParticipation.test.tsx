import { fireEvent, screen, within } from '@testing-library/react';
import { interpolate, locale } from '../../locales';
import { renderWithProviders } from '../../test/render';
import type { EventParticipant } from '../../types/event';
import { EventParticipation } from './EventParticipation';

const text = locale.event_details.participation;

const participant = (
  id: string,
  name: string,
  attended: boolean | null,
  photoUrl: string | null = null,
): EventParticipant => ({ id, name, photoUrl, attended });

const joseane = participant('p1', 'Joseane Alves', true);
const beatriz = participant('p2', 'Beatriz Souza', true);
const camila = participant('p3', 'Camila Ferreira', false);
const daniela = participant('p4', 'Daniela Lima', null);

describe('EventParticipation', () => {
  describe('resumo', () => {
    it('mostra presentes sobre o total com o percentual arredondado', () => {
      renderWithProviders(
        <EventParticipation
          attendance={{ present: 2, absent: 1, total: 3 }}
          participants={[joseane, beatriz, camila]}
        />,
      );

      // 2 de 3 = 66,67%
      expect(
        screen.getByText(interpolate(text.summary, { present: 2, total: 3, percent: 67 })),
      ).toBeInTheDocument();
    });

    it('usa present/total mesmo quando há participantes sem registro', () => {
      renderWithProviders(
        <EventParticipation
          attendance={{ present: 2, absent: 1, total: 4 }}
          participants={[joseane, beatriz, camila, daniela]}
        />,
      );

      // total - present daria 2 ausentes e 50% por acaso; o certo é 2 de 4 presentes
      expect(
        screen.getByText(interpolate(text.summary, { present: 2, total: 4, percent: 50 })),
      ).toBeInTheDocument();
    });
  });

  describe('listas', () => {
    it('separa presentes e ausentes, cada uma com a contagem no título', () => {
      renderWithProviders(
        <EventParticipation
          attendance={{ present: 2, absent: 1, total: 3 }}
          participants={[joseane, beatriz, camila]}
        />,
      );

      expect(screen.getByText(interpolate(text.presentTitle, { count: 2 }))).toBeInTheDocument();
      expect(screen.getByText(interpolate(text.absentTitle, { count: 1 }))).toBeInTheDocument();

      const [presentList, absentList] = screen.getAllByRole('list');
      expect(within(presentList).getByText('Joseane Alves')).toBeInTheDocument();
      expect(within(presentList).getByText('Beatriz Souza')).toBeInTheDocument();
      expect(within(presentList).queryByText('Camila Ferreira')).not.toBeInTheDocument();
      expect(within(absentList).getByText('Camila Ferreira')).toBeInTheDocument();
    });

    it('deixa de fora quem está sem registro de presença', () => {
      renderWithProviders(
        <EventParticipation
          attendance={{ present: 1, absent: 1, total: 3 }}
          participants={[joseane, camila, daniela]}
        />,
      );

      expect(screen.queryByText('Daniela Lima')).not.toBeInTheDocument();
      expect(screen.getByText('Joseane Alves')).toBeInTheDocument();
      expect(screen.getByText('Camila Ferreira')).toBeInTheDocument();
    });

    it('avisa quando ninguém faltou', () => {
      renderWithProviders(
        <EventParticipation
          attendance={{ present: 2, absent: 0, total: 2 }}
          participants={[joseane, beatriz]}
        />,
      );

      expect(screen.getByText(text.absentEmpty)).toBeInTheDocument();
      expect(screen.queryByText(text.presentEmpty)).not.toBeInTheDocument();
      expect(screen.getAllByRole('list')).toHaveLength(1);
    });

    it('avisa quando ninguém esteve presente', () => {
      renderWithProviders(
        <EventParticipation
          attendance={{ present: 0, absent: 1, total: 1 }}
          participants={[camila]}
        />,
      );

      expect(screen.getByText(text.presentEmpty)).toBeInTheDocument();
      expect(screen.queryByText(text.absentEmpty)).not.toBeInTheDocument();
      expect(
        screen.getByText(interpolate(text.summary, { present: 0, total: 1, percent: 0 })),
      ).toBeInTheDocument();
    });
  });

  describe('estado vazio', () => {
    it('mostra o aviso, sem 0% nem listas, quando ninguém tem presença registrada', () => {
      renderWithProviders(
        <EventParticipation
          attendance={{ present: 0, absent: 0, total: 2 }}
          participants={[{ ...joseane, attended: null }, daniela]}
        />,
      );

      expect(screen.getByText(text.empty)).toBeInTheDocument();
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
      expect(screen.queryByText(/%/)).not.toBeInTheDocument();
    });

    it('não divide por zero quando o grupo não tem participantes', () => {
      renderWithProviders(
        <EventParticipation attendance={{ present: 0, absent: 0, total: 0 }} participants={[]} />,
      );

      expect(screen.getByText(text.empty)).toBeInTheDocument();
      expect(screen.queryByText(/NaN/)).not.toBeInTheDocument();
    });

    it.each([
      ['attendance nulo', null, [joseane]],
      ['attendance ausente', undefined, [joseane]],
      ['participants ausente', { present: 1, absent: 0, total: 1 }, undefined],
      ['participants nulo', { present: 1, absent: 0, total: 1 }, null],
    ])('trata %s como vazio, para respostas sem esses campos', (_, attendance, participants) => {
      renderWithProviders(
        <EventParticipation attendance={attendance} participants={participants} />,
      );

      expect(screen.getByText(text.empty)).toBeInTheDocument();
    });
  });

  describe('foto', () => {
    const withPhoto = participant('p1', 'Joseane Alves', true, 'https://example.com/joseane.jpg');
    const attendance = { present: 1, absent: 0, total: 1 };

    it('mostra a foto da participante', () => {
      const { container } = renderWithProviders(
        <EventParticipation attendance={attendance} participants={[withPhoto]} />,
      );

      // a foto é decorativa (alt vazio): não tem role "img", então busca pela tag
      expect(container.querySelector('img')).toHaveAttribute(
        'src',
        'https://example.com/joseane.jpg',
      );
    });

    it('mostra o ícone padrão quando a participante não tem foto', () => {
      const { container } = renderWithProviders(
        <EventParticipation attendance={attendance} participants={[joseane]} />,
      );

      expect(screen.getByText('Joseane Alves')).toBeInTheDocument();
      expect(container.querySelector('img')).not.toBeInTheDocument();
    });

    it('troca a foto pelo ícone padrão quando ela não carrega', () => {
      const { container } = renderWithProviders(
        <EventParticipation attendance={attendance} participants={[withPhoto]} />,
      );

      // o jsdom não carrega imagem: dispara o erro que o navegador dispararia
      fireEvent.error(container.querySelector('img') as HTMLImageElement);

      expect(container.querySelector('img')).not.toBeInTheDocument();
      expect(screen.getByText('Joseane Alves')).toBeInTheDocument();
    });
  });
});
