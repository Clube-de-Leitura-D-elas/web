import styled from 'styled-components';
import type { ModalSize } from './index';

const MAX_WIDTH_BY_SIZE: Record<ModalSize, string> = {
  sm: '22.5rem',
  md: '30rem',
  lg: '40rem',
};

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: ${({ theme }) => theme.overlayScrim};
`;

export const Container = styled.div<{ $size: ModalSize }>`
  width: 100%;
  max-width: ${({ $size }) => MAX_WIDTH_BY_SIZE[$size]};
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-radius: 0.75rem;
  background-color: ${({ theme }) => theme.surface};
  box-shadow: 0 0.75rem 2rem rgba(0, 0, 0, 0.24); // a sombra tem essa cor pois não tem token de elevação
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.5rem;
  color: ${({ theme }) => theme.text};
`;

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  border: none;
  border-radius: 0.25rem;
  background: transparent;
  font-size: 1.25rem;
  line-height: 1;
  color: ${({ theme }) => theme.textMuted};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.text};
  }
`;

export const Description = styled.p`
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${({ theme }) => theme.textMuted};
`;

export const Body = styled.div`
  margin-top: 1rem;
`;

export const Footer = styled.div<{ $size: ModalSize }>`
  display: flex;
  justify-content: ${({ $size }) => ($size === 'sm' ? 'center' : 'flex-end')};
  gap: 0.75rem;
  margin-top: 1.5rem;
`;
