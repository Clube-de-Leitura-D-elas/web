import { useCallback, useState } from 'react';
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

  // Tamanho real da caixa, medido depois de renderizar: o texto muda (valores maiores, outro
  // idioma) e um tamanho fixo deixaria o tooltip sair do gráfico nas pontas. A atualização roda
  // antes da pintura, então a posição já sai corrigida.
  const [size, setSize] = useState({ width: 0, height: 0 });
  const measureBox = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const { offsetWidth: width, offsetHeight: height } = node;
    setSize((current) =>
      current.width === width && current.height === height ? current : { width, height },
    );
  }, []);

  const halfWidth = size.width / 2;
  const x = datum ? xScale?.(datum.label, { position: 'middle' }) : undefined;
  const pointTop = datum ? yScale?.(datum.total) : undefined;
  // nas pontas, a caixa fica inteira dentro do gráfico em vez de centrada no ponto
  const maxX = plotArea ? plotArea.x + plotArea.width - halfWidth : undefined;
  const position =
    x === undefined || pointTop === undefined
      ? undefined
      : {
          x: maxX === undefined ? x : Math.min(Math.max(x, halfWidth), Math.max(maxX, halfWidth)),
          y: Math.max(pointTop - TOOLTIP_GAP, size.height),
        };

  const renderTooltip = ({ active, payload }: TooltipContentProps) => {
    if (!active || !payload?.length) return null;

    const current = payload[0].payload as PeriodDatum;
    return (
      <PeriodTooltip boxRef={measureBox} title={current.label} value={formatValue(current.total)} />
    );
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
