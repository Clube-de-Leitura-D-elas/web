/**
 * EXEMPLO: service de livros.
 *
 * O service é a ÚNICA camada que conversa com o Supabase. As páginas nunca importam o
 * `supabase` direto: elas chamam as funções daqui.
 *
 * Regras de todo service:
 * - Cada função faz uma operação (buscar, criar, editar, apagar) e não usa nada do React.
 * - Se o Supabase devolver `error`, a função lança o erro com `throw`. Quem chamou decide
 *   o que mostrar na tela (com `.catch` ou `try/catch`).
 * - A função devolve os dados já no tipo certo (`Book`, `Book[]`...).
 */
import type { Book, NewBook } from '../types/example_book';
import { supabase } from './supabaseClient';

export async function getBooks(): Promise<Book[]> {
  const { data, error } = await supabase.from('books').select('id, title, author').order('title');

  if (error) throw error;
  return data;
}

export async function createBook(book: NewBook): Promise<Book> {
  const { data, error } = await supabase
    .from('books')
    .insert(book)
    .select('id, title, author')
    .single();

  if (error) throw error;
  return data;
}
