import { AppTextField, AppTextFieldProps } from '../AppTextField';
import { useAppPasswordField } from './common/hooks';
import { VisibilityOffRounded, VisibilityRounded } from '@mui/icons-material';
import { IconButton } from '@mui/material';

export type AppPasswordFieldProps = AppTextFieldProps;

export const AppPasswordField = (props: AppPasswordFieldProps) => {
  const { obscurePassword, handleVisibilityButtonClicked } =
    useAppPasswordField();

  return (
    <AppTextField
      {...props}
      type={obscurePassword ? 'password' : 'text'}
      InputProps={{
        endAdornment: (
          <IconButton
            sx={{
              padding: 0,
            }}
            onClick={handleVisibilityButtonClicked}
          >
            {obscurePassword && (
              <VisibilityOffRounded
                sx={{
                  color: '#808080',
                  fontSize: '16px !important',
                }}
              />
            )}

            {!obscurePassword && (
              <VisibilityRounded
                sx={{
                  color: '#808080',
                  fontSize: '16px !important',
                }}
              />
            )}
          </IconButton>
        ),
      }}
    />
  );
};
