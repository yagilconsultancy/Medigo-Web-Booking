'use client';

import { ReactNode } from 'react';
import { AppBar, Box, Toolbar } from '@mui/material';
import { AppLogo } from '../../components';

export type AppHeaderProps = {
  showRightContent?: boolean;
  rightContent?: ReactNode;
};

export function AppHeader({
  showRightContent = true,
  rightContent,
}: AppHeaderProps) {
  // const [open, setOpen] = useState(false);
  // const [activeSection, setActiveSection] = useState<string | null>(null);
  // const pathname = usePathname();

  // const closeDrawer = () => setOpen(false);
  // const isActiveNavItem = (item: (typeof navItems)[number]) =>
  //   pathname === item.href ||
  //   (pathname === '/' && activeSection === item.section);

  // const navLinkStyles = (isActive: boolean) => ({
  //   position: 'relative',
  //   display: 'inline-flex',
  //   alignItems: 'center',
  //   textDecoration: 'none',
  //   color: (theme: any) =>
  //     isActive ? theme.color.brandBlue : theme.color.navText,
  //   fontSize: pxToRem(16),
  //   fontWeight: isActive ? 500 : 400,
  //   lineHeight: 1.5,
  //   transition: 'color 180ms ease, font-weight 180ms ease',
  //   '&:hover': {
  //     color: (theme: any) => theme.color.brandBlue,
  //     fontWeight: 500,
  //     '&::after': {
  //       transform: 'scaleX(1)',
  //     },
  //   },
  //   '&::after': {
  //     content: '""',
  //     position: 'absolute',
  //     left: 0,
  //     bottom: '-4px',
  //     width: '100%',
  //     height: '2px',
  //     backgroundColor: (theme: any) => theme.color.brandBlue,
  //     transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
  //     transformOrigin: 'left center',
  //     transition: 'transform 220ms ease',
  //   },
  // });

  // useEffect(() => {
  //   if (pathname !== '/') {
  //     setActiveSection(null);
  //     return;
  //   }

  //   const elements = navItems
  //     .map((item) => document.getElementById(item.section))
  //     .filter((element): element is HTMLElement => Boolean(element));

  //   if (elements.length === 0) return;

  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       const visible = entries.filter((entry) => entry.isIntersecting);
  //       if (!visible.length) return;

  //       const mostVisible = visible.sort(
  //         (a, b) => b.intersectionRatio - a.intersectionRatio
  //       )[0];

  //       setActiveSection(mostVisible.target.id);
  //     },
  //     { threshold: [0.35, 0.5, 0.65] }
  //   );

  //   elements.forEach((element) => observer.observe(element));
  //   return () => observer.disconnect();
  // }, [pathname]);

  return (
    <AppBar
      sx={{
        backgroundColor: (theme) => theme.palette.common.white,
        color: (theme) => theme.palette.text.primary,
        boxShadow: 'none',
        position: 'sticky',
        top: 0,
        maxWidth: '1920px',
        zIndex: (theme) => theme.zIndex.appBar + 1,
        mx: 'auto',
        borderBottom: '0.667px solid',
        borderBottomColor: (theme) => theme.palette.divider,
      }}
      elevation={0}
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: { xs: 64, md: 64 },
          px: { xs: 2, sm: 3 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box
          sx={{
            flex: 1,
            width: '100%',
            maxWidth: '1920px',
            mx: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', flexShrink: 0, alignItems: 'center' }}>
            <AppLogo />
          </Box>

          {showRightContent && rightContent ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {rightContent}
            </Box>
          ) : null}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
