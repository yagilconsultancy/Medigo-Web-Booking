'use client';

import { Typography } from '@mui/material';
import { StaticImageData } from 'next/image';
import { pxToRem } from '@/common';
import { Centered, RowStack, StyledImage } from '@/ui/modules/components';

export type SectionTitleProps = {
  label: string;
  iconSrc?: StaticImageData;
  bgSection?: string;
};

export function SectionTitle({ label, iconSrc, bgSection }: SectionTitleProps) {
  return (
    <RowStack spacing={'12px'}>
      {iconSrc ? (
        <Centered
          sx={{
            padding: '13px',
            borderRadius: '14px',
            background: bgSection,
          }}
        >
          <StyledImage
            src={iconSrc}
            alt={`${label} icon`}
            sx={{
              width: '18px',
              height: '18px',
            }}
          />
        </Centered>
      ) : null}

      <Typography
        sx={{
          fontSize: pxToRem(18),
          fontWeight: 700,
          color: '#0F172A',
          fontFamily: 'Inter, sans-serif',
          lineHeight: '27px',
        }}
      >
        {label}
      </Typography>
    </RowStack>
  );
}
