import { useId, type ReactNode } from 'react';
import * as Styled from './styles';

export type ChartCardProps = {
  title: string;
  // colado ao título (ex.: contador de itens da lista)
  badge?: ReactNode;
  // à direita do título (ex.: abas de período e zoom)
  action?: ReactNode;
  children: ReactNode;
};

export const ChartCard = ({ title, badge, action, children }: ChartCardProps) => {
  const titleId = useId();

  return (
    <Styled.Card aria-labelledby={titleId}>
      <Styled.Header>
        <Styled.TitleGroup>
          <Styled.Title id={titleId}>{title}</Styled.Title>
          {badge}
        </Styled.TitleGroup>
        {action && <Styled.Action>{action}</Styled.Action>}
      </Styled.Header>
      {children}
    </Styled.Card>
  );
};
