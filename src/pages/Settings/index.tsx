import { useSearchParams } from 'react-router';
import { Tabs } from '../../components/Tab';
import { useLocale } from '../../hooks/useLocale';
import { CitiesSettings } from './CitiesSettings';
import { AuthenticationSettings } from './AuthenticationSettings';
import * as Styled from './styles';

const AUTHENTICATION_TAB = 'autenticacao';

export const Settings = () => {
  const { settings: text } = useLocale();
  const [searchParams, setSearchParams] = useSearchParams();

  const active = searchParams.get('aba') === AUTHENTICATION_TAB ? 'authentication' : 'cities';

  return (
    <Styled.Container>
      <Styled.Header>
        <Styled.Title>{text.title}</Styled.Title>
        <Styled.Subtitle>{text.subtitle}</Styled.Subtitle>
      </Styled.Header>

      <Tabs
        active={active}
        onChange={(value) =>
          setSearchParams(value === 'authentication' ? { aba: AUTHENTICATION_TAB } : {}, {
            replace: true,
          })
        }
        tabs={[
          { value: 'cities', label: text.tabs.cities, children: <CitiesSettings /> },
          {
            value: 'authentication',
            label: text.tabs.authentication,
            children: <AuthenticationSettings />,
          },
        ]}
      />
    </Styled.Container>
  );
};
