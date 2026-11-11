import {
  Tooltip,
  useActiveTooltipDataPoints,
  usePlotArea,
  useXAxisScale,
  useYAxisScale,
  type TooltipContentProps,
} from 'recharts';
import { PeriodTooltip } from './PeriodTooltip';

export type PeriodDatum = {
  key: string;
  label: string;
  total: number;
};

// espaço entre o ponto (topo da barra ou ponto da linha) e o tooltip
const TOOLTIP_GAP = 8;
// tamanho aproximado do tooltip: pontos altos e os das pontas não o empurram para fora do gráfico
const TOOLTIP_HEIGHT = 60;
const TOOLTIP_HALF_WIDTH = 84;

type AnchoredTooltipProps = {
  formatValue: (total: number) => string;
};

// Tooltip preso ao ponto ativo (centralizado acima dele). O mouse só decide qual ponto está
// ativo: a posição vem da escala dos eixos, então ele não acompanha o cursor. Deve ficar dentro
// de um gráfico do Recharts cujos dados sejam `PeriodDatum`, com o eixo X em `label`.
export const AnchoredTooltip = ({ formatValue }: AnchoredTooltipProps) => {
  const xScale = useXAxisScale();
  const yScale = useYAxisScale();
  const plotArea = usePlotArea();
  const datum = useActiveTooltipDataPoints<PeriodDatum>()?.[0];

  const x = datum ? xScale?.(datum.label, { position: 'middle' }) : undefined;
  const pointTop = datum ? yScale?.(datum.total) : undefined;
  // em telas estreitas, os pontos das pontas deixam o tooltip dentro do gráfico
  const maxX = plotArea ? plotArea.x + plotArea.width - TOOLTIP_HALF_WIDTH : undefined;
  const position =
    x === undefined || pointTop === undefined
      ? undefined
      : {
          x:
            maxX === undefined
              ? x
              : Math.min(Math.max(x, TOOLTIP_HALF_WIDTH), Math.max(maxX, TOOLTIP_HALF_WIDTH)),
          y: Math.max(pointTop - TOOLTIP_GAP, TOOLTIP_HEIGHT),
        };

  const renderTooltip = ({ active, payload }: TooltipContentProps) => {
    if (!active || !payload?.length) return null;

    const current = payload[0].payload as PeriodDatum;
    return <PeriodTooltip title={current.label} value={formatValue(current.total)} />;
  };

  return (
    <Tooltip
      cursor={false}
      // sem animação: ela faz o tooltip "deslizar" do canto até o ponto
      isAnimationActive={false}
      offset={0}
      // o centro do tooltip é ajustado por CSS; o Recharts não deve reposicioná-lo
      allowEscapeViewBox={{ x: true, y: true }}
      position={position}
      content={renderTooltip}
    />
  );
};
