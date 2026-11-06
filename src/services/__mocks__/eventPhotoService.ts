import { fn } from 'storybook/test';
import type * as actual from '../eventPhotoService';

export const fetchPhotoBlob = fn<typeof actual.fetchPhotoBlob>().mockName('fetchPhotoBlob');
