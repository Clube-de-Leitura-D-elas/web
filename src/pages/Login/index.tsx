import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { isAuthApiError } from '@supabase/supabase-js';
import logoDelas from '../../assets/logo-delas.png';
import { Input } from '../../components/Input';
import { useAdminAccess } from '../../hooks/useAdminAccess';
import { locale } from '../../locales';
import {
  getProfileByCurrentUser,
  hasAdminRole,
  signInWithPassword,
  signOut,
} from '../../services/authService';
import * as Styled from './styles';

const text = locale.login;

const getErrorMessage = (error: unknown) =>
  isAuthApiError(error) && error.code === 'invalid_credentials'
    ? text.errors.invalidCredentials
    : text.errors.generic;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();
  const navigate = useNavigate();
  const access = useAdminAccess();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setIsSubmitting(true);

    try {
      await signInWithPassword({ email, password });
      const profile = await getProfileByCurrentUser();

      if (!hasAdminRole(profile?.app_role)) {
        await signOut();
        setError(text.errors.noAccess);
        return;
      }

      navigate('/', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (access === 'checking') {
    return <div>{locale.auth.loading}</div>;
  }

  if (access === 'allowed') {
    return <Navigate to="/" replace />;
  }

  return (
    <Styled.Container>
      <Styled.BrandPanel>
        <Styled.Logo src={logoDelas} alt="" />
        <Styled.BrandText>
          <Styled.BrandName>{text.brand.name}</Styled.BrandName>
          <Styled.BrandSubtitle>{text.brand.subtitle}</Styled.BrandSubtitle>
        </Styled.BrandText>
      </Styled.BrandPanel>

      <Styled.FormPanel>
        <Styled.Card>
          <Styled.Header>
            <Styled.Title>{text.title}</Styled.Title>
            <Styled.Subtitle>{text.subtitle}</Styled.Subtitle>
          </Styled.Header>

          <Styled.Form onSubmit={handleSubmit}>
            <Styled.Fields>
              <Input
                id="login-email"
                type="email"
                label={text.email.label}
                placeholder={text.email.placeholder}
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <Input
                id="login-password"
                type="password"
                label={text.password.label}
                placeholder={text.password.placeholder}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Styled.Fields>

            {error && <Styled.ErrorMessage role="alert">{error}</Styled.ErrorMessage>}

            <Styled.SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? text.submitting : text.submit}
            </Styled.SubmitButton>
          </Styled.Form>
        </Styled.Card>
      </Styled.FormPanel>
    </Styled.Container>
  );
}
