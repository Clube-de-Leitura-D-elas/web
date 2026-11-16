import styled from 'styled-components';
import type { AvatarSize } from '.';
import { theme } from '../../theme/theme';

const SIZES: Record<AvatarSize, { box: string; font: string }> = {
  sm: { box: '2rem', font: '0.75rem' },
  md: { box: '2.5rem', font: '0.875rem' },
  lg: { box: '3.5rem', font: '1.125rem' },
  xl: { box: '4.5rem', font: '1.625rem' },
};

export const Container = styled.span<{ $size: AvatarSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${({ $size }) => SIZES[$size].box};
  height: ${({ $size }) => SIZES[$size].box};
  overflow: hidden;
  border-radius: 50%;
  background-color: ${theme.surfaceBrandSoft};
  color: ${theme.textBrand};
  font-size: ${({ $size }) => SIZES[$size].font};
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.02em;
  user-select: none;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
