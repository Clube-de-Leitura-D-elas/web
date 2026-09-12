import { useState, type InputHTMLAttributes, type ChangeEvent } from 'react';
import * as Styled from './styles';

export type InputSize = 'md' | 'lg';

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'size'> & {
  id: string;
  label: string;
  size?: InputSize;
  helperText?: string;
  error?: string;
};

export const Input = ({
  id,
  label,
  size = 'md',
  helperText,
  error,
  disabled,
  onChange,
  ...rest
}: InputProps) => {
  const [dismissed, setDismissed] = useState(false);
  const [prevError, setPrevError] = useState(error);

  if (error !== prevError) {
    setPrevError(error);
    setDismissed(false);
  }

  const visibleError = dismissed ? undefined : error;
  const message = error ?? helperText;
  const messageId = message ? `${id}-helper` : undefined;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (visibleError) setDismissed(true);
    onChange?.(e);
  };

  return (
    <Styled.Container>
      <Styled.Label htmlFor={id}>{label}</Styled.Label>
      <Styled.Field $size={size} $error={!!visibleError} $disabled={!!disabled}>
        <Styled.TextField
          id={id}
          disabled={disabled}
          aria-invalid={!!visibleError}
          aria-describedby={messageId}
          onChange={handleChange}
          {...rest}
        />
      </Styled.Field>
      {message && (
        <Styled.Helper id={messageId} $error={!!visibleError}>
          {message}
        </Styled.Helper>
      )}
    </Styled.Container>
  );
};
