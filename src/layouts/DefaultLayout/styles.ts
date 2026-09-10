import styled from 'styled-components';

/** Celular: o menu lateral some e vira uma gaveta aberta pelo botão da barra do topo. */
export const MOBILE_QUERY = '(max-width: 767px)';
/** Tablet: o menu lateral começa fechado (só ícones) para sobrar espaço para o conteúdo. */
export const TABLET_QUERY = '(max-width: 1023px)';

const DRAWER_TRANSITION = '0.28s cubic-bezier(0.4, 0, 0.2, 1)';

export const Container = styled.div`
  display: flex;
  min-height: 100vh;
  min-height: 100dvh;

  @media ${MOBILE_QUERY} {
    flex-direction: column;
  }
`;

export const SidebarSlot = styled.div<{ $open: boolean }>`
  position: sticky;
  top: 0;
  z-index: 2;
  align-self: flex-start;
  flex-shrink: 0;

  @media ${MOBILE_QUERY} {
    position: fixed;
    inset: 0 auto 0 0;
    z-index: 4;
    /* O 1rem a mais esconde o botão redondo que fica para fora do painel. */
    transform: ${({ $open }) => ($open ? 'none' : 'translateX(calc(-100% - 1rem))')};
    transition: transform ${DRAWER_TRANSITION};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const Scrim = styled.div<{ $open: boolean }>`
  display: none;

  @media ${MOBILE_QUERY} {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 3;
    background-color: ${({ theme }) => theme.overlayScrim};
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
    transition: opacity ${DRAWER_TRANSITION};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const TopBar = styled.header`
  display: none;

  @media ${MOBILE_QUERY} {
    position: sticky;
    top: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    height: 4rem;
    padding: 0 1rem;
    background-color: ${({ theme }) => theme.background};
    border-bottom: 1px solid ${({ theme }) => theme.border};
  }
`;

export const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: 0;
  border-radius: 0.75rem;
  background: none;
  color: ${({ theme }) => theme.textMuted};
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.surfaceSunken};
    color: ${({ theme }) => theme.textBrand};
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

export const TopBarLogo = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  object-fit: cover;
`;

export const TopBarBrand = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.textBrand};
`;

export const Content = styled.main`
  flex: 1;
  min-width: 0;
  padding: 2rem;

  @media ${MOBILE_QUERY} {
    padding: 1.5rem 1rem;
  }
`;
