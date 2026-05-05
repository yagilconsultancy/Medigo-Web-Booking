import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { pxToRem } from '../../../../common';

type AppTabItem = {
  label: string;
};

type AppTabProps = {
  tabs: AppTabItem[];
  defaultIndex?: number;
  onChange?: (index: number) => void;
};

export const AppTab = ({ tabs, defaultIndex = 0, onChange }: AppTabProps) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
    onChange?.(index);
  };

  return (
    <Stack
      direction="row"
      sx={{
        background: '#F7F9FB',
        borderRadius: '14px',
        padding: '4px',
        width: 'fit-content',
      }}
    >
      {tabs.map((tab, index) => {
        const isActive = activeIndex === index;
        return (
          <Box
            key={index}
            onClick={() => handleTabClick(index)}
            sx={{
              padding: '8px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: isActive ? '#2F6FED' : 'transparent',
            }}
          >
            <Typography
              sx={{
                fontSize: pxToRem(12),
                fontWeight: 600,
                fontFamily: (theme) => theme.typography.fontFamily,
                lineHeight: '18px',
                fontStyle: 'semibold',
                color: isActive ? '#FFFFFF' : 'text.secondary',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                userSelect: 'none',
              }}
            >
              {tab.label}
            </Typography>
          </Box>
        );
      })}
    </Stack>
  );
};
