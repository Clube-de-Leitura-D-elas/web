import styled, { keyframes } from 'styled-components';
import { EASE_OUT, reducedMotion } from '../../theme/motion';
import { theme } from '../../theme/theme';
import type { ToastVariant } from '.';

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, 1rem);
  }

  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
`;

export const Container = styled.div`
  position: fixed;
  left: 50%;
  bottom: 2rem;
  z-index: 1100;
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: calc(100% - 2rem);
  padding: 0.625rem 0.625rem 0.625rem 1.125rem;
  border-radius: 0.75rem;
  background-color: ${theme.text};
  color: ${theme.textInverse};
  box-shadow: 0 0.75rem 2rem -0.5rem ${theme.overlayScrim};
  font-size: 0.9375rem;
  font-weight: 700;
  transform: translate(-50%, 0);
  animation: ${slideUp} 0.35s ${EASE_OUT} both;
  ${reducedMotion}
`;

export const Icon = styled.span<{ $variant: ToastVariant }>`
  display: flex;
  flex-shrink: 0;
  color: ${({ $variant }) => ($variant === 'error' ? theme.warning : theme.success)};

  svg {
    width: 1.125rem;
    height: 1.125rem;
    stroke-width: 3;
  }
`;

export const Message = styled.span`
  min-width: 0;
`;

export const Action = styled.button`
  flex-shrink: 0;
  height: 2.25rem;
  padding: 0 0.75rem;
  border: 1px solid ${theme.textMuted};
  border-radius: 0.5rem;
  background: transparent;
  color: ${theme.textInverse};
  font-size: 0.875rem;
  font-weight: 800;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${theme.textInverse};
  }
`;
