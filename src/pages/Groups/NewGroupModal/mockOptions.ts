import type { DropdownItemList } from '../../../components/Dropdown';

// Mock enquanto não há API: trocar por dados do backend via services/ quando a criação de grupo for integrada.
export const MOCK_CITY_OPTIONS: DropdownItemList[] = [
  { value: 'porto-alegre', label: 'Porto Alegre' },
  { value: 'porto-alegre-zona-sul', label: 'Porto Alegre — Zona Sul' },
  { value: 'sao-paulo-zona-oeste', label: 'São Paulo — Zona Oeste' },
  { value: 'belo-horizonte', label: 'Belo Horizonte' },
  { value: 'recife', label: 'Recife' },
];

export const MOCK_COORDINATOR_OPTIONS: DropdownItemList[] = [
  { value: 'joana-alves', label: 'Joana Alves' },
  { value: 'simone-ferreira', label: 'Simone Ferreira' },
  { value: 'vera-barbosa', label: 'Vera Barbosa' },
  { value: 'rita-cardoso', label: 'Rita Cardoso' },
  { value: 'carolina-weber', label: 'Carolina Weber' },
];
