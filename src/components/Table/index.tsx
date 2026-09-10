import { useState, type ReactNode } from 'react';
import { interpolate, locale } from '../../locales';
import * as Styled from './styles';

export type TableAlign = 'left' | 'center' | 'right';

export type TableColumn = {
  key: string;
  label: ReactNode;
  width?: string;
  align?: TableAlign;
};

export type TableRow = Record<string, ReactNode>;

export type TableProps = {
  columns: TableColumn[];
  rows: TableRow[];
  pageSize?: number;
  itemLabel?: string;
};

const DEFAULT_PAGE_SIZE = 6;
const MAX_VISIBLE_PAGES = 3;

const getVisiblePages = (currentPage: number, totalPages: number) => {
  const size = Math.min(MAX_VISIBLE_PAGES, totalPages);
  const first = Math.min(Math.max(currentPage - Math.floor(size / 2), 1), totalPages - size + 1);
  return Array.from({ length: size }, (_, index) => first + index);
};

export const Table = ({
  columns,
  rows,
  pageSize = DEFAULT_PAGE_SIZE,
  itemLabel = locale.table.defaultItemLabel,
}: TableProps) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pageRows = rows.slice(startIndex, startIndex + pageSize);

  const summary = interpolate(locale.table.summary, {
    start: pageRows.length > 0 ? startIndex + 1 : 0,
    end: startIndex + pageRows.length,
    total: rows.length,
    itemLabel,
  });

  return (
    <Styled.Container>
      <Styled.Scroll>
        <Styled.Table>
          <colgroup>
            {columns.map((column) => (
              <Styled.Col key={column.key} $width={column.width} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {columns.map(({ key, label, align = 'center' }) => (
                <Styled.HeaderCell key={key} scope="col" $align={align}>
                  <Styled.CellContent $align={align}>{label}</Styled.CellContent>
                </Styled.HeaderCell>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <Styled.EmptyCell colSpan={columns.length}>{locale.table.empty}</Styled.EmptyCell>
              </tr>
            ) : (
              pageRows.map((row, rowIndex) => (
                <Styled.Row key={startIndex + rowIndex}>
                  {columns.map(({ key, align = 'center' }) => (
                    <Styled.Cell key={key} $align={align}>
                      <Styled.CellContent $align={align}>{row[key]}</Styled.CellContent>
                    </Styled.Cell>
                  ))}
                </Styled.Row>
              ))
            )}
          </tbody>
        </Styled.Table>
      </Styled.Scroll>

      <Styled.Footer>
        <Styled.Summary aria-live="polite">{summary}</Styled.Summary>
        <Styled.Pagination aria-label={locale.table.paginationLabel}>
          <Styled.PageButton
            type="button"
            aria-label={locale.table.previousPage}
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
          >
            <span aria-hidden="true">‹</span>
          </Styled.PageButton>
          {getVisiblePages(currentPage, totalPages).map((pageNumber) => (
            <Styled.PageButton
              key={pageNumber}
              type="button"
              aria-label={interpolate(locale.table.goToPage, { page: pageNumber })}
              aria-current={pageNumber === currentPage ? 'page' : undefined}
              $active={pageNumber === currentPage}
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </Styled.PageButton>
          ))}
          <Styled.PageButton
            type="button"
            aria-label={locale.table.nextPage}
            disabled={currentPage === totalPages}
            onClick={() => setPage(currentPage + 1)}
          >
            <span aria-hidden="true">›</span>
          </Styled.PageButton>
        </Styled.Pagination>
      </Styled.Footer>
    </Styled.Container>
  );
};
