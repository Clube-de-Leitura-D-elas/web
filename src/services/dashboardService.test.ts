import { getAbsences, getActiveParticipants, getRegistrations } from './dashboardService';
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

describe('getActiveParticipants', () => {
  it('chama a function com o período e devolve os itens', async () => {
    const items = [
      { period: '2026-10-01', total: 980 },
      { period: '2026-11-01', total: 984 },
    ];
    invoke.mockResolvedValue({ data: { items }, error: null });

    await expect(getActiveParticipants('2021-12-01', '2026-11-11')).resolves.toEqual(items);

    const [name, options] = invoke.mock.calls[0];
    expect(name).toBe('get-dashboard-active-participants-web?from=2021-12-01&to=2026-11-11');
    expect(options).toEqual({ method: 'GET' });
  });

  it('repassa o erro da function', async () => {
    const error = new Error('403');
    invoke.mockResolvedValue({ data: null, error } as never);

    await expect(getActiveParticipants('2021-12-01', '2026-11-11')).rejects.toBe(error);
  });
});

describe('getAbsences', () => {
  it('chama a function sem parâmetros e devolve os itens', async () => {
    const items = [
      {
        participantId: 'p1',
        name: 'Rayane Moura',
        group: { id: 'g6', number: 6, description: 'Recife' },
        lastPresenceAt: null,
      },
    ];
    invoke.mockResolvedValue({ data: { items }, error: null });

    await expect(getAbsences()).resolves.toEqual(items);

    const [name, options] = invoke.mock.calls[0];
    expect(name).toBe('get-dashboard-absences-web?');
    expect(options).toEqual({ method: 'GET' });
  });

  it('repassa o erro da function', async () => {
    const error = new Error('403');
    invoke.mockResolvedValue({ data: null, error } as never);

    await expect(getAbsences()).rejects.toBe(error);
  });
});
