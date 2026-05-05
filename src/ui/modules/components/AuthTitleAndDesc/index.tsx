import { Stack, Typography } from '@mui/material';
import { pxToRem } from '../../../../common';

type AuthTitleAndDescProps = {
  title: string;
  desc: string;
};

export function AuthTitleAndDesc({ title, desc }: AuthTitleAndDescProps) {
  return (
    <Stack spacing={'12px'}>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 600,
          fontSize: {
            xs: pxToRem(24),
            md: pxToRem(36),
          },
          textAlign: 'center',
          lineHeight: {
            xs: '36px',
            md: '44px',
          },
          color: (theme) => theme.color.black,
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 300,
          textAlign: 'center',
          fontSize: {
            xs: pxToRem(16),
            md: pxToRem(20),
          },
          color: (theme) => theme.color.lightGrey,
        }}
      >
        {desc}
      </Typography>
    </Stack>
  );
}
