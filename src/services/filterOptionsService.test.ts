import { locale } from '../locales';
import { getParticipantFilterOptions } from './filterOptionsService';
import { supabase } from './supabaseClient';

const invoke = jest.mocked(supabase.functions.invoke);

describe('getParticipantFilterOptions', () => {
  it('monta as opções dos dropdowns com a opção "todas" no topo', async () => {
    invoke.mockResolvedValue({
      data: {
        cities: [{ id: 'c1', name: 'Canoas' }],
        groups: [{ id: 'g1', number: 3, description: 'Centro' }],
        summary: { groups: 4, cities: 2 },
      },
      error: null,
    });

    await expect(getParticipantFilterOptions()).resolves.toEqual({
      cityOptions: [
        { value: '', label: locale.participants.filters.cityAll },
        { value: 'c1', label: 'Canoas' },
      ],
      groupOptions: [
        { value: '', label: locale.participants.filters.groupAll },
        { value: 'g1', label: 'Grupo 3 - Centro' },
      ],
      summary: { groups: 4, cities: 2 },
    });
    expect(invoke).toHaveBeenCalledWith('get-participant-filters', { method: 'GET' });
  });

  it('repassa o erro da function', async () => {
    const error = new Error('500');
    invoke.mockResolvedValue({ data: null, error } as never);

    await expect(getParticipantFilterOptions()).rejects.toBe(error);
  });

  it('falha quando a resposta vem vazia', async () => {
    invoke.mockResolvedValue({ data: null, error: null });

    await expect(getParticipantFilterOptions()).rejects.toThrow('returned no data');
  });
});
