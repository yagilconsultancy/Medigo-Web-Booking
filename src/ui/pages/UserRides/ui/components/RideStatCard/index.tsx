'use client';

import { Paper, Stack, Typography, type SxProps, type Theme } from '@mui/material';
import type { ReactNode } from 'react';
import { pxToRem } from '@/common';

export type RideStatCardProps = {
  icon: ReactNode;
  value: string;
  label: string;
  paperSx?: SxProps<Theme>;
  iconContainerSx?: SxProps<Theme>;
  valueSx?: SxProps<Theme>;
  labelSx?: SxProps<Theme>;
};

export function RideStatCard({
  icon,
  value,
  label,
  paperSx,
  iconContainerSx,
  valueSx,
  labelSx,
}: RideStatCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid #F3F4F6',
        borderRadius: pxToRem(16),
        boxShadow: '0px 1px 2px rgba(0,0,0,0.06)',
        p: pxToRem(16),
        ...paperSx,
      }}
    >
      <Stack spacing={1.25}>
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            width: pxToRem(32),
            height: pxToRem(32),
            borderRadius: pxToRem(10),
            bgcolor: '#EFF6FF',
            color: '#155DFC',
            ...iconContainerSx,
          }}
        >
          {icon}
        </Stack>

        <Typography
          sx={{
            color: '#0F172A',
            fontWeight: 700,
            fontSize: pxToRem(20),
            lineHeight: pxToRem(24),
            ...valueSx,
          }}
        >
          {value}
        </Typography>

        <Typography
          sx={{
            color: '#94A3B8',
            fontSize: pxToRem(11),
            lineHeight: pxToRem(16),
            ...labelSx,
          }}
        >
          {label}
        </Typography>
      </Stack>
    </Paper>
  );
}
