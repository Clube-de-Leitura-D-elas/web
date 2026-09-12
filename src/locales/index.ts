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
import ptBR from './pt-BR.json';

export const locale = ptBR;

export const interpolate = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{\{(\w+)\}\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
