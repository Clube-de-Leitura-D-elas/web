import { useState } from 'react';
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
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DropdownItemList | null>(null);

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

  return (
    <Styled.Wrapper>
      {label && <Styled.Label>{label}</Styled.Label>}
      <Styled.Trigger
        type="button"
        onClick={handleToggle}
        $size={size}
        $isOpen={isOpen}
        disabled={disabled}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <span>{isOpen ? <TbChevronUp /> : <TbChevronDown />}</span>
      </Styled.Trigger>
      {isOpen && (
        <Styled.Menu>
          {options.map((option) => (
            <Styled.MenuItem
              key={option.value}
              $isSelected={selectedOption?.value === option.value}
              onClick={() => handleSelectOption(option)}
            >
              {option.label}
            </Styled.MenuItem>
          ))}
        </Styled.Menu>
      )}
      {helperText && <Styled.HelperText $isError={isError}>{helperText}</Styled.HelperText>}
    </Styled.Wrapper>
  );
};
