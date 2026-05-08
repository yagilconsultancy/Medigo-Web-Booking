import { ComponentType, useMemo } from 'react';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { Box, Typography, Collapse } from '@mui/material';
import { useTextFieldStyles } from '../../../common';

type AppOtpInputProps = {
  otp: string;
  onchange?: (value: string) => void;
  errorMessage?: string;
  hasError?: boolean;
  length?: number | undefined;
  oncomplete?: (value: string) => void;
};

const OtpInput = MuiOtpInput as unknown as ComponentType<any>;

export function AppOtpInput({
  otp,
  onchange,
  errorMessage,
  hasError,
  length,
  oncomplete,
}: AppOtpInputProps) {
  const styles = useTextFieldStyles({
    borderRadius: '8px',
    borderWidth: '1px',
    padding: { xs: '12px 16px !important', sm: '12px 16px !important' },
    fontSize: { xs: '0.875rem', md: '0.875rem' },
    variant: 'outlined',
    error: hasError,
  });

  const textFieldStyles = useMemo(() => {
    return {
      ...styles,
      '& .MuiOutlinedInput-root': {
        border: `1px solid ${hasError ? '#D87759' : '#C4C4C4'}`,
        width: '42px',
        height: '39px',
      },
    };
  }, [styles, hasError]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', gap: '6px' }}>
        <OtpInput
          autoFocus
          value={otp}
          length={length || 4}
          onChange={onchange}
          onComplete={oncomplete}
          sx={textFieldStyles}
          TextFieldsProps={{ placeholder: '-' }}
        />
      </Box>

      <Collapse in={hasError} orientation="vertical">
        <Box sx={{ marginTop: '6px' }}>
          <Typography
            variant="body2"
            sx={{
              color: '#D87759',
              fontSize: '.875rem',
              fontWeight: 500,
            }}
          >
            {errorMessage}
          </Typography>
        </Box>
      </Collapse>
    </Box>
  );
}
