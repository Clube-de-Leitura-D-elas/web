import { FunctionsHttpError } from '@supabase/functions-js';
import { GroupServiceError } from './groupErrors';
import {
  createGroup,
  type CreateGroupPayload,
  getGroupDetails,
  getGroupMeetingsPage,
  getGroupParticipantsPage,
  updateGroupParticipant,
  updateGroupStatus,
} from './groupService';
import { locale } from '../locales';
import { supabase } from './supabaseClient';
import { clearCalendarCache } from './calendarService';

jest.mock('./calendarService', () => ({
  clearCalendarCache: jest.fn(),
}));

const invoke = jest.mocked(supabase.functions.invoke);

const respond = (data: unknown) => invoke.mockResolvedValue({ data, error: null });
const fail = (error: unknown) => invoke.mockResolvedValue({ data: null, error } as never);

beforeEach(() => {
  jest.clearAllMocks();
});

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
  it('atualiza o status do grupo e limpa o cache do calendário', async () => {
    respond({ is_active: false });

    await expect(updateGroupStatus('g1', false)).resolves.toBe(false);

    expect(invoke).toHaveBeenCalledWith('update-group-status-web', {
      body: { group_id: 'g1', is_active: false },
    });

    expect(clearCalendarCache).toHaveBeenCalledTimes(1);
  });

  it('falha quando a resposta vem vazia', async () => {
    respond(null);

    await expect(updateGroupStatus('g1', true)).rejects.toThrow('returned no data');

    expect(clearCalendarCache).not.toHaveBeenCalled();
  });
});

describe('updateGroupParticipant', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it.each(['promote', 'demote', 'remove'] as const)('envia a ação %s no body', async (action) => {
    respond({ success: true });

    await expect(updateGroupParticipant('g1', 'p1', action)).resolves.toBeUndefined();
    expect(invoke).toHaveBeenCalledWith('update-group-participant-web', {
      body: { groupId: 'g1', participantId: 'p1', action },
    });
  });

  it('traduz o 409 para a mensagem de conflito', async () => {
    fail(new FunctionsHttpError({ status: 409 }));

    await expect(updateGroupParticipant('g1', 'p1', 'demote')).rejects.toThrow(
      locale.group_details.participantActions.conflictError,
    );
  });

  it('trata outros erros com a mensagem genérica', async () => {
    fail(new FunctionsHttpError({ status: 500 }));

    await expect(updateGroupParticipant('g1', 'p1', 'promote')).rejects.toThrow(
      locale.group_details.participantActions.error,
    );
  });
});

describe('createGroup', () => {
  const payload: CreateGroupPayload = { cityId: 'poa', coordinatorId: null };

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('cria o grupo e limpa o cache do calendário', async () => {
    const created = { id: 'g43', number: 43 };
    respond(created);

    await expect(createGroup(payload)).resolves.toBe(created);

    expect(invoke).toHaveBeenCalledWith('create-group', {
      body: payload,
    });

    expect(clearCalendarCache).toHaveBeenCalledTimes(1);
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

    expect(clearCalendarCache).not.toHaveBeenCalled();
  });
});
