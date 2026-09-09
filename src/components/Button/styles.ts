import styled, { css } from 'styled-components';
import type { ButtonSize, ButtonVariant } from './Button';

export const Container = styled.button<{ $variant: ButtonVariant; $size: ButtonSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 16px;
  font-weight: bold;
  white-space: nowrap;
  height: 40px;
  padding: 8px 32px;

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
            background-color: ${theme.surfaceBrandSoft};
          }
          &:active:not(:disabled) {
            background-color: ${theme.surfaceSunken};
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
        `;
      case 'danger':
        return css`
          background-color: ${theme.danger};
          color: ${theme.textOnBrand};

          &:hover:not(:disabled) {
            background-color: ${theme.errorDark};
          }
        `;
    }
  }}

  ${({ $size }) =>
    $size === 'sm'
      ? css`
          height: 32px;
          padding: 4px 16px;
        `
      : $size === 'lg'
        ? css`
            height: 56px;
            padding: 16px 32px;
          `
        : null};
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
