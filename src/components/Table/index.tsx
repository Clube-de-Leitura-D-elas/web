import { useEffect, useState, type ReactNode } from 'react';
import { interpolate, locale } from '../../locales';
import { Button } from '../Button';
import * as Styled from './styles';

export type TableAlign = 'left' | 'center' | 'right';

export type TableColumn = {
  key: string;
  label: ReactNode;
  width?: string;
  align?: TableAlign;
};

export type TableRow = Record<string, ReactNode>;

export type TablePageRequest = {
  page: number;
  pageSize: number;
};

export type TablePage = {
  rows: TableRow[];
  total: number;
};

export type TableFetchPage = (request: TablePageRequest) => Promise<TablePage>;

type TableBaseProps = {
  columns: TableColumn[];
  pageSize?: number;
  itemLabel?: string;
};

export type TableProps = TableBaseProps &
  (
    | {
        rows: TableRow[];
        fetchPage?: never;
      }
    | {
        fetchPage: TableFetchPage;
        rows?: never;
      }
  );

type PageCache = {
  fetchPage?: TableFetchPage;
  pageSize: number;
  pages: Record<number, TableRow[]>;
  total: number | null;
  failedPage: number | null;
};

const DEFAULT_PAGE_SIZE = 6;
const MAX_VISIBLE_PAGES = 3;
const SKELETON_WIDTHS = ['70%', '45%', '60%', '35%', '55%'];

const createCache = (fetchPage: TableFetchPage | undefined, pageSize: number): PageCache => ({
  fetchPage,
  pageSize,
  pages: {},
  total: null,
  failedPage: null,
});

const getVisiblePages = (currentPage: number, totalPages: number) => {
  const size = Math.min(MAX_VISIBLE_PAGES, totalPages);
  const first = Math.min(Math.max(currentPage - Math.floor(size / 2), 1), totalPages - size + 1);
  return Array.from({ length: size }, (_, index) => first + index);
};

export const Table = ({
  columns,
  rows,
  fetchPage,
  pageSize = DEFAULT_PAGE_SIZE,
  itemLabel = locale.table.defaultItemLabel,
}: TableProps) => {
  const [page, setPage] = useState(1);
  const [cache, setCache] = useState(() => createCache(fetchPage, pageSize));

  if (cache.fetchPage !== fetchPage || cache.pageSize !== pageSize) {
    setCache(createCache(fetchPage, pageSize));
    setPage(1);
  }

  const isRemote = fetchPage !== undefined;
  const isTotalKnown = !isRemote || cache.total !== null;
  const total = isRemote ? (cache.total ?? 0) : (rows ?? []).length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pageRows = isRemote
    ? cache.pages[currentPage]
    : (rows ?? []).slice(startIndex, startIndex + pageSize);
  const isCached = pageRows !== undefined;
  const hasError = isRemote && cache.failedPage === currentPage;
  const isLoading = isRemote && !isCached && !hasError;
  const skeletonRowCount = isTotalKnown
    ? Math.min(pageSize, Math.max(total - startIndex, 1))
    : pageSize;

  useEffect(() => {
    if (!fetchPage || isCached || hasError) return;

    const isSameSource = (current: PageCache) =>
      current.fetchPage === fetchPage && current.pageSize === pageSize;

    fetchPage({ page: currentPage, pageSize })
      .then((result) =>
        setCache((current) =>
          isSameSource(current)
            ? {
                ...current,
                pages: { ...current.pages, [currentPage]: result.rows },
                total: result.total,
              }
            : current,
        ),
      )
      .catch(() =>
        setCache((current) =>
          isSameSource(current) ? { ...current, failedPage: currentPage } : current,
        ),
      );
  }, [fetchPage, pageSize, currentPage, isCached, hasError]);

  const clearError = () =>
    setCache((current) =>
      current.failedPage === null ? current : { ...current, failedPage: null },
    );

  const goToPage = (pageNumber: number) => {
    setPage(pageNumber);
    clearError();
  };

  const summary = interpolate(locale.table.summary, {
    start: total > 0 ? startIndex + 1 : 0,
    end: Math.min(startIndex + pageSize, total),
    total,
    itemLabel,
  });

  const renderRow = (
    key: number,
    renderCell: (column: TableColumn, columnIndex: number) => ReactNode,
  ) => (
    <Styled.Row key={key}>
      {columns.map((column, columnIndex) => {
        const align = column.align ?? 'center';
        return (
          <Styled.Cell key={column.key} $align={align}>
            <Styled.CellContent $align={align}>
              {renderCell(column, columnIndex)}
            </Styled.CellContent>
          </Styled.Cell>
        );
      })}
    </Styled.Row>
  );

  const renderBody = () => {
    if (isLoading) {
      return Array.from({ length: skeletonRowCount }, (_, rowIndex) =>
        renderRow(rowIndex, (_column, columnIndex) => (
          <Styled.Skeleton
            aria-hidden="true"
            $width={SKELETON_WIDTHS[(rowIndex + columnIndex) % SKELETON_WIDTHS.length]}
          />
        )),
      );
    }

    if (hasError || !pageRows || pageRows.length === 0) {
      return (
        <tr>
          <Styled.MessageCell colSpan={columns.length}>
            {hasError ? (
              <Styled.Message>
                {locale.table.error}
                <Button variant="secondary" size="sm" onClick={clearError}>
                  {locale.table.retry}
                </Button>
              </Styled.Message>
            ) : (
              locale.table.empty
            )}
          </Styled.MessageCell>
        </tr>
      );
    }

    return pageRows.map((row, rowIndex) =>
      renderRow(startIndex + rowIndex, (column) => row[column.key]),
    );
  };

  return (
    <Styled.Container>
      <Styled.Scroll>
        <Styled.Table aria-busy={isLoading}>
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
          <tbody>{renderBody()}</tbody>
        </Styled.Table>
      </Styled.Scroll>

      <Styled.Footer>
        <Styled.Summary aria-live="polite">
          {isTotalKnown ? summary : <Styled.Skeleton aria-hidden="true" $width="10rem" />}
        </Styled.Summary>
        <Styled.Pagination aria-label={locale.table.paginationLabel}>
          <Styled.PageButton
            type="button"
            aria-label={locale.table.previousPage}
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
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
              onClick={() => goToPage(pageNumber)}
            >
              {pageNumber}
            </Styled.PageButton>
          ))}
          <Styled.PageButton
            type="button"
            aria-label={locale.table.nextPage}
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            <span aria-hidden="true">›</span>
          </Styled.PageButton>
        </Styled.Pagination>
      </Styled.Footer>
    </Styled.Container>
  );
};
