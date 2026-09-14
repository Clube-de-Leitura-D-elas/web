import { fn } from 'storybook/test';
import type * as actual from '../participantListService';

export const getParticipantsPage =
  fn<typeof actual.getParticipantsPage>().mockName('getParticipantsPage');

export const getPendingParticipantsPage = fn<typeof actual.getPendingParticipantsPage>().mockName(
  'getPendingParticipantsPage',
);

export const approvePendingParticipant = fn<typeof actual.approvePendingParticipant>().mockName(
  'approvePendingParticipant',
);

export const rejectPendingParticipant = fn<typeof actual.rejectPendingParticipant>().mockName(
  'rejectPendingParticipant',
);
