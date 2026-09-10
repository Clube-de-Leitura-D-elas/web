import styled, { css } from 'styled-components';
import type { DropdownVariants } from '.';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
  max-width: 20rem;
  position: relative;
`;

export const Label = styled.label`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  user-select: none;
`;

export const Trigger = styled.button<{ $size?: DropdownVariants; $isOpen?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  border-radius: 0.5rem;
  border: 2px solid ${({ theme, $isOpen }) => ($isOpen ? theme.focusRing : theme.border)};
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
    border-color: ${({ theme }) => theme.primary};
  }
  &:disabled {
    cursor: not-allowed;
    background-color: ${({ theme }) => theme.disabledBg ?? theme.surface};
    color: ${({ theme }) => theme.disabledFg ?? theme.textMuted};
    border-color: ${({ theme }) => theme.border};
    opacity: 0.6;
  }
`;

export const Menu = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  background-color: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.5rem;
  left: 0;
  width: 100%;
  overflow-y: auto;
`;

export const MenuItem = styled.li<{ $isSelected?: boolean }>`
  padding: 0.5rem 1rem;
  color: ${({ theme, $isSelected }) => ($isSelected ? theme.textBrand : theme.text)};
  background-color: ${({ theme, $isSelected }) => ($isSelected ? theme.surfaceBrandSoft : theme.background)};
  cursor: pointer;
  font-weight: 600;
  z-index: 10;

  &:hover {
    background-color: ${({ theme }) => theme.surfaceBrandSoft};
  }
`;

export const HelperText = styled.span<{ $isError?: boolean }>`
  font-size: 0.875rem;
  color: ${({ theme, $isError }) => ($isError ? theme.error : theme.textMuted)};
`;
