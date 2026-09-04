/**
 * Componente Tag — EXEMPLO DE REFERÊNCIA.
 *
 * Use este componente como modelo ao implementar os outros. Repare em quatro coisas:
 *  1. o estilo mora todo em `styles.ts` e chega aqui como `Styled.*`;
 *  2. o componente é `export const` (nunca `export default`);
 *  3. o conteúdo vem por `children`, e não por uma prop de texto;
 *  4. nenhuma cor aparece neste arquivo — cor é assunto do `styles.ts`, via tema.
 *
 * Exemplos de import e das variantes: veja `Tag.example.tsx`.
 * */
import type { ReactNode } from 'react';
import * as Styled from './styles';

/** Primary = papéis do clube. Neutral = rótulos sem destaque. */
export type TagColor = 'primary' | 'neutral';

export type TagProps = {
  /** Conteúdo da tag — normalmente um texto curto. */
  children: ReactNode;
  /** Variante de cor. Padrão: 'primary'. */
  color?: TagColor;
};

export const Tag = ({ children, color = 'primary' }: TagProps) => (
  <Styled.Container $color={color}>{children}</Styled.Container>
);
