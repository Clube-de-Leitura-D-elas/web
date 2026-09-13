import type { ReactNode } from 'react';
import * as Styled from './styles';

export type TagColor = 'primary' | 'neutral';

export type TagProps = {
  children: ReactNode;
  color?: TagColor;
};

export const Tag = ({ children, color = 'primary' }: TagProps) => (
  <Styled.Container $color={color}>{children}</Styled.Container>
);
