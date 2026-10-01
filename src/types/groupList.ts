export type GroupOrder = 'name_asc' | 'name_desc';

export type GroupFilters = {
  search: string;
  cityId: string;
  order: GroupOrder;
};

export type GroupCity = {
  id: string;
  name: string;
};

export type GroupListItem = {
  id: string;
  number: number;
  description: string;
  createdAt: string;
  city: GroupCity | null;
  coordinator: string | null;
  members: number;
  nextMeetingAt: string | null;
  status: string;
};

export type GroupsSummary = {
  activeGroups: number;
  cities: number;
};

// Resposta da Edge Function `get-groups-web`
export type GroupGridResponse = {
  items: GroupListItem[];
  // total considerando os filtros atuais (usado na paginação)
  total: number;
  // valores globais (usados no subtítulo da página)
  summary: GroupsSummary;
  // lista de cidades (usada no dropdown de filtro)
  cities: GroupCity[];
};
