import React, { type ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

/*
 * Propriedades customizadas para o componente Button.
 * Herda todos os atributos nativos de um elemento HTMLButtonElement.
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variante visual baseada no design system (padrão: 'primary') */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Dimensões e espaçamentos pré-definidos do botão (padrão: 'md') */
  size?: 'sm' | 'md' | 'lg';
  /** Elemento opcional de ícone (SVG, ReactNode) renderizado ao lado do texto */
  icon?: React.ReactNode;
}

/**
 * Botão reutilizável conforme o Design System
 * Suporta 4 variantes, 3 tamanhos, ícone opcional e herança total de acessibilidade nativa (`focus-visible`, estados de clique, tecla Tab e leitor de tela).
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled = false,
  type = 'button',
  ...rest
}: ButtonProps) => {
  const buttonClasses = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      disabled={disabled}
      className={buttonClasses}
      aria-disabled={disabled}
      {...rest}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
