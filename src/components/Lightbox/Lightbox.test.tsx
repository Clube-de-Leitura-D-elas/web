import { fireEvent, screen } from '@testing-library/react';
import { useState } from 'react';
import { locale } from '../../locales';
import { renderWithProviders } from '../../test/render';
import { Lightbox, type LightboxItem } from '.';

const text = locale.lightbox;

const items: LightboxItem[] = [
  { id: '1', src: 'https://exemplo.com/1.jpg', alt: 'Foto 1' },
  { id: '2', src: 'https://exemplo.com/2.jpg', alt: 'Foto 2' },
  { id: '3', src: 'https://exemplo.com/3.jpg', alt: 'Foto 3' },
];

const Harness = ({
  initial = 0,
  onClose = () => {},
  onImageError,
}: {
  initial?: number;
  onClose?: () => void;
  onImageError?: (item: LightboxItem) => void;
}) => {
  const [index, setIndex] = useState(initial);

  return (
    <Lightbox
      items={items}
      index={index}
      onIndexChange={setIndex}
      onClose={onClose}
      label="Galeria"
      onImageError={onImageError}
      footer={<span>Rodapé</span>}
    />
  );
};

describe('Lightbox', () => {
  it('mostra a imagem aberta, a posição e o rodapé', () => {
    renderWithProviders(<Harness initial={1} />);

    expect(screen.getByRole('dialog', { name: 'Galeria' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Foto 2' })).toHaveAttribute('src', items[1].src);
    expect(screen.getByText('2 de 3')).toBeInTheDocument();
    expect(screen.getByText('Rodapé')).toBeInTheDocument();
  });

  it('navega pelos botões e desabilita nas pontas', async () => {
    const { user } = renderWithProviders(<Harness />);

    expect(screen.getByRole('button', { name: text.previous })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: text.next }));
    expect(screen.getByRole('img', { name: 'Foto 2' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: text.next }));
    expect(screen.getByRole('img', { name: 'Foto 3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: text.next })).toBeDisabled();
  });

  it('navega pelas setas do teclado', async () => {
    const { user } = renderWithProviders(<Harness initial={1} />);

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('img', { name: 'Foto 3' })).toBeInTheDocument();

    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(screen.getByRole('img', { name: 'Foto 1' })).toBeInTheDocument();

    // na primeira foto a seta para a esquerda não faz nada
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('img', { name: 'Foto 1' })).toBeInTheDocument();
  });

  it('fecha pelo X', async () => {
    const onClose = jest.fn();
    const { user } = renderWithProviders(<Harness onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: text.close }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('fecha com Esc', async () => {
    const onClose = jest.fn();
    const { user } = renderWithProviders(<Harness onClose={onClose} />);

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('fecha ao clicar fora, mas não ao clicar na foto', async () => {
    const onClose = jest.fn();
    const { user } = renderWithProviders(<Harness onClose={onClose} />);

    await user.click(screen.getByRole('img', { name: 'Foto 1' }));
    expect(onClose).not.toHaveBeenCalled();

    await user.click(screen.getByRole('dialog').parentElement as HTMLElement);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('cai no placeholder e avisa quando a imagem não carrega', () => {
    const onImageError = jest.fn();
    renderWithProviders(<Harness onImageError={onImageError} />);

    fireEvent.error(screen.getByRole('img', { name: 'Foto 1' }));

    expect(onImageError).toHaveBeenCalledWith(items[0]);
    expect(screen.getByText(text.unavailable)).toBeInTheDocument();
    // a navegação continua funcionando
    expect(screen.getByRole('button', { name: text.next })).toBeEnabled();
  });
});
