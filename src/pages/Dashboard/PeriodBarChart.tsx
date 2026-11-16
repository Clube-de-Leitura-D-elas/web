import { useLayoutEffect, useRef } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useTheme } from 'styled-components';
import { AnchoredTooltip, type PeriodDatum } from './AnchoredTooltip';
import * as Styled from './styles';

type PeriodBarChartProps = {
  data: PeriodDatum[];
  formatValue: (total: number) => string;
  ariaLabel: string;
  formatTick?: (label: string) => string;
};

const CHART_HEIGHT = 256;
const PERIOD_WIDTH = 42;
const AXIS_WIDTH = 32;
const AXIS_OVERLAY_WIDTH = 48;
const AXIS_CHART_WIDTH = 100;
const CHART_MARGIN = { top: 8, right: 16, bottom: 0, left: 16 };

export const PeriodBarChart = ({
  data,
  formatValue,
  ariaLabel,
  formatTick,
}: PeriodBarChartProps) => {
  const theme = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);
  const tick = { fill: theme.textMuted, fontSize: 12 };

  const minChartWidth = data.length * PERIOD_WIDTH + 64;

  const maxValue = Math.max(0, ...data.map(({ total }) => total));
  const tickStep = Math.max(1, Math.ceil(maxValue / 4));
  const ticks = Array.from({ length: 5 }, (_, index) => index * tickStep);
  const yDomain: [number, number] = [0, tickStep * 4];

  const firstPeriod = data[0]?.key;
  const lastPeriod = data[data.length - 1]?.key;

  useLayoutEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    element.scrollLeft = element.scrollWidth - element.clientWidth;
  }, [firstPeriod, lastPeriod]);

  return (
    <Styled.ChartViewport role="group" aria-label={ariaLabel}>
      <Styled.ChartScroll ref={scrollRef} tabIndex={0} aria-label={ariaLabel}>
        <Styled.ChartContent $minWidth={minChartWidth}>
          <Styled.ChartFrame>
            <ResponsiveContainer
              width="100%"
              height={CHART_HEIGHT}
              initialDimension={{ width: 600, height: CHART_HEIGHT }}
            >
              <BarChart data={data} margin={{ ...CHART_MARGIN, left: 48 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={theme.border} />

                <XAxis
                  dataKey="label"
                  tick={tick}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  tickFormatter={formatTick}
                  height={30}
                />

                <YAxis
                  hide
                  width={AXIS_WIDTH}
                  allowDecimals={false}
                  domain={yDomain}
                  ticks={ticks}
                />

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
        </Styled.ChartContent>
      </Styled.ChartScroll>

      <Styled.ChartAxisOverlay $width={AXIS_OVERLAY_WIDTH} aria-hidden="true">
        <BarChart data={data} width={AXIS_CHART_WIDTH} height={CHART_HEIGHT} margin={CHART_MARGIN}>
          <XAxis dataKey="label" hide height={30} />

          <YAxis
            width={AXIS_WIDTH}
            allowDecimals={false}
            domain={yDomain}
            ticks={ticks}
            tick={tick}
            tickLine={false}
            axisLine={false}
          />

          <Bar dataKey="total" fill="transparent" isAnimationActive={false} />
        </BarChart>
      </Styled.ChartAxisOverlay>
    </Styled.ChartViewport>
  );
};
