import { fn } from 'storybook/test';
import type * as actual from '../groupService';

export const getGroupDetails = fn<typeof actual.getGroupDetails>().mockName('getGroupDetails');

export const getGroupParticipantsPage = fn<typeof actual.getGroupParticipantsPage>().mockName(
  'getGroupParticipantsPage',
);

export const getGroupMeetingsPage =
  fn<typeof actual.getGroupMeetingsPage>().mockName('getGroupMeetingsPage');

export const updateGroupStatus =
  fn<typeof actual.updateGroupStatus>().mockName('updateGroupStatus');

export const createGroup = fn<typeof actual.createGroup>().mockName('createGroup');

export const getGroupCities = fn<typeof actual.getGroupCities>().mockName('getGroupCities');

export const getGroupZones = fn<typeof actual.getGroupZones>().mockName('getGroupZones');

export const updateGroupLocation =
  fn<typeof actual.updateGroupLocation>().mockName('updateGroupLocation');

export const updateGroupParticipant =
  fn<typeof actual.updateGroupParticipant>().mockName('updateGroupParticipant');
