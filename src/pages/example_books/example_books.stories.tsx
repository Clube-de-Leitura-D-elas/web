/**
 * EXEMPLO: stories da página de livros, simulando as respostas do Supabase.
 *
 * O service de verdade é trocado pelo mock de `src/services/__mocks__/example_bookService.ts`.
 * Em cada story, o `beforeEach` define o que o service "responde": uma lista, uma lista
 * vazia, um erro ou uma requisição que nunca termina (carregando).
 */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, mocked } from 'storybook/test';
import { locale } from '../../locales';
import { createBook, getBooks } from '../../services/example_bookService';
import type { Book } from '../../types/example_book';
import Books from '.';

/** Tempo de resposta simulado da requisição, em milissegundos. */
const REQUEST_DELAY = 600;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const books: Book[] = [
  { id: 1, title: 'A Hora da Estrela', author: 'Clarice Lispector' },
  { id: 2, title: 'Quarto de Despejo', author: 'Carolina Maria de Jesus' },
  { id: 3, title: 'Torto Arado', author: 'Itamar Vieira Junior' },
  { id: 4, title: 'Um Defeito de Cor', author: 'Ana Maria Gonçalves' },
];

const meta = {
  title: 'Exemplos/Página de livros',
  component: Books,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Página de exemplo do padrão página → service → Supabase. As requisições são simuladas: nenhuma chamada chega ao Supabase.',
      },
    },
  },
  // Resposta padrão de todas as stories. Cada story pode sobrescrever no próprio `beforeEach`.
  beforeEach: () => {
    mocked(getBooks).mockImplementation(async () => {
      await wait(REQUEST_DELAY);
      return books;
    });
    mocked(createBook).mockImplementation(async (book) => {
      await wait(REQUEST_DELAY);
      return { id: Date.now(), ...book };
    });
  },
} satisfies Meta<typeof Books>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A requisição responde com a lista de livros. */
export const WithBooks: Story = {};

/** A requisição ainda não respondeu: mostra a mensagem de carregando. */
export const Loading: Story = {
  beforeEach: () => {
    mocked(getBooks).mockImplementation(() => new Promise(() => {}));
  },
};

/** A requisição responde com uma lista vazia. */
export const Empty: Story = {
  beforeEach: () => {
    mocked(getBooks).mockResolvedValue([]);
  },
};

/** A requisição falha (ex.: sem internet ou erro no Supabase). */
export const LoadError: Story = {
  beforeEach: () => {
    mocked(getBooks).mockRejectedValue(new Error('Falha na requisição'));
  },
};

/** Preenche o formulário e salva: o livro novo aparece na tabela. */
export const AddBook: Story = {
  play: async ({ canvas, userEvent }) => {
    await canvas.findByText('Torto Arado');

    await userEvent.type(canvas.getByLabelText(locale.example_books.columns.title), 'Úrsula');
    await userEvent.type(
      canvas.getByLabelText(locale.example_books.columns.author),
      'Maria Firmina dos Reis',
    );
    await userEvent.click(canvas.getByRole('button', { name: locale.example_books.submit }));

    await expect(await canvas.findByText('Úrsula')).toBeInTheDocument();
    await expect(createBook).toHaveBeenCalledWith({
      title: 'Úrsula',
      author: 'Maria Firmina dos Reis',
    });
  },
};

/** O salvamento falha: mostra a mensagem de erro e o livro não entra na tabela. */
export const SaveError: Story = {
  beforeEach: () => {
    mocked(createBook).mockRejectedValue(new Error('Falha ao salvar'));
  },
  play: async ({ canvas, userEvent }) => {
    await canvas.findByText('Torto Arado');

    await userEvent.type(canvas.getByLabelText(locale.example_books.columns.title), 'Úrsula');
    await userEvent.type(
      canvas.getByLabelText(locale.example_books.columns.author),
      'Maria Firmina dos Reis',
    );
    await userEvent.click(canvas.getByRole('button', { name: locale.example_books.submit }));

    await expect(await canvas.findByText(locale.example_books.saveError)).toBeInTheDocument();
  },
};
