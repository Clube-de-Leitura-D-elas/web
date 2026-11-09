import { FunctionsHttpError } from '@supabase/functions-js';
import { readFunctionErrorMessage } from './functionError';

const httpError = (body: () => Promise<unknown>) =>
  new FunctionsHttpError({ status: 400, json: body });

describe('readFunctionErrorMessage', () => {
  it('devolve a mensagem do corpo da resposta', async () => {
    const error = httpError(() => Promise.resolve({ error: 'unable to load group' }));

    await expect(readFunctionErrorMessage(error)).resolves.toBe('unable to load group');
  });

  it('devolve null quando o corpo não tem mensagem', async () => {
    await expect(
      readFunctionErrorMessage(httpError(() => Promise.resolve({}))),
    ).resolves.toBeNull();
  });

  it('devolve null quando o corpo não é JSON', async () => {
    const error = httpError(() => Promise.reject(new Error('not json')));

    await expect(readFunctionErrorMessage(error)).resolves.toBeNull();
  });

  it('devolve null para erros que não vêm da function', async () => {
    await expect(readFunctionErrorMessage(new Error('rede'))).resolves.toBeNull();
  });
});
