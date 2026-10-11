import styled from 'styled-components';
import { Button } from '../Button';

export const Container = styled(Button)`
  display: flex;
  align-self: flex-start;
  justify-content: flex-start;
  width: fit-content;
  padding: 0;
  font-size: 1rem;

  &:hover:not(:disabled),
  &:active:not(:disabled) {
    background-color: transparent;
  }
`;
