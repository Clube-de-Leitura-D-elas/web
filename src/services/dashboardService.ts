import type {
  AbsenceItem,
  AbsencesResponse,
  ActiveParticipantsItem,
  ActiveParticipantsResponse,
  DashboardKpisResponse,
  Granularity,
  RegistrationsItem,
  RegistrationsResponse,
} from '../types/dashboard';
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

// Um ponto por mês, já em ordem. O painel pede 60 meses e recorta o período no navegador.
export async function getActiveParticipants(
  from: string,
  to: string,
): Promise<ActiveParticipantsItem[]> {
  const data = await invokeGet<ActiveParticipantsResponse>(
    'get-dashboard-active-participants-web',
    { from, to },
  );

  return data.items;
}

export async function getDashboardKpis(): Promise<DashboardKpisResponse> {
  return invokeGet<DashboardKpisResponse>('get-dashboard-kpis-web', {});
}

// A lista vem inteira e já ordenada (sem presença há mais tempo primeiro): a tabela pagina no
// navegador.
export async function getAbsences(): Promise<AbsenceItem[]> {
  const data = await invokeGet<AbsencesResponse>('get-dashboard-absences-web', {});

  return data.items;
}
