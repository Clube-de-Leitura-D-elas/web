import { Link } from 'react-router';
import styled from 'styled-components';
import { EASE_OUT, enter } from '../../theme/motion';
import { theme } from '../../theme/theme';

export const Container = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  color: ${theme.textMuted};
  font-size: 0.875rem;
  font-weight: 600;
  ${enter(0)}

  span[aria-current] {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const ParentLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  gap: 0.375rem;
  color: ${theme.textBrand};
  font-weight: 700;
  text-decoration: none;

  svg {
    width: 1rem;
    height: 1rem;
    transition: transform 0.2s ${EASE_OUT};
  }

  &:hover {
    color: ${theme.primaryHover};

    svg {
      transform: translateX(-0.1875rem);
    }
  }

  &:focus-visible {
    outline: 2px solid ${theme.focusRing};
    outline-offset: 0.25rem;
    border-radius: 0.25rem;
  }

  @media (prefers-reduced-motion: reduce) {
    svg {
      transition: none;
    }

    &:hover svg {
      transform: none;
    }
  }
`;
