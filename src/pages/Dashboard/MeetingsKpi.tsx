import { useEffect, useState } from 'react';
import { DataState } from '../../components/DataState';
import { KpiCard } from '../../components/KpiCard';
import { useLocale } from '../../hooks/useLocale';
import { LuCalendarDays } from 'react-icons/lu';
import { theme } from '../../theme/theme';
import { interpolate } from '../../locales';
import * as Styled from './styles';
import { getDashboardKpis } from '../../services/dashboardService';

type MeetingsKpiState =
  | { status: 'loading' }
  | { status: 'error' }
  | {
      status: 'ready';
      currentMonth: number;
      previousMonth: number;
    };

export const MeetingsKpi = () => {
  const { dashboard } = useLocale();
  const text = dashboard.kpis.meetings;

  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<MeetingsKpiState>({
    status: 'loading',
  });

  useEffect(() => {
    let ignore = false;

    getDashboardKpis()
      .then((data) => {
        if (!ignore) {
          setState({
            status: 'ready',
            currentMonth: data.meetings.currentMonth,
            previousMonth: data.meetings.previousMonth,
          });
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

  const { currentMonth, previousMonth } = state;

  let description: string;
  let descriptionVariant: 'default' | 'success' | 'danger' = 'default';

  if (previousMonth === 0) {
    description = text.noPrevious;
  } else if (currentMonth === previousMonth) {
    description = text.same;
  } else {
    const isIncrease = currentMonth > previousMonth;

    descriptionVariant = isIncrease ? 'success' : 'danger';

    const percentage = Math.round(Math.abs((currentMonth - previousMonth) / previousMonth) * 100);

    description = interpolate(isIncrease ? text.increase : text.decrease, {
      percentage,
    });
  }

  return (
    <KpiCard
      title={text.title}
      value={currentMonth}
      description={description}
      descriptionVariant={descriptionVariant}
      icon={
        <Styled.Icon>
          <LuCalendarDays size={26} color={theme.primary} />
        </Styled.Icon>
      }
    />
  );
};
