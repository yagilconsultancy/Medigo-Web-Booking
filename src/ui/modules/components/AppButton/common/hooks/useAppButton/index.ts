import { AppButtonProps } from '../../../index';
import { CircularProgressProps, useTheme } from '@mui/material';
import { useState } from 'react';

export const useAppButton = ({
  variant = 'contained',
  color = 'primary',
}: Pick<AppButtonProps, 'variant' | 'color'>) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const buttonVariant = variant as keyof typeof theme.button;
  const buttonColor =
    color as keyof (typeof theme.button)[typeof buttonVariant];

  const themeButtonConfig = (theme as any)?.button?.[buttonVariant]?.[
    buttonColor
  ] as
    | {
        background: string;
        color: string;
        hoverBackground: string;
        hoverColor: string;
      }
    | undefined;

  const fallbackConfig = (() => {
    const primaryMain = theme.palette?.primary?.main ?? '#007AFF';
    const primaryContrast = theme.palette?.primary?.contrastText ?? '#FFFFFF';

    if (variant === 'outlined') {
      return {
        background: 'transparent',
        color: primaryMain,
        hoverBackground: theme.palette?.action?.hover ?? 'rgba(0,0,0,0.04)',
        hoverColor: primaryMain,
      };
    }

    if (variant === 'text') {
      return {
        background: 'transparent',
        color: primaryMain,
        hoverBackground: theme.palette?.action?.hover ?? 'rgba(0,0,0,0.04)',
        hoverColor: primaryMain,
      };
    }

    return {
      background: primaryMain,
      color: primaryContrast,
      hoverBackground: primaryMain,
      hoverColor: primaryContrast,
    };
  })();

  const {
    background,
    color: themeColor,
    hoverBackground,
    hoverColor,
  } = themeButtonConfig ?? fallbackConfig;

  const styles: AppButtonProps['sx'] = {
    background,
    color: themeColor,
    columnGap: '10px',

    '&:hover': {
      background: `${hoverBackground} !important`,
      color: hoverColor,
    },
    '&:disabled': {
      background,
      color: themeColor,
      opacity: 0.5,
    },
  };

  const loaderStyles: CircularProgressProps['sx'] = {
    color: themeColor,
    marginRight: '20px',
  };

  return {
    styles,
    loaderStyles,
    isHovered,
    setIsHovered,
  };
};
