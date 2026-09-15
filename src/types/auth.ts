export type AppRole = 'READER' | 'MANAGER' | 'FOUNDER';

export const APP_ROLES: ReadonlySet<AppRole> = new Set<AppRole>(['READER', 'MANAGER', 'FOUNDER']);

export const ADMIN_ROLES: ReadonlySet<AppRole> = new Set<AppRole>(['MANAGER', 'FOUNDER']);
