import { fn } from 'storybook/test';
import type * as actual from '../groupListService';

export const getGroupGrid = fn<typeof actual.getGroupGrid>().mockName('getGroupGrid');
