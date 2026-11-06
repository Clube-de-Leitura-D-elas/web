import styled, { css } from 'styled-components';
import type { DataStateSize } from '.';

export const Container = styled.div<{
  $size: DataStateSize;
  $minHeight?: string;
  $loading?: boolean;
}>`
  display: flex;
  box-sizing: border-box;
  width: 100%;
  min-height: ${({ $minHeight }) => $minHeight ?? 'auto'};

  ${({ $size, $loading }) =>
    $size === 'sm'
      ? css`
          flex-direction: row;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.5rem;
          text-align: left;
        `
      : css`
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: ${$loading ? '0' : '1.5rem 1rem'};
          text-align: center;
        `}
`;

export const Icon = styled.span<{ $variant: 'empty' | 'error'; $size: DataStateSize }>`
  ${({ theme, $variant, $size }) => css`
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    color: ${$variant === 'error' ? theme.errorDark : theme.textMuted};

    ${
      $size === 'md' &&
      css`
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        background-color: ${$variant === 'error' ? theme.errorLight : theme.surfaceSunken};
      `
    }

    svg {
      width: ${$size === 'sm' ? '1rem' : '1.5rem'};
      height: ${$size === 'sm' ? '1rem' : '1.5rem'};
    }
  `}
`;

export const Message = styled.p<{ $size: DataStateSize }>`
  margin: 0;
  max-width: 28rem;
  font-size: ${({ $size }) => ($size === 'sm' ? '0.75rem' : '0.875rem')};
  line-height: 1.4;
  color: ${({ theme }) => theme.textMuted};
`;

export const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;
