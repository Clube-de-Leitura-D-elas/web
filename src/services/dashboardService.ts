import type { Granularity, RegistrationsItem, RegistrationsResponse } from '../types/dashboard';
import { invokeGet } from './invokeGet';

// Os períodos sem inscrição já vêm com total 0: o front não preenche lacunas.
export async function getRegistrations(
  granularity: Granularity,
  from: string,
  to: string,
): Promise<RegistrationsItem[]> {
  const data = await invokeGet<RegistrationsResponse>('get-dashboard-registrations-web', {
    granularity,
    from,
    to,
  });

  return data.items;
}
