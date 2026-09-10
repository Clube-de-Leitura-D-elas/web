import { useState } from 'react';
import type { IconType } from 'react-icons';
import {
  LuBookOpen,
  LuCalendarDays,
  LuLayoutDashboard,
  LuLogOut,
  LuSettings,
  LuUsersRound,
} from 'react-icons/lu';
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from 'react-icons/tb';
import logoDelas from '../../assets/logo-delas.png';
import { useLocale, type Messages } from '../../hooks/useLocale';
import * as Styled from './styles';

type NavItem = {
  path: string;
  labelKey: keyof Messages['sidebar']['nav'];
  icon: IconType;
};

const NAV_ITEMS: NavItem[] = [
  { path: '/', labelKey: 'dashboard', icon: LuLayoutDashboard },
  { path: '/calendario', labelKey: 'calendario', icon: LuCalendarDays },
  { path: '/grupos', labelKey: 'grupos', icon: LuBookOpen },
  { path: '/participantes', labelKey: 'participantes', icon: LuUsersRound },
  { path: '/configuracoes', labelKey: 'configuracoes', icon: LuSettings },
];

export type SidebarUser = {
  name: string;
  initial?: string;
};

export type SidebarProps = {
  user: SidebarUser;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  defaultCollapsed?: boolean;
  onLogout?: () => void;
  /** Chamado ao clicar em um item do menu (ex.: para fechar o menu no celular). */
  onNavigate?: () => void;
};

export const Sidebar = ({
  user,
  collapsed,
  onToggleCollapse,
  defaultCollapsed = false,
  onLogout,
  onNavigate,
}: SidebarProps) => {
  const [selfCollapsed, setSelfCollapsed] = useState(defaultCollapsed);
  const { sidebar: text } = useLocale();

  const isCollapsed = collapsed ?? selfCollapsed;

  const handleToggle = () => {
    if (collapsed === undefined) setSelfCollapsed((value) => !value);
    onToggleCollapse?.();
  };

  const userDetails = (
    <>
      <Styled.UserName>{user.name}</Styled.UserName>
      <Styled.LogoutButton type="button" onClick={onLogout}>
        <LuLogOut aria-hidden />
        <Styled.LogoutLabel>{text.logout}</Styled.LogoutLabel>
      </Styled.LogoutButton>
    </>
  );

  return (
    <Styled.Container $collapsed={isCollapsed} aria-label={text.label}>
      <Styled.ToggleButton
        type="button"
        onClick={handleToggle}
        aria-expanded={!isCollapsed}
        aria-label={isCollapsed ? text.toggle.expand : text.toggle.collapse}
      >
        {isCollapsed ? (
          <TbLayoutSidebarLeftExpand aria-hidden />
        ) : (
          <TbLayoutSidebarLeftCollapse aria-hidden />
        )}
      </Styled.ToggleButton>

      <Styled.Top>
        <Styled.Brand>
          <Styled.Logo src={logoDelas} alt={text.logoAlt} $collapsed={isCollapsed} />
          <Styled.BrandText $collapsed={isCollapsed}>
            <Styled.BrandName>{text.brand.name}</Styled.BrandName>
            <Styled.BrandSubtitle>{text.brand.subtitle}</Styled.BrandSubtitle>
          </Styled.BrandText>
        </Styled.Brand>

        <Styled.Nav>
          {/* O NavLink marca o item da rota atual com aria-current="page", e o estilo
              de ativo parte desse atributo. `end` no "/" evita que o Dashboard fique
              ativo em todas as rotas. */}
          {NAV_ITEMS.map(({ path, labelKey, icon: Icon }) => {
            const label = text.nav[labelKey];

            return (
              <Styled.Item
                key={path}
                to={path}
                end={path === '/'}
                onClick={onNavigate}
                title={isCollapsed ? label : undefined}
              >
                <Icon aria-hidden />
                <Styled.ItemLabel $collapsed={isCollapsed}>{label}</Styled.ItemLabel>
              </Styled.Item>
            );
          })}

          <Styled.Divider $collapsed={isCollapsed} />
        </Styled.Nav>
      </Styled.Top>

      <Styled.UserArea>
        <Styled.User>
          <Styled.Avatar aria-hidden>{user.initial ?? user.name.trim().charAt(0)}</Styled.Avatar>

          <Styled.UserInfo $collapsed={isCollapsed}>{userDetails}</Styled.UserInfo>
        </Styled.User>

        {isCollapsed && <Styled.Popover>{userDetails}</Styled.Popover>}
      </Styled.UserArea>
    </Styled.Container>
  );
};
