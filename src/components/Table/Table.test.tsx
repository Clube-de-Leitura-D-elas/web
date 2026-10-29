import { screen, waitFor, within } from '@testing-library/react';
import { interpolate, locale } from '../../locales';
import { pending, renderWithProviders } from '../../test/render';
import { Table, type TableFetchPage, type TableRow } from '.';

const columns = [
  { key: 'name', label: 'Nome' },
  { key: 'city', label: 'Cidade' },
];

const makeRows = (count: number): TableRow[] =>
  Array.from({ length: count }, (_, index) => ({ name: `Pessoa ${index + 1}`, city: 'Canoas' }));

const summary = (start: number, end: number, total: number, itemLabel = 'registros') =>
  interpolate(locale.table.summary, { start, end, total, itemLabel });

const bodyRows = () => within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row');

const pageButton = (page: number) =>
  screen.getByRole('button', { name: interpolate(locale.table.goToPage, { page }) });

/** fetchPage em memória, com uma página por chamada. */
const remoteSource = (rows: TableRow[]): jest.MockedFunction<TableFetchPage> =>
  jest.fn(async ({ page, pageSize }) => ({
    rows: rows.slice((page - 1) * pageSize, page * pageSize),
    total: rows.length,
  }));

describe('Table com linhas locais', () => {
  it('renderiza cabeçalho e a primeira página', () => {
    renderWithProviders(<Table columns={columns} rows={makeRows(5)} pageSize={2} />);

    expect(screen.getByRole('columnheader', { name: 'Nome' })).toBeInTheDocument();
    expect(bodyRows()).toHaveLength(2);
    expect(screen.getByText('Pessoa 1')).toBeInTheDocument();
    expect(screen.getByText(summary(1, 2, 5))).toBeInTheDocument();
  });

  it('pagina pelos botões', async () => {
    const { user } = renderWithProviders(
      <Table columns={columns} rows={makeRows(5)} pageSize={2} itemLabel="pessoas" />,
    );

    await user.click(screen.getByRole('button', { name: locale.table.nextPage }));
    expect(screen.getByText('Pessoa 3')).toBeInTheDocument();
    expect(pageButton(2)).toHaveAttribute('aria-current', 'page');

    await user.click(pageButton(3));
    expect(bodyRows()).toHaveLength(1);
    expect(screen.getByText(summary(5, 5, 5, 'pessoas'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: locale.table.nextPage })).toBeDisabled();
  });

  it('desabilita "anterior" na primeira página', () => {
    renderWithProviders(<Table columns={columns} rows={makeRows(5)} pageSize={2} />);

    expect(screen.getByRole('button', { name: locale.table.previousPage })).toBeDisabled();
  });

  it('mostra no máximo três botões de página', () => {
    renderWithProviders(<Table columns={columns} rows={makeRows(20)} pageSize={2} />);

    const pagination = screen.getByRole('navigation', { name: locale.table.paginationLabel });
    // anterior + 3 páginas + próxima
    expect(within(pagination).getAllByRole('button')).toHaveLength(5);
  });

  it('avisa quando não há registros', () => {
    renderWithProviders(<Table columns={columns} rows={[]} />);

    expect(screen.getByText(locale.table.empty)).toBeInTheDocument();
    expect(screen.getByText(summary(0, 0, 0))).toBeInTheDocument();
  });
});

