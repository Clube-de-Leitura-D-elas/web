export type CityErrorCode =
  | 'duplicate_city'
  | 'duplicate_zone'
  | 'zone_has_active_groups'
  | 'city_has_active_groups'
  | 'unknown';

const KNOWN_CODES: readonly CityErrorCode[] = [
  'duplicate_city',
  'duplicate_zone',
  'zone_has_active_groups',
  'city_has_active_groups',
];

export const toCityErrorCode = (value: unknown): CityErrorCode =>
  KNOWN_CODES.find((code) => code === value) ?? 'unknown';

export class CityServiceError extends Error {
  readonly code: CityErrorCode;
  readonly zone: string | null;
  readonly activeGroups: number | null;

  constructor(
    code: CityErrorCode,
    details: { zone?: string | null; activeGroups?: number | null } = {},
    cause?: unknown,
  ) {
    super(`cities/${code}`, { cause });
    this.name = 'CityServiceError';
    this.code = code;
    this.zone = details.zone ?? null;
    this.activeGroups = details.activeGroups ?? null;
  }
}
