/**
 * EXEMPLO: página de livros (rota `/livros`).
 *
 * Mostra o padrão de duas camadas do projeto: página -> service -> Supabase.
 *
 * - Buscar dados ao abrir a tela: a página chama o service dentro de um `useEffect`.
 * - Ações do usuário (salvar, editar, apagar): a página chama o service direto no handler
 *   do evento, sem `useEffect`.
 * - A página guarda no estado os dados, o carregamento (`loading`) e o erro (`error`).
 *
 */
import { useEffect, useState, type SubmitEvent } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Table, type TableColumn } from '../../components/Table';
import { locale } from '../../locales';
import { createBook, getBooks } from '../../services/example_bookService';
import type { Book } from '../../types/example_book';
import * as Styled from './styles';

const columns: TableColumn[] = [
  { key: 'title', label: locale.example_books.columns.title, align: 'left' },
  { key: 'author', label: locale.example_books.columns.author, align: 'left' },
];

function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [saving, setSaving] = useState(false);

  // Busca os livros ao abrir a página.
  useEffect(() => {
    // Evita atualizar o estado se a página fechar antes da resposta chegar.
    let ignore = false;

    getBooks()
      .then((data) => {
        if (!ignore) setBooks(data);
      })
      .catch(() => {
        if (!ignore) setError(locale.example_books.loadError);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Ações do usuário chamam o service direto no handler, sem useEffect.
  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const book = await createBook({ title, author });
      setBooks((current) => [...current, book]);
      setTitle('');
      setAuthor('');
    } catch {
      setError(locale.example_books.saveError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Styled.Container>
      <Styled.Title>{locale.example_books.title}</Styled.Title>

      <Styled.Form onSubmit={handleSubmit}>
        <Input
          id="book-title"
          label={locale.example_books.columns.title}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
        <Input
          id="book-author"
          label={locale.example_books.columns.author}
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          required
        />
        <Button type="submit" disabled={saving}>
          {locale.example_books.submit}
        </Button>
      </Styled.Form>

      {error && <Styled.Message $error>{error}</Styled.Message>}

      {loading ? (
        <Styled.Message>{locale.example_books.loading}</Styled.Message>
      ) : (
        <Table
          columns={columns}
          rows={books.map((book) => ({ title: book.title, author: book.author }))}
          itemLabel={locale.example_books.itemLabel}
        />
      )}
    </Styled.Container>
  );
}

export default Books;
