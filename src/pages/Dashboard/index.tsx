import { useLocale } from '../../hooks/useLocale';
import { NewRegistrationsChart } from './NewRegistrationsChart';
import * as Styled from './styles';

export const Dashboard = () => {
  const { dashboard: text } = useLocale();

  return (
    <Styled.Container>
      <Styled.Header>
        <Styled.Title>{text.title}</Styled.Title>
        <Styled.Subtitle>{text.subtitle}</Styled.Subtitle>
      </Styled.Header>

      <Styled.KpiGrid aria-label={text.kpis.label} />

      <Styled.ChartsGrid aria-label={text.charts.label}>
        <NewRegistrationsChart />
      </Styled.ChartsGrid>
    </Styled.Container>
  );
};
