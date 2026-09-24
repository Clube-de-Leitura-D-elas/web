import styled, { css } from 'styled-components';
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

export const MenuDropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
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
          border-top: 1px solid ${theme.border};
          margin-top: 0.25rem;
          border-radius: 0 0 8px 8px;

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
`;
