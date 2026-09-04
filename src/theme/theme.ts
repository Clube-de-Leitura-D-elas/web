/**
 * Tema do Clube de Leitura D'Elas.
 *
 * As cores vêm da coleção "Cores" do Figma. Cada token é uma chave direta do tema,
 * então dentro de qualquer `styles.ts` você escreve apenas:
 *
 *   background-color: ${({ theme }) => theme.primary};
 *
 * Regra do projeto: NUNCA use hex fixo em componente. Sempre `theme.<cor>`.
 * Se a cor que você precisa não existe aqui, fale com a liderança técnica antes de inventar.
 *
 * Espaçamento, raio e tipografia não são tokens — vão direto no CSS do componente.
 */

export type ThemeMode = 'light' | 'dark';

export type AppTheme = {
  /** Modo ativo. Útil quando um componente precisa se comportar diferente no escuro. */
  mode: ThemeMode;

  /* Fundos */
  /** Fundo da tela. */
  background: string;
  /** Fundo alternativo, para seções que precisam se separar do fundo principal. */
  backgroundSubtle: string;

  /* Superfícies */
  /** Card, modal, painel. */
  surface: string;
  /** Área rebaixada dentro de uma superfície. */
  surfaceSunken: string;
  /** Destaque suave da marca (fundo de tag, badge, banner). */
  surfaceBrandSoft: string;

  /* Bordas */
  /** Borda padrão. */
  border: string;
  /** Borda de ênfase. */
  borderStrong: string;
  /** Borda da marca. */
  borderBrand: string;

  /* Texto */
  /** Texto principal. */
  text: string;
  /** Texto secundário, legenda, placeholder. */
  textMuted: string;
  /** Texto sobre fundo de contraste invertido. */
  textInverse: string;
  /** Texto e link da marca. */
  textBrand: string;
  /** Texto sobre um fundo da cor da marca (ex.: dentro do botão primário). */
  textOnBrand: string;

  /* Sobreposição */
  /** Véu escuro atrás do modal. */
  overlayScrim: string;

  /* Ações */
  /** Botão primário. */
  primary: string;
  /** Botão primário em hover. */
  primaryHover: string;
  /** Botão primário pressionado. */
  primaryPressed: string;
  /** Ação destrutiva (excluir, remover). */
  danger: string;
  /** Fundo de controle desabilitado. */
  disabledBg: string;
  /** Texto/ícone de controle desabilitado. */
  disabledFg: string;
  /** Anel de foco (navegação por teclado). */
  focusRing: string;

  /* Feedback */
  success: string;
  successLight: string;
  successDark: string;
  warning: string;
  warningLight: string;
  warningDark: string;
  error: string;
  errorLight: string;
  errorDark: string;
  info: string;
  infoLight: string;
  infoDark: string;
};

export const lightTheme: AppTheme = {
  mode: 'light',

  background: '#FFFFFF',
  backgroundSubtle: '#FAF8F9',

  surface: '#FFFFFF',
  surfaceSunken: '#F2EFF1',
  surfaceBrandSoft: '#FCE8F0',

  border: '#E4E0E3',
  borderStrong: '#CAC4C8',
  borderBrand: '#E74984',

  text: '#1B171A',
  textMuted: '#7C7379',
  textInverse: '#FFFFFF',
  textBrand: '#A9144B',
  textOnBrand: '#FFFFFF',

  overlayScrim: 'rgba(27, 23, 26, 0.5)',

  primary: '#E6256D',
  primaryHover: '#A9144B',
  primaryPressed: '#64102E',
  danger: '#D92D20',
  disabledBg: '#E4E0E3',
  disabledFg: '#A39BA0',
  focusRing: '#E6256D',

  success: '#1E9E63',
  successLight: '#E4F6ED',
  successDark: '#14764A',
  warning: '#D98E04',
  warningLight: '#FDF3E0',
  warningDark: '#A66B00',
  error: '#D92D20',
  errorLight: '#FCE9E7',
  errorDark: '#A81E14',
  info: '#2563EB',
  infoLight: '#E6EDFD',
  infoDark: '#1D4ED8',
};

/**
 * Modo escuro.
 *
 * O painel "Paleta — Light e Dark" do Figma publica 15 destes valores; outros 5 são
 * idênticos ao light (o Figma não os marca com *). Os 13 marcados com TODO abaixo ainda
 * não existem no Figma em modo escuro — foram derivados seguindo a lógica dos que existem,
 * para que o tema escuro fique completo. Confirme com o design antes de usá-los em tela.
 */
export const darkTheme: AppTheme = {
  mode: 'dark',

  background: '#16131A',
  backgroundSubtle: '#1B171A',

  surface: '#2A2429',
  surfaceSunken: '#1B171A',
  surfaceBrandSoft: '#64102E',

  border: '#413A3E',
  borderStrong: '#5A5257',
  borderBrand: '#E74984',

  text: '#FAF8F9',
  textMuted: '#A39BA0',
  textInverse: '#1B171A', // TODO: confirmar valor dark com o design
  textBrand: '#E74984',
  textOnBrand: '#FFFFFF',

  overlayScrim: 'rgba(0, 0, 0, 0.6)', // TODO: confirmar valor dark com o design

  primary: '#E6256D',
  primaryHover: '#E74984',
  primaryPressed: '#F26FA0', // TODO: confirmar valor dark com o design
  danger: '#D92D20',
  disabledBg: '#413A3E',
  disabledFg: '#7C7379', // TODO: confirmar valor dark com o design
  focusRing: '#E74984', // TODO: confirmar valor dark com o design

  success: '#1E9E63',
  successLight: '#10402A', // TODO: confirmar valor dark com o design
  successDark: '#4ECB92', // TODO: confirmar valor dark com o design
  warning: '#D98E04',
  warningLight: '#4A3306', // TODO: confirmar valor dark com o design
  warningDark: '#E9B44C', // TODO: confirmar valor dark com o design
  error: '#D92D20',
  errorLight: '#4E120D', // TODO: confirmar valor dark com o design
  errorDark: '#F27168', // TODO: confirmar valor dark com o design
  info: '#2563EB',
  infoLight: '#14275C', // TODO: confirmar valor dark com o design
  infoDark: '#7BA3F5', // TODO: confirmar valor dark com o design
};

export const themes: Record<ThemeMode, AppTheme> = {
  light: lightTheme,
  dark: darkTheme,
};
