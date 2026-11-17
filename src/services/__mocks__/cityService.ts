import { fn } from 'storybook/test';
import type * as actual from '../cityService';

export const getCityGrid = fn<typeof actual.getCityGrid>().mockName('getCityGrid');
export const saveCity = fn<typeof actual.saveCity>().mockName('saveCity');
export const updateCityStatus = fn<typeof actual.updateCityStatus>().mockName('updateCityStatus');
