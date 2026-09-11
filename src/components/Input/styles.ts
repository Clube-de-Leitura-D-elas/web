import styled, { css } from 'styled-components';

import type { InputSize } from './index';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
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
  border: 0.0625rem solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.surface};

  ${({ $size }) => sizeStyles[$size]}

  &:focus-within {
    border-color: ${({ theme }) => theme.focusRing};
  }

  ${({ $error, theme }) =>
    $error &&
    css`
      border-color: ${theme.error};

      &:focus-within {
        border-color: ${theme.error};
      }
    `}

  ${({ $disabled, theme }) =>
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
  color: ${({ theme }) => theme.text};

  &::placeholder {
    color: ${({ theme }) => theme.textMuted};
  }

  &:disabled {
    color: ${({ theme }) => theme.disabledFg};
    cursor: not-allowed;
  }

  &:disabled::placeholder {
    color: ${({ theme }) => theme.disabledFg};
  }
`;

export const Helper = styled.span<{ $error: boolean }>`
  font-size: 0.75rem;
  color: ${({ theme, $error }) => ($error ? theme.error : theme.textMuted)};
`;
