import { fn } from 'storybook/test';
import type * as actual from '../dashboardService';

export const getRegistrations = fn<typeof actual.getRegistrations>().mockName('getRegistrations');

export const getActiveParticipants =
  fn<typeof actual.getActiveParticipants>().mockName('getActiveParticipants');
