'use client';

import { ButtonProps } from '@mui/material';
import { BaseButton } from './ui/components';
import { useAppButton } from './common/hooks';
import { Loader } from '../Loader';

export type AppButtonProps = ButtonProps & {
  isLoading?: boolean;
};

export const AppButton = ({
  variant,
  color,
  sx,
  children,
  isLoading,
  disabled,
  ...rest
}: AppButtonProps) => {
  const { styles, loaderStyles, setIsHovered } = useAppButton({
    variant,
    color,
  });

  return (
    <BaseButton
      {...rest}
      sx={{
        ...styles,
        ...sx,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled || isLoading}
    >
      {isLoading && (
        <Loader
          sx={{
            ...loaderStyles,
          }}
        />
      )}

      {!isLoading && children}
    </BaseButton>
  );
};
