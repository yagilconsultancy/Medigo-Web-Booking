import { PropsWithChildren } from 'react';
import { ThemeProviderProps } from '@mui/material/styles/ThemeProvider';
import { CssBaseline, ThemeProvider } from '@mui/material';

export type AppThemeProviderProps = Required<PropsWithChildren> & {
  theme: ThemeProviderProps['theme'];
};

export const AppThemeProvider = ({
  children,
  theme,
}: AppThemeProviderProps) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
