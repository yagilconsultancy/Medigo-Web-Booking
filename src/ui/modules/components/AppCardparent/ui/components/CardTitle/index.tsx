import { Typography } from '@mui/material';
import { pxToRem } from '../../../../../../../common';

type CardTitleProps = {
  title: string;
};

export const CardTitle = ({ title }: CardTitleProps) => {
  return (
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 500,
        fontSize: pxToRem(18),
        lineHeight: '27px',
        fontStyle: 'medium',
      }}
    >
      {title}
    </Typography>
  );
};
