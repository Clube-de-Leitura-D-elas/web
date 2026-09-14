import { useNavigate } from 'react-router';
import logoDelas from '../../assets/logo-delas.png';
import { Button } from '../../components/Button';
import { useLocale } from '../../hooks/useLocale';
import * as Styled from './styles';

export type NotFoundProps = {
  title?: string;
  description?: string;
  fullScreen?: boolean;
};

export const NotFound = ({ title, description, fullScreen = true }: NotFoundProps) => {
  const navigate = useNavigate();
  const { notFound: text } = useLocale();

  return (
    <Styled.Container as={fullScreen ? 'main' : 'div'} $fullScreen={fullScreen}>
      <Styled.Logo src={logoDelas} alt="" />
      <Styled.Code aria-hidden>{text.code}</Styled.Code>
      <Styled.Title>{title ?? text.title}</Styled.Title>
      <Styled.Description>{description ?? text.description}</Styled.Description>
      <Styled.Actions>
        <Button onClick={() => navigate('/', { replace: true })}>{text.backButton}</Button>
      </Styled.Actions>
    </Styled.Container>
  );
};
