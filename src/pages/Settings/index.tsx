import { useSearchParams } from 'react-router';
import { Tabs } from '../../components/Tab';
import { useLocale } from '../../hooks/useLocale';
import { CitiesSettings } from './CitiesSettings';
import { PasswordSettings } from './PasswordSettings';
import * as Styled from './styles';

const PASSWORD_TAB = 'senha';

export const Settings = () => {
  const { settings: text } = useLocale();
  const [searchParams, setSearchParams] = useSearchParams();

  const active = searchParams.get('aba') === PASSWORD_TAB ? 'password' : 'cities';

  return (
    <Styled.Container>
      <Styled.Header>
        <Styled.Title>{text.title}</Styled.Title>
        <Styled.Subtitle>{text.subtitle}</Styled.Subtitle>
      </Styled.Header>

      <Tabs
        active={active}
        onChange={(value) =>
          setSearchParams(value === 'password' ? { aba: PASSWORD_TAB } : {}, { replace: true })
        }
        tabs={[
          { value: 'cities', label: text.tabs.cities, children: <CitiesSettings /> },
          { value: 'password', label: text.tabs.password, children: <PasswordSettings /> },
        ]}
      />
    </Styled.Container>
  );
};
