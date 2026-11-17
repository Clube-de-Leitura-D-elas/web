export type CityStatusFilter = 'all' | 'active' | 'inactive';

export type CityFilters = {
  search: string;
  uf: string;
  status: CityStatusFilter;
};

export type CityZone = {
  id: string;
  name: string;
  isActive: boolean;
  activeGroups: number;
};

export type CityListItem = {
  id: string;
  name: string;
  uf: string;
  isActive: boolean;
  groups: number;
  activeGroups: number;
  zones: CityZone[];
};

export type CitiesSummary = {
  activeCities: number;
  activeZones: number;
};

export type CityGridResponse = {
  items: CityListItem[];
  total: number;
  ufs: string[];
  summary: CitiesSummary;
};

export type CityZoneInput = {
  id: string | null;
  name: string;
  isActive: boolean;
};

export type SaveCityInput = {
  cityId: string | null;
  name: string;
  uf: string;
  zones: CityZoneInput[];
};
