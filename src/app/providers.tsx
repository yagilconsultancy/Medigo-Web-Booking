'use client';

import { PropsWithChildren } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AppThemeProvider } from '../ui/modules/components';
import { QueryClientProvider } from '@tanstack/react-query';
import { defaultTheme } from '../ui/assets/styles/theme/default-theme';
import { Toaster } from 'sonner';
import { queryClient } from '../common';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <AppRouterCacheProvider>
      <AppThemeProvider theme={defaultTheme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <QueryClientProvider client={queryClient}>
            {children}
            <Toaster
              position="bottom-right"
              richColors
              toastOptions={{
                duration: 3000,
                className: 'custom-toast',
                style: {
                  padding: '12px 16px',
                  borderRadius: '8px',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                },
              }}
            />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </LocalizationProvider>
      </AppThemeProvider>
    </AppRouterCacheProvider>
  );
};
