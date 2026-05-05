import * as React from 'react';
import Box from '@mui/material/Box';
import { AppTextField } from '../AppTextField';
import { StyledImage } from '../../../../StyledImage';

type InputWithIconProps = {
  icon: any;
};

export default function AppInputWithIconField({
  icon,
  ...props
}: InputWithIconProps) {
  return (
    <Box
      sx={{
        width: '45%',
      }}
    >
      <AppTextField
        {...props}
        type={'text'}
        variant={'filled'}
        borderRadius={'4px'}
        InputProps={{
          startAdornment: (
            <StyledImage src={icon} alt={'Search'} width={10} height={10} />
          ),
          disableUnderline: true,
        }}
        padding={{
          xs: '8px 17px !important',
          sm: '10px 10px !important',
        }}
      />
    </Box>
  );
}
