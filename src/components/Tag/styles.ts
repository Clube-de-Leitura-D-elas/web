import styled, { css } from 'styled-components';
import type { TagColor } from '.';

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

  ${({ theme, $color }) => {
    switch ($color) {
      case 'primary':
        return css`
          background-color: ${theme.surfaceBrandSoft};
          color: ${theme.textBrand};
        `;
      default:
        return css`
          background-color: ${theme.surfaceSunken};
          color: ${theme.text};
        `;
    }
  }}
`;
