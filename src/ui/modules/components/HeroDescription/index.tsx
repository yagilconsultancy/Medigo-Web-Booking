import { Typography } from '@mui/material';
import { pxToRem } from '../../../../common';

type HeroDescriptionprops = {
  desc: string;
};

export function HeroDescription({ desc }: HeroDescriptionprops) {
  return (
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        color: (theme) => theme.palette.background.default,
        fontWeight: 400,
        fontSize: {
          xs: pxToRem(14),
          md: pxToRem(18),
        },
        lineHeight: {
          xs: '20px',
          md: '27px',
        },
        letterSpacing: '.2px',
      }}
    >
      {desc}
    </Typography>
  );
}
