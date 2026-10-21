import { Link } from 'react-router';
import {
  LuArrowRight,
  LuBookOpen,
  LuCalendarDays,
  LuEar,
  LuHandHeart,
  LuInstagram,
  LuLandmark,
  LuMapPin,
  LuMessagesSquare,
  LuPlay,
  LuSearch,
  LuSparkles,
  LuUserRound,
  LuUsers,
} from 'react-icons/lu';
import logoDelas from '../../assets/logo-delas.png';
import { locale } from '../../locales';
import { LANDING_LINKS } from './links';
import * as Styled from './styles';

const text = locale.landing;

const SECTION_IDS = {
  about: 'o-clube',
  howItWorks: 'como-funciona',
  agreements: 'combinados',
  projects: 'projetos',
  where: 'onde-estamos',
} as const;

const valueIcons = [LuBookOpen, LuSparkles, LuEar, LuHandHeart, LuSearch];
const stepIcons = [LuUsers, LuUserRound, LuBookOpen, LuCalendarDays, LuMessagesSquare];

const ExternalLink = ({ href, children, ...props }: Styled.LinkButtonProps) => (
  <Styled.LinkButton href={href} target="_blank" rel="noopener noreferrer" {...props}>
    {children}
    <Styled.VisuallyHidden> {text.projects.opensInNewTab}</Styled.VisuallyHidden>
  </Styled.LinkButton>
);

