import { useId, type ReactNode } from 'react';
import * as Styled from './styles';

export type ChartCardProps = {
  title: string;
  // à direita do título (ex.: abas de período e zoom)
  action?: ReactNode;
  children: ReactNode;
};

export const ChartCard = ({ title, action, children }: ChartCardProps) => {
  const titleId = useId();

  return (
    <Styled.Card aria-labelledby={titleId}>
      <Styled.Header>
        <Styled.Title id={titleId}>{title}</Styled.Title>
        {action && <Styled.Action>{action}</Styled.Action>}
      </Styled.Header>
      {children}
    </Styled.Card>
  );
};
