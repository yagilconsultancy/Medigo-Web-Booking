import { AppTextField, AppTextFieldProps } from '../AppTextField';
import { StyledImage } from '../../../../StyledImage';
import searchIcon from './ui/assets/icons/search.svg';
import { Box, BoxProps } from '@mui/material';

export type AppSearchFieldProps = AppTextFieldProps & {
  boxProps?: BoxProps;
  useCustomContainer?: boolean;
};

export const AppSearchField = ({
  boxProps,
  useCustomContainer,
  ...props
}: AppSearchFieldProps) => {
  const { sx, ...restBoxProps } = boxProps || {};

  const Field = (
    <AppTextField
      {...props}
      type={'text'}
      variant={'filled'}
      InputProps={{
        startAdornment: (
          <StyledImage
            src={searchIcon}
            alt={'Search'}
            sx={{ width: '13.5px', height: '13.5px' }}
          />
        ),
        disableUnderline: true,
      }}
      borderRadius={props.borderRadius || '8px'}
      padding={
        props.padding || {
          xs: '8px 17px !important',
          sm: '10px 13px !important',
        }
      }
    />
  );

  if (useCustomContainer) {
    return Field;
  }

  return (
    <Box
      sx={{
        width: '45%',
        ...sx,
      }}
      {...restBoxProps}
    >
      {Field}
    </Box>
  );
};
