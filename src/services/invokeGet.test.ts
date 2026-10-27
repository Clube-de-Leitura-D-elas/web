import { invokeGet } from './invokeGet';
import { supabase } from './supabaseClient';

const invoke = jest.mocked(supabase.functions.invoke);

describe('invokeGet', () => {
  it('chama a function com GET e os parâmetros na query string', async () => {
    invoke.mockResolvedValue({ data: { ok: true }, error: null });

    await expect(invokeGet('get-things', { page: 2, search: 'ana' })).resolves.toEqual({
      ok: true,
    });
    expect(invoke).toHaveBeenCalledWith('get-things?page=2&search=ana', { method: 'GET' });
  });

  it('não envia parâmetros vazios', async () => {
    invoke.mockResolvedValue({ data: {}, error: null });

    await invokeGet('get-things', { page: 1, search: '', cityId: '' });

    expect(invoke).toHaveBeenCalledWith('get-things?page=1', { method: 'GET' });
  });

  it('envia o número zero', async () => {
    invoke.mockResolvedValue({ data: {}, error: null });

    await invokeGet('get-things', { offset: 0 });

    expect(invoke).toHaveBeenCalledWith('get-things?offset=0', { method: 'GET' });
  });

  it('repassa o erro da function', async () => {
    const error = new Error('500');
    invoke.mockResolvedValue({ data: null, error } as never);

    await expect(invokeGet('get-things', {})).rejects.toBe(error);
  });
});
