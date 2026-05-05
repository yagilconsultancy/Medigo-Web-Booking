import React from 'react';
import { Box, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export interface PermissionErrorProps {
  title?: string;
  message?: string;
}

export const PermissionError = ({
  title = 'Insufficient permissions',
  message = 'You do not have permission to access this resource.',
}: PermissionErrorProps) => {
  return (
    <Box
      sx={{
        background: '#fce4ec',
        border: '1px solid #ef5350',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        width: '100%',
        height: '100%',
      }}
    >
      <ErrorOutlineIcon
        sx={{
          color: '#d32f2f',
          fontSize: '20px',
          flexShrink: 0,
          marginTop: '2px',
        }}
      />
      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{
            fontWeight: 600,
            color: '#d32f2f',
            marginBottom: '4px',
            fontSize: '14px',
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            color: '#666',
            fontSize: '13px',
            lineHeight: '1.5',
          }}
        >
          {message}
        </Typography>
      </Box>
    </Box>
  );
};
