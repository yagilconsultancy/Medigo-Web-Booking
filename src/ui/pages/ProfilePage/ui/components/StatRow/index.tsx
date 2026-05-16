'use client';

import { Box, Typography } from '@mui/material';
import { pxToRem } from '@/common';

export function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: pxToRem(12),
        fontSize: pxToRem(11),
      }}
    >
      <Typography sx={{ fontSize: pxToRem(10), color: '#94A3B8' }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: pxToRem(10), color: '#0F172A', fontWeight: 800 }}>
        {value}
      </Typography>
    </Box>
  );
}

