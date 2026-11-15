import { fn } from 'storybook/test';
import type * as actual from '../dashboardService';

export const getRegistrations = fn<typeof actual.getRegistrations>().mockName('getRegistrations');

export const getActiveParticipants =
  fn<typeof actual.getActiveParticipants>().mockName('getActiveParticipants');
export const getDashboardKpis = fn<typeof actual.getDashboardKpis>().mockName('getDashboardKpis');
export const getAbsences = fn<typeof actual.getAbsences>().mockName('getAbsences');
