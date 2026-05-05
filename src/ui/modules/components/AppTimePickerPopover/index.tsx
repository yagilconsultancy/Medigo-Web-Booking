'use client';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {
  Box,
  ButtonBase,
  Divider,
  Paper,
  Popover,
  SxProps,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { pxToRem } from '../../../../common';
import { AppButton } from '../AppButton';

type AppTimePickerPopoverProps = {
  value: string; // 24h format: "HH:mm"
  onChange: (value: string) => void;
  placeholder?: string;
  buttonSx?: SxProps;
};

const pad2 = (n: number) => String(n).padStart(2, '0');

function parseTime24(value: string): { hour24: number; minute: number } | null {
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hour24 = Number(match[1]);
  const minute = Number(match[2]);
  if (!Number.isFinite(hour24) || !Number.isFinite(minute)) return null;
  if (hour24 < 0 || hour24 > 23 || minute < 0 || minute > 59) return null;
  return { hour24, minute };
}

function formatDisplay(value: string) {
  const parsed = parseTime24(value);
  if (!parsed) return '';

  const period = parsed.hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = parsed.hour24 % 12 === 0 ? 12 : parsed.hour24 % 12;
  return `${pad2(hour12)}:${pad2(parsed.minute)} ${period}`;
}

export const AppTimePickerPopover = ({
  value,
  onChange,
  placeholder = 'Set a time',
  buttonSx,
}: AppTimePickerPopoverProps) => {
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  const initial = useMemo(() => parseTime24(value), [value]);

  const [hour, setHour] = useState(() => {
    const h = initial?.hour24 ?? 9;
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return pad2(hour12);
  });
  const [minute, setMinute] = useState(() => pad2(initial?.minute ?? 0));
  const [period, setPeriod] = useState<'AM' | 'PM'>(() =>
    (initial?.hour24 ?? 9) >= 12 ? 'PM' : 'AM'
  );

  const hours = useMemo(
    () => Array.from({ length: 12 }, (_, i) => pad2(i + 1)),
    []
  );
  const minutes = useMemo(
    () => Array.from({ length: 60 }, (_, i) => pad2(i)),
    []
  );
  const periods = useMemo(() => ['AM', 'PM'] as const, []);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  useEffect(() => {
    if (!open) return;
    const parsed = parseTime24(value);
    if (!parsed) return;
    const nextPeriod: 'AM' | 'PM' = parsed.hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = parsed.hour24 % 12 === 0 ? 12 : parsed.hour24 % 12;
    setHour(pad2(hour12));
    setMinute(pad2(parsed.minute));
    setPeriod(nextPeriod);
  }, [open, value]);

  const handleConfirm = () => {
    const hourNum = Number(hour);
    const minuteNum = Number(minute);
    if (!hourNum || hourNum < 1 || hourNum > 12) return;
    if (!Number.isFinite(minuteNum) || minuteNum < 0 || minuteNum > 59) return;

    let hour24 = hourNum % 12;
    if (period === 'PM') hour24 += 12;
    onChange(`${pad2(hour24)}:${pad2(minuteNum)}`);
    handleClose();
  };

  const displayValue = value ? formatDisplay(value) : '';

  return (
    <>
      <ButtonBase
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          width: '100%',
          height: pxToRem(40),
          borderRadius: pxToRem(14),
          border: '0.67px solid #E8ECF0',
          bgcolor: '#FFFFFF',
          boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
          px: pxToRem(14),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          ...buttonSx,
        }}
      >
        <Typography
          sx={{
            fontSize: pxToRem(13),
            fontWeight: 600,
            color: displayValue ? '#374151' : '#94A3B8',
          }}
        >
          {displayValue || placeholder}
        </Typography>
        <AccessTimeIcon sx={{ fontSize: pxToRem(16), color: '#94A3B8' }} />
      </ButtonBase>

      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: pxToRem(12),
              p: pxToRem(16),
              boxShadow: '0px 12px 40px rgba(0,0,0,0.14)',
              border: '0.67px solid #F0F4F8',
              mt: pxToRem(6),
              width: pxToRem(328),
            },
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: pxToRem(12),
          }}
        >
          <Typography
            sx={{ fontSize: pxToRem(16), fontWeight: 600, color: '#202020' }}
          >
            Add time
          </Typography>
          <Typography
            onClick={handleClose}
            sx={{
              color: '#BB2B00',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: pxToRem(12),
            }}
          >
            Cancel
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            bgcolor: '#F7F7F7',
            borderRadius: pxToRem(8),
            p: pxToRem(8),
            display: 'flex',
            gap: pxToRem(8),
            mb: pxToRem(14),
          }}
        >
          <Box sx={{ flex: 1, maxHeight: pxToRem(150), overflowY: 'auto' }}>
            {hours.map((h) => {
              const active = hour === h;
              return (
                <Box
                  key={h}
                  onClick={() => setHour(h)}
                  sx={{
                    py: pxToRem(8),
                    cursor: 'pointer',
                    borderRadius: pxToRem(6),
                    bgcolor: active ? '#F0F0F0' : 'transparent',
                    fontWeight: active ? 600 : 400,
                    fontSize: pxToRem(16),
                    textAlign: 'center',
                  }}
                >
                  {h}
                </Box>
              );
            })}
          </Box>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ borderColor: '#E5E7EB' }}
          />

          <Box sx={{ flex: 1, maxHeight: pxToRem(150), overflowY: 'auto' }}>
            {minutes.map((m) => {
              const active = minute === m;
              return (
                <Box
                  key={m}
                  onClick={() => setMinute(m)}
                  sx={{
                    py: pxToRem(8),
                    cursor: 'pointer',
                    borderRadius: pxToRem(6),
                    bgcolor: active ? '#F0F0F0' : 'transparent',
                    fontWeight: active ? 600 : 400,
                    fontSize: pxToRem(16),
                    textAlign: 'center',
                  }}
                >
                  {m}
                </Box>
              );
            })}
          </Box>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ borderColor: '#E5E7EB' }}
          />

          <Box sx={{ flex: 1 }}>
            {periods.map((p) => {
              const active = period === p;
              return (
                <Box
                  key={p}
                  onClick={() => setPeriod(p)}
                  sx={{
                    py: pxToRem(8),
                    cursor: 'pointer',
                    borderRadius: pxToRem(6),
                    bgcolor: active ? '#F0F0F0' : 'transparent',
                    fontWeight: active ? 600 : 400,
                    fontSize: pxToRem(16),
                    textAlign: 'center',
                  }}
                >
                  {p}
                </Box>
              );
            })}
          </Box>
        </Paper>

        <AppButton fullWidth onClick={handleConfirm} sx={{ width: '100%' }}>
          Continue
        </AppButton>
      </Popover>
    </>
  );
};
