import { NavLink } from 'react-router';
import styled, { css } from 'styled-components';

const OPEN_WIDTH = '15.5rem';
const COLLAPSED_WIDTH = '6rem';

const BORDER_WIDTH = '1px';

const WIDTH_TRANSITION = '0.28s cubic-bezier(0.4, 0, 0.2, 1)';

const fadeTransition = (collapsed: boolean) =>
  collapsed ? 'opacity 0.12s ease' : 'opacity 0.2s ease 0.12s';

const fade = css<{ $collapsed: boolean }>`
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  transition: ${({ $collapsed }) => fadeTransition($collapsed)};
  pointer-events: ${({ $collapsed }) => ($collapsed ? 'none' : 'auto')};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const Container = styled.aside<{ $collapsed: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  height: 100vh;
  height: 100dvh;
  width: ${({ $collapsed }) =>
    $collapsed
      ? `calc(${COLLAPSED_WIDTH} + ${BORDER_WIDTH})`
      : `calc(${OPEN_WIDTH} + ${BORDER_WIDTH})`};
  padding: 2rem 1.5rem 1.5rem;
  transition: width ${WIDTH_TRANSITION};

  ${({ theme }) => css`
    background-color: ${theme.background};
    border-right: ${BORDER_WIDTH} solid ${theme.border};
  `}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const ToggleButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: -1rem;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border-radius: 50%;
  cursor: pointer;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;

  ${({ theme }) => css`
    border: 1px solid ${theme.border};
    background-color: ${theme.surface};
    color: ${theme.textMuted};

    &:hover {
      border-color: ${theme.borderBrand};
      background-color: ${theme.surfaceBrandSoft};
      color: ${theme.textBrand};
    }
  `}

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

export const Top = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  gap: 2.5rem;
  overflow: hidden;
`;

export const Brand = styled.div`
  position: relative;
  flex-shrink: 0;
  height: 3.75rem;
  overflow: hidden;
`;

export const BrandText = styled.div<{ $collapsed: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  white-space: nowrap;

  ${fade}
`;

export const BrandName = styled.p`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  line-height: 2.5rem;
  color: ${({ theme }) => theme.textBrand};
`;

export const BrandSubtitle = styled.p`
  margin: 0;
  font-size: 0.625rem;
  font-weight: 700;
  line-height: normal;
  color: ${({ theme }) => theme.textMuted};
`;

export const Logo = styled.img<{ $collapsed: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;

  opacity: ${({ $collapsed }) => ($collapsed ? 0.5 : 0)};
  transition: ${({ $collapsed }) =>
    $collapsed ? 'opacity 0.2s ease 0.12s' : 'opacity 0.12s ease'};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const Item = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
  height: 3rem;
  padding: 1rem 0.75rem;
  border-radius: 0.75rem;
  line-height: 1.5rem;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  ${({ theme }) => css`
    color: ${theme.textMuted};

    &:hover {
      background-color: ${theme.surfaceSunken};
      color: ${theme.textBrand};
    }

    &[aria-current='page'] {
      background-color: ${theme.primary};
      color: ${theme.textOnBrand};
    }
  `}

  svg {
    flex-shrink: 0;
    max-width: none;
    width: 1.25rem;
    height: 1.25rem;
    margin: 0.125rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const ItemLabel = styled.span<{ $collapsed: boolean }>`
  font-size: 0.875rem;
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  pointer-events: ${({ $collapsed }) => ($collapsed ? 'none' : 'auto')};
  transition: ${({ $collapsed }) => `${fadeTransition($collapsed)}, font-size 0.2s ease`};

  ${Item}:hover &,
  ${Item}[aria-current='page'] & {
    font-size: 1rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const Divider = styled.hr<{ $collapsed: boolean }>`
  flex-shrink: 0;
  height: 1px;
  margin: 0;
  border: 0;
  background-color: ${({ theme }) => theme.border};

  ${fade}
`;

export const User = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
  overflow: hidden;
`;

export const Popover = styled.div`
  position: absolute;
  bottom: 0;
  left: 2.5rem;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  min-width: 10rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  transform: scale(0.9);
  transform-origin: bottom left;
  pointer-events: none;
  transition:
    opacity 0.18s ease,
    transform 0.18s cubic-bezier(0.4, 0, 0.2, 1);

  ${({ theme }) => css`
    border: ${BORDER_WIDTH} solid ${theme.border};
    background-color: ${theme.surface};
  `}

  > * {
    opacity: 0;
    transform: translateX(-0.5rem);
    transition:
      opacity 0.18s ease,
      transform 0.18s ease;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    > * {
      transition: none;
    }
  }
`;

export const UserArea = styled.div`
  position: relative;
  flex-shrink: 0;

  &:hover ${Popover}, &:focus-within ${Popover} {
    opacity: 1;
    transform: scale(1);
    pointer-events: auto;
  }

  &:hover ${Popover} > *,
  &:focus-within ${Popover} > * {
    opacity: 1;
    transform: none;
  }

  &:hover ${Popover} > *:nth-child(1),
  &:focus-within ${Popover} > *:nth-child(1) {
    transition-delay: 0.06s;
  }

  &:hover ${Popover} > *:nth-child(2),
  &:focus-within ${Popover} > *:nth-child(2) {
    transition-delay: 0.12s;
  }
`;

export const Avatar = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.surfaceBrandSoft};
  color: ${({ theme }) => theme.textBrand};
  font-size: 0.9375rem;
  font-weight: 700;
  line-height: normal;
  text-transform: uppercase;
`;

export const UserInfo = styled.div<{ $collapsed: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  white-space: nowrap;

  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  visibility: ${({ $collapsed }) => ($collapsed ? 'hidden' : 'visible')};
  transition: ${({ $collapsed }) =>
    $collapsed
      ? 'opacity 0.12s ease, visibility 0s linear 0.12s'
      : 'opacity 0.2s ease 0.12s, visibility 0s linear 0s'};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const UserName = styled.span`
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5rem;
  color: ${({ theme }) => theme.text};
`;

export const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0;
  border: 0;
  border-radius: 0.25rem;
  background: none;
  color: ${({ theme }) => theme.textBrand};
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
  text-align: left;
  cursor: pointer;

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

export const LogoutLabel = styled.span`
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background-color: currentColor;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  ${LogoutButton}:hover &::after {
    transform: scaleX(1);
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      transition: none;
    }
  }
`;
