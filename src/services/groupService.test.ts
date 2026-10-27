import { FunctionsHttpError } from '@supabase/functions-js';
import { GroupServiceError } from './groupErrors';
import {
  createGroup,
  getGroupDetails,
  getGroupMeetingsPage,
  getGroupParticipantsPage,
  updateGroupStatus,
} from './groupService';
import { supabase } from './supabaseClient';

const invoke = jest.mocked(supabase.functions.invoke);

const respond = (data: unknown) => invoke.mockResolvedValue({ data, error: null });
const fail = (error: unknown) => invoke.mockResolvedValue({ data: null, error } as never);

describe('consultas do grupo', () => {
  it('getGroupDetails busca pelo groupId', async () => {
    respond({ id: 'g1' });

    await expect(getGroupDetails('g1')).resolves.toEqual({ id: 'g1' });
    expect(invoke).toHaveBeenCalledWith('get-group-details-web?groupId=g1', { method: 'GET' });
  });

  it('getGroupParticipantsPage pagina pelo groupId', async () => {
    respond({ items: [], total: 0 });

    await getGroupParticipantsPage('g1', { page: 2, pageSize: 6 });

    expect(invoke).toHaveBeenCalledWith('get-group-participants-web?groupId=g1&page=2&pageSize=6', {
      method: 'GET',
    });
  });

  it('getGroupMeetingsPage pagina pelo groupId', async () => {
    respond({ items: [], total: 0 });

    await getGroupMeetingsPage('g1', { page: 1, pageSize: 6 });

    expect(invoke).toHaveBeenCalledWith('get-group-meetings-web?groupId=g1&page=1&pageSize=6', {
      method: 'GET',
    });
  });
});

describe('updateGroupStatus', () => {
  it('envia o novo status e devolve o que o backend gravou', async () => {
    respond({ is_active: false });

    await expect(updateGroupStatus('g1', false)).resolves.toBe(false);
    expect(invoke).toHaveBeenCalledWith('update-group-status', {
      body: { group_id: 'g1', is_active: false },
    });
  });

  it('falha quando a resposta vem vazia', async () => {
    respond(null);

    await expect(updateGroupStatus('g1', true)).rejects.toThrow('returned no data');
  });
});

describe('createGroup', () => {
  const payload = { name: 'Grupo 43', cityId: 'poa', coordinatorId: null };

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('envia o payload e devolve o grupo criado', async () => {
    const created = { id: 'g43', number: 43 };
    respond(created);

    await expect(createGroup(payload)).resolves.toBe(created);
    expect(invoke).toHaveBeenCalledWith('create-group', { body: payload });
  });

  it('traduz o 409 para duplicate_number', async () => {
    fail(new FunctionsHttpError({ status: 409 }));

    const error = await createGroup(payload).catch((e) => e);

    expect(error).toBeInstanceOf(GroupServiceError);
    expect(error.code).toBe('duplicate_number');
  });

  it('trata outros erros como unknown', async () => {
    fail(new FunctionsHttpError({ status: 500 }));

    const error = await createGroup(payload).catch((e) => e);

    expect(error).toBeInstanceOf(GroupServiceError);
    expect(error.code).toBe('unknown');
  });

  it('falha quando a resposta vem vazia', async () => {
    respond(null);

    await expect(createGroup(payload)).rejects.toThrow('returned no data');
  });
});
