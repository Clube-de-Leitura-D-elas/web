import { useState, useRef, useEffect, useId, type FocusEvent, type KeyboardEvent } from 'react';
import { TbChevronDown, TbChevronUp } from 'react-icons/tb';
import * as Styled from './styles';

export type DropdownVariants = 'md' | 'lg';

export interface DropdownItemList {
  label: string;
  value: string;
}

export type DropdownProps = {
  options: DropdownItemList[];
  size?: DropdownVariants;
  onSelect: (value: string) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  isError?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
};

export const Dropdown = ({
  options,
  onSelect,
  size = 'md',
  label,
  placeholder = 'Selecione uma opção',
  helperText,
  isError = false,
  disabled = false,
  fullWidth = false,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DropdownItemList | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const pendingFocusIndex = useRef<number | null>(null);

  const baseId = useId();
  const labelId = `${baseId}-label`;
  const valueId = `${baseId}-value`;
  const menuId = `${baseId}-menu`;

  const selectedIndex = options.findIndex((option) => option.value === selectedOption?.value);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelectOption = (option: DropdownItemList) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelect(option.value);
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;

    event.preventDefault();
    if (options.length === 0) return;

    const index = Math.max(selectedIndex, 0);
    if (isOpen) {
      optionRefs.current[index]?.focus();
    } else {
      pendingFocusIndex.current = index;
      setIsOpen(true);
    }
  };

  const handleOptionKeyDown = (event: KeyboardEvent<HTMLLIElement>, index: number) => {
    const lastIndex = options.length - 1;
    const nextIndexByKey: Record<string, number> = {
      ArrowDown: Math.min(index + 1, lastIndex),
      ArrowUp: Math.max(index - 1, 0),
      Home: 0,
      End: lastIndex,
    };

    if (event.key in nextIndexByKey) {
      event.preventDefault();
      optionRefs.current[nextIndexByKey[event.key]]?.focus();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelectOption(options[index]);
      triggerRef.current?.focus();
    }
  };

  const handleWrapperKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Escape' || !isOpen) return;

    event.stopPropagation();
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleWrapperBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (isOpen && !event.currentTarget.contains(event.relatedTarget)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (!isOpen || pendingFocusIndex.current === null) return;

    optionRefs.current[pendingFocusIndex.current]?.focus();
    pendingFocusIndex.current = null;
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <Styled.Wrapper
      ref={dropdownRef}
      $fullWidth={fullWidth}
      onKeyDown={handleWrapperKeyDown}
      onBlur={handleWrapperBlur}
    >
      {label && <Styled.Label id={labelId}>{label}</Styled.Label>}
      <Styled.Field>
        <Styled.Trigger
          ref={triggerRef}
          type="button"
          onClick={handleToggle}
          onKeyDown={handleTriggerKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={isOpen ? menuId : undefined}
          aria-labelledby={label ? `${labelId} ${valueId}` : undefined}
          $size={size}
          $isOpen={isOpen}
          $isError={isError}
          disabled={disabled}
        >
          <Styled.TriggerValue id={valueId}>
            {selectedOption ? selectedOption.label : placeholder}
          </Styled.TriggerValue>
          <Styled.TriggerIcon>{isOpen ? <TbChevronUp /> : <TbChevronDown />}</Styled.TriggerIcon>
        </Styled.Trigger>
        {isOpen && (
          <Styled.Menu id={menuId} role="listbox" aria-labelledby={label ? labelId : undefined}>
            {options.map((option, index) => (
              <Styled.MenuItem
                key={option.value}
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                role="option"
                tabIndex={-1}
                aria-selected={selectedOption?.value === option.value}
                $isSelected={selectedOption?.value === option.value}
                onClick={() => handleSelectOption(option)}
                onKeyDown={(event) => handleOptionKeyDown(event, index)}
              >
                {option.label}
              </Styled.MenuItem>
            ))}
          </Styled.Menu>
        )}
      </Styled.Field>
      {helperText && <Styled.HelperText $isError={isError}>{helperText}</Styled.HelperText>}
    </Styled.Wrapper>
  );
};
