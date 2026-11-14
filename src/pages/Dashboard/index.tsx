import { useLocale } from '../../hooks/useLocale';
import { NewRegistrationsChart } from './NewRegistrationsChart';
import { GroupsKpi } from './GroupsKpi';
import * as Styled from './styles';
import { MeetingsKpi } from './MeetingsKpi';

export const Dashboard = () => {
  const { dashboard: text } = useLocale();

  return (
    <Styled.Container>
      <Styled.Header>
        <Styled.Title>{text.title}</Styled.Title>
        <Styled.Subtitle>{text.subtitle}</Styled.Subtitle>
      </Styled.Header>

      <Styled.KpiGrid aria-label={text.kpis.label}>
        <GroupsKpi />
        <MeetingsKpi />
      </Styled.KpiGrid>

      <Styled.ChartsGrid aria-label={text.charts.label}>
        <NewRegistrationsChart />
      </Styled.ChartsGrid>
    </Styled.Container>
  );
};
