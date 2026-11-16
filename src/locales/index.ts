/**
 * Textos da aplicação.
 *
 * Todo texto fixo de componente vem de `pt-BR.json`, nunca escrito direto no JSX:
 *
 *   import { locale } from '../../locales';
 *   <p>{locale.table.empty}</p>
 *
 * Para textos com variáveis, use `{{nome}}` no JSON e preencha com `interpolate`:
 *
 *   interpolate(locale.table.goToPage, { page: 2 }); // "Ir para a página 2"
 */
import { formatNumber } from '../utils/number';
import ptBR from './pt-BR.json';

export const locale = ptBR;

export const interpolate = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{\{(\w+)\}\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );

// O número entra com separador de milhar (1.234), como o resto da interface.
export const pluralize = (forms: { one: string; other: string }, count: number) =>
  interpolate(count === 1 ? forms.one : forms.other, { count: formatNumber(count) });
