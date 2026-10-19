import { getGroupFormOptions } from './groupFormService';
import { supabase } from './supabaseClient';

const invoke = jest.mocked(supabase.functions.invoke);

describe('getGroupFormOptions', () => {
  it('lista cada cidade seguida das suas zonas, com o nome da cidade na zona', async () => {
    invoke.mockResolvedValue({
      data: {
        cities: [
          { id: 'poa', name: 'Porto Alegre' },
          { id: 'sp', name: 'São Paulo' },
        ],
        zones: [
          { id: 'sp-oeste', name: 'Zona Oeste', cityId: 'sp' },
          { id: 'poa-sul', name: 'Zona Sul', cityId: 'poa' },
        ],
        coordinators: [{ id: 'u1', name: 'Joana Alves' }],
      },
      error: null,
    });

    const options = await getGroupFormOptions();

    expect(options.citiesAndZones).toEqual([
      { value: 'poa', label: 'Porto Alegre' },
      { value: 'poa-sul', label: 'Porto Alegre — Zona Sul' },
      { value: 'sp', label: 'São Paulo' },
      { value: 'sp-oeste', label: 'São Paulo — Zona Oeste' },
    ]);
    expect(options.coordinators).toEqual([{ value: 'u1', label: 'Joana Alves' }]);
    expect(invoke).toHaveBeenCalledWith('get-group-form-options');
  });

  it('deixa de fora zonas de cidades que não vieram na resposta', async () => {
    invoke.mockResolvedValue({
      data: {
        cities: [{ id: 'poa', name: 'Porto Alegre' }],
        zones: [{ id: 'orfa', name: 'Zona Norte', cityId: 'inexistente' }],
        coordinators: [],
      },
      error: null,
    });

    const options = await getGroupFormOptions();

    expect(options.citiesAndZones).toEqual([{ value: 'poa', label: 'Porto Alegre' }]);
  });

  it('repassa o erro da function', async () => {
    const error = new Error('500');
    invoke.mockResolvedValue({ data: null, error } as never);

    await expect(getGroupFormOptions()).rejects.toBe(error);
  });

  it('falha quando a resposta vem vazia', async () => {
    invoke.mockResolvedValue({ data: null, error: null });

    await expect(getGroupFormOptions()).rejects.toThrow('returned no data');
  });
});
