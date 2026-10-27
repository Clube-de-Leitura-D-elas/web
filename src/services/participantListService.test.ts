import {
  approvePendingParticipant,
  getParticipantsPage,
  getPendingParticipantsPage,
  rejectPendingParticipant,
} from './participantListService';
import { supabase } from './supabaseClient';

const invoke = jest.mocked(supabase.functions.invoke);

beforeEach(() => {
  invoke.mockResolvedValue({ data: { items: [], total: 0 }, error: null });
});

describe('getParticipantsPage', () => {
  it('envia página, ordem e os filtros preenchidos', async () => {
    await getParticipantsPage(
      { page: 2, pageSize: 6 },
      { search: 'ana', cityId: 'c1', groupId: 'g1', order: 'name_desc' },
    );

    expect(invoke).toHaveBeenCalledWith(
      'get-participants?page=2&pageSize=6&order=name_desc&search=ana&cityId=c1&groupId=g1',
      { method: 'GET' },
    );
  });

  it('omite os filtros vazios', async () => {
    await getParticipantsPage(
      { page: 1, pageSize: 6 },
      { search: '', cityId: '', groupId: '', order: 'name_asc' },
    );

    expect(invoke).toHaveBeenCalledWith('get-participants?page=1&pageSize=6&order=name_asc', {
      method: 'GET',
    });
  });
});

describe('getPendingParticipantsPage', () => {
  it('envia só busca e ordem', async () => {
    await getPendingParticipantsPage({ page: 1, pageSize: 6 }, { search: 'bia', order: 'newest' });

    expect(invoke).toHaveBeenCalledWith(
      'get-pending-participants?page=1&pageSize=6&order=newest&search=bia',
      { method: 'GET' },
    );
  });
});

describe.each([
  ['approvePendingParticipant', approvePendingParticipant, 'accept-pending-user'],
  ['rejectPendingParticipant', rejectPendingParticipant, 'reject-pending-user'],
])('%s', (_name, action, functionName) => {
  it(`chama ${functionName} com o id da solicitação`, async () => {
    invoke.mockResolvedValue({ data: null, error: null });

    await expect(action('pending-1')).resolves.toBeUndefined();
    expect(invoke).toHaveBeenCalledWith(functionName, { body: { pending_user_id: 'pending-1' } });
  });

  it('repassa o erro da function', async () => {
    const error = new Error('409');
    invoke.mockResolvedValue({ data: null, error } as never);

    await expect(action('pending-1')).rejects.toBe(error);
  });
});
