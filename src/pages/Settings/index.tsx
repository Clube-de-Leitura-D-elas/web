import { Tabs } from '../../components/Tab';
import { useLocale } from '../../hooks/useLocale';
import { CitiesSettings } from './CitiesSettings';
import * as Styled from './styles';

export const Settings = () => {
  const { settings: text } = useLocale();

  return (
    <Styled.Container>
      <Styled.Header>
        <Styled.Title>{text.title}</Styled.Title>
        <Styled.Subtitle>{text.subtitle}</Styled.Subtitle>
      </Styled.Header>

      <Tabs tabs={[{ value: 'cities', label: text.tabs.cities, children: <CitiesSettings /> }]} />
    </Styled.Container>
  );
};
