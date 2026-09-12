/**
 * EXEMPLO: versão falsa do service de livros, usada só no Storybook.
 *
 * O `.storybook/preview.tsx` chama `sb.mock(...)` para o `example_bookService.ts`. Com isso, no
 * Storybook, quem importa o service recebe ESTE arquivo no lugar do verdadeiro, e nenhuma
 * chamada chega ao Supabase.
 *
 * As funções começam vazias. Cada story define o que elas devolvem (ver
 * `src/pages/example_books/example_books.stories.tsx`).
 */
import { fn } from 'storybook/test';
import type * as actual from '../example_bookService';

export const getBooks = fn<typeof actual.getBooks>().mockName('getBooks');
export const createBook = fn<typeof actual.createBook>().mockName('createBook');
