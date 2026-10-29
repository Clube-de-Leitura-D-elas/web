import type { AnchorHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import { MOBILE_QUERY, TABLET_QUERY } from '../../layouts/DefaultLayout/styles';

type LinkVariant = 'primary' | 'secondary' | 'inverse' | 'inverseOutline';
type LinkSize = 'sm' | 'md' | 'lg';

export type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  $variant: LinkVariant;
  $size: LinkSize;
};

const CONTENT_WIDTH = '72rem';

const contentBox = css`
  width: 100%;
  max-width: ${CONTENT_WIDTH};
  margin: 0 auto;
`;

export const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`;

export const SkipLink = styled.a`
  ${({ theme }) => css`
    position: absolute;
    top: -3rem;
    left: 1rem;
    z-index: 20;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    background-color: ${theme.surface};
    color: ${theme.textBrand};
    font-weight: 700;

    &:focus {
      top: 1rem;
    }
  `}
`;

/* Link com cara de botão: mesma forma do `Button`, mas navega (é <a>, não <button>). */
export const LinkButton = styled.a<LinkButtonProps>`
  ${({ theme, $variant, $size }) => css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border: 1px solid transparent;
    border-radius: 999px;
    font-weight: 700;
    text-decoration: none;
    white-space: nowrap;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    ${
      $size === 'sm' &&
      css`
        height: 2.25rem;
        padding: 0.25rem 1.25rem;
        font-size: 0.875rem;
      `
    }
    ${
      $size === 'md' &&
      css`
        height: 2.75rem;
        padding: 0.5rem 1.5rem;
        font-size: 1rem;
      `
    }
    ${
      $size === 'lg' &&
      css`
        height: 3.25rem;
        padding: 0.75rem 1.75rem;
        font-size: 1rem;
      `
    }

    ${
      $variant === 'primary' &&
      css`
        background-color: ${theme.primary};
        color: ${theme.textOnBrand};
        &:hover {
          background-color: ${theme.primaryHover};
        }
        &:active {
          background-color: ${theme.primaryPressed};
        }
      `
    }
    ${
      $variant === 'secondary' &&
      css`
        background-color: ${theme.surface};
        color: ${theme.textBrand};
        border-color: ${theme.borderBrand};
        &:hover {
          background-color: ${theme.surfaceBrandSoft};
        }
      `
    }
    ${
      $variant === 'inverse' &&
      css`
        background-color: ${theme.surface};
        color: ${theme.textBrand};
        &:hover {
          background-color: ${theme.surfaceBrandSoft};
        }
      `
    }
    ${
      $variant === 'inverseOutline' &&
      css`
        background-color: transparent;
        color: ${theme.textOnBrand};
        border-color: ${theme.textOnBrand};
        &:hover {
          background-color: ${theme.primaryPressed};
        }
      `
    }

    &:focus-visible {
      outline-color: ${$variant.startsWith('inverse') ? theme.textOnBrand : theme.focusRing};
    }

    & > svg {
      flex-shrink: 0;
      width: 1.25em;
      height: 1.25em;
    }

    @media ${MOBILE_QUERY} {
      white-space: normal;
      text-align: center;
      height: auto;
      min-height: ${$size === 'sm' ? '2.25rem' : '3rem'};
    }
  `}
`;

/* Cabeçalho */

export const Header = styled.header`
  ${({ theme }) => css`
    position: sticky;
    top: 0;
    z-index: 10;
    padding: 0.75rem 1.5rem;
    background-color: ${theme.surface};
    border-bottom: 1px solid ${theme.border};

    @media ${MOBILE_QUERY} {
      padding: 0.75rem 1rem;
    }
  `}
`;

export const HeaderInner = styled.div`
  ${contentBox}
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
`;

export const Brand = styled.a`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: ${theme.textBrand};
    font-weight: 700;
    text-decoration: none;

    @media ${MOBILE_QUERY} {
      font-size: 0.875rem;
    }
  `}
`;

export const BrandLogo = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
`;

export const Nav = styled.nav`
  ${({ theme }) => css`
    display: flex;
    gap: 1.5rem;

    a {
      color: ${theme.text};
      font-size: 0.9375rem;
      font-weight: 600;
      text-decoration: none;

      &:hover {
        color: ${theme.textBrand};
      }
    }

    @media ${TABLET_QUERY} {
      display: none;
    }
  `}
`;

/* Hero */

export const Hero = styled.section`
  ${({ theme }) => css`
    padding: 5rem 1.5rem;
    background-color: ${theme.textBrand};
    color: ${theme.textOnBrand};
    scroll-margin-top: 4rem;

    @media ${MOBILE_QUERY} {
      padding: 3rem 1rem;
    }
  `}
`;

export const HeroInner = styled.div`
  ${contentBox}
  display: flex;
  align-items: center;
  gap: 4rem;

  @media ${TABLET_QUERY} {
    flex-direction: column-reverse;
    gap: 2rem;
    text-align: center;
  }
`;