export const Landing = () => (
  <>
    <Styled.SkipLink href="#conteudo">{text.skipToContent}</Styled.SkipLink>

    <Styled.Header>
      <Styled.HeaderInner>
        <Styled.Brand href="#topo">
          <Styled.BrandLogo src={logoDelas} alt="" />
          <span>{text.header.brand}</span>
        </Styled.Brand>
        <Styled.Nav aria-label={text.header.navLabel}>
          {(Object.keys(SECTION_IDS) as (keyof typeof SECTION_IDS)[]).map((key) => (
            <a key={key} href={`#${SECTION_IDS[key]}`}>
              {text.header.nav[key]}
            </a>
          ))}
        </Styled.Nav>
        <ExternalLink href={LANDING_LINKS.readingSignUp} $variant="primary" $size="sm">
          {text.header.signUp}
        </ExternalLink>
      </Styled.HeaderInner>
    </Styled.Header>

    <main id="conteudo">
      <Styled.Hero id="topo">
        <Styled.HeroInner>
          <Styled.HeroText>
            <Styled.Eyebrow>{text.hero.eyebrow}</Styled.Eyebrow>
            <Styled.HeroTitle>{text.hero.title}</Styled.HeroTitle>
            <Styled.HeroDescription>{text.hero.description}</Styled.HeroDescription>
            <Styled.Actions>
              <ExternalLink href={LANDING_LINKS.readingSignUp} $variant="inverse" $size="lg">
                {text.hero.primaryCta}
                <LuArrowRight aria-hidden />
              </ExternalLink>
              <Styled.LinkButton
                href={`#${SECTION_IDS.howItWorks}`}
                $variant="inverseOutline"
                $size="lg"
              >
                {text.hero.secondaryCta}
              </Styled.LinkButton>
            </Styled.Actions>
          </Styled.HeroText>
          <Styled.HeroLogo src={logoDelas} alt={text.hero.logoAlt} />
        </Styled.HeroInner>
      </Styled.Hero>

      <Styled.Stats aria-label={text.stats.label}>
        {text.stats.items.map((item) => (
          <Styled.Stat key={item.label}>
            <Styled.StatValue>{item.value}</Styled.StatValue>
            <Styled.StatLabel>{item.label}</Styled.StatLabel>
          </Styled.Stat>
        ))}
      </Styled.Stats>

      <Styled.Section id={SECTION_IDS.about} aria-labelledby="titulo-proposito">
        <Styled.SectionTitle id="titulo-proposito">{text.purpose.title}</Styled.SectionTitle>
        <Styled.Grid $columns={3}>
          {text.purpose.items.map((item) => (
            <Styled.Card key={item.title}>
              <Styled.CardTitle>{item.title}</Styled.CardTitle>
              <Styled.CardText>{item.text}</Styled.CardText>
            </Styled.Card>
          ))}
        </Styled.Grid>

        <Styled.SubTitle>{text.purpose.valuesTitle}</Styled.SubTitle>
        <Styled.Grid $columns={5}>
          {text.purpose.values.map((value, index) => {
            const Icon = valueIcons[index];
            return (
              <Styled.ValueCard key={value.title}>
                <Styled.IconBadge aria-hidden>
                  <Icon />
                </Styled.IconBadge>
                <Styled.CardTitle>{value.title}</Styled.CardTitle>
                <Styled.CardText>{value.text}</Styled.CardText>
              </Styled.ValueCard>
            );
          })}
        </Styled.Grid>
      </Styled.Section>

      <Styled.Section id={SECTION_IDS.howItWorks} $subtle aria-labelledby="titulo-como-funciona">
        <Styled.SectionTitle id="titulo-como-funciona">{text.howItWorks.title}</Styled.SectionTitle>
        <Styled.SectionDescription>{text.howItWorks.description}</Styled.SectionDescription>
        <Styled.Steps>
          {text.howItWorks.steps.map((step, index) => {
            const Icon = stepIcons[index];
            return (
              <Styled.Step key={step.title}>
                <Styled.IconBadge aria-hidden>
                  <Icon />
                </Styled.IconBadge>
                <Styled.CardTitle>{step.title}</Styled.CardTitle>
                <Styled.CardText>{step.text}</Styled.CardText>
              </Styled.Step>
            );
          })}
        </Styled.Steps>
        <Styled.Quote>{text.howItWorks.quote}</Styled.Quote>

        <Styled.SubTitle>{text.howItWorks.participationTitle}</Styled.SubTitle>
        <Styled.CheckList>
          {text.howItWorks.participation.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </Styled.CheckList>
      </Styled.Section>

      <Styled.Section id={SECTION_IDS.agreements} aria-labelledby="titulo-combinados">
        <Styled.SectionTitle id="titulo-combinados">{text.agreements.title}</Styled.SectionTitle>
        <Styled.Highlight>{text.agreements.highlight}</Styled.Highlight>
        <Styled.NumberedList>
          {text.agreements.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </Styled.NumberedList>
      </Styled.Section>

      <Styled.Section id={SECTION_IDS.projects} $subtle aria-labelledby="titulo-projetos">
        <Styled.SectionTitle id="titulo-projetos">{text.projects.title}</Styled.SectionTitle>
        <Styled.Grid $columns={2}>
          <Styled.ProjectCard>
            <Styled.IconBadge aria-hidden>
              <LuBookOpen />
            </Styled.IconBadge>
            <Styled.CardTitle as="h3">{text.projects.reading.title}</Styled.CardTitle>
            <Styled.Pill>{text.projects.reading.tag}</Styled.Pill>
            <Styled.CardText>{text.projects.reading.text}</Styled.CardText>
            <ExternalLink href={LANDING_LINKS.readingSignUp} $variant="primary" $size="md">
              {text.projects.reading.cta}
            </ExternalLink>
          </Styled.ProjectCard>
          <Styled.ProjectCard>
            <Styled.IconBadge aria-hidden>
              <LuLandmark />
            </Styled.IconBadge>
            <Styled.CardTitle as="h3">{text.projects.political.title}</Styled.CardTitle>
            <Styled.Pill>{text.projects.political.tag}</Styled.Pill>
            <Styled.CardText>{text.projects.political.text}</Styled.CardText>
            <ExternalLink href={LANDING_LINKS.politicalSignUp} $variant="secondary" $size="md">
              {text.projects.political.cta}
            </ExternalLink>
          </Styled.ProjectCard>
        </Styled.Grid>
      </Styled.Section>

      <Styled.Section id={SECTION_IDS.where} aria-labelledby="titulo-onde">
        <Styled.SectionTitle id="titulo-onde">{text.where.title}</Styled.SectionTitle>
        <Styled.StateList>
          {text.where.states.map((state) => (
            <li key={state.name}>
              <LuMapPin aria-hidden />
              <div>
                <Styled.StateName>{state.name}</Styled.StateName>
                <Styled.CardText>{state.cities}</Styled.CardText>
              </div>
            </li>
          ))}
        </Styled.StateList>
      </Styled.Section>

      <Styled.Closing aria-labelledby="titulo-boas-vindas">
        <Styled.SectionTitle id="titulo-boas-vindas" $inverse>
          {text.closing.title}
        </Styled.SectionTitle>
        <Styled.ClosingText>{text.closing.text}</Styled.ClosingText>
        <ExternalLink href={LANDING_LINKS.readingSignUp} $variant="inverse" $size="lg">
          {text.closing.cta}
          <LuArrowRight aria-hidden />
        </ExternalLink>
      </Styled.Closing>
    </main>

    <Styled.Footer>
      <Styled.FooterInner>
        <Styled.Brand as="div">
          <Styled.BrandLogo src={logoDelas} alt="" />
          <span>{text.footer.copyright}</span>
        </Styled.Brand>
        <Styled.FooterLinks aria-label={text.footer.socialTitle}>
          <a href={LANDING_LINKS.instagram} target="_blank" rel="noopener noreferrer">
            <LuInstagram aria-hidden />
            {text.footer.instagram}
            <Styled.VisuallyHidden> {text.projects.opensInNewTab}</Styled.VisuallyHidden>
          </a>
          <a href={LANDING_LINKS.video} target="_blank" rel="noopener noreferrer">
            <LuPlay aria-hidden />
            {text.footer.video}
            <Styled.VisuallyHidden> {text.projects.opensInNewTab}</Styled.VisuallyHidden>
          </a>
          <Link to="/login">{text.footer.adminLogin}</Link>
        </Styled.FooterLinks>
      </Styled.FooterInner>
    </Styled.Footer>
  </>
);
