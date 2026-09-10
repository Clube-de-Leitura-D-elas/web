import styled, { css } from 'styled-components';
import type { TableAlign } from '.';

const justifyByAlign: Record<TableAlign, string> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

export const Container = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: 1rem;
    overflow: hidden;
    background-color: ${theme.background};
  `}
`;

export const Scroll = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
`;

export const Col = styled.col<{ $width?: string }>`
  ${({ $width }) =>
    $width &&
    css`
      width: ${$width};
    `}
`;

const cellPadding = css`
  padding: 0.75rem 0.5rem;

  &:first-child {
    padding-left: 1rem;
  }

  &:last-child {
    padding-right: 1rem;
  }
`;

export const HeaderCell = styled.th<{ $align: TableAlign }>`
  ${({ theme, $align }) => css`
    ${cellPadding}
    height: 2.75rem;
    background-color: ${theme.surfaceSunken};
    color: ${theme.textMuted};
    font-size: 0.6875rem;
    font-weight: 400;
    line-height: 1rem;
    letter-spacing: 0.025rem;
    text-transform: uppercase;
    text-align: ${$align};
  `}
`;

export const Row = styled.tr`
  ${({ theme }) => css`
    background-color: ${theme.background};

    &:nth-child(even) {
      background-color: ${theme.backgroundSubtle};
    }
  `}
`;

export const Cell = styled.td<{ $align: TableAlign }>`
  ${({ theme, $align }) => css`
    ${cellPadding}
    color: ${theme.text};
    font-size: 0.8125rem;
    line-height: 1.25rem;
    text-align: ${$align};
    vertical-align: middle;
    overflow-wrap: anywhere;
  `}
`;

export const CellContent = styled.div<{ $align: TableAlign }>`
  ${({ $align }) => css`
    display: flex;
    align-items: center;
    justify-content: ${justifyByAlign[$align]};
    min-width: 0;
  `}
`;

export const EmptyCell = styled.td`
  ${({ theme }) => css`
    padding: 1.5rem 1rem;
    color: ${theme.textMuted};
    font-size: 0.8125rem;
    line-height: 1.25rem;
    text-align: center;
  `}
`;

export const Footer = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 1rem;
    border-top: 0.0625rem solid ${theme.border};
    background-color: ${theme.background};
  `}
`;

export const Summary = styled.p`
  ${({ theme }) => css`
    margin: 0;
    color: ${theme.textMuted};
    font-size: 0.8125rem;
    line-height: 1.25rem;
  `}
`;

export const Pagination = styled.nav`
  display: flex;
  gap: 0.5rem;
`;

export const PageButton = styled.button<{ $active?: boolean }>`
  ${({ theme, $active }) => css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    border-radius: 0.5rem;
    border: 0.0625rem solid ${theme.border};
    background-color: ${theme.surface};
    color: ${theme.textMuted};
    font-size: 0.75rem;
    font-weight: 700;
    line-height: normal;
    cursor: pointer;

    &:hover:not(:disabled) {
      border-color: ${theme.borderStrong};
    }

    &:disabled {
      color: ${theme.disabledFg};
      cursor: not-allowed;
    }

    ${
      $active &&
      css`
        border-color: ${theme.primary};
        background-color: ${theme.primary};
        color: ${theme.textOnBrand};

        &:hover:not(:disabled) {
          border-color: ${theme.primaryHover};
          background-color: ${theme.primaryHover};
        }
      `
    }
  `}
`;
