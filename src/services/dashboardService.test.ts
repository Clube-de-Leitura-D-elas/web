import { getRegistrations } from './dashboardService';
import { supabase } from './supabaseClient';

const invoke = jest.mocked(supabase.functions.invoke);

describe('getRegistrations', () => {
  it('chama a function com a granularidade e o período e devolve os itens', async () => {
    const items = [
      { period: '2026-10-01', total: 4 },
      { period: '2026-11-01', total: 0 },
    ];
    invoke.mockResolvedValue({ data: { items }, error: null });

    await expect(getRegistrations('month', '2026-10-01', '2026-11-08')).resolves.toEqual(items);

    const [name, options] = invoke.mock.calls[0];
    expect(name).toBe(
      'get-dashboard-registrations-web?granularity=month&from=2026-10-01&to=2026-11-08',
    );
    expect(options).toEqual({ method: 'GET' });
  });

  it('repassa o erro da function', async () => {
    const error = new Error('403');
    invoke.mockResolvedValue({ data: null, error } as never);

    await expect(getRegistrations('week', '2026-08-17', '2026-11-08')).rejects.toBe(error);
  });
});
