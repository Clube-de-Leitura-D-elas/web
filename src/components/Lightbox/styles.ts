import styled from 'styled-components';
import { theme } from '../../theme/theme';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: ${theme.overlayScrim};
`;

export const Dialog = styled.div`
  position: relative;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`;

export const Stage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  max-width: 100%;
`;

export const Image = styled.img`
  display: block;
  max-width: min(90vw, 70rem);
  max-height: 75vh;
  min-width: 0;
  object-fit: contain;
  border-radius: 0.5rem;
  background: ${theme.surfaceSunken};
`;

export const Unavailable = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: min(80vw, 24rem);
  height: 16rem;
  padding: 1rem;
  box-sizing: border-box;
  border-radius: 0.5rem;
  background: ${theme.surfaceSunken};
  color: ${theme.textMuted};
  font-size: 0.9375rem;
  text-align: center;
`;

const iconButton = `
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: ${theme.surface};
  color: ${theme.text};
  cursor: pointer;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  &:hover:not(:disabled) {
    background: ${theme.surfaceBrandSoft};
    color: ${theme.textBrand};
  }

  &:focus-visible {
    outline: 2px solid ${theme.focusRing};
    outline-offset: 2px;
  }

  &:disabled {
    background: ${theme.disabledBg};
    color: ${theme.disabledFg};
    cursor: not-allowed;
  }
`;

export const NavButton = styled.button`
  ${iconButton}
`;

export const CloseButton = styled.button`
  ${iconButton}
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  z-index: 1;
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  max-width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background: ${theme.surface};
  color: ${theme.text};
  font-size: 0.875rem;
  text-align: center;
`;

export const Position = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${theme.textMuted};
`;
