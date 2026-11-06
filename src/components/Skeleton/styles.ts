import styled, { css, keyframes } from 'styled-components';

type SkeletonStyleProps = {
  $width: string;
  $height: string;
  $variant: 'rectangular' | 'circular';
};

const pulse = keyframes`
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }
`;

export const Skeleton = styled.span<SkeletonStyleProps>`
  ${({ theme, $width, $height, $variant }) => css`
    display: block;
    width: ${$width};
    height: ${$height};
    max-width: 100%;
    border-radius: ${$variant === 'circular' ? '50%' : '0.25rem'};
    background-color: ${theme.border};
    animation: ${pulse} 1.5s ease-in-out infinite;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  `}
`;
