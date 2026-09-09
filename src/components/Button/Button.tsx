import type { ButtonHTMLAttributes, ReactNode } from 'react';
import * as Styled from './styles';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'sm' | 'lg';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  type = 'button',
  disabled = false,
  ...props
}: ButtonProps) => {
  return (
    <Styled.Container type={type} $variant={variant} $size={size} disabled={disabled} {...props}>
      {icon}
      {children}
    </Styled.Container>
  );
};
