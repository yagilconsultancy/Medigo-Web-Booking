import React from 'react';
import { Field } from 'formik';
import {
  Select,
  MenuItem,
  Typography,
  FormControl,
  FormHelperText,
} from '@mui/material';
import { pxToRem } from '../../../../common';

export const AppSelect = ({
  name,
  label,
  options,
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  size = 'medium',
  fullWidth = true,
}) => {
  return (
    <Field name={name}>
      {({ field, form }) => {
        const hasError = form.touched[name] && form.errors[name];

        return (
          <FormControl
            fullWidth={fullWidth}
            error={Boolean(hasError)}
            disabled={disabled}
          >
            {label && (
              <Typography
                sx={{
                  color: (theme) => theme.palette.text.primary,
                  fontSize: pxToRem(14),
                  fontWeight: 500,
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {label}
                {required && (
                  <Typography
                    component="span"
                    sx={{
                      color: 'error.main',
                      marginLeft: '4px',
                    }}
                  >
                    *
                  </Typography>
                )}
              </Typography>
            )}

            <Select
              {...field}
              displayEmpty
              size={size}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderRadius: '8px',
                },
                '& .MuiSelect-select': {
                  padding: '10px 16px',
                  minHeight: '45px !important',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: pxToRem(14),
                },
                backgroundColor: 'white',
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 300,
                    borderRadius: '8px',
                    marginTop: '4px',
                    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
                  },
                },
              }}
            >
              <MenuItem disabled value="">
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: pxToRem(14),
                  }}
                >
                  {placeholder}
                </Typography>
              </MenuItem>

              {options.map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                  sx={{
                    fontSize: pxToRem(14),
                    minHeight: '45px',
                    '&.Mui-selected': {
                      backgroundColor: 'primary.lighter',
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: 'primary.light',
                    },
                  }}
                >
                  {option}
                </MenuItem>
              ))}
            </Select>

            {hasError && (
              <FormHelperText error>{form.errors[name]}</FormHelperText>
            )}
          </FormControl>
        );
      }}
    </Field>
  );
};
