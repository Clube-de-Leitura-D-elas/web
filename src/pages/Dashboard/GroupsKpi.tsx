import { useEffect, useState } from 'react';
import { DataState } from '../../components/DataState';
import { KpiCard } from '../../components/KpiCard';
import { useLocale } from '../../hooks/useLocale';
import { LuBookOpen } from 'react-icons/lu';
import { theme } from '../../theme/theme';
import * as Styled from './styles';
import { getDashboardKpis } from '../../services/dashboardService';

type GroupsKpiState =
  { status: 'loading' } | { status: 'error' } | { status: 'ready'; total: number };

export const GroupsKpi = () => {
  const { dashboard } = useLocale();
  const text = dashboard.kpis.groups;

  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<GroupsKpiState>({ status: 'loading' });

  useEffect(() => {
    let ignore = false;

    getDashboardKpis()
      .then((data) => {
        if (!ignore) {
          setState({ status: 'ready', total: data.groups.total });
        }
      })
      .catch((error) => {
        console.error(error);

        if (!ignore) {
          setState({ status: 'error' });
        }
      });

    return () => {
      ignore = true;
    };
  }, [attempt]);

  if (state.status !== 'ready') {
    return (
      <DataState
        variant={state.status}
        size="sm"
        onRetry={() => {
          setState({ status: 'loading' });
          setAttempt((current) => current + 1);
        }}
      />
    );
  }

  return (
    <KpiCard
      title={text.title}
      value={state.total}
      description={text.description}
      icon={
        <Styled.Icon>
          <LuBookOpen size={26} color={theme.primary} />
        </Styled.Icon>
      }
    />
  );
};
