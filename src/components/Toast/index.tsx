import { useEffect, useEffectEvent, type ReactNode } from 'react';
import { LuCheck, LuTriangleAlert } from 'react-icons/lu';
import * as Styled from './styles';

export type ToastVariant = 'success' | 'error';

export type ToastProps = {
  children: ReactNode;
  variant?: ToastVariant;
  onDismiss: () => void;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
};

export const Toast = ({
  children,
  variant = 'success',
  onDismiss,
  actionLabel,
  onAction,
  duration = 6000,
}: ToastProps) => {
  const dismiss = useEffectEvent(onDismiss);

  useEffect(() => {
    const timer = setTimeout(() => dismiss(), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <Styled.Container role={variant === 'error' ? 'alert' : 'status'}>
      <Styled.Icon $variant={variant} aria-hidden="true">
        {variant === 'error' ? <LuTriangleAlert /> : <LuCheck />}
      </Styled.Icon>
      <Styled.Message>{children}</Styled.Message>
      {actionLabel && onAction && (
        <Styled.Action type="button" onClick={onAction}>
          {actionLabel}
        </Styled.Action>
      )}
    </Styled.Container>
  );
};
