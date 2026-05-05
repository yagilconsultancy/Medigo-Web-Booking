'use client';

import { Box, IconButton, Stack, Typography } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { pxToRem } from '../../../../common';
import { RowStack } from '../RowStack';

type AppNumberFieldProps = {
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  step?: number;
  min?: number;
  max?: number;
  decimalPlaces?: number;
};

export const AppNumberField = ({
  value,
  onChange,
  unit = 'CAD',
  step = 1,
  min,
  max,
  decimalPlaces = 2,
}: AppNumberFieldProps) => {
  const handleIncrement = () => {
    const newValue = parseFloat((value + step).toFixed(decimalPlaces));
    if (max !== undefined && newValue > max) return;
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = parseFloat((value - step).toFixed(decimalPlaces));
    if (min !== undefined && newValue < min) return;
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(e.target.value);
    if (isNaN(parsed)) return;
    if (min !== undefined && parsed < min) return;
    if (max !== undefined && parsed > max) return;
    onChange(parseFloat(parsed.toFixed(decimalPlaces)));
  };

  const displayValue =
    decimalPlaces > 0 ? value.toFixed(decimalPlaces) : String(value);

  return (
    <RowStack
      sx={{
        background: '#FFFFFF',
        border: '0.67px solid #E8ECF0',
        borderRadius: '14px',
        overflow: 'hidden',
        height: 40,
      }}
    >
      {/* Number Input */}
      <Box
        component="input"
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        sx={{
          width: 90,
          height: '100%',
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 700,
          fontSize: pxToRem(15),
          color: '#2F6FED',
          textAlign: 'right',
          padding: '8px 12px',
          boxSizing: 'border-box',
        }}
      />

      {/* Unit Label */}
      <RowStack
        sx={{
          background: '#F7F9FB',
          borderLeft: '0.67px solid #E8ECF0',
          padding: '0px 12px',
          height: '100%',
        }}
      >
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(12),
            color: '#9CA3AF',
            whiteSpace: 'nowrap',
          }}
        >
          {unit}
        </Typography>
      </RowStack>

      {/* Stepper Arrows */}
      <Stack
        sx={{
          opacity: 0.6,
          height: '100%',
          justifyContent: 'center',
        }}
      >
        <IconButton
          onClick={handleIncrement}
          size="small"
          sx={{
            padding: '0px 4px',
            borderRadius: 0,
            height: '50%',
          }}
        >
          <KeyboardArrowUpIcon sx={{ fontSize: 16, color: '#6B7280' }} />
        </IconButton>
        <IconButton
          onClick={handleDecrement}
          size="small"
          sx={{
            padding: '0px 4px',
            borderRadius: 0,
            height: '50%',
          }}
        >
          <KeyboardArrowDownIcon sx={{ fontSize: 16, color: '#6B7280' }} />
        </IconButton>
      </Stack>
    </RowStack>
  );
};
