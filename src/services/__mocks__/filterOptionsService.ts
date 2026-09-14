import { fn } from 'storybook/test';
import type * as actual from '../filterOptionsService';

export const getParticipantFilterOptions = fn<typeof actual.getParticipantFilterOptions>().mockName(
  'getParticipantFilterOptions',
);
