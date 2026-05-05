'use client';

import {
  Box,
  Collapse,
  InputAdornment,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material';
import { RowStack } from '../../../../RowStack';
import { useTextFieldStyles } from '../../../common';

export type AppTextFieldProps = TextFieldProps & {
  borderRadius?: string;
  borderTopLeftRadius?: string;
  borderBottomLeftRadius?: string;
  borderWidth?: string;
  padding?: object;
  fontSize?: object;
  marginTop?: object;
  errorMessage?: string;
  endIcon?: React.ReactNode;
};

export const AppTextField = (props: AppTextFieldProps) => {
  const {
    error,
    marginTop = {
      xs: '0',
    },
    errorMessage,
    endIcon,
    borderRadius,
    borderTopLeftRadius,
    borderBottomLeftRadius,
    borderWidth,
    padding,
    fontSize,
    ...rest
  } = props;
  const styles = useTextFieldStyles(props);

  return (
    <Box
      sx={{
        flexGrow: 1,
        marginTop,
      }}
    >
      <TextField
        hiddenLabel
        id="filled-hidden-label-normal"
        {...rest}
        sx={styles}
        error={error}
        InputProps={{
          ...(rest as any).InputProps,
          ...(endIcon && {
            endAdornment: (
              <InputAdornment position="end">{endIcon}</InputAdornment>
            ),
          }),
        }}
      />
      <Collapse in={error} orientation={'vertical'}>
        <RowStack
          sx={{
            width: '100%',
          }}
          justifyContent={'flex-start'}
        >
          <Typography
            variant={'body1'}
            sx={{
              color: (theme) => theme.color.error,
              fontSize: { xs: '.875rem', md: '.875rem' },
              fontWeight: 500,
            }}
          >
            {errorMessage}
          </Typography>
        </RowStack>
      </Collapse>
    </Box>
  );
};
