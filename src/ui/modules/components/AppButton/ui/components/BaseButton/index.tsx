'use client';

import { Button, styled } from '@mui/material';
import { pxToRem } from '../../../../../../../common';

export const BaseButton = styled(Button)(() => ({
  borderRadius: '14px',
  textTransform: 'none',
  padding: '13px 12px 13px 12px',
  fontSize: pxToRem(16),
  boxShadow: 'none',
  fontWeight: 600,
  lineHeight: '20.16px',
  border: 'none',
  height: '100%',
}));
