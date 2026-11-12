import type { Ref } from 'react';
import * as Styled from './styles';

type PeriodTooltipProps = {
  title: string;
  value: string;
  // permite medir a caixa renderizada (ex.: para mantê-la dentro do gráfico)
  boxRef?: Ref<HTMLDivElement>;
};

export const PeriodTooltip = ({ title, value, boxRef }: PeriodTooltipProps) => (
  <Styled.TooltipBox ref={boxRef}>
    <Styled.TooltipTitle>{title}</Styled.TooltipTitle>
    <Styled.TooltipValue>{value}</Styled.TooltipValue>
  </Styled.TooltipBox>
);
