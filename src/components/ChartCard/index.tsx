import { useId, type ReactNode } from 'react';
import * as Styled from './styles';

export type ChartCardProps = {
  title: string;
  children: ReactNode;
};

export const ChartCard = ({ title, children }: ChartCardProps) => {
  const titleId = useId();

  return (
    <Styled.Card aria-labelledby={titleId}>
      <Styled.Title id={titleId}>{title}</Styled.Title>
      {children}
    </Styled.Card>
  );
};
