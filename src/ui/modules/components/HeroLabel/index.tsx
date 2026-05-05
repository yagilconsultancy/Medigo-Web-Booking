import { Typography } from '@mui/material';
import { pxToRem } from '../../../../common';

type HeroLabelProps = {
  label: string;
};

export function HeroLabel({ label }: HeroLabelProps) {
  return (
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        color: (theme) => theme.palette.background.default,
        fontWeight: 700,
        fontSize: {
          xs: pxToRem(24),
          md: pxToRem(40),
          lg: pxToRem(65),
        },
        lineHeight: {
          xs: '40px',
          md: '70px',
          lg: '91px',
        },
      }}
    >
      {label}
    </Typography>
  );
}
