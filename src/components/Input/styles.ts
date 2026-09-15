import styled, { css } from 'styled-components';
import type { InputSize } from './index';
import { theme } from '../../theme/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${theme.text};
`;

const sizeStyles = {
  md: css`
    height: 2.5rem;
    padding: 0.5rem 1rem;
  `,
  lg: css`
    height: 3.5rem;
    padding: 1rem;
  `,
};

export const Field = styled.div<{
  $size: InputSize;
  $error: boolean;
  $disabled: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.5rem;
  border: 0.0625rem solid ${theme.border};
  background-color: ${theme.surface};

  ${({ $size }) => sizeStyles[$size]}

  &:focus-within {
    border-color: ${theme.focusRing};
  }

  ${({ $error }) =>
    $error &&
    css`
      border-color: ${theme.error};

      &:focus-within {
        border-color: ${theme.error};
      }
    `}

  ${({ $disabled }) =>
    $disabled &&
    css`
      background-color: ${theme.disabledBg};
      border-color: ${theme.border};

      &:focus-within {
        border-color: ${theme.border};
      }
    `}
`;

export const TextField = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.875rem;
  color: ${theme.text};

  /* O foco já é indicado pela borda do Field; sem isto o :focus-visible global desenha um segundo anel. */
  &:focus-visible {
    outline: none;
  }

  &::placeholder {
    color: ${theme.textMuted};
  }

  &:disabled {
    color: ${theme.disabledFg};
    cursor: not-allowed;
  }

  &:disabled::placeholder {
    color: ${theme.disabledFg};
  }
`;

export const VisibilityToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0.25rem;
  border: none;
  border-radius: 0.25rem;
  background: transparent;
  color: ${theme.textMuted};
  cursor: pointer;

  &:hover {
    color: ${theme.text};
  }

  &:focus-visible {
    outline: 2px solid ${theme.focusRing};
    outline-offset: 0;
  }

  &:disabled {
    color: ${theme.disabledFg};
    cursor: not-allowed;
  }

  svg {
    width: 1.125rem;
    height: 1.125rem;
  }
`;

export const Helper = styled.span<{ $error: boolean }>`
  font-size: 0.75rem;
  color: ${({ $error }) => ($error ? theme.error : theme.textMuted)};
`;
