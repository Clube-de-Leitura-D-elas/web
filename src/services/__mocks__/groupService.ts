import { fn } from 'storybook/test';
import type * as actual from '../groupService';

export const getGroupDetails = fn<typeof actual.getGroupDetails>().mockName('getGroupDetails');

export const getGroupParticipantsPage = fn<typeof actual.getGroupParticipantsPage>().mockName(
  'getGroupParticipantsPage',
);

export const getGroupMeetingsPage =
  fn<typeof actual.getGroupMeetingsPage>().mockName('getGroupMeetingsPage');
