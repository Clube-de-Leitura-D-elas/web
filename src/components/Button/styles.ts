import styled, { css } from 'styled-components';
import type { ButtonSize, ButtonVariant } from './Button';

export const Container = styled.button<{ $variant: ButtonVariant; $size: ButtonSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: bold;
  white-space: nowrap;

  ${({ theme, $variant }) => {
    switch ($variant) {
      case 'primary':
        return css`
          background-color: ${theme.primary};
          color: ${theme.textOnBrand};

          &:hover:not(:disabled) {
            background-color: ${theme.primaryHover};
          }
          &:active:not(:disabled) {
            background-color: ${theme.primaryPressed};
          }
        `;
      case 'secondary':
        return css`
          background-color: ${theme.surface};
          color: ${theme.primary};
          border-color: ${theme.borderBrand};

          &:hover:not(:disabled) {
            background-color: ${theme.surfaceSunken};
          }
          &:active:not(:disabled) {
            background-color: ${theme.surfaceBrandSoft};
            border-color: ${theme.primaryHover};
          }
        `;
      case 'ghost':
        return css`
          background-color: transparent;
          color: ${theme.textBrand};

          &:hover:not(:disabled) {
            background-color: ${theme.surfaceSunken};
          }
          &:active:not(:disabled) {
            background-color: ${theme.surfaceBrandSoft};
          }
        `;
      case 'danger':
        return css`
          background-color: ${theme.danger};
          color: ${theme.textOnBrand};

          &:hover:not(:disabled) {
            background-color: ${theme.errorDark};
          }
          &:active:not(:disabled) {
            background-color: ${theme.primaryPressed};
          }
        `;
    }
  }}

  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return css`
          height: 2rem;
          padding: 0.25rem 1rem;
        `;
      case 'md':
        return css`
          height: 2.5rem;
          padding: 0.5rem 2rem;
        `;
      case 'lg':
        return css`
          height: 3.5rem;
          padding: 1rem 2rem;
        `;
    }
  }}
  &:disabled {
    cursor: not-allowed;
    background-color: ${({ theme }) => theme.disabledBg};
    color: ${({ theme }) => theme.disabledFg};
    border-color: transparent;
  }
  & > svg {
    flex-shrink: 0;
    width: 1.25em;
    height: 1.25em;
  }
`;
