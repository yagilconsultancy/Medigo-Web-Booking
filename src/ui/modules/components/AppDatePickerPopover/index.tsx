'use client';

import { useState } from 'react';
import { Box, Popover, SxProps, Typography } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { Dayjs } from 'dayjs';
import { pxToRem } from '../../../../common';

type AppDatePickerPopoverProps = {
  value: Dayjs | null;
  onChange: (date: Dayjs | null) => void;
  format?: string;
  maxDate?: Dayjs;
  minDate?: Dayjs;
  buttonSx?: SxProps;
  iconSx?: SxProps;
  textSx?: SxProps;
};

export const AppDatePickerPopover = ({
  value,
  onChange,
  format = 'MMM DD, YYYY',
  maxDate,
  minDate,
  buttonSx,
  iconSx,
  textSx,
}: AppDatePickerPopoverProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <Box
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          height: 40,
          padding: '0 16px',
          borderRadius: '14px',
          background: '#FFFFFF',
          border: '0.67px solid #E8ECF0',
          boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.05)',
          cursor: 'pointer',
          '&:hover': { opacity: 0.85 },
          ...buttonSx,
        }}
      >
        <CalendarTodayOutlinedIcon
          sx={{ fontSize: 15, color: '#6B7280', ...iconSx }}
        />
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13),
            color: '#374151',
            whiteSpace: 'nowrap',
            ...textSx,
          }}
        >
          {value ? value.format(format) : 'Select date'}
        </Typography>
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '14px',
              padding: '12px',
              boxShadow: '0px 12px 40px 0px rgba(0, 0, 0, 0.14)',
              border: '0.67px solid #F0F4F8',
              mt: '6px',
            },
          },
        }}
      >
        <DateCalendar
          value={value}
          maxDate={maxDate}
          minDate={minDate}
          onChange={(newDate) => {
            onChange(newDate);
            setAnchorEl(null);
          }}
          sx={{
            width: 300,
            '& .MuiPickersDay-root': {
              fontFamily: 'Inter, sans-serif',
              fontSize: pxToRem(13),
              fontWeight: 400,
              '&.Mui-selected': {
                background: '#2F6FED',
                color: '#FFFFFF',
                '&:hover': { background: '#2558C4' },
              },
            },
            '& .MuiPickersCalendarHeader-label': {
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: pxToRem(14),
              color: '#111827',
            },
            '& .MuiDayCalendar-weekDayLabel': {
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: pxToRem(12),
              color: '#9CA3AF',
            },
          }}
        />
      </Popover>
    </>
  );
};
