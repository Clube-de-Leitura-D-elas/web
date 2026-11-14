import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type FocusEvent,
  type ReactNode,
} from 'react';
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
  const [paused, setPaused] = useState(false);
  const remaining = useRef(duration);

  useEffect(() => {
    if (paused) return;

    const startedAt = Date.now();
    const timer = setTimeout(() => dismiss(), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current = Math.max(remaining.current - (Date.now() - startedAt), 0);
    };
  }, [paused]);

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
  };

  return (
    <Styled.Container
      role={variant === 'error' ? 'alert' : 'status'}
      onFocus={() => setPaused(true)}
      onBlur={handleBlur}
    >
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
