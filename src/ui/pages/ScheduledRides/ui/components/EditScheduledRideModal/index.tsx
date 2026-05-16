'use client';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import { Box, ButtonBase, IconButton, Stack, TextField, Typography } from '@mui/material';
import { pxToRem } from '@/common';
import { AppModal, RowStack } from '@/ui/modules/components';
import type { ScheduledRideItem } from '../ScheduledRideList';

export function EditScheduledRideModal({
  open,
  setOpen,
  ride,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ride: ScheduledRideItem | null;
}) {
  return (
    <AppModal
      open={open}
      setOpen={setOpen}
      label="Edit scheduled ride"
      padding="0px"
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: pxToRem(24),
          width: pxToRem(520),
          maxWidth: 'calc(100vw - 40px)',
          overflow: 'hidden',
        },
      }}
    >
      <Box sx={{ width: '100%' }}>
        <RowStack
          justifyContent="space-between"
          sx={{
            borderBottom: '1px solid #F3F4F6',
            px: pxToRem(28),
            py: pxToRem(20),
          }}
        >
          <Stack spacing={pxToRem(2)}>
            <Typography
              sx={{
                color: '#94A3B8',
                fontSize: pxToRem(11),
                fontWeight: 700,
                letterSpacing: pxToRem(1.1),
                textTransform: 'uppercase',
                lineHeight: pxToRem(16.5),
              }}
            >
              Edit Ride
            </Typography>
            <Typography
              sx={{
                color: '#0F172A',
                fontSize: pxToRem(18),
                fontWeight: 700,
                letterSpacing: pxToRem(-0.45),
                lineHeight: pxToRem(27),
              }}
            >
              {ride?.id ?? ''}
            </Typography>
          </Stack>

          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              width: pxToRem(36),
              height: pxToRem(36),
              bgcolor: '#F3F4F6',
              '&:hover': { bgcolor: '#F3F4F6' },
            }}
            aria-label="Close edit ride"
          >
            <CloseRoundedIcon sx={{ fontSize: pxToRem(18), color: '#0F172A' }} />
          </IconButton>
        </RowStack>

        <Box sx={{ px: pxToRem(28), pt: pxToRem(24), pb: pxToRem(20) }}>
          <Stack spacing={pxToRem(20)}>
            <Stack spacing={pxToRem(12)}>
              <Typography
                sx={{
                  color: '#94A3B8',
                  fontSize: pxToRem(11),
                  fontWeight: 700,
                  letterSpacing: pxToRem(1.1),
                  textTransform: 'uppercase',
                }}
              >
                Pickup Address
              </Typography>

              <RowStack spacing={1.5} sx={{ alignItems: 'center' }}>
                <Box
                  sx={{
                    width: pxToRem(8),
                    height: pxToRem(8),
                    borderRadius: pxToRem(999),
                    bgcolor: '#155DFC',
                    flexShrink: 0,
                  }}
                />
                <TextField
                  fullWidth
                  size="small"
                  defaultValue={ride?.pickupAddress ?? ''}
                  sx={{
                    '& .MuiInputBase-root': {
                      height: pxToRem(50),
                      bgcolor: '#F8FAFC',
                      borderRadius: pxToRem(12),
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E5E7EB',
                      borderWidth: pxToRem(1),
                    },
                    '& .MuiInputBase-input': {
                      fontSize: pxToRem(14),
                      color: '#99A1AF',
                      py: 0,
                    },
                  }}
                />
              </RowStack>

              <Box sx={{ pl: pxToRem(19) }}>
                <Box sx={{ width: pxToRem(1), height: pxToRem(16), bgcolor: '#E5E7EB' }} />
              </Box>

              <Typography
                sx={{
                  color: '#94A3B8',
                  fontSize: pxToRem(11),
                  fontWeight: 700,
                  letterSpacing: pxToRem(1.1),
                  textTransform: 'uppercase',
                }}
              >
                Destination
              </Typography>

              <RowStack spacing={1.5} sx={{ alignItems: 'center' }}>
                <Box
                  sx={{
                    width: pxToRem(8),
                    height: pxToRem(8),
                    borderRadius: pxToRem(999),
                    bgcolor: '#00BC7D',
                    flexShrink: 0,
                  }}
                />
                <TextField
                  fullWidth
                  size="small"
                  defaultValue={ride?.destinationAddress ?? ''}
                  sx={{
                    '& .MuiInputBase-root': {
                      height: pxToRem(50),
                      bgcolor: '#F8FAFC',
                      borderRadius: pxToRem(12),
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E5E7EB',
                      borderWidth: pxToRem(1),
                    },
                    '& .MuiInputBase-input': {
                      fontSize: pxToRem(14),
                      color: '#99A1AF',
                      py: 0,
                    },
                  }}
                />
              </RowStack>
            </Stack>

            <RowStack spacing={2} alignItems="flex-start">
              <Stack spacing={pxToRem(8)} sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    color: '#94A3B8',
                    fontSize: pxToRem(11),
                    fontWeight: 700,
                    letterSpacing: pxToRem(1.1),
                    textTransform: 'uppercase',
                  }}
                >
                  Date
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  defaultValue={ride?.dateLabel ?? ''}
                  sx={{
                    '& .MuiInputBase-root': {
                      height: pxToRem(50),
                      bgcolor: '#F8FAFC',
                      borderRadius: pxToRem(12),
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E5E7EB',
                      borderWidth: pxToRem(1),
                    },
                    '& .MuiInputBase-input': {
                      fontSize: pxToRem(14),
                      color: '#99A1AF',
                      py: 0,
                    },
                  }}
                />
              </Stack>

              <Stack spacing={pxToRem(8)} sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    color: '#94A3B8',
                    fontSize: pxToRem(11),
                    fontWeight: 700,
                    letterSpacing: pxToRem(1.1),
                    textTransform: 'uppercase',
                  }}
                >
                  Time
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  defaultValue={ride?.timeLabel ?? ''}
                  sx={{
                    '& .MuiInputBase-root': {
                      height: pxToRem(50),
                      bgcolor: '#F8FAFC',
                      borderRadius: pxToRem(12),
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E5E7EB',
                      borderWidth: pxToRem(1),
                    },
                    '& .MuiInputBase-input': {
                      fontSize: pxToRem(14),
                      color: '#99A1AF',
                      py: 0,
                    },
                  }}
                />
              </Stack>
            </RowStack>

            <Stack spacing={pxToRem(8)}>
              <Typography
                sx={{
                  color: '#94A3B8',
                  fontSize: pxToRem(11),
                  fontWeight: 700,
                  letterSpacing: pxToRem(1.1),
                  textTransform: 'uppercase',
                }}
              >
                Notes for Driver{' '}
                <Box component="span" sx={{ fontWeight: 400, textTransform: 'none' }}>
                  (optional)
                </Box>
              </Typography>

              <TextField
                fullWidth
                multiline
                minRows={4}
                placeholder="Any changes or special instructions..."
                sx={{
                  '& .MuiInputBase-root': {
                    bgcolor: '#F8FAFC',
                    borderRadius: pxToRem(12),
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E5E7EB',
                    borderWidth: pxToRem(1),
                  },
                  '& .MuiInputBase-input': {
                    fontSize: pxToRem(14),
                    color: '#99A1AF',
                    lineHeight: pxToRem(21),
                  },
                }}
              />
            </Stack>

            <RowStack
              spacing={1.25}
              alignItems="flex-start"
              sx={{
                bgcolor: '#FFFBEB',
                border: '1px solid #FEF3C6',
                borderRadius: pxToRem(12),
                p: pxToRem(16),
              }}
            >
              <InfoOutlinedIcon sx={{ fontSize: pxToRem(16), color: '#92400E', mt: pxToRem(2) }} />
              <Typography
                sx={{
                  color: '#92400E',
                  fontSize: pxToRem(12),
                  lineHeight: pxToRem(19.5),
                }}
              >
                Changes to confirmed rides may require re-confirmation from dispatch.
                You&apos;ll be notified by SMS.
              </Typography>
            </RowStack>
          </Stack>
        </Box>

        <RowStack
          justifyContent="space-between"
          sx={{
            borderTop: '1px solid #F3F4F6',
            px: pxToRem(28),
            py: pxToRem(20),
          }}
        >
          <ButtonBase onClick={() => setOpen(false)} sx={{ borderRadius: pxToRem(999) }}>
            <Box
              sx={{
                border: '1px solid #E5E7EB',
                borderRadius: pxToRem(999),
                px: pxToRem(20),
                py: pxToRem(10),
              }}
            >
              <Typography sx={{ color: '#64748B', fontSize: pxToRem(13), fontWeight: 600 }}>
                Discard
              </Typography>
            </Box>
          </ButtonBase>

          <ButtonBase onClick={() => setOpen(false)} sx={{ borderRadius: pxToRem(999) }}>
            <RowStack
              spacing={1}
              sx={{
                bgcolor: '#155DFC',
                borderRadius: pxToRem(999),
                px: pxToRem(20),
                py: pxToRem(10),
                boxShadow: '0px 2px 5px rgba(21,93,252,0.28)',
              }}
            >
              <Typography sx={{ color: '#FFFFFF', fontSize: pxToRem(13), fontWeight: 700 }}>
                Save Changes
              </Typography>
              <KeyboardArrowRightRoundedIcon sx={{ fontSize: pxToRem(18), color: '#FFFFFF' }} />
            </RowStack>
          </ButtonBase>
        </RowStack>
      </Box>
    </AppModal>
  );
}

