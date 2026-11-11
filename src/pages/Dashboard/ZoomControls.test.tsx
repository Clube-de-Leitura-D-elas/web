import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/render';
import { ZoomControls } from './ZoomControls';

const renderControls = (props: Partial<React.ComponentProps<typeof ZoomControls>> = {}) =>
  renderWithProviders(
    <ZoomControls
      zoomInLabel="Aproximar"
      zoomOutLabel="Afastar"
      canZoomIn
      canZoomOut
      onZoomIn={() => {}}
      onZoomOut={() => {}}
      {...props}
    />,
  );

describe('ZoomControls', () => {
  it('chama o botão certo em cada lupa', async () => {
    const onZoomIn = jest.fn();
    const onZoomOut = jest.fn();
    const { user } = renderControls({ onZoomIn, onZoomOut });

    await user.click(screen.getByRole('button', { name: 'Aproximar' }));
    expect(onZoomIn).toHaveBeenCalledTimes(1);
    expect(onZoomOut).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Afastar' }));
    expect(onZoomOut).toHaveBeenCalledTimes(1);
  });

  it('desabilita cada lupa quando não há mais para onde ir', () => {
    renderControls({ canZoomIn: false });

    expect(screen.getByRole('button', { name: 'Aproximar' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Afastar' })).toBeEnabled();
  });

  it('não chama nada em uma lupa desabilitada', async () => {
    const onZoomOut = jest.fn();
    const { user } = renderControls({ canZoomOut: false, onZoomOut });

    await user.click(screen.getByRole('button', { name: 'Afastar' }));

    expect(onZoomOut).not.toHaveBeenCalled();
  });
});
