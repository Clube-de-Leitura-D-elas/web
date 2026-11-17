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

const palette = {
  success: { background: theme.successLight, border: theme.success, text: theme.successDark },
  error: { background: theme.errorLight, border: theme.error, text: theme.errorDark },
} satisfies Record<ToastVariant, { background: string; border: string; text: string }>;

export const Container = styled.div<{ $variant: ToastVariant }>`
  position: fixed;
  left: 50%;
  bottom: 2rem;
  z-index: 1100;
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: calc(100% - 2rem);
  padding: 0.625rem 0.625rem 0.625rem 1.125rem;
  border: 1px solid ${({ $variant }) => palette[$variant].border};
  border-radius: 0.75rem;
  background-color: ${({ $variant }) => palette[$variant].background};
  color: ${({ $variant }) => palette[$variant].text};
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
  color: ${({ $variant }) => palette[$variant].border};

  svg {
    width: 1.125rem;
    height: 1.125rem;
    stroke-width: 3;
  }
`;

export const Message = styled.span`
  min-width: 0;
`;

export const Action = styled.button<{ $variant: ToastVariant }>`
  flex-shrink: 0;
  height: 2.25rem;
  padding: 0 0.75rem;
  border: 1px solid ${({ $variant }) => palette[$variant].border};
  border-radius: 0.5rem;
  background: transparent;
  color: ${({ $variant }) => palette[$variant].text};
  font-size: 0.875rem;
  font-weight: 800;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${theme.surface};
  }
`;
