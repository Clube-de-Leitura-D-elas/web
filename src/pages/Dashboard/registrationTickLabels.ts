import type { Granularity } from '../../types/dashboard';

export const formatRegistrationTick = (label: string, granularity: Granularity): string => {
  if (granularity === 'month') {
    return label.replace(/\/\d{2}(\d{2})$/, '/$1');
  }

  return label.replace(/^.*?(\d{2}\/\d{2})$/, '$1');
};
