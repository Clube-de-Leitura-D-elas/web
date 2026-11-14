import { useId, type ReactNode } from 'react';
import * as Styled from './styles';

export type KpiCardProps = {
  title: string;
  value: number | string;
  description?: string;
  descriptionVariant?: 'default' | 'success' | 'danger';
  icon?: ReactNode;
};

export const KpiCard = ({
  title,
  value,
  description,
  descriptionVariant = 'default',
  icon,
}: KpiCardProps) => {
  const titleId = useId();

  return (
    <Styled.Card aria-labelledby={titleId}>
      <Styled.Header>
        <Styled.Title id={titleId}>{title}</Styled.Title>
        {icon}
      </Styled.Header>

      <Styled.Value>{value}</Styled.Value>

      {description && (
        <Styled.Description $variant={descriptionVariant}>{description}</Styled.Description>
      )}
    </Styled.Card>
  );
};
