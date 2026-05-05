'use client';

import React, { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { SketchPicker } from 'react-color';
import { pxToRem } from '../../../../common';

export type ColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  error?: string;
};

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  label,
  error,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleChangeComplete = (color: any) => {
    onChange(color.hex);
  };

  return (
    <Stack spacing={'8px'}>
      {label && (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(12.5),
            color: '#374151',
            lineHeight: '1.5em',
          }}
        >
          {label}
        </Typography>
      )}

      <Box sx={{ position: 'relative' }}>
        {/* Color Display */}
        <Box
          onClick={() => setShowPicker(!showPicker)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 14px',
            background: '#FFFFFF',
            border: error ? '1px solid #EF4444' : '1px solid #E8ECF0',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: error ? '#EF4444' : '#D1D5DB',
            },
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              background: value || '#000000',
              border: '1px solid #E8ECF0',
              flexShrink: 0,
            }}
          />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(13),
              color: value ? '#111827' : '#9CA3AF',
              lineHeight: '1.5em',
            }}
          >
            {value || 'Select a color'}
          </Typography>
        </Box>

        {/* Color Picker Popover */}
        {showPicker && (
          <>
            {/* Overlay to close picker */}
            <Box
              onClick={() => setShowPicker(false)}
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1,
              }}
            />

            {/* Picker */}
            <Box
              sx={{
                position: 'absolute',
                bottom: '100%',
                left: 0,
                marginBottom: '8px',
                zIndex: 2,
                boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
                borderRadius: '8px',
              }}
            >
              <SketchPicker
                color={value || '#000000'}
                onChangeComplete={handleChangeComplete}
                disableAlpha
              />
            </Box>
          </>
        )}
      </Box>

      {/* Error Message */}
      {error && (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(11.5),
            color: '#EF4444',
            lineHeight: '1.5em',
          }}
        >
          {error}
        </Typography>
      )}
    </Stack>
  );
};
