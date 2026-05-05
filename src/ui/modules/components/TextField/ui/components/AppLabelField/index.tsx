import { Typography } from '@mui/material';
import { pxToRem } from '../../../../../../../common';

type LabelComponentProps = {
  label: string;
};

export function AppLabelField({ label }: LabelComponentProps) {
  return (
    <Typography
      component={'span'}
      sx={{
        fontWeight: 400,
        fontSize: pxToRem(14),
        lineHeight: '21px',
        color: (theme) => theme.color.black,
      }}
    >
      {label}
    </Typography>
  );
}
