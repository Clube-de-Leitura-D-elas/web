import styled, { css, keyframes } from 'styled-components';
import { EASE_OUT, reducedMotion } from '../../theme/motion';
import { theme } from '../../theme/theme';

export const Container = styled.div`
  position: relative;
  display: inline-block;
`;

export const TriggerButton = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 6px;
  color: ${theme.textMuted};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${theme.border};
  }
`;

const menuIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-0.25rem) scale(0.97);
  }

  to {
    opacity: 1;
    transform: none;
  }
`;

export const MenuDropdown = styled.div`
  animation: ${menuIn} 0.18s ${EASE_OUT} both;
  ${reducedMotion}
  position: fixed;
  z-index: 50;
  background-color: ${theme.background};
  min-width: 220px;
  display: flex;
  flex-direction: column;
  border-radius: 14px;
  padding: 1rem;
  box-shadow: 0 4px 16px ${theme.border};
  gap: 2px;
`;

export const MenuItemText = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

export const MenuItemHint = styled.small`
  max-width: 14rem;
  white-space: normal;
  font-size: 0.75rem;
  color: ${theme.textMuted};
`;

export const MenuItem = styled.button<{ $variant?: 'default' | 'danger' }>`
  border: none;
  background-color: transparent;
  cursor: pointer;
  text-align: left;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  white-space: nowrap;
  transition: background-color 0.15s ease;

  ${({ $variant }) =>
    $variant === 'danger'
      ? css`
          color: ${theme.danger};
          &:hover {
            background-color: ${theme.surfaceSunken};
          }
        `
      : css`
          color: ${theme.text};

          &:hover {
            background-color: ${theme.border};
          }
        `}

  &[aria-disabled='true'] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &[aria-disabled='true']:hover {
    background-color: transparent;
  }
`;
