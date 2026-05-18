'use client';

import { Box, Stack, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MessageIcon from '@mui/icons-material/Message';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { pxToRem } from '@/common';
import { AppButton, AppModal, RowStack } from '@/ui/modules/components';

export type DriverArrivedModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  driverName: string;
  vehicleInfo: string;
  tripDate: string;
  freeWaitTime: string;
  onMessageDriver: () => void;
  onRequestMoreTime: () => void;
  onCancelRide: () => void;
};

export function DriverArrivedModal({
  open,
  setOpen,
  driverName,
  vehicleInfo,
  tripDate,
  freeWaitTime,
  onMessageDriver,
  onRequestMoreTime,
  onCancelRide,
}: DriverArrivedModalProps) {
  return (
    <AppModal
      open={open}
      setOpen={setOpen}
      label="driver-arrived-modal"
      padding="0"
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: pxToRem(420),
          bgcolor: '#FFFFFF',
          overflow: 'hidden',
        }}
      >
        {/* Driver Info Section */}
        <Box
          sx={{
            p: pxToRem(20),
            pb: pxToRem(0.67),
            borderBottom: '0.67px solid #F1F5F9',
          }}
        >
          <Box sx={{ position: 'relative', pb: pxToRem(20) }}>
            {/* Driver Avatar (placeholder for now) */}
            <Box
              sx={{
                width: pxToRem(42),
                height: pxToRem(42),
                borderRadius: '50%',
                bgcolor: '#E0E7FF',
                overflow: 'hidden',
                mb: pxToRem(8),
              }}
            >
              {/* Image will go here */}
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#2563EB',
                  color: '#FFFFFF',
                  fontSize: pxToRem(18),
                  fontWeight: 700,
                }}
              >
                {driverName.charAt(0)}
              </Box>
            </Box>

            <Stack
              spacing={pxToRem(2)}
              sx={{ ml: pxToRem(56), mt: pxToRem(-42) }}
            >
              <Typography
                sx={{
                  fontSize: pxToRem(14),
                  fontWeight: 700,
                  lineHeight: pxToRem(21),
                  color: '#0F172A',
                }}
              >
                Ride share with {driverName}
              </Typography>
              <Typography
                sx={{
                  fontSize: pxToRem(12),
                  lineHeight: pxToRem(18),
                  color: '#64748B',
                }}
              >
                {vehicleInfo}
              </Typography>
              <Typography
                sx={{
                  fontSize: pxToRem(11),
                  lineHeight: pxToRem(16.5),
                  color: '#94A3B8',
                }}
              >
                {tripDate}
              </Typography>
            </Stack>

            {/* Close Button */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: pxToRem(28),
                height: pxToRem(28),
                borderRadius: pxToRem(10),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: '#F1F5F9',
                },
              }}
              onClick={() => setOpen(false)}
            >
              <Typography sx={{ fontSize: pxToRem(18), color: '#64748B' }}>
                ✕
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Status and Actions Section */}
        <Box sx={{ p: pxToRem(20) }}>
          <Stack spacing={pxToRem(16)}>
            {/* Status */}
            <RowStack spacing={1}>
              <Box
                sx={{
                  width: pxToRem(8),
                  height: pxToRem(8),
                  borderRadius: '50%',
                  bgcolor: '#16A34A',
                  opacity: 0.52,
                }}
              />
              <Typography
                sx={{
                  fontSize: pxToRem(15),
                  fontWeight: 700,
                  lineHeight: pxToRem(22.5),
                  color: '#0F172A',
                }}
              >
                Your driver is here...
              </Typography>
            </RowStack>

            {/* Wait Time Info */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: pxToRem(16),
                bgcolor: '#F8FAFC',
                border: '0.67px solid #E2E8F0',
                borderRadius: pxToRem(14),
              }}
            >
              <RowStack spacing={1}>
                <AccessTimeIcon
                  sx={{ fontSize: pxToRem(16), color: '#64748B' }}
                />
                <Typography
                  sx={{
                    fontSize: pxToRem(13),
                    fontWeight: 500,
                    lineHeight: pxToRem(19.5),
                    color: '#64748B',
                  }}
                >
                  Waiting
                </Typography>
              </RowStack>
              <RowStack spacing={pxToRem(6)}>
                <Typography
                  sx={{
                    fontSize: pxToRem(12),
                    lineHeight: pxToRem(18),
                    color: '#94A3B8',
                  }}
                >
                  Free wait time left:
                </Typography>
                <Typography
                  sx={{
                    fontSize: pxToRem(14),
                    fontWeight: 800,
                    lineHeight: pxToRem(21),
                    color: '#EF4444',
                  }}
                >
                  {freeWaitTime}
                </Typography>
              </RowStack>
            </Box>

            {/* Message Driver Button */}
            <AppButton
              variant="contained"
              fullWidth
              onClick={onMessageDriver}
              sx={{
                height: pxToRem(48),
                borderRadius: pxToRem(14),
                bgcolor: '#2563EB',
                fontSize: pxToRem(14),
                fontWeight: 600,
                lineHeight: pxToRem(21),
                textTransform: 'none',
                boxShadow:
                  '0px 4px 16px rgba(37,99,235,0.15), 0px 2px 8px rgba(37,99,235,0.25)',
                '&:hover': {
                  bgcolor: '#1E40AF',
                },
              }}
            >
              <RowStack spacing={1}>
                <MessageIcon sx={{ fontSize: pxToRem(18) }} />
                <span>Message Driver</span>
              </RowStack>
            </AppButton>

            {/* Request More Time Button */}
            <AppButton
              variant="outlined"
              fullWidth
              onClick={onRequestMoreTime}
              sx={{
                height: pxToRem(48),
                borderRadius: pxToRem(14),
                border: '0.67px solid #E2E8F0',
                fontSize: pxToRem(14),
                fontWeight: 600,
                lineHeight: pxToRem(21),
                color: '#475569',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#F8FAFC',
                  border: '0.67px solid #E2E8F0',
                },
              }}
            >
              <RowStack spacing={1}>
                <ScheduleIcon sx={{ fontSize: pxToRem(16) }} />
                <span>Request More Time</span>
              </RowStack>
            </AppButton>

            {/* Cancel Ride Button */}
            <AppButton
              variant="text"
              fullWidth
              onClick={onCancelRide}
              sx={{
                height: pxToRem(37),
                fontSize: pxToRem(14),
                fontWeight: 600,
                lineHeight: pxToRem(21),
                color: '#EF4444',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'rgba(239,68,68,0.05)',
                },
              }}
            >
              Cancel Ride
            </AppButton>
          </Stack>
        </Box>
      </Box>
    </AppModal>
  );
}
