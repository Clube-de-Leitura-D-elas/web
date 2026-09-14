import { interpolate, locale } from '../locales';
import type {
  ParticipantFilterOptions,
  ParticipantFiltersResponse,
} from '../types/participantList';
import { supabase } from './supabaseClient';

export async function getParticipantFilterOptions(): Promise<ParticipantFilterOptions> {
  const { data, error } = await supabase.functions.invoke<ParticipantFiltersResponse>(
    'get-participant-filters',
    { method: 'GET' },
  );
  if (error) throw error;
  if (!data) throw new Error('get-participant-filters returned no data');

  return {
    cityOptions: [
      { value: '', label: locale.participants.filters.cityAll },
      ...data.cities.map((city) => ({ value: city.id, label: city.name })),
    ],
    groupOptions: [
      { value: '', label: locale.participants.filters.groupAll },
      ...data.groups.map((group) => ({
        value: group.id,
        label: interpolate(locale.participants.filters.groupOption, {
          number: group.number,
          description: group.description,
        }),
      })),
    ],
    summary: data.summary,
  };
}
