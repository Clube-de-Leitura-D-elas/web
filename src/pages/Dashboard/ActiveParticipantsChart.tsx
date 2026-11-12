import { useEffect, useEffectEvent, useId, useRef, useState } from 'react';
import { ChartCard } from '../../components/ChartCard';
import { DataState, type DataStatus } from '../../components/DataState';
import { Tabs } from '../../components/Tab';
import { useLocale } from '../../hooks/useLocale';
import { pluralize } from '../../locales';
import { getActiveParticipants } from '../../services/dashboardService';
import type { ActiveParticipantsItem } from '../../types/dashboard';
import { formatMonthShortYear, getMonthlyRange } from '../../utils/date';
import {
  DEFAULT_RANGE,
  FETCH_MONTHS,
  RANGE_OPTIONS,
  lastMonths,
  monthsOf,
  stepRange,
  type RangeValue,
} from './activeParticipantsRange';
import { PeriodAreaChart } from './PeriodAreaChart';
import { ZoomControls } from './ZoomControls';

const CHART_MIN_HEIGHT = '16rem';
// o trackpad dispara dezenas de eventos por gesto: um passo de zoom por gesto
const WHEEL_THROTTLE_MS = 250;

export const ActiveParticipantsChart = () => {
  const { dashboard } = useLocale();
  const text = dashboard.activeParticipants;

  const panelId = useId();

  const [range, setRange] = useState<RangeValue>(DEFAULT_RANGE);
  // muda a cada "Tentar novamente", para refazer a busca
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{
    attempt: number;
    items: ActiveParticipantsItem[] | null;
  } | null>(null);

  const chartAreaRef = useRef<HTMLDivElement>(null);
  const lastWheelAt = useRef(0);
  const wheelPointer = useRef<{ x: number; y: number } | null>(null);

  // Busca o maior período uma vez: abas e zoom só recortam os meses, sem nova requisição.
  useEffect(() => {
    let ignore = false;

    // dentro do Promise: se o intervalo de datas falhar, vira o estado de erro do card
    new Promise<ActiveParticipantsItem[]>((resolve) => {
      const { from, to } = getMonthlyRange(FETCH_MONTHS);
      resolve(getActiveParticipants(from, to));
    })
      .then((items) => {
        if (!ignore) setResult({ attempt, items });
      })
      .catch((err) => {
        console.error(err);
        if (!ignore) setResult({ attempt, items: null });
      });

    return () => {
      ignore = true;
    };
  }, [attempt]);

  const items = result?.attempt === attempt ? result.items : undefined;

  // os meses sem entrada já vêm preenchidos: "sem dados" é lista vazia ou tudo zerado
  const status: DataStatus =
    items === undefined
      ? 'loading'
      : items === null
        ? 'error'
        : items.every(({ total }) => total === 0)
          ? 'empty'
          : 'ready';

  // Scroll do mouse sobre o gráfico: para cima aproxima, para baixo afasta. O listener é nativo
  // porque o `onWheel` do React é passivo e não deixa chamar `preventDefault`.
  const handleWheel = useEffectEvent((event: WheelEvent) => {
    // carregando, erro ou vazio: não há gráfico para ampliar e a página deve rolar normalmente
    if (status !== 'ready' || event.deltaY === 0) return;

    const direction = event.deltaY < 0 ? 'in' : 'out';
    const next = stepRange(range, direction);
    const now = Date.now();
    // ainda no mesmo gesto que acabou de dar um passo
    const sameGesture = now - lastWheelAt.current < WHEEL_THROTTLE_MS;

    if (next === range) {
      // nas pontas não há o que ampliar e a página rola; só o fim do gesto que chegou à ponta
      // continua bloqueado, para a página não pular no meio dele
      if (sameGesture) {
        lastWheelAt.current = now;
        event.preventDefault();
      }
      return;
    }

    event.preventDefault();
    // todo evento consumido renova a marca: o gesto (com a inércia do trackpad) só termina depois
    // de WHEEL_THROTTLE_MS sem eventos, e cada gesto dá um único passo
    lastWheelAt.current = now;
    if (sameGesture) return;

    wheelPointer.current = { x: event.clientX, y: event.clientY };
    setRange(next);
  });

  // O período muda com o mouse parado: o Recharts só recalcula o ponto ativo num movimento. Depois
  // de redesenhar, repete um movimento na posição do mouse para o tooltip ir ao ponto sob ele.
  useEffect(() => {
    const pointer = wheelPointer.current;
    if (!pointer) return;
    wheelPointer.current = null;

    const frame = requestAnimationFrame(() => {
      const target = document.elementFromPoint?.(pointer.x, pointer.y);
      target?.dispatchEvent(
        new MouseEvent('mousemove', {
          bubbles: true,
          clientX: pointer.x,
          clientY: pointer.y,
        }),
      );
    });

    return () => cancelAnimationFrame(frame);
  }, [range]);

  useEffect(() => {
    const element = chartAreaRef.current;
    if (!element) return;

    element.addEventListener('wheel', handleWheel, { passive: false });
    return () => element.removeEventListener('wheel', handleWheel);
  }, []);

  const canZoomIn = stepRange(range, 'in') !== range;
  const canZoomOut = stepRange(range, 'out') !== range;

  return (
    <ChartCard
      title={text.title}
      action={
        <>
          <Tabs
            active={range}
            onChange={(value) => setRange(value as RangeValue)}
            showPanels={false}
            size="sm"
            fit
            panelId={panelId}
            tabs={RANGE_OPTIONS.map(({ value }) => ({ value, label: text.ranges[value] }))}
          />
          <ZoomControls
            zoomInLabel={text.zoomIn}
            zoomOutLabel={text.zoomOut}
            canZoomIn={canZoomIn}
            canZoomOut={canZoomOut}
            onZoomIn={() => setRange((current) => stepRange(current, 'in'))}
            onZoomOut={() => setRange((current) => stepRange(current, 'out'))}
          />
        </>
      }
    >
      <div ref={chartAreaRef} role="tabpanel" id={panelId} aria-labelledby={`tab-${range}`}>
        {status === 'ready' && items ? (
          <PeriodAreaChart
            data={lastMonths(items, monthsOf(range)).map(({ period, total }) => ({
              key: period,
              label: formatMonthShortYear(period),
              total,
            }))}
            formatValue={(total) => pluralize(text.count, total)}
            ariaLabel={text.chartLabel}
          />
        ) : (
          <DataState
            variant={status === 'ready' ? 'loading' : status}
            minHeight={CHART_MIN_HEIGHT}
            onRetry={() => setAttempt((current) => current + 1)}
          >
            {status === 'empty' ? text.empty : undefined}
          </DataState>
        )}
      </div>
    </ChartCard>
  );
};
