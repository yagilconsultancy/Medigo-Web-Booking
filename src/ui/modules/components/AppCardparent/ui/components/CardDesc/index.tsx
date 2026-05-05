import { Typography } from '@mui/material';
import { pxToRem } from '../../../../../../../common';

type CardTitleProps = {
  desc: string;
};

export const CardDesc = ({ desc }: CardTitleProps) => {
  return (
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 400,
        fontSize: pxToRem(13),
        lineHeight: '19.5px',
        fontStyle: 'regular',
      }}
    >
      {desc}
    </Typography>
  );
};
