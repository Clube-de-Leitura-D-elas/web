import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  useActiveTooltipDataPoints,
  usePlotArea,
  useXAxisScale,
  useYAxisScale,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from 'recharts';
import { useTheme } from 'styled-components';
import { PeriodTooltip } from './PeriodTooltip';

export type PeriodBarDatum = {
  key: string;
  label: string;
  total: number;
};

type PeriodBarChartProps = {
  data: PeriodBarDatum[];
  // texto do valor no tooltip (ex.: "37 inscrições")
  formatValue: (total: number) => string;
  ariaLabel: string;
};

const CHART_HEIGHT = 256;
// espaço entre o topo da barra e o tooltip
const TOOLTIP_GAP = 8;
// tamanho aproximado do tooltip: barras altas e as das pontas não o empurram para fora do gráfico
const TOOLTIP_HEIGHT = 60;
const TOOLTIP_HALF_WIDTH = 64;

type AnchoredTooltipProps = {
  formatValue: (total: number) => string;
};

// Tooltip preso à barra ativa (centralizado acima do topo dela). O mouse só decide qual barra
// está ativa: a posição vem da escala dos eixos, então ele não acompanha o cursor.
const AnchoredTooltip = ({ formatValue }: AnchoredTooltipProps) => {
  const xScale = useXAxisScale();
  const yScale = useYAxisScale();
  const plotArea = usePlotArea();
  const datum = useActiveTooltipDataPoints<PeriodBarDatum>()?.[0];

  const x = datum ? xScale?.(datum.label, { position: 'middle' }) : undefined;
  const barTop = datum ? yScale?.(datum.total) : undefined;
  // em telas estreitas, as barras das pontas deixam o tooltip dentro do gráfico
  const maxX = plotArea ? plotArea.x + plotArea.width - TOOLTIP_HALF_WIDTH : undefined;
  const position =
    x === undefined || barTop === undefined
      ? undefined
      : {
          x:
            maxX === undefined
              ? x
              : Math.min(Math.max(x, TOOLTIP_HALF_WIDTH), Math.max(maxX, TOOLTIP_HALF_WIDTH)),
          y: Math.max(barTop - TOOLTIP_GAP, TOOLTIP_HEIGHT),
        };

  const renderTooltip = ({ active, payload }: TooltipContentProps) => {
    if (!active || !payload?.length) return null;

    const current = payload[0].payload as PeriodBarDatum;
    return <PeriodTooltip title={current.label} value={formatValue(current.total)} />;
  };

  return (
    <Tooltip
      cursor={false}
      // sem animação: ela faz o tooltip "deslizar" do canto até a barra
      isAnimationActive={false}
      offset={0}
      // o centro do tooltip é ajustado por CSS; o Recharts não deve reposicioná-lo
      allowEscapeViewBox={{ x: true, y: true }}
      position={position}
      content={renderTooltip}
    />
  );
};

// Barras por período (mês, semana). As cores vêm do tema: o Recharts recebe cor como prop.
export const PeriodBarChart = ({ data, formatValue, ariaLabel }: PeriodBarChartProps) => {
  const theme = useTheme();
  const tick = { fill: theme.textMuted, fontSize: 12 };

  return (
    <div role="group" aria-label={ariaLabel}>
      {/* initialDimension: o jsdom não mede a tela e o gráfico não apareceria nos testes */}
      <ResponsiveContainer
        width="100%"
        height={CHART_HEIGHT}
        initialDimension={{ width: 600, height: CHART_HEIGHT }}
      >
        <BarChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={theme.border} />
          <XAxis
            dataKey="label"
            tick={tick}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={16}
          />
          <YAxis allowDecimals={false} tick={tick} tickLine={false} axisLine={false} width={32} />
          <AnchoredTooltip formatValue={formatValue} />
          <Bar
            dataKey="total"
            fill={theme.primary}
            radius={[4, 4, 0, 0]}
            activeBar={{ fill: theme.primaryHover }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
