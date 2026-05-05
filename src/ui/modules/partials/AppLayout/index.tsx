import { ReactNode } from 'react';
import { Box } from '@mui/material';
import { Centered } from '../../components';
import { AppHeader } from '../AppHeader';
import type { AppHeaderProps } from '../AppHeader';
import { AppFooter } from '../AppFooter';

type AppLayoutProp = {
  children: ReactNode;
  headerProps?: AppHeaderProps;
};

export function AppLayout({ children, headerProps }: AppLayoutProp) {
  return (
    // <ReactLenis root>
    <Centered direction={'column'} sx={{ position: 'relative' }}>
      <AppHeader {...headerProps} />
      <Box
        component="main"
        sx={{
          width: '100%',
          maxWidth: '1920px',
          mx: 'auto',
          background: (theme) => theme.palette.background.default,
        }}
      >
        {children}
      </Box>
      {/* <AppFooter /> */}
    </Centered>
    // </ReactLenis>
  );
}
