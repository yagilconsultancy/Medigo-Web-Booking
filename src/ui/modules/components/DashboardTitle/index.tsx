import { Typography } from '@mui/material';
import { pxToRem } from '../../../../common';

type DashboardTitleProps = {
  title: string;
};

export function DashboardTitle({ title }: DashboardTitleProps) {
  return (
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 500,
        fontSize: pxToRem(24),
        fontStyle: 'medium',
        lineHeight: '36px',
        color: (theme) => theme.color.deepBlue,
      }}
    >
      {title}
    </Typography>
  );
}
