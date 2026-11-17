import { useId, useState, type FormEvent } from 'react';

import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Toast } from '../../components/Toast';
import { useLocale } from '../../hooks/useLocale';
import { interpolate } from '../../locales';
import { AuthServiceError } from '../../services/authErrors';
import { changePassword } from '../../services/authService';
import * as Styled from './styles';

const MIN_PASSWORD_LENGTH = 8;
const lengthParams = { min: MIN_PASSWORD_LENGTH };

type FieldErrors = {
  current?: string;
  next?: string;
  confirm?: string;
};

export const AuthenticationSettings = () => {
  const {
    settings: { authentication: text },
  } = useLocale();
  const baseId = useId();

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successId, setSuccessId] = useState<number | null>(null);

  const clearError = (field: keyof FieldErrors) =>
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));

  const validate = (): FieldErrors => ({
    current: current ? undefined : text.errors.currentRequired,
    next:
      next.length < MIN_PASSWORD_LENGTH
        ? interpolate(text.errors.tooShort, lengthParams)
        : next === current
          ? text.errors.sameAsCurrent
          : undefined,
    confirm: confirm === next ? undefined : text.errors.mismatch,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) return;

    const found = validate();
    setErrors(found);
    setFormError(null);
    if (found.current || found.next || found.confirm) return;

    setIsSaving(true);

    try {
      await changePassword({ currentPassword: current, newPassword: next });
      setCurrent('');
      setNext('');
      setConfirm('');
      setSuccessId(Date.now());
    } catch (error) {
      const code = error instanceof AuthServiceError ? error.code : 'unknown';

      if (code === 'wrong_password') setErrors({ current: text.errors.wrongPassword });
      else if (code === 'too_many_attempts') setErrors({ current: text.errors.tooManyAttempts });
      else if (code === 'same_password') setErrors({ next: text.errors.sameAsCurrent });
      else if (code === 'weak_password') setErrors({ next: text.errors.weakPassword });
      else setFormError(text.errors.generic);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Styled.Section>
      <Styled.PasswordForm onSubmit={handleSubmit} noValidate>
        <Styled.SectionSummary>{text.description}</Styled.SectionSummary>

        <Input
          id={`${baseId}-current`}
          type="password"
          label={text.current.label}
          autoComplete="current-password"
          value={current}
          onChange={(event) => {
            setCurrent(event.target.value);
            clearError('current');
          }}
          error={errors.current}
          disabled={isSaving}
          required
          fullWidth
        />

        <Input
          id={`${baseId}-new`}
          type="password"
          label={text.new.label}
          autoComplete="new-password"
          value={next}
          onChange={(event) => {
            setNext(event.target.value);
            clearError('next');
          }}
          helperText={interpolate(text.new.helperText, lengthParams)}
          error={errors.next}
          disabled={isSaving}
          required
          fullWidth
        />

        <Input
          id={`${baseId}-confirm`}
          type="password"
          label={text.confirm.label}
          autoComplete="new-password"
          value={confirm}
          onChange={(event) => {
            setConfirm(event.target.value);
            clearError('confirm');
          }}
          error={errors.confirm}
          disabled={isSaving}
          required
          fullWidth
        />

        {formError && <Styled.FormError role="alert">{formError}</Styled.FormError>}

        <Styled.FormActions>
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? text.submitting : text.submit}
          </Button>
        </Styled.FormActions>
      </Styled.PasswordForm>

      {successId !== null && (
        <Toast key={successId} onDismiss={() => setSuccessId(null)}>
          {text.success}
        </Toast>
      )}
    </Styled.Section>
  );
};
