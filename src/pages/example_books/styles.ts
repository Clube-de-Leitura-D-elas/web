/**
 * EXEMPLO: estilos da página de livros.
 *
 * Igual aos componentes, todo o CSS da página fica aqui, e a página importa com
 * `import * as Styled from './styles'`. Cores sempre vêm do tema (`theme.<cor>`), nunca hex fixo.
 */
import styled, { css } from 'styled-components';

export const Container = styled.main`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
`;

export const Title = styled.h1`
  ${({ theme }) => css`
    margin: 0;
    color: ${theme.text};
    font-size: 1.5rem;
  `}
`;

export const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 1rem;
`;

export const Message = styled.p<{ $error?: boolean }>`
  ${({ theme, $error }) => css`
    margin: 0;
    color: ${$error ? theme.error : theme.textMuted};
    font-size: 0.875rem;
  `}
`;