export const HeroText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  @media ${TABLET_QUERY} {
    align-items: center;
  }
`;

export const Eyebrow = styled.p`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const HeroTitle = styled.h1`
  margin: 0;
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.15;

  @media ${TABLET_QUERY} {
    font-size: 2.5rem;
  }

  @media ${MOBILE_QUERY} {
    font-size: 2rem;
  }
`;

export const HeroDescription = styled.p`
  max-width: 36rem;
  margin: 0;
  font-size: 1.125rem;
  line-height: 1.6;
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;

  @media ${TABLET_QUERY} {
    justify-content: center;
  }

  @media ${MOBILE_QUERY} {
    flex-direction: column;
    width: 100%;
  }
`;

export const HeroLogo = styled.img`
  ${({ theme }) => css`
    width: 18rem;
    height: 18rem;
    flex-shrink: 0;
    border-radius: 50%;
    object-fit: cover;
    background-color: ${theme.surface};
    border: 0.5rem solid ${theme.primary};

    @media ${TABLET_QUERY} {
      width: 10rem;
      height: 10rem;
      border-width: 0.25rem;
    }
  `}
`;

/* Números */

export const Stats = styled.section`
  ${({ theme }) => css`
    ${contentBox}
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-top: -2.5rem;
    padding: 1.5rem;
    border-radius: 1rem;
    background-color: ${theme.surface};
    border: 1px solid ${theme.border};
    position: relative;

    @media (max-width: ${CONTENT_WIDTH}) {
      width: calc(100% - 3rem);
    }

    @media ${MOBILE_QUERY} {
      grid-template-columns: repeat(2, 1fr);
      width: calc(100% - 2rem);
      padding: 1rem;
    }
  `}
`;

export const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  text-align: center;
`;

export const StatValue = styled.p`
  ${({ theme }) => css`
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.2;
    color: ${theme.textBrand};

    @media ${MOBILE_QUERY} {
      font-size: 1.5rem;
    }
  `}
`;

export const StatLabel = styled.p`
  ${({ theme }) => css`
    margin: 0;
    font-size: 0.875rem;
    color: ${theme.textMuted};
  `}
`;

/* Seções */

export const Section = styled.section<{ $subtle?: boolean }>`
  ${({ theme, $subtle }) => css`
    padding: 5rem max(1.5rem, calc((100% - ${CONTENT_WIDTH}) / 2));
    background-color: ${$subtle ? theme.backgroundSubtle : theme.background};
    scroll-margin-top: 4rem;

    @media ${MOBILE_QUERY} {
      padding: 3rem 1rem;
    }
  `}
`;

export const SectionTitle = styled.h2<{ $inverse?: boolean }>`
  ${({ theme, $inverse }) => css`
    margin: 0 0 1rem;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.25;
    color: ${$inverse ? theme.textOnBrand : theme.text};

    @media ${MOBILE_QUERY} {
      font-size: 1.5rem;
    }
  `}
`;

export const SectionDescription = styled.p`
  ${({ theme }) => css`
    max-width: 44rem;
    margin: 0 0 2.5rem;
    font-size: 1.125rem;
    color: ${theme.text};
  `}
`;

export const SubTitle = styled.h3`
  ${({ theme }) => css`
    margin: 3rem 0 1.5rem;
    font-size: 1.375rem;
    font-weight: 700;
    color: ${theme.text};
  `}
`;

export const Grid = styled.div<{ $columns: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns}, 1fr);
  gap: 1.5rem;
  margin-top: 1.5rem;

  @media ${TABLET_QUERY} {
    grid-template-columns: repeat(${({ $columns }) => Math.min($columns, 2)}, 1fr);
  }

  @media ${MOBILE_QUERY} {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.article`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.75rem;
    border-radius: 1rem;
    background-color: ${theme.surfaceBrandSoft};
    border-top: 0.25rem solid ${theme.primary};

    /* textMuted não atinge 4.5:1 sobre o rosa; aqui o texto usa a cor principal. */
    p {
      color: ${theme.text};
    }
  `}
`;

export const ValueCard = styled.article`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.5rem;
    border-radius: 1rem;
    background-color: ${theme.surface};
    border: 1px solid ${theme.border};
  `}
`;

export const CardTitle = styled.h3`
  ${({ theme }) => css`
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;
    color: ${theme.text};
  `}
`;

export const CardText = styled.p`
  ${({ theme }) => css`
    margin: 0;
    font-size: 1rem;
    line-height: 1.6;
    color: ${theme.textMuted};
  `}
`;

export const IconBadge = styled.span`
  ${({ theme }) => css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    background-color: ${theme.surfaceBrandSoft};
    color: ${theme.textBrand};

    svg {
      width: 1.375rem;
      height: 1.375rem;
    }
  `}
`;

export const Steps = styled.ol`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;

  @media ${TABLET_QUERY} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${MOBILE_QUERY} {
    grid-template-columns: 1fr;
  }
`;

export const Step = styled.li`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.5rem;
    border-radius: 1rem;
    background-color: ${theme.surface};
    border: 1px solid ${theme.border};
  `}
