import { act, screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/render';
import { Toast } from '.';

describe('Toast', () => {
  it('mostra a mensagem num status e chama a ação', async () => {
    const onAction = jest.fn();
    const { user } = renderWithProviders(
      <Toast onDismiss={jest.fn()} actionLabel="Desfazer" onAction={onAction}>
        Carla agora é coordenadora
      </Toast>,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Carla agora é coordenadora');
    await user.click(screen.getByRole('button', { name: 'Desfazer' }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('não mostra botão sem ação', () => {
    renderWithProviders(<Toast onDismiss={jest.fn()}>Ana foi removida do grupo</Toast>);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('anuncia o erro como alerta', () => {
    renderWithProviders(
      <Toast variant="error" onDismiss={jest.fn()}>
        Não foi possível atualizar
      </Toast>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível atualizar');
  });

  it('some sozinho depois do tempo', () => {
    jest.useFakeTimers();
    const onDismiss = jest.fn();
    renderWithProviders(
      <Toast onDismiss={onDismiss} duration={3000}>
        Pronto
      </Toast>,
    );

    act(() => jest.advanceTimersByTime(2999));
    expect(onDismiss).not.toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(1));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });
});
