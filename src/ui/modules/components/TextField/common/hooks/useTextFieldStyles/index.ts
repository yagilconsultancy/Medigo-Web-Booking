import { AppTextFieldProps } from '../../../ui/components';
import { useTheme } from '@mui/material';
import { useMemo } from 'react';
import { pxToRem } from '../../../../../../../common';

export const useTextFieldStyles = ({
  borderRadius = '10px',
  borderWidth = '1px',
  padding = {
    xs: '8px 17px !important',
    sm: '10px 10px !important',
  },
  fontSize = {
    xs: '0.875rem',
    md: '1rem',
    lg: pxToRem(13),
  },
  variant = 'outlined',
  error,
}: Pick<
  AppTextFieldProps,
  'borderRadius' | 'borderWidth' | 'padding' | 'fontSize' | 'variant' | 'error'
>) => {
  // @ts-ignore
  const { textField } = useTheme();

  return useMemo(() => {
    const textFieldVariant = variant as keyof typeof textField;
    const stateStyle = textField[textFieldVariant];
    const {
      background: defaultBackground,
      border: defaultBorder,
      text: defaultText,
      placeholder: defaultPlaceholder,
      error: defaultError,
    } = stateStyle.default.colors;
    const {
      background: focusedBackground,
      border: focusedBorder,
      text: focusedText,
      placeholder: focusedPlaceholder,
    } = stateStyle.focused.colors;

    const resolveBorderColor = (isFocused: boolean) => {
      if (error) {
        return defaultError;
      }
      if (isFocused) {
        return focusedBorder;
      }
      return defaultBorder;
    };

    return {
      width: '100%',
      backgroundColor: defaultBackground,
      borderRadius: borderRadius,

      '& .MuiInputBase-input': {
        fontWeight: 500,
        fontSize: fontSize,
        color: defaultText,
        borderRadius: borderRadius,
        padding: padding,

        '&::placeholder': {
          color: defaultPlaceholder,
          fontWeight: 400,
          fontSize: fontSize,
          opacity: 1,
        },
        '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active':
          {
            transition: 'background-color 600000s 0s, color 600000s 0s',
          },
        '&[data-autocompleted]': {
          backgroundColor: 'transparent !important',
        },
        '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
          WebkitAppearance: 'none',
          margin: 0,
        },
      },

      '& .MuiOutlinedInput-root': {
        padding: padding,
        '& fieldset': {
          borderRadius: borderRadius,
          border: `${borderWidth} solid ${resolveBorderColor(false)}`,
        },
        '&:hover fieldset': {
          border: `${borderWidth} solid ${resolveBorderColor(true)}`,
        },
        '&.Mui-focused': {
          color: focusedText,
          backgroundColor: focusedBackground,

          '& fieldset': {
            border: `${borderWidth} solid ${resolveBorderColor(true)}`,
          },
          '&::placeholder': {
            color: focusedPlaceholder,
          },
        },
      },

      '& .MuiFilledInput-root': {
        backgroundColor: defaultBackground,
        borderRadius: borderRadius,
        '&:before': {
          borderBottom: `${borderWidth} solid ${defaultBorder}`,
        },
        '&:hover:before': {
          borderBottom: `${borderWidth} solid ${resolveBorderColor(false)}`,
        },
        '&.Mui-focused': {
          backgroundColor: focusedBackground,

          '&:after': {
            borderBottom: `${borderWidth} solid ${resolveBorderColor(true)}`,
          },
          '&::placeholder': {
            color: focusedPlaceholder,
          },
        },
      },
    };
  }, [variant, error, borderRadius, fontSize, padding, borderWidth, textField]);
};
