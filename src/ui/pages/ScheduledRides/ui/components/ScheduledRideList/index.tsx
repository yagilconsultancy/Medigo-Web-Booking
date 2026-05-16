'use client';

import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import PendingRoundedIcon from '@mui/icons-material/PendingRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import { Box, ButtonBase, Chip, Paper, Stack, Typography } from '@mui/material';
import { pxToRem } from '@/common';
import { RowStack } from '@/ui/modules/components';

export type ScheduledRideStatus = 'confirmed' | 'pending' | 'recurring';

export type ScheduledRideItem = {
  id: string;
  status: ScheduledRideStatus;
  pickupAddress: string;
  destinationAddress: string;
  dateLabel: string;
  timeLabel: string;
  recurringLabel?: string;
  driverAssigned?: string;
  accentColor: string;
};

const statusChip = (status: ScheduledRideStatus) => {
  if (status === 'confirmed') {
    return {
      label: 'Confirmed',
      icon: <CheckCircleRoundedIcon sx={{ fontSize: pxToRem(14) }} />,
      sx: { bgcolor: '#ECFDF5', borderColor: '#A7F3D0', color: '#047857' },
    } as const;
  }

  if (status === 'pending') {
    return {
      label: 'Pending',
      icon: <PendingRoundedIcon sx={{ fontSize: pxToRem(14) }} />,
      sx: { bgcolor: '#FFFBEB', borderColor: '#FDE68A', color: '#92400E' },
    } as const;
  }

  return {
    label: 'Recurring',
    icon: <ReplayRoundedIcon sx={{ fontSize: pxToRem(14) }} />,
    sx: { bgcolor: '#F5F3FF', borderColor: '#DDD6FE', color: '#6D28D9' },
  } as const;
};

