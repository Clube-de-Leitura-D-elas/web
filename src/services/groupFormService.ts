import type { DropdownItemList } from '../components/Dropdown';
import { supabase } from './supabaseClient';

export type CityOrZoneOption = DropdownItemList;
export type CoordinatorOption = DropdownItemList;

type GroupFormOptionsResponse = {
  cities: { id: string; name: string }[];
  zones: { id: string; name: string; cityId: string }[];
  coordinators: { id: string; name: string }[];
};

export async function getGroupFormOptions(): Promise<{
  citiesAndZones: CityOrZoneOption[];
  coordinators: CoordinatorOption[];
}> {
  const { data, error } =
    await supabase.functions.invoke<GroupFormOptionsResponse>('get-group-form-options');

  if (error) throw error;
  if (!data) throw new Error('get-group-form-options returned no data');

  const { cities, zones, coordinators } = data;
  const cityNameById = new Map(cities.map((city) => [city.id, city.name]));

  const cityOptions: CityOrZoneOption[] = cities.map((city) => ({
    value: city.id,
    label: city.name,
  }));
  const zoneOptions: CityOrZoneOption[] = zones.map((zone) => ({
    value: zone.id,
    label: cityNameById.get(zone.cityId)
      ? `${cityNameById.get(zone.cityId)} — ${zone.name}`
      : zone.name,
  }));

  return {
    citiesAndZones: cityOptions.flatMap((city) => [
      city,
      ...zoneOptions.filter((zone) => {
        const selectedZone = zones.find((item) => item.id === zone.value);
        return selectedZone?.cityId === city.value;
      }),
    ]),
    coordinators: coordinators.map((user) => ({ value: user.id, label: user.name })),
  };
}
