import { fn } from 'storybook/test';
import type * as actual from '../participantService';

export const getParticipantById =
  fn<typeof actual.getParticipantById>().mockName('getParticipantById');

export const getParticipantGroups =
  fn<typeof actual.getParticipantGroups>().mockName('getParticipantGroups');

export const getParticipantPresence =
  fn<typeof actual.getParticipantPresence>().mockName('getParticipantPresence');

export const updateParticipantStatus =
  fn<typeof actual.updateParticipantStatus>().mockName('updateParticipantStatus');

export const getCities = fn<typeof actual.getCities>().mockName('getCities');

export const getZones = fn<typeof actual.getZones>().mockName('getZones');

export const updateParticipant =
  fn<typeof actual.updateParticipant>().mockName('updateParticipant');
