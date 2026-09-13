export type AppRole = 'READER' | 'MANAGER' | 'FOUNDER';

export const ADMIN_ROLES: ReadonlySet<AppRole> = new Set<AppRole>(['MANAGER', 'FOUNDER']);

export type UserProfile = {
  id?: string;
  user_id?: string;
  name?: string;
  email?: string;
  app_role?: AppRole;
};
