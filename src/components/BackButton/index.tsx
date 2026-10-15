import type { ButtonProps } from '../Button';
import * as Styled from './styles';

export type BackButtonProps = Omit<ButtonProps, 'children' | 'variant' | 'icon'> & {
  label?: string;
};

const ArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M19 12H5M5 12L11 6M5 12L11 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const BackButton = ({ label, onClick, ...props }: BackButtonProps) => {
  return (
    <Styled.Container
      variant="ghost"
      icon={<ArrowLeft />}
      onClick={onClick ?? (() => window.history.back())}
      {...props}
    >
      {label ?? 'Voltar'}
    </Styled.Container>
  );
};
