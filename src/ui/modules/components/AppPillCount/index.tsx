import { Typography, useTheme } from '@mui/material';
import { RowStack } from '../RowStack';
import { pxToRem } from '../../../../common';
import { Centered } from '../Centered';

type AppPillCountProps = {
  active: boolean;
  text: string;
  count: number;
  onClick?: () => void;
};

export const AppPillCount = ({
  active,
  text,
  count,
  onClick,
}: AppPillCountProps) => {
  const theme = useTheme();
  return (
    <RowStack
      spacing={0.5}
      onClick={onClick}
      sx={{
        padding: '8.12px 16.06px',
        border: !active ? `0.67px solid #E5E7EB` : 'none',
        background: active ? theme.palette.primary.main : 'transparent',
        borderRadius: '10px',
        cursor: 'pointer',
      }}
    >
      <Typography
        sx={{
          color: active ? theme.palette.background.default : 'text.secondary',
          fontWeight: 600,
          fontSize: pxToRem(13),
          lineHeight: '20.25px',
        }}
      >
        {text}
      </Typography>
      <Centered
        sx={{
          background: active ? '#FFFFFF40' : '#F0F4F8',
          borderRadius: '50%',
          width: '18.46px',
          height: '17.33px',
        }}
      >
        <Typography
          sx={{
            color: active ? theme.palette.background.default : 'text.secondary',
            fontWeight: 600,
            fontSize: pxToRem(11),
            lineHeight: '16.5px',
          }}
        >
          {count}
        </Typography>
      </Centered>
    </RowStack>
  );
};
