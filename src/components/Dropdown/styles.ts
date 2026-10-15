import styled from 'styled-components';
import type { DropdownVariants } from '.';
import { theme, fieldTokens } from '../../theme/theme';

export const Wrapper = styled.div<{ $fullWidth: boolean }>`
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
  border-radius: ${fieldTokens.border.radius};
  border: ${fieldTokens.border.width} solid
    ${({ $isOpen, $isError }) => ($isError ? theme.error : $isOpen ? theme.focusRing : theme.border)};
  height: ${({ $size = 'md' }) => fieldTokens.height[$size]};
  padding: ${({ $size = 'md' }) => fieldTokens.padding[$size]};
  font-size: ${fieldTokens.typography.fontSize};
  cursor: pointer;
  outline: none;
  transition: ${fieldTokens.transition};

  &:hover:not(:disabled) {
    border-color: ${({ $isError, $isOpen }) =>
      $isError ? theme.error : $isOpen ? theme.focusRing : theme.primary};
  }
  &:focus {
    border-color: ${({ $isError }) => ($isError ? theme.error : theme.focusRing)};
  }
  &:disabled {
    cursor: not-allowed;
    background-color: ${theme.disabledBg ?? theme.surface};
    color: ${theme.disabledFg ?? theme.textMuted};
    border-color: ${theme.border};
    opacity: 0.6;
  }
`;

export const TriggerValue = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
`;

export const TriggerIcon = styled.span`
  display: flex;
  flex-shrink: 0;
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
  border: ${fieldTokens.border.width} solid ${theme.border};
  border-radius: ${fieldTokens.border.radius};
  z-index: 10;
`;

export const MenuItem = styled.li<{ $isSelected?: boolean }>`
  padding: ${fieldTokens.padding.md};
  color: ${({ $isSelected }) => ($isSelected ? theme.textBrand : theme.text)};
  background-color: ${({ $isSelected }) => ($isSelected ? theme.surfaceBrandSoft : theme.background)};
  cursor: pointer;
  font-weight: 600;

  &:hover,
  &:focus-visible {
    background-color: ${theme.surfaceBrandSoft};
    color: ${theme.textBrand};
  }
`;

export const HelperText = styled.span<{ $isError?: boolean }>`
  font-size: ${fieldTokens.typography.helperSize};
  color: ${({ $isError }) => ($isError ? theme.error : theme.textMuted)};
`;
