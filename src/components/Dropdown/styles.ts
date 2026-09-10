import styled, { css } from 'styled-components';
import type { DropdownVariants } from './Dropdown';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
  max-width: 20rem;
  position: relative;
`;

export const Label = styled.label``;

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
`;

export const MenuItem = styled.li<{ $isSelected?: boolean }>``;

export const HelperText = styled.span``;
