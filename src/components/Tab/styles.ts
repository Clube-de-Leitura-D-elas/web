import styled, { css } from 'styled-components';
import type { TabSize } from '.';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const TabList = styled.div<{ $size: TabSize }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 2px solid ${({ theme }) => theme.border};
  overflow-x: auto;
  overflow-y: hidden;
`;

export const TabButton = styled.button<{ $active: boolean; $size: TabSize }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  font-weight: 600;
  margin-bottom: -2px;
  border-bottom: 2px solid transparent;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;

  ${({ $size }) =>
    $size === 'lg'
      ? css`
          height: 3.5rem;
          padding: 0 1.5rem;
          font-size: 1.125rem;
        `
      : css`
          height: 2.5rem;
          padding: 0 1rem;
          font-size: 1rem;
        `}

  ${({ theme, $active }) =>
    $active &&
    css`
      color: ${theme.primary};
      font-weight: 600;

      &::after {
        content: '';
        position: absolute;

        left: 0;
        right: 0;
        bottom: -1px;

        height: 3px;

        background-color: ${theme.primary};
      }

      &:hover {
        color: ${theme.primary};
        background-color: transparent;
      }
    `}

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focusRing};
    outline-offset: -2px;
    border-radius: 0.25rem;
  }

  &:disabled {
    cursor: not-allowed;
    color: ${({ theme }) => theme.disabledFg};
  }
`;

export const Panel = styled.div`
  padding-top: 1rem;
  color: ${({ theme }) => theme.text};
`;
