import { useEffect, useState } from 'react';
import { LuMenu } from 'react-icons/lu';
import { Outlet } from 'react-router';
import logoDelas from '../../assets/logo-delas.png';
import { Sidebar, type SidebarUser } from '../../components/Sidebar/Sidebar';
import { useLocale } from '../../hooks/useLocale';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import * as Styled from './styles';

// Provisório: trocar pela usuária logada quando a autenticação existir.
const CURRENT_USER: SidebarUser = { name: 'Claudine' };

type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export const DefaultLayout = () => {
  const isMobile = useMediaQuery(Styled.MOBILE_QUERY);
  const isTablet = useMediaQuery(Styled.TABLET_QUERY);
  const breakpoint: Breakpoint = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';

  const [collapsed, setCollapsed] = useState(breakpoint === 'tablet');
  const [menuOpen, setMenuOpen] = useState(false);
  const [prevBreakpoint, setPrevBreakpoint] = useState(breakpoint);
  const { layout: text, sidebar: sidebarText } = useLocale();

  if (breakpoint !== prevBreakpoint) {
    setPrevBreakpoint(breakpoint);
    setCollapsed(breakpoint === 'tablet');
    setMenuOpen(false);
  }

  const drawerOpen = isMobile && menuOpen;
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!drawerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    const previousOverflow = document.body.style.overflow;

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [drawerOpen]);

  return (
    <Styled.Container>
      <Styled.TopBar>
        <Styled.MenuButton
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-expanded={drawerOpen}
          aria-label={text.openMenu}
        >
          <LuMenu aria-hidden />
        </Styled.MenuButton>
        <Styled.TopBarLogo src={logoDelas} alt="" />
        <Styled.TopBarBrand>{sidebarText.brand.name}</Styled.TopBarBrand>
      </Styled.TopBar>

      <Styled.Scrim $open={drawerOpen} onClick={closeMenu} aria-hidden />

      <Styled.SidebarSlot $open={drawerOpen} inert={isMobile && !menuOpen}>
        <Sidebar
          user={CURRENT_USER}
          collapsed={isMobile ? false : collapsed}
          onToggleCollapse={isMobile ? closeMenu : () => setCollapsed((value) => !value)}
          onNavigate={closeMenu}
        />
      </Styled.SidebarSlot>

      <Styled.Content>
        <Outlet />
      </Styled.Content>
    </Styled.Container>
  );
};
