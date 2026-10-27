import {
  getParticipantById,
  getParticipantGroups,
  getParticipantPresence,
  updateParticipantStatus,
} from './participantService';
import { supabase } from './supabaseClient';

const invoke = jest.mocked(supabase.functions.invoke);

const respond = (data: unknown) => invoke.mockResolvedValue({ data, error: null });

describe('getParticipantById', () => {
  it('busca pelo id e converte os campos para camelCase', async () => {
    respond({
      id: 'p1',
      name: 'Joseane',
      phone: '51999999999',
      instagram: '@jo',
      email: 'jo@gmail.com',
      birth_date: '1990-10-24',
      job: 'Advogada',
      is_active: true,
      city: 'Porto Alegre',
      zone: null,
      entry_date: '2025-03-15',
      photo: 'https://cdn.exemplo.com/jo.jpg',
    });

    await expect(getParticipantById('p1')).resolves.toEqual({
      id: 'p1',
      name: 'Joseane',
      phone: '51999999999',
      instagram: '@jo',
      email: 'jo@gmail.com',
      birthDate: '1990-10-24',
      job: 'Advogada',
      active: true,
      city: 'Porto Alegre',
      zone: null,
      entryDate: '2025-03-15',
      photo: 'https://cdn.exemplo.com/jo.jpg',
    });
    expect(invoke).toHaveBeenCalledWith('get-participant?participant_id=p1', { method: 'GET' });
  });

  it('repassa o erro da function', async () => {
    const error = new Error('404');
    invoke.mockResolvedValue({ data: null, error } as never);

    await expect(getParticipantById('p1')).rejects.toBe(error);
  });
});

describe('getParticipantGroups', () => {
  it('pagina e converte os grupos', async () => {
    respond({
      items: [
        { id: 'g1', number: 3, city: 'Canoas', is_coordinator: true, entry_date: '2024-03-01' },
        { id: 'g2', number: 5, city: null, is_coordinator: false },
      ],
      total: 9,
    });

    await expect(getParticipantGroups('p1', 2, 5)).resolves.toEqual({
      groups: [
        { id: 'g1', number: 3, city: 'Canoas', isCoordinator: true, entryDate: '2024-03-01' },
        { id: 'g2', number: 5, city: null, isCoordinator: false, entryDate: null },
      ],
      total: 9,
    });
    expect(invoke).toHaveBeenCalledWith(
      'get-participant-groups?participant_id=p1&page=2&pageSize=5',
      { method: 'GET' },
    );
  });
});

describe('getParticipantPresence', () => {
  it('converte os encontros', async () => {
    respond({ items: [{ meeting_id: 'm1', date: '2026-09-10', present: false }] });

    await expect(getParticipantPresence('p1')).resolves.toEqual([
      { meetingId: 'm1', date: '2026-09-10', present: false },
    ]);
    expect(invoke).toHaveBeenCalledWith('get-participant-presence?participant_id=p1', {
      method: 'GET',
    });
  });
});

describe('updateParticipantStatus', () => {
  it('envia o novo status e devolve o que o backend gravou', async () => {
    respond({ is_active: false });

    await expect(updateParticipantStatus('p1', false)).resolves.toBe(false);
    expect(invoke).toHaveBeenCalledWith('update-participant-status', {
      body: { participant_id: 'p1', is_active: false },
    });
  });

  it('falha quando a resposta vem vazia', async () => {
    respond(null);

    await expect(updateParticipantStatus('p1', true)).rejects.toThrow('returned no data');
  });

  it('repassa o erro da function', async () => {
    const error = new Error('403');
    invoke.mockResolvedValue({ data: null, error } as never);

    await expect(updateParticipantStatus('p1', true)).rejects.toBe(error);
  });
});
