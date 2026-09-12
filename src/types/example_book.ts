/**
 * EXEMPLO: tipos do livro.
 *
 * Descreve o formato de uma linha da tabela `books` do Supabase. O service e a página usam
 * estes tipos, então se a tabela ganhar uma coluna nova, é só adicionar aqui.
 *
 * `NewBook` é o livro antes de ser salvo: sem `id`, porque quem gera o `id` é o banco.
 */
export type Book = {
  id: number;
  title: string;
  author: string;
};

export type NewBook = Omit<Book, 'id'>;
