import type { InputHTMLAttributes } from 'react';
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
  ...rest
}: InputProps) => {
  const message = error ?? helperText;
  const messageId = message ? `${id}-helper` : undefined;

  return (
    <Styled.Container>
      <Styled.Label htmlFor={id}>{label}</Styled.Label>
      <Styled.Field $size={size} $error={!!error} $disabled={!!disabled}>
        <Styled.TextField
          id={id}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={messageId}
          {...rest}
        />
      </Styled.Field>
      {message && (
        <Styled.Helper id={messageId} $error={!!error}>
          {message}
        </Styled.Helper>
      )}
    </Styled.Container>
  );
};
