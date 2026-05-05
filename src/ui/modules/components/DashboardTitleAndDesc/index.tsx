import { Stack, Typography } from '@mui/material';
import { DashboardTitle } from '../DashboardTitle';
import { pxToRem } from '../../../../common';

type DashboardTitleAndDescProps = {
  title: string;
  desc: string;
};

export const DashboardTitleAndDesc = ({
  title,
  desc,
}: DashboardTitleAndDescProps) => {
  return (
    <Stack spacing={0.2}>
      <DashboardTitle title={title} />
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontStyle: 'regular',
          fontWeight: 400,
          fontSize: pxToRem(14),
          lineHeight: '21px',
          color: 'text.secondary',
        }}
      >
        {desc}
      </Typography>
    </Stack>
  );
};
