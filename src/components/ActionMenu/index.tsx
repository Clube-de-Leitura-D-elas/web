import { useEffect, useRef, useState, type ReactNode } from 'react';
import { IoMdMore } from 'react-icons/io';
import * as Styled from './styles';

export type ActionItem = {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
};

export type ActionMenuProps = {
  items: ActionItem[];
  ariaLabel?: string;
};

export const ActionMenu = ({ items, ariaLabel = 'Mais ações' }: ActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <Styled.Container ref={containerRef}>
      <Styled.TriggerButton
        type="button"
        aria-label={ariaLabel}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <IoMdMore />
      </Styled.TriggerButton>

      {isOpen && (
        <Styled.MenuDropdown>
          {items.map((item, index) => (
            <Styled.MenuItem
              key={index}
              type="button"
              role="menuitem"
              $variant={item.variant}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Styled.MenuItem>
          ))}
        </Styled.MenuDropdown>
      )}
    </Styled.Container>
  );
};
