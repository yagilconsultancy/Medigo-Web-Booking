'use client';

import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { AppButton } from '@/ui/modules/components';
import { pxToRem } from '@/common';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('[AppErrorBoundary]', error);
  }, [error]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#F8FAFC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: pxToRem(20),
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: pxToRem(520),
          bgcolor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: pxToRem(18),
          p: pxToRem(24),
          boxShadow: '0px 24px 48px rgba(2,6,23,0.08)',
        }}
      >
        <Typography
          sx={{
            fontSize: pxToRem(18),
            fontWeight: 900,
            color: '#0F172A',
          }}
        >
          Something went wrong
        </Typography>

        <Typography
          sx={{
            mt: pxToRem(8),
            fontSize: pxToRem(13),
            color: '#64748B',
            lineHeight: pxToRem(19),
          }}
        >
          Please try again. If this keeps happening, contact support using the
          chat widget.
        </Typography>

        {error?.message ? (
          <Box
            sx={{
              mt: pxToRem(14),
              p: pxToRem(12),
              borderRadius: pxToRem(14),
              bgcolor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              maxHeight: pxToRem(160),
              overflow: 'auto',
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontSize: pxToRem(12),
              color: '#0F172A',
              whiteSpace: 'pre-wrap',
            }}
          >
            {error.message}
          </Box>
        ) : null}

        <Box sx={{ display: 'flex', gap: pxToRem(12), mt: pxToRem(18) }}>
          <AppButton
            variant="contained"
            onClick={reset}
            sx={{
              height: pxToRem(44),
              borderRadius: pxToRem(14),
              bgcolor: '#2563EB',
              fontWeight: 800,
              textTransform: 'none',
              '&:hover': { bgcolor: '#1D4ED8' },
            }}
          >
            Try again
          </AppButton>

          <AppButton
            variant="outlined"
            onClick={() => window.location.reload()}
            sx={{
              height: pxToRem(44),
              borderRadius: pxToRem(14),
              borderColor: '#E2E8F0',
              color: '#0F172A',
              fontWeight: 800,
              textTransform: 'none',
              '&:hover': { borderColor: '#CBD5E1', bgcolor: '#F8FAFC' },
            }}
          >
            Reload
          </AppButton>
        </Box>
      </Box>
    </Box>
  );
}
