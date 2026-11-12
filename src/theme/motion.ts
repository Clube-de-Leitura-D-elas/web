import { css, keyframes } from 'styled-components';

export const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(0.75rem);
  }

  to {
    opacity: 1;
    transform: none;
  }
`;

export const popIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.5);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const growX = keyframes`
  from {
    transform: scaleX(0);
  }

  to {
    transform: scaleX(1);
  }
`;

export const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.6;
  }

  70%,
  100% {
    transform: scale(2.6);
    opacity: 0;
  }
`;

export const reducedMotion = css`
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition: none;
  }
`;

export const enter = (delay = 0) => css`
  animation: ${fadeInUp} 0.5s ${EASE_OUT} ${delay}ms backwards;
  ${reducedMotion}
`;

export const pop = (delay = 0) => css`
  animation: ${popIn} 0.35s ${EASE_OUT} ${delay}ms backwards;
  ${reducedMotion}
`;
