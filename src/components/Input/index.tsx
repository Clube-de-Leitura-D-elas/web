import { useState, type InputHTMLAttributes, type ChangeEvent } from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { locale } from '../../locales';
import * as Styled from './styles';

const text = locale.input;

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
  type,
  onChange,
  ...rest
}: InputProps) => {
  const [dismissed, setDismissed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [prevError, setPrevError] = useState(error);

  if (error !== prevError) {
    setPrevError(error);
    setDismissed(false);
  }

  const visibleError = dismissed ? undefined : error;
  const message = error ?? helperText;
  const messageId = message ? `${id}-helper` : undefined;
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

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
          type={inputType}
          disabled={disabled}
          aria-invalid={!!visibleError}
          aria-describedby={messageId}
          onChange={handleChange}
          {...rest}
        />
        {isPassword && (
          <Styled.VisibilityToggle
            type="button"
            disabled={disabled}
            aria-label={showPassword ? text.hidePassword : text.showPassword}
            aria-pressed={showPassword}
            aria-controls={id}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <LuEyeOff aria-hidden /> : <LuEye aria-hidden />}
          </Styled.VisibilityToggle>
        )}
      </Styled.Field>
      {message && (
        <Styled.Helper id={messageId} $error={!!visibleError}>
          {message}
        </Styled.Helper>
      )}
    </Styled.Container>
  );
};
