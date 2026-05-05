'use client';

import { useState } from 'react';
import { Box, Popover, Stack, Typography } from '@mui/material';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import { RowStack } from '../RowStack';
import { pxToRem } from '../../../../common';

export type FilterSection = {
  label: string;
  key: string;
  options: string[];
};

type AppFilterPopoverProps = {
  sections: FilterSection[];
  filters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
};

export const AppFilterPopover = ({
  sections,
  filters,
  onFilterChange,
  onReset,
}: AppFilterPopoverProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const isActive = Object.values(filters).some((v) => v !== 'All');

  return (
    <>
      {/* Trigger Button */}
      <Box
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          height: 38,
          padding: '0 16px',
          background: isActive ? '#EFF5FF' : '#F7F9FB',
          border: isActive ? '0.667px solid #2F6FED' : '0.67px solid #E8ECF0',
          borderRadius: '14px',
          cursor: 'pointer',
          '&:hover': { opacity: 0.85 },
        }}
      >
        <FilterListOutlinedIcon
          sx={{ fontSize: 15, color: isActive ? '#2F6FED' : '#374151' }}
        />
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13),
            color: isActive ? '#2F6FED' : '#374151',
          }}
        >
          Filter
        </Typography>
      </Box>

      {/* Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '14px',
              padding: '12px',
              boxShadow: '0px 12px 40px 0px rgba(0, 0, 0, 0.14)',
              border: '0.67px solid #F0F4F8',
              mt: '6px',
              width: 276,
            },
          },
        }}
      >
        <Stack spacing={'16px'}>
          {/* Header */}
          <RowStack justifyContent={'space-between'}>
            <RowStack spacing={'8px'}>
              <FilterListOutlinedIcon
                sx={{
                  fontSize: 16,
                  color: (theme) => theme.color.deepBlue,
                }}
              />
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(14),
                  color: '#111827',
                }}
              >
                Filters
              </Typography>
            </RowStack>
            <Typography
              onClick={onReset}
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(12),
                color: (theme) => theme.color.deepBlue,
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Reset all
            </Typography>
          </RowStack>

          {/* Sections */}
          {sections.map((section) => (
            <Stack key={section.key} spacing={'10px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(10),
                  letterSpacing: '0.06em',
                  color: '#9CA3AF',
                  textTransform: 'uppercase',
                }}
              >
                {section.label}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {section.options.map((option) => {
                  const isSelected = filters[section.key] === option;
                  return (
                    <Box
                      key={option}
                      onClick={() => onFilterChange(section.key, option)}
                      sx={{
                        padding: '5px 14px',
                        borderRadius: '100px',
                        background: isSelected ? '#2F6FED' : '#F7F9FB',
                        border: isSelected
                          ? '0.67px solid #2F6FED'
                          : '0.67px solid #E8ECF0',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          opacity: 0.85,
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 400,
                          fontSize: pxToRem(12),
                          color: isSelected
                            ? '#FFFFFF'
                            : (theme) => theme.color.deepBlue,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {option}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Stack>
          ))}
        </Stack>
      </Popover>
    </>
  );
};
