import { screen, within } from '@testing-library/react';
import { locale } from '../../locales';
import { getAbsences } from '../../services/dashboardService';
import { pending, renderWithProviders } from '../../test/render';
import { AbsencesList } from './AbsencesList';
import { ABSENCES } from './storyData';

jest.mock('../../services/dashboardService', () => ({
  getAbsences: jest.fn(),
}));

const text = locale.dashboard.absences;

const card = () => screen.getByRole('region', { name: text.title });

beforeEach(() => {
  jest.mocked(getAbsences).mockResolvedValue(ABSENCES);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('AbsencesList', () => {
  it('mostra o título e o carregamento', () => {
    jest.mocked(getAbsences).mockReturnValue(pending());

    renderWithProviders(<AbsencesList />);

    expect(card()).toBeInTheDocument();
    expect(screen.getByText(locale.dataState.loading)).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('mostra a tabela com as colunas e o total de linhas ao lado do título', async () => {
    renderWithProviders(<AbsencesList />);

    const table = await screen.findByRole('table');
    expect(
      within(table).getByRole('columnheader', { name: text.columns.participant }),
    ).toBeVisible();
    expect(within(table).getByRole('columnheader', { name: text.columns.group })).toBeVisible();
    expect(
      within(table).getByRole('columnheader', { name: text.columns.lastPresence }),
    ).toBeVisible();
    expect(within(card()).getByText('8')).toBeInTheDocument();
  });

  it('mostra o nome, o grupo com número de dois dígitos e a data da última presença', async () => {
    renderWithProviders(<AbsencesList />);

    const row = (await screen.findByText('Ísis Nascimento Pires')).closest('tr') as HTMLElement;
    expect(row).toHaveTextContent('Grupo 03 - São Paulo');
    expect(row).toHaveTextContent('18/08/2026');
  });

  it('mostra "Nunca" quando a participante nunca esteve presente no grupo', async () => {
    renderWithProviders(<AbsencesList />);

    const row = (await screen.findByText('Rayane Moura')).closest('tr') as HTMLElement;
    expect(within(row).getByText(text.never)).toBeInTheDocument();
  });

  it('cada linha leva à página da participante', async () => {
    renderWithProviders(<AbsencesList />);

    expect(await screen.findByRole('link', { name: 'Rayane Moura' })).toHaveAttribute(
      'href',
      '/participantes/p1',
    );
  });

  it('pagina a lista: as linhas depois da sexta ficam na página seguinte', async () => {
    const { user } = renderWithProviders(<AbsencesList />);
    await screen.findByRole('table');

    expect(screen.queryByText('Luiza Hashimoto')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: locale.table.nextPage }));

    expect(screen.getByText('Luiza Hashimoto')).toBeInTheDocument();
  });

  it('mostra o estado vazio, sem tabela e sem contador, quando ninguém faltou', async () => {
    jest.mocked(getAbsences).mockResolvedValue([]);

    renderWithProviders(<AbsencesList />);

    expect(await screen.findByText(text.empty)).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(within(card()).queryByText('0')).not.toBeInTheDocument();
  });

  it('mostra o erro e refaz a busca em "Tentar novamente"', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.mocked(getAbsences).mockRejectedValueOnce(new Error('403'));

    const { user } = renderWithProviders(<AbsencesList />);

    expect(await screen.findByRole('alert')).toHaveTextContent(locale.dataState.error);

    await user.click(screen.getByRole('button', { name: locale.dataState.retry }));

    expect(await screen.findByRole('table')).toBeInTheDocument();
    expect(getAbsences).toHaveBeenCalledTimes(2);
  });
});
