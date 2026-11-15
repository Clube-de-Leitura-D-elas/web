import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useTheme } from 'styled-components';
import { AnchoredTooltip, type PeriodDatum } from './AnchoredTooltip';
import * as Styled from './styles';

// Mantém a compatibilidade com os testes que usam este tipo.
export type PeriodBarDatum = PeriodDatum;

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

  const minPeriodWidth = Math.max(80, ...data.map(({ label }) => label.length * 7 + 24));
  const minChartWidth = data.length * minPeriodWidth + 32;

  return (
    <Styled.ChartScroll role="group" aria-label={ariaLabel} tabIndex={0}>
      <Styled.ChartContent $minWidth={minChartWidth}>
        {/* initialDimension: o jsdom não mede a tela e o gráfico não apareceria nos testes */}
        <ResponsiveContainer
          width="100%"
          height={CHART_HEIGHT}
          initialDimension={{ width: 600, height: CHART_HEIGHT }}
        >
          <BarChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 16 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={theme.border} />

            <XAxis dataKey="label" tick={tick} tickLine={false} axisLine={false} interval={0} />

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
      </Styled.ChartContent>
    </Styled.ChartScroll>
  );
};