export function ScheduledRideList({
  items,
  onEdit,
  onCancel,
}: {
  items: ScheduledRideItem[];
  onEdit: (item: ScheduledRideItem) => void;
  onCancel: (item: ScheduledRideItem) => void;
}) {
  return (
    <Stack spacing={2}>
      {items.map((ride) => {
        const chip = statusChip(ride.status);

        return (
          <Paper
            key={ride.id}
            elevation={0}
            sx={{
              border: '1px solid #F3F4F6',
              borderRadius: pxToRem(16),
              boxShadow: '0px 1px 2px rgba(0,0,0,0.06)',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                height: pxToRem(2),
                bgcolor: ride.accentColor,
              }}
            />

            <Box sx={{ px: pxToRem(24), py: pxToRem(18) }}>
              <RowStack
                justifyContent="space-between"
                alignItems="flex-start"
                gap={2}
              >
                <RowStack
                  alignItems="flex-start"
                  gap={pxToRem(20)}
                  sx={{ minWidth: 0 }}
                >
                  <Box
                    sx={{
                      width: pxToRem(40),
                      height: pxToRem(40),
                      borderRadius: pxToRem(14),
                      bgcolor:
                        ride.status === 'confirmed'
                          ? '#ECFDF5'
                          : ride.status === 'pending'
                            ? '#FFFBEB'
                            : '#F5F3FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color:
                        ride.status === 'confirmed'
                          ? '#047857'
                          : ride.status === 'pending'
                            ? '#92400E'
                            : '#6D28D9',
                    }}
                  >
                    <CalendarMonthRoundedIcon sx={{ fontSize: pxToRem(18) }} />
                  </Box>

                  <Stack spacing={1.25} sx={{ minWidth: 0 }}>
                    <RowStack
                      spacing={1.25}
                      sx={{ minWidth: 0, flexWrap: 'wrap' }}
                    >
                      <Typography
                        sx={{
                          color: '#0F172A',
                          fontWeight: 700,
                          fontSize: pxToRem(13),
                          lineHeight: pxToRem(20),
                          letterSpacing: pxToRem(-0.325),
                        }}
                      >
                        {ride.id}
                      </Typography>

                      <Chip
                        icon={chip.icon}
                        label={chip.label}
                        variant="outlined"
                        size="small"
                        sx={{
                          height: pxToRem(24),
                          borderWidth: pxToRem(1),
                          fontSize: pxToRem(11),
                          fontWeight: 600,
                          '& .MuiChip-label': { px: pxToRem(6) },
                          '& .MuiChip-icon': {
                            ml: pxToRem(6),
                            mr: pxToRem(-2),
                            color: 'inherit',
                          },
                          ...chip.sx,
                        }}
                      />

                      {ride.recurringLabel ? (
                        <Chip
                          label={ride.recurringLabel}
                          variant="outlined"
                          size="small"
                          sx={{
                            height: pxToRem(24),
                            borderWidth: pxToRem(1),
                            fontSize: pxToRem(11),
                            fontWeight: 600,
                            bgcolor: '#F5F3FF',
                            borderColor: '#DDD6FE',
                            color: '#6D28D9',
                            '& .MuiChip-label': { px: pxToRem(8) },
                          }}
                        />
                      ) : null}
                    </RowStack>

                    <RowStack spacing={1.25} flexWrap="wrap">
                      <RowStack spacing={1}>
                        <CalendarMonthRoundedIcon
                          sx={{ fontSize: pxToRem(14), color: '#94A3B8' }}
                        />
                        <Typography
                          sx={{
                            color: '#0F172A',
                            fontSize: pxToRem(12),
                            fontWeight: 600,
                          }}
                        >
                          {ride.dateLabel}
                        </Typography>
                      </RowStack>

                      <RowStack spacing={1}>
                        <ScheduleRoundedIcon
                          sx={{ fontSize: pxToRem(14), color: '#94A3B8' }}
                        />
                        <Typography
                          sx={{
                            color: '#94A3B8',
                            fontSize: pxToRem(11),
                            fontWeight: 500,
                          }}
                        >
                          {ride.timeLabel}
                        </Typography>
                      </RowStack>
                    </RowStack>

                    <Stack spacing={0.75}>
                      <RowStack spacing={1.25} sx={{ minWidth: 0 }}>
                        <Box
                          sx={{
                            width: pxToRem(8),
                            height: pxToRem(8),
                            borderRadius: pxToRem(999),
                            bgcolor: '#155DFC',
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          sx={{
                            color: '#0F172A',
                            fontSize: pxToRem(12),
                            lineHeight: pxToRem(18),
                            fontWeight: 500,
                            minWidth: 0,
                          }}
                          noWrap
                        >
                          {ride.pickupAddress}
                        </Typography>
                      </RowStack>

                      <RowStack spacing={1.25} sx={{ minWidth: 0 }}>
                        <Box
                          sx={{
                            width: pxToRem(8),
                            height: pxToRem(8),
                            borderRadius: pxToRem(999),
                            bgcolor: '#00BC7D',
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          sx={{
                            color: '#0F172A',
                            fontSize: pxToRem(12),
                            lineHeight: pxToRem(18),
                            fontWeight: 500,
                            minWidth: 0,
                          }}
                          noWrap
                        >
                          {ride.destinationAddress}
                        </Typography>
                      </RowStack>
                    </Stack>

                    {ride.driverAssigned ? (
                      <RowStack spacing={1.25} sx={{ mt: pxToRem(4) }}>
                        <Box
                          sx={{
                            width: pxToRem(18),
                            height: pxToRem(18),
                            borderRadius: pxToRem(999),
                            bgcolor: '#155DFC',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: pxToRem(10),
                            fontWeight: 700,
                          }}
                        >
                          R
                        </Box>
                        <Typography
                          sx={{
                            color: '#64748B',
                            fontSize: pxToRem(11),
                            fontWeight: 500,
                          }}
                        >
                          Driver assigned —{' '}
                          <Box component="span" sx={{ fontWeight: 700 }}>
                            {ride.driverAssigned}
                          </Box>
                        </Typography>
                      </RowStack>
                    ) : null}
                  </Stack>
                </RowStack>

                <Stack
                  spacing={1}
                  alignItems="flex-end"
                  sx={{ pt: pxToRem(2) }}
                >
                  <ButtonBase
                    onClick={() => onEdit(ride)}
                    sx={{ borderRadius: pxToRem(10) }}
                  >
                    <RowStack
                      spacing={1}
                      sx={{
                        bgcolor: '#EFF6FF',
                        borderRadius: pxToRem(10),
                        px: pxToRem(12),
                        py: pxToRem(6),
                        color: '#155DFC',
                      }}
                    >
                      <EditRoundedIcon sx={{ fontSize: pxToRem(14) }} />
                      <Typography
                        sx={{
                          color: '#155DFC',
                          fontSize: pxToRem(12),
                          fontWeight: 700,
                        }}
                      >
                        Edit
                      </Typography>
                    </RowStack>
                  </ButtonBase>

                  <ButtonBase
                    onClick={() => onCancel(ride)}
                    sx={{ borderRadius: pxToRem(10) }}
                  >
                    <RowStack
                      spacing={1}
                      sx={{
                        bgcolor: '#F8FAFC',
                        borderRadius: pxToRem(10),
                        px: pxToRem(12),
                        py: pxToRem(6),
                        color: '#64748B',
                      }}
                    >
                      <CancelRoundedIcon sx={{ fontSize: pxToRem(14) }} />
                      <Typography
                        sx={{
                          color: '#64748B',
                          fontSize: pxToRem(12),
                          fontWeight: 600,
                        }}
                      >
                        Cancel
                      </Typography>
                    </RowStack>
                  </ButtonBase>
                </Stack>
              </RowStack>
            </Box>
          </Paper>
        );
      })}
    </Stack>
  );
}
