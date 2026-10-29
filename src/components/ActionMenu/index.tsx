import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
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

const MENU_GAP = 4;

type MenuPosition = { top: number; right: number };

export const ActionMenu = ({ items, ariaLabel = 'Mais ações' }: ActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // O menu é `fixed` para não ser cortado por um pai com overflow (ex.: a Table).
  // Abre para cima quando não cabe abaixo do botão.
  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current || !menuRef.current) {
      setPosition(null);
      return;
    }
    const trigger = triggerRef.current.getBoundingClientRect();
    const menuHeight = menuRef.current.offsetHeight;
    const below = trigger.bottom + MENU_GAP;
    const above = trigger.top - MENU_GAP - menuHeight;
    const fitsBelow = below + menuHeight <= window.innerHeight;
    setPosition({
      top: fitsBelow || above < 0 ? below : above,
      right: window.innerWidth - trigger.right,
    });
  }, [isOpen]);

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

    // a posição é calculada na abertura; rolar ou redimensionar fecha o menu
    const close = () => setIsOpen(false);

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [isOpen]);

  return (
    <Styled.Container ref={containerRef}>
      <Styled.TriggerButton
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <IoMdMore />
      </Styled.TriggerButton>

      {isOpen && (
        <Styled.MenuDropdown
          ref={menuRef}
          style={
            position
              ? { top: position.top, right: position.right }
              : { visibility: 'hidden', top: 0, right: 0 }
          }
        >
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
