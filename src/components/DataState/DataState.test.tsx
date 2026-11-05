import { screen } from '@testing-library/react';
import { locale } from '../../locales';
import { renderWithProviders } from '../../test/render';
import { DataState } from '.';

const text = locale.dataState;

describe('DataState', () => {
  describe('loading', () => {
    it('anuncia o carregamento para leitores de tela', () => {
      renderWithProviders(<DataState variant="loading" />);

      expect(screen.getByRole('status')).toHaveTextContent(text.loading);
    });

    it('usa o esqueleto passado no lugar do padrão', () => {
      renderWithProviders(
        <DataState variant="loading" skeleton={<span data-testid="esqueleto" />}>
          Carregando grupos
        </DataState>,
      );

      expect(screen.getByRole('status')).toHaveTextContent('Carregando grupos');
      expect(screen.getByTestId('esqueleto')).toBeInTheDocument();
    });
  });

  describe('empty', () => {
    it('mostra o texto padrão', () => {
      renderWithProviders(<DataState variant="empty" />);

      expect(screen.getByText(text.empty)).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('mostra a mensagem passada', () => {
      renderWithProviders(<DataState variant="empty">Nenhuma inscrição no período.</DataState>);

      expect(screen.getByText('Nenhuma inscrição no período.')).toBeInTheDocument();
      expect(screen.queryByText(text.empty)).not.toBeInTheDocument();
    });
  });

  describe('error', () => {
    it('avisa o erro sem botão quando não há onRetry', () => {
      renderWithProviders(<DataState variant="error" />);

      expect(screen.getByRole('alert')).toHaveTextContent(text.error);
      expect(screen.queryByRole('button', { name: text.retry })).not.toBeInTheDocument();
    });

    it('chama onRetry ao clicar em tentar novamente', async () => {
      const onRetry = jest.fn();
      const { user } = renderWithProviders(<DataState variant="error" onRetry={onRetry} />);

      await user.click(screen.getByRole('button', { name: text.retry }));

      expect(onRetry).toHaveBeenCalledTimes(1);
    });
  });
});
