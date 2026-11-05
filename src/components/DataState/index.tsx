import type { ReactNode } from 'react';
import { LuInbox, LuTriangleAlert } from 'react-icons/lu';
import { useLocale } from '../../hooks/useLocale';
import { Button } from '../Button';
import { Skeleton } from '../Skeleton';
import * as Styled from './styles';

export type DataStatus = 'loading' | 'empty' | 'error' | 'ready';

export type DataStateVariant = Exclude<DataStatus, 'ready'>;
export type DataStateSize = 'md' | 'sm';

export type DataStateProps = {
  variant: DataStateVariant;
  children?: ReactNode;
  onRetry?: () => void;
  skeleton?: ReactNode;
  size?: DataStateSize;
  minHeight?: string;
};

export const DataState = ({
  variant,
  children,
  onRetry,
  skeleton,
  size = 'md',
  minHeight,
}: DataStateProps) => {
  const { dataState: text } = useLocale();

  if (variant === 'loading') {
    return (
      <Styled.Container role="status" $size={size} $minHeight={minHeight} $loading>
        <Styled.VisuallyHidden>{children ?? text.loading}</Styled.VisuallyHidden>
        {skeleton ?? <Skeleton height={minHeight ?? (size === 'sm' ? '2rem' : '12rem')} />}
      </Styled.Container>
    );
  }

  if (variant === 'error') {
    return (
      <Styled.Container role="alert" $size={size} $minHeight={minHeight}>
        <Styled.Icon $variant="error" $size={size}>
          <LuTriangleAlert aria-hidden />
        </Styled.Icon>
        <Styled.Message $size={size}>{children ?? text.error}</Styled.Message>
        {onRetry && (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            {text.retry}
          </Button>
        )}
      </Styled.Container>
    );
  }

  return (
    <Styled.Container role="status" $size={size} $minHeight={minHeight}>
      <Styled.Icon $variant="empty" $size={size}>
        <LuInbox aria-hidden />
      </Styled.Icon>
      <Styled.Message $size={size}>{children ?? text.empty}</Styled.Message>
    </Styled.Container>
  );
};
