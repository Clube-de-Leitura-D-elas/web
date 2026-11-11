import { useId } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useTheme } from 'styled-components';
import * as Styled from './styles';
import { AnchoredTooltip, type PeriodDatum } from './AnchoredTooltip';
import { pickTickLabels } from './tickLabels';

type PeriodAreaChartProps = {
  data: PeriodDatum[];
  // texto do valor no tooltip (ex.: "984 participantes ativas")
  formatValue: (total: number) => string;
  ariaLabel: string;
};

// o ponto mais alto fica no topo da área do gráfico: a folga acima dá lugar ao tooltip, que não
// cobre a linha
const CHART_TOP_MARGIN = 68;
const CHART_HEIGHT = 300;

// milhares com ponto (1.000), como no resto do painel
const numberFormatter = new Intl.NumberFormat('pt-BR');

// Linha com preenchimento por período (ex.: total de participantes mês a mês). As cores vêm do
// tema: o Recharts recebe cor como prop.
export const PeriodAreaChart = ({ data, formatValue, ariaLabel }: PeriodAreaChartProps) => {
  const theme = useTheme();
  // o useId devolve ":r1:" e os dois-pontos atrapalham o url(#...) do gradiente
  const gradientId = `area-fill-${useId().replace(/:/g, '')}`;
  const tick = { fill: theme.textMuted, fontSize: 12 };

  return (
    <Styled.ChartFrame role="group" aria-label={ariaLabel}>
      {/* initialDimension: o jsdom não mede a tela e o gráfico não apareceria nos testes */}
      <ResponsiveContainer
        width="100%"
        height={CHART_HEIGHT}
        initialDimension={{ width: 600, height: CHART_HEIGHT }}
      >
        <AreaChart data={data} margin={{ top: CHART_TOP_MARGIN, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.primary} stopOpacity={0.25} />
              <stop offset="100%" stopColor={theme.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={theme.border} />
          <XAxis
            dataKey="label"
            tick={tick}
            tickLine={false}
            axisLine={false}
            ticks={pickTickLabels(data.map(({ label }) => label))}
            interval="preserveEnd"
            minTickGap={16}
          />
          {/* domínio automático: a linha não precisa começar em zero para mostrar a variação */}
          <YAxis
            allowDecimals={false}
            domain={['auto', 'auto']}
            tick={tick}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => numberFormatter.format(value)}
            width={44}
          />
          <AnchoredTooltip formatValue={formatValue} />
          <Area
            type="monotone"
            dataKey="total"
            stroke={theme.primary}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 5, fill: theme.primaryHover, stroke: theme.surface, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Styled.ChartFrame>
  );
};
