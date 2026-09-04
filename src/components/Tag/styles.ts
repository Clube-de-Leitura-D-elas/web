/**
 * Estilos do Tag.
 *
 * Duas convenções importantes do projeto aparecem aqui:
 *
 * 1. COR SEMPRE DO TEMA. Nada de `#FCE8F0` solto — use `${({ theme }) => theme.surfaceBrandSoft}`.
 *    Assim o componente funciona no modo claro e no escuro sem nenhuma alteração.
 *
 * 2. PARÂMETRO TRANSIENTE (`$color`, com cifrão). O cifrão avisa o styled-components que a prop é
 *    só para o estilo e NÃO deve virar atributo HTML. Sem ele, o React reclama no console
 *    de um atributo `color` desconhecido no <span>. É o erro nº 1 de quem está começando.
 *
 * Medidas (altura 24px, padding 4/16, raio 999px) vêm do Figma e ficam fixas aqui —
 * só cor é token.
 */
import styled, { css } from 'styled-components';
import type { TagColor } from './Tag';

export const Container = styled.span<{ $color: TagColor }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 24px;
  padding: 4px 16px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  white-space: nowrap;

  ${({ theme, $color }) =>
    $color === 'primary'
      ? css`
          background-color: ${theme.surfaceBrandSoft};
          color: ${theme.textBrand};
        `
      : css`
          background-color: ${theme.surfaceSunken};
          color: ${theme.text};
        `}
`;
