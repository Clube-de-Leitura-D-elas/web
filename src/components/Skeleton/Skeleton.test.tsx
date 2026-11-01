import { render } from '@testing-library/react';
import { Skeleton } from '.';

describe('Skeleton', () => {
  it('renderiza com as propriedades padrão', () => {
    const { container } = render(<Skeleton />);

    const skeleton = container.querySelector('span');

    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    expect(skeleton).toHaveStyle({
      width: '100%',
      height: '0.75rem',
      borderRadius: '0.25rem',
    });
  });

  it('aplica largura e altura personalizadas', () => {
    const { container } = render(<Skeleton width="12rem" height="1.5rem" />);

    const skeleton = container.querySelector('span');

    expect(skeleton).toHaveStyle({
      width: '12rem',
      height: '1.5rem',
    });
  });

  it('renderiza no formato circular', () => {
    const { container } = render(<Skeleton width="3rem" height="3rem" variant="circular" />);

    const skeleton = container.querySelector('span');

    expect(skeleton).toHaveStyle({
      borderRadius: '50%',
    });
  });

  it('renderiza no formato retangular por padrão', () => {
    const { container } = render(<Skeleton />);

    const skeleton = container.querySelector('span');

    expect(skeleton).toHaveStyle({
      borderRadius: '0.25rem',
    });
  });
});
