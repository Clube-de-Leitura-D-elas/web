import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useTheme } from 'styled-components';
import * as Styled from './styles';
import { AnchoredTooltip, type PeriodDatum } from './AnchoredTooltip';

type PeriodBarChartProps = {
  data: PeriodDatum[];
  // texto do valor no tooltip (ex.: "37 inscrições")
  formatValue: (total: number) => string;
  ariaLabel: string;
};

const CHART_HEIGHT = 256;

// Barras por período (mês, semana). As cores vêm do tema: o Recharts recebe cor como prop.
export const PeriodBarChart = ({ data, formatValue, ariaLabel }: PeriodBarChartProps) => {
  const theme = useTheme();
  const tick = { fill: theme.textMuted, fontSize: 12 };

  return (
    <Styled.ChartFrame role="group" aria-label={ariaLabel}>
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
    </Styled.ChartFrame>
  );
};
