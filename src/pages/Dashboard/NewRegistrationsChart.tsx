import { useEffect, useState } from 'react';
import { ChartCard } from '../../components/ChartCard';
import { DataState, type DataStatus } from '../../components/DataState';
import { Tabs } from '../../components/Tab';
import { useLocale } from '../../hooks/useLocale';
import { interpolate, pluralize } from '../../locales';
import { getRegistrations } from '../../services/dashboardService';
import type { Granularity, RegistrationsItem } from '../../types/dashboard';
import { formatDayMonth, formatMonthLabel, getRegistrationsRange } from '../../utils/date';
import { PeriodBarChart } from './PeriodBarChart';

const CHART_MIN_HEIGHT = '16rem';

export const NewRegistrationsChart = () => {
  const { dashboard } = useLocale();
  const text = dashboard.registrations;

  const [granularity, setGranularity] = useState<Granularity>('month');
  // muda a cada "Tentar novamente", para refazer a busca mesmo com a mesma granularidade
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ key: string; items: RegistrationsItem[] | null } | null>(
    null,
  );

  const requestKey = `${granularity}:${attempt}`;

  useEffect(() => {
    let ignore = false;

    // dentro do Promise: se o intervalo de datas falhar, vira o estado de erro do card
    new Promise<RegistrationsItem[]>((resolve) => {
      const { from, to } = getRegistrationsRange(granularity);
      resolve(getRegistrations(granularity, from, to));
    })
      .then((items) => {
        if (!ignore) setResult({ key: requestKey, items });
      })
      .catch((err) => {
        console.error(err);
        if (!ignore) setResult({ key: requestKey, items: null });
      });

    // resposta de uma aba anterior chega atrasada: não pode sobrescrever a atual
    return () => {
      ignore = true;
    };
  }, [granularity, requestKey]);

  // Limpa o resultado ao trocar de aba: voltar para a aba anterior antes de a outra responder
  // reaproveitaria a chave antiga e mostraria dados velhos em vez do carregamento.
  // Clicar na aba já ativa não muda nada e preserva o resultado.
  const handleGranularityChange = (value: string) => {
    const next = value as Granularity;
    if (next === granularity) return;

    setResult(null);
    setGranularity(next);
  };

  const items = result?.key === requestKey ? result.items : undefined;

  // os períodos vazios já vêm com total 0: "sem inscrição" é quando todos são 0
  const status: DataStatus =
    items === undefined
      ? 'loading'
      : items === null
        ? 'error'
        : items.every(({ total }) => total === 0)
          ? 'empty'
          : 'ready';

  const labelOf = (period: string) =>
    granularity === 'month'
      ? formatMonthLabel(period)
      : interpolate(text.weekLabel, { date: formatDayMonth(period) });

  const content =
    status === 'ready' && items ? (
      <PeriodBarChart
        data={items.map(({ period, total }) => ({ key: period, label: labelOf(period), total }))}
        formatValue={(total) => pluralize(text.count, total)}
        ariaLabel={text.chartLabel[granularity]}
      />
    ) : (
      <DataState
        variant={status === 'ready' ? 'loading' : status}
        minHeight={CHART_MIN_HEIGHT}
        onRetry={() => setAttempt((current) => current + 1)}
      >
        {status === 'empty' ? text.empty : undefined}
      </DataState>
    );

  return (
    <ChartCard
      title={text.title}
      action={
        <Tabs
          active={granularity}
          onChange={handleGranularityChange}
          showPanels={false}
          tabs={[
            { value: 'month', label: text.month },
            { value: 'week', label: text.week },
          ]}
        />
      }
    >
      {content}
    </ChartCard>
  );
};
