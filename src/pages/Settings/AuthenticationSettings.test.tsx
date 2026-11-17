import { screen } from '@testing-library/react';
import { interpolate, locale } from '../../locales';
import { AuthServiceError } from '../../services/authErrors';
import { changePassword } from '../../services/authService';
import { renderWithProviders } from '../../test/render';
import { AuthenticationSettings } from './AuthenticationSettings';

jest.mock('../../services/authService', () => ({ changePassword: jest.fn() }));

const text = locale.settings.authentication;

const renderTab = () => {
  const view = renderWithProviders(<AuthenticationSettings />);
  const fill = async (current: string, next: string, confirm = next) => {
    if (current) await view.user.type(screen.getByLabelText(text.current.label), current);
    if (next) await view.user.type(screen.getByLabelText(text.new.label), next);
    if (confirm) await view.user.type(screen.getByLabelText(text.confirm.label), confirm);
  };
  const submit = () => view.user.click(screen.getByRole('button', { name: text.submit }));
  return { ...view, fill, submit };
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AuthenticationSettings', () => {
  it('valida os campos antes de chamar o servidor', async () => {
    const { fill, submit } = renderTab();

    await submit();
    expect(screen.getByText(text.errors.currentRequired)).toBeInTheDocument();
    expect(screen.getByText(interpolate(text.errors.tooShort, { min: 8 }))).toBeInTheDocument();

    await fill('senha-atual', 'nova-senha-1', 'nova-senha-2');
    await submit();
    expect(screen.getByText(text.errors.mismatch)).toBeInTheDocument();
    expect(changePassword).not.toHaveBeenCalled();
  });

  it('não aceita a mesma senha', async () => {
    const { fill, submit } = renderTab();

    await fill('mesma-senha', 'mesma-senha');
    await submit();

    expect(screen.getByText(text.errors.sameAsCurrent)).toBeInTheDocument();
    expect(changePassword).not.toHaveBeenCalled();
  });

  it('troca a senha, limpa o formulário e avisa', async () => {
    jest.mocked(changePassword).mockResolvedValue();
    const { fill, submit } = renderTab();

    await fill('senha-atual', 'nova-senha-123');
    await submit();

    expect(changePassword).toHaveBeenCalledWith({
      currentPassword: 'senha-atual',
      newPassword: 'nova-senha-123',
    });
    expect(await screen.findByText(text.success)).toBeInTheDocument();
    expect(screen.getByLabelText(text.current.label)).toHaveValue('');
    expect(screen.getByLabelText(text.new.label)).toHaveValue('');
    expect(screen.getByLabelText(text.confirm.label)).toHaveValue('');
  });

  it('aponta a senha atual incorreta no campo', async () => {
    jest.mocked(changePassword).mockRejectedValue(new AuthServiceError('wrong_password'));
    const { fill, submit } = renderTab();

    await fill('errada', 'nova-senha-123');
    await submit();

    expect(await screen.findByText(text.errors.wrongPassword)).toBeInTheDocument();
    expect(screen.getByLabelText(text.new.label)).toHaveValue('nova-senha-123');
  });

  it('aponta senha fraca no campo da nova senha', async () => {
    jest.mocked(changePassword).mockRejectedValue(new AuthServiceError('weak_password'));
    const { fill, submit } = renderTab();

    await fill('senha-atual', '12345678');
    await submit();

    expect(await screen.findByText(text.errors.weakPassword)).toBeInTheDocument();
  });

  it('tira o erro do campo assim que a usuária volta a digitar nele', async () => {
    jest.mocked(changePassword).mockRejectedValue(new AuthServiceError('wrong_password'));
    const { fill, submit, user } = renderTab();

    await fill('errada', 'nova-senha-123');
    await submit();
    expect(await screen.findByText(text.errors.wrongPassword)).toBeInTheDocument();

    await user.type(screen.getByLabelText(text.current.label), 'x');

    expect(screen.queryByText(text.errors.wrongPassword)).not.toBeInTheDocument();
  });

  it('avisa quando houve tentativas demais com a senha errada', async () => {
    jest.mocked(changePassword).mockRejectedValue(new AuthServiceError('too_many_attempts'));
    const { fill, submit } = renderTab();

    await fill('errada', 'nova-senha-123');
    await submit();

    expect(await screen.findByText(text.errors.tooManyAttempts)).toBeInTheDocument();
  });

  it('mostra o mínimo de caracteres no texto de ajuda', () => {
    renderTab();

    expect(screen.getByText(interpolate(text.new.helperText, { min: 8 }))).toBeInTheDocument();
  });

  it('mostra erro genérico nas outras falhas', async () => {
    jest.mocked(changePassword).mockRejectedValue(new Error('network'));
    const { fill, submit } = renderTab();

    await fill('senha-atual', 'nova-senha-123');
    await submit();

    expect(await screen.findByRole('alert')).toHaveTextContent(text.errors.generic);
  });
});
