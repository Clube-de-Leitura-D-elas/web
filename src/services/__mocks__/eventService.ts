import { fn } from 'storybook/test';
import type * as actual from '../eventService';

export const getEventDetails = fn<typeof actual.getEventDetails>().mockName('getEventDetails');
