'use client';

import { Box, Typography, TypographyProps } from '@mui/material';
import { pxToRem } from '../../../../common';

export type AppLabelProps = TypographyProps & {
  required?: boolean;
};

export function AppLabel({
  children,
  required = false,
  sx,
  ...rest
}: AppLabelProps) {
  return (
    <Typography
      component="label"
      sx={{
        color: (theme) => theme.color.black,
        fontSize: pxToRem(15.392),
        lineHeight: 1.43,
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        ...sx,
      }}
      {...rest}
    >
      <Box component="span">{children}</Box>
      {required ? (
        <Box component="span" sx={{ color: 'error.main' }}>
          *
        </Box>
      ) : null}
    </Typography>
  );
}
