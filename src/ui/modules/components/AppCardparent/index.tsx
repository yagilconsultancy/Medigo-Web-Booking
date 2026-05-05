import { Stack } from '@mui/material';
import { ReactNode } from 'react';

type AppCardParentProps = {
  children: ReactNode;
};

export const AppCardparent = ({ children }: AppCardParentProps) => {
  return (
    <Stack
      sx={{
        border: '0.67px solid #F0F4F8',
        boxShadow: '0px 1px 6px rgba(0, 0, 0, 0.06)',
        padding: '18.2px 19px',
        borderRadius: '16px',
        background: (theme) => theme.palette.background.default,
        width: '100%',
        height: '100%',
      }}
      spacing="18px"
    >
      {children}
    </Stack>
  );
};
