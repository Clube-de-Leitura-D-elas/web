import styled, { css } from 'styled-components';
import type { DropdownVariants } from '.';
import { theme } from '../../theme/theme';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
  max-width: 20rem;
`;

export const Label = styled.label`
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.text};
  user-select: none;
`;

export const Field = styled.div`
  position: relative;
  width: 100%;
`;

export const Trigger = styled.button<{
  $size?: DropdownVariants;
  $isOpen?: boolean;
  $isError?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: ${theme.surface};
  color: ${theme.text};
  border-radius: 0.5rem;
  border: 2px solid
    ${({ $isOpen, $isError }) => ($isError ? theme.error : $isOpen ? theme.focusRing : theme.border)};
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  ${({ $size }) =>
    $size === 'lg'
      ? css`
          height: 3.5rem;
        `
      : css`
          height: 2.5rem;
        `}
  &:focus {
    border-color: ${({ $isError }) => ($isError ? theme.error : theme.primary)};
  }
  &:disabled {
    cursor: not-allowed;
    background-color: ${theme.disabledBg ?? theme.surface};
    color: ${theme.disabledFg ?? theme.textMuted};
    border-color: ${theme.border};
    opacity: 0.6;
  }
`;

export const Menu = styled.ul`
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  width: 100%;
  max-height: 15rem;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
  background-color: ${theme.surface};
  border: 1px solid ${theme.border};
  border-radius: 0.5rem;
  z-index: 10;
`;

export const MenuItem = styled.li<{ $isSelected?: boolean }>`
  padding: 0.5rem 1rem;
  color: ${({ $isSelected }) => ($isSelected ? theme.textBrand : theme.text)};
  background-color: ${({ $isSelected }) => ($isSelected ? theme.surfaceBrandSoft : theme.background)};
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background-color: ${theme.surfaceBrandSoft};
    color: ${theme.textBrand};
  }
`;

export const HelperText = styled.span<{ $isError?: boolean }>`
  font-size: 0.875rem;
  color: ${({ $isError }) => ($isError ? theme.error : theme.textMuted)};
`;
