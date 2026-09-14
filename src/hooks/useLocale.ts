import ptBR from '../locales/pt-BR.json';

export type Messages = typeof ptBR;

export const messages: Messages = ptBR;

export const useLocale = (): Messages => messages;