describe('Table com fetchPage', () => {
  it('mostra o esqueleto enquanto carrega', () => {
    renderWithProviders(<Table columns={columns} fetchPage={() => pending()} />);

    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
  });

  it('busca a primeira página e mostra as linhas', async () => {
    const fetchPage = remoteSource(makeRows(8));
    renderWithProviders(<Table columns={columns} fetchPage={fetchPage} pageSize={3} />);

    expect(await screen.findByText('Pessoa 1')).toBeInTheDocument();
    expect(fetchPage).toHaveBeenCalledWith({ page: 1, pageSize: 3 });
    expect(screen.getByText(summary(1, 3, 8))).toBeInTheDocument();
    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'false');
  });

  it('guarda as páginas já buscadas', async () => {
    const fetchPage = remoteSource(makeRows(8));
    const { user } = renderWithProviders(
      <Table columns={columns} fetchPage={fetchPage} pageSize={3} />,
    );
    await screen.findByText('Pessoa 1');

    await user.click(pageButton(2));
    expect(await screen.findByText('Pessoa 4')).toBeInTheDocument();

    await user.click(pageButton(1));
    expect(screen.getByText('Pessoa 1')).toBeInTheDocument();
    expect(fetchPage).toHaveBeenCalledTimes(2);
  });

  it('mostra o erro e tenta de novo', async () => {
    const fetchPage = jest
      .fn<ReturnType<TableFetchPage>, Parameters<TableFetchPage>>()
      .mockRejectedValueOnce(new Error('falhou'))
      .mockResolvedValue({ rows: makeRows(1), total: 1 });
    const { user } = renderWithProviders(<Table columns={columns} fetchPage={fetchPage} />);

    expect(await screen.findByText(locale.table.error)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: locale.table.retry }));

    expect(await screen.findByText('Pessoa 1')).toBeInTheDocument();
    expect(fetchPage).toHaveBeenCalledTimes(2);
  });

  it('volta para a página 1 e busca de novo quando o fetchPage muda (ex.: filtro)', async () => {
    const first = remoteSource(makeRows(8));
    const { user, rerender } = renderWithProviders(
      <Table columns={columns} fetchPage={first} pageSize={3} />,
    );
    await screen.findByText('Pessoa 1');
    await user.click(pageButton(2));
    await screen.findByText('Pessoa 4');

    const second = remoteSource([{ name: 'Filtrada', city: 'Recife' }]);
    rerender(<Table columns={columns} fetchPage={second} pageSize={3} />);

    expect(await screen.findByText('Filtrada')).toBeInTheDocument();
    expect(second).toHaveBeenCalledWith({ page: 1, pageSize: 3 });
  });

  it('ignora a resposta de um fetchPage antigo', async () => {
    let resolveOld: (value: { rows: TableRow[]; total: number }) => void = () => {};
    const old = jest.fn<ReturnType<TableFetchPage>, Parameters<TableFetchPage>>(
      () => new Promise((resolve) => (resolveOld = resolve)),
    );
    const { rerender } = renderWithProviders(<Table columns={columns} fetchPage={old} />);

    const current = remoteSource([{ name: 'Atual', city: 'Recife' }]);
    rerender(<Table columns={columns} fetchPage={current} />);
    await screen.findByText('Atual');

    resolveOld({ rows: [{ name: 'Antiga', city: 'Canoas' }], total: 1 });

    await waitFor(() => expect(screen.queryByText('Antiga')).not.toBeInTheDocument());
    expect(screen.getByText('Atual')).toBeInTheDocument();
  });
});

describe('Table com linhas clicáveis', () => {
  const linkedRows: TableRow[] = [
    { name: 'Pessoa 1', city: 'Canoas', rowHref: '/participantes/p1' },
    { name: 'Pessoa 2', city: 'Canoas' },
  ];

  it('a linha com rowHref vira um único link para o destino', () => {
    renderWithProviders(<Table columns={columns} rows={linkedRows} />);

    const [first, second] = bodyRows();
    const links = within(first).getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute('href', '/participantes/p1');
    expect(links[0]).toHaveTextContent('Pessoa 1');
    expect(within(second).queryByRole('link')).not.toBeInTheDocument();
  });

  it('navega ao clicar no link da linha', async () => {
    const { user } = renderWithProviders(<Table columns={columns} rows={linkedRows} />, {
      route: '/participantes',
      path: '/participantes',
    });

    await user.click(screen.getByRole('link', { name: 'Pessoa 1' }));

    expect(screen.getByTestId('location')).toHaveTextContent('/participantes/p1');
  });
});
