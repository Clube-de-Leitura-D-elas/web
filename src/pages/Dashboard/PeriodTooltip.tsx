import * as Styled from './styles';

type PeriodTooltipProps = {
  title: string;
  value: string;
};

export const PeriodTooltip = ({ title, value }: PeriodTooltipProps) => (
  <Styled.TooltipBox>
    <Styled.TooltipTitle>{title}</Styled.TooltipTitle>
    <Styled.TooltipValue>{value}</Styled.TooltipValue>
  </Styled.TooltipBox>
);