`;

export const Quote = styled.blockquote`
  ${({ theme }) => css`
    margin: 2.5rem 0 0;
    padding: 1.25rem 1.5rem;
    border-left: 0.25rem solid ${theme.primary};
    background-color: ${theme.surface};
    border-radius: 0 0.75rem 0.75rem 0;
    font-size: 1.125rem;
    font-style: italic;
    color: ${theme.text};
  `}
`;

export const CheckList = styled.ul`
  ${({ theme }) => css`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      position: relative;
      padding: 1rem 1rem 1rem 3rem;
      border-radius: 0.75rem;
      background-color: ${theme.surface};
      border: 1px solid ${theme.border};
      color: ${theme.text};
    }

    li::before {
      content: '✓';
      position: absolute;
      left: 1rem;
      top: 1rem;
      color: ${theme.textBrand};
      font-weight: 700;
    }

    @media ${MOBILE_QUERY} {
      grid-template-columns: 1fr;
    }
  `}
`;

export const Highlight = styled.p`
  ${({ theme }) => css`
    max-width: 48rem;
    margin: 0 0 2rem;
    padding: 1.5rem;
    border-radius: 1rem;
    background-color: ${theme.surfaceBrandSoft};
    color: ${theme.textBrand};
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.5;
  `}
`;

export const NumberedList = styled.ol`
  ${({ theme }) => css`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem 2rem;
    margin: 0;
    padding: 0;
    list-style: none;
    counter-reset: combinado;

    li {
      display: flex;
      align-items: baseline;
      gap: 1rem;
      counter-increment: combinado;
      font-size: 1.0625rem;
      color: ${theme.text};
    }

    li::before {
      content: counter(combinado, decimal-leading-zero);
      flex-shrink: 0;
      color: ${theme.textBrand};
      font-size: 1.25rem;
      font-weight: 700;
    }

    @media ${MOBILE_QUERY} {
      grid-template-columns: 1fr;
    }
  `}
`;

export const ProjectCard = styled.article`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 2rem;
    border-radius: 1rem;
    background-color: ${theme.surface};
    border: 1px solid ${theme.border};

    ${CardText} {
      flex: 1;
    }

    @media ${MOBILE_QUERY} {
      padding: 1.5rem;

      ${LinkButton} {
        width: 100%;
      }
    }
  `}
`;

export const Pill = styled.span`
  ${({ theme }) => css`
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    background-color: ${theme.surfaceBrandSoft};
    color: ${theme.textBrand};
    font-size: 0.8125rem;
    font-weight: 700;
  `}
`;

export const StateList = styled.ul`
  ${({ theme }) => css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
    gap: 1rem;
    margin: 1.5rem 0 0;
    padding: 0;
    list-style: none;

    li {
      display: flex;
      gap: 0.75rem;
      padding: 1.25rem;
      border-radius: 0.75rem;
      border: 1px solid ${theme.border};
    }

    li > svg {
      flex-shrink: 0;
      width: 1.25rem;
      height: 1.25rem;
      margin-top: 0.125rem;
      color: ${theme.textBrand};
    }
  `}
`;

export const StateName = styled.p`
  ${({ theme }) => css`
    margin: 0 0 0.25rem;
    font-weight: 700;
    color: ${theme.text};
  `}
`;

/* Fechamento */

export const Closing = styled.section`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 5rem 1.5rem;
    background-color: ${theme.textBrand};
    color: ${theme.textOnBrand};
    text-align: center;

    @media ${MOBILE_QUERY} {
      padding: 3rem 1rem;

      ${LinkButton} {
        width: 100%;
      }
    }
  `}
`;

export const ClosingText = styled.p`
  max-width: 40rem;
  margin: 0 0 1rem;
  font-size: 1.125rem;
  line-height: 1.6;
`;

/* Rodapé */

export const Footer = styled.footer`
  ${({ theme }) => css`
    padding: 2rem 1.5rem;
    background-color: ${theme.text};
    color: ${theme.textInverse};

    ${Brand} {
      color: ${theme.textInverse};
    }

    @media ${MOBILE_QUERY} {
      padding: 2rem 1rem;
    }
  `}
`;

export const FooterInner = styled.div`
  ${contentBox}
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;

  @media ${TABLET_QUERY} {
    flex-direction: column;
    text-align: center;
  }
`;

export const FooterLinks = styled.nav`
  ${({ theme }) => css`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;

    a {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: ${theme.textInverse};
      font-weight: 600;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }

      &:focus-visible {
        outline-color: ${theme.textInverse};
      }
    }

    svg {
      width: 1.25rem;
      height: 1.25rem;
    }
  `}
`;
