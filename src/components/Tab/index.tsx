import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import * as Styled from './styles';

export type TabSize = 'md' | 'lg';

export type Tab = {
  /** Identificador único da aba, usado para saber qual está ativa. */
  value: string;
  /** Texto exibido no botão da aba (ex.: "Participantes (3)"). */
  label: string;
  /** Conteúdo exibido quando essa aba está ativa. Pode ser qualquer coisa: texto, componente, tabela, lista etc. */
  children: ReactNode;
  disabled?: boolean;
};

export type TabsProps = {
  tabs: Tab[];
  /** Aba ativa (uso controlado). Se informado, o componente para de controlar o próprio estado. */
  active?: string;
  /** Aba ativa inicial (uso não controlado). Ignorado se `active` for informado. */
  defaultActive?: string;
  /** Chamado sempre que o usuário troca de aba. */
  onChange?: (value: string) => void;
  size?: TabSize;
};

export const Tabs = ({ tabs, active, defaultActive, onChange, size = 'md' }: TabsProps) => {
  const isControlled = active !== undefined;

  const [internalActive, setInternalActive] = useState<string | undefined>(
    defaultActive ?? tabs[0]?.value,
  );

  const activeValue = isControlled ? active : internalActive;
  const activeTab = tabs.find((tab) => tab.value === activeValue);

  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const selectTab = (value: string) => {
    if (!isControlled) {
      setInternalActive(value);
    }
    onChange?.(value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const enabledTabs = tabs.filter((tab) => !tab.disabled);
    if (enabledTabs.length === 0) return;

    const currentIndex = enabledTabs.findIndex((tab) => tab.value === activeValue);
    let nextIndex: number;

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % enabledTabs.length;
        break;
      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = enabledTabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const nextTab = enabledTabs[nextIndex];
    selectTab(nextTab.value);
    tabRefs.current[nextTab.value]?.focus();
  };

  return (
    <Styled.Wrapper>
      <Styled.TabList role="tablist" $size={size} onKeyDown={handleKeyDown}>
        {tabs.map((tab) => {
          const isActive = tab.value === activeValue;

          return (
            <Styled.TabButton
              key={tab.value}
              ref={(node) => {
                tabRefs.current[tab.value] = node;
              }}
              type="button"
              role="tab"
              id={`tab-${tab.value}`}
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.value}`}
              tabIndex={isActive ? 0 : -1}
              disabled={tab.disabled}
              $active={isActive}
              $size={size}
              onClick={() => selectTab(tab.value)}
            >
              {tab.label}
            </Styled.TabButton>
          );
        })}
      </Styled.TabList>

      {activeTab && (
        <Styled.Panel
          role="tabpanel"
          id={`tabpanel-${activeTab.value}`}
          aria-labelledby={`tab-${activeTab.value}`}
        >
          {activeTab.children}
        </Styled.Panel>
      )}
    </Styled.Wrapper>
  );
};
