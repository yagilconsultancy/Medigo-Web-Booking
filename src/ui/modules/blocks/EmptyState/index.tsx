'use client';

import { Stack, Typography } from '@mui/material';
import React from 'react';
import dynamic from 'next/dynamic';
import { pxToRem } from '../../../../common';

const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  { ssr: false }
);

export type EmptyStateProps = {
  emptyState?: React.ReactNode;
  animationSrc?: string;
  showAnimation?: boolean;
};

export const EmptyState = ({
  emptyState,
  animationSrc = 'https://lottie.host/4b03149f-0a35-4d5e-bf54-0b906915ff84/tSLey7MBpp.json',
  showAnimation = true,
}: EmptyStateProps) => {
  return (
    <Stack
      spacing={3}
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '100%',
        height: '100%',
        py: 4,
      }}
    >
      {showAnimation && (
        <Player
          autoplay
          loop
          src={animationSrc}
          speed={1.5}
          style={{
            height: '200px',
            width: '200px',
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        />
      )}

      {emptyState ? (
        emptyState
      ) : (
        <Typography
          sx={{
            color: 'text.primary',
            fontSize: pxToRem(12),
            fontWeight: 300,
            textAlign: 'center',
          }}
        >
          No data to display
        </Typography>
      )}
    </Stack>
  );
};
