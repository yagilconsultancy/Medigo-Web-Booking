'use client';

import { Switch, switchClasses } from '@mui/material';
import { pxToRem } from '@/common';

export function IOSSwitch(props: React.ComponentProps<typeof Switch>) {
  return (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
      sx={{
        width: pxToRem(42),
        height: pxToRem(24),
        padding: 0,
        [`& .${switchClasses.switchBase}`]: {
          padding: 0,
          margin: pxToRem(2),
          transitionDuration: '200ms',
          [`&.${switchClasses.checked}`]: {
            transform: `translateX(${pxToRem(18)})`,
            color: '#fff',
            [`& + .${switchClasses.track}`]: {
              backgroundColor: '#2F6FED',
              opacity: 1,
              border: 0,
            },
          },
        },
        [`& .${switchClasses.thumb}`]: {
          boxSizing: 'border-box',
          width: pxToRem(20),
          height: pxToRem(20),
        },
        [`& .${switchClasses.track}`]: {
          borderRadius: pxToRem(24),
          backgroundColor: '#E2E8F0',
          opacity: 1,
          transition: 'background-color 200ms',
        },
      }}
    />
  );
}

