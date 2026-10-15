import styled, { css } from 'styled-components';
import type { InputSize } from './index';
import { theme, fieldTokens } from '../../theme/theme';

export const Container = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${fieldTokens.gap.container};
  width: 100%;
  max-width: ${({ $fullWidth }) => ($fullWidth ? 'none' : '20rem')};
`;

export const Label = styled.label`
  font-size: ${fieldTokens.typography.labelSize};
  font-weight: ${fieldTokens.typography.labelWeight};
  color: ${theme.text};
`;

export const Field = styled.div<{
  $size: InputSize;
  $error: boolean;
  $disabled: boolean;
}>`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: ${fieldTokens.border.radius};
  border: ${fieldTokens.border.width} solid ${theme.border};
  background-color: ${theme.surface};
  height: ${({ $size = 'md' }) => fieldTokens.height[$size]};
  padding: ${({ $size = 'md' }) => fieldTokens.padding[$size]};
  transition: ${fieldTokens.transition};

  &:hover:not(:disabled) {
    border-color: ${theme.primary};
  }

  &:focus-within {
    border-color: ${theme.focusRing};
  }

  ${({ $error }) =>
    $error &&
    css`
      border-color: ${theme.error};

      &:hover:not(:disabled),
      &:focus-within {
        border-color: ${theme.error};
      }
    `}

  ${({ $disabled }) =>
    $disabled &&
    css`
      background-color: ${theme.disabledBg};
      border-color: ${theme.border};
      opacity: 0.6;
      cursor: not-allowed;

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
  font-size: ${fieldTokens.typography.fontSize};
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
  font-size: ${fieldTokens.typography.helperSize};
  color: ${({ $error }) => ($error ? theme.error : theme.textMuted)};
`;
