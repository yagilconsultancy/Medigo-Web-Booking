'use client';

import { useState } from 'react';
import { Box, Stack, Typography, TextField, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';
import { pxToRem } from '@/common';
import { AppButton, AppModal, RowStack } from '@/ui/modules/components';

export type RateDriverModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  driverName: string;
  tripDuration: string;
  onSubmit: (rating: number, tip: number, comment: string) => void;
};

export function RateDriverModal({
  open,
  setOpen,
  driverName,
  tripDuration,
  onSubmit,
}: RateDriverModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [tip, setTip] = useState(10);
  const [comment, setComment] = useState('');

  const tipOptions = [0, 5, 10, 15];

  const handleSubmit = () => {
    onSubmit(rating, tip, comment);
  };

  return (
    <AppModal
      open={open}
      setOpen={setOpen}
      label="rate-driver-modal"
      padding="0"
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: pxToRem(600),
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={() => setOpen(false)}
          sx={{
            position: 'absolute',
            top: pxToRem(34),
            right: pxToRem(27),
            width: pxToRem(40),
            height: pxToRem(40),
            bgcolor: '#F8F9FA',
            borderRadius: '50%',
            zIndex: 1,
            '&:hover': {
              bgcolor: '#E9ECEF',
            },
          }}
        >
          <CloseIcon sx={{ fontSize: pxToRem(20), color: '#111827' }} />
        </IconButton>

        <Box sx={{ p: pxToRem(84), pt: pxToRem(78) }}>
          <Stack spacing={pxToRem(24)} alignItems="center">
            {/* Title */}
            <Typography
              sx={{
                fontSize: pxToRem(22),
                fontWeight: 500,
                lineHeight: pxToRem(33),
                color: '#0F172A',
                textAlign: 'center',
              }}
            >
              You&apos;ve reached your destination!
            </Typography>

            {/* Driver Info */}
            <Stack
              spacing={pxToRem(12)}
              alignItems="center"
              sx={{ width: '100%' }}
            >
              {/* Driver Avatar */}
              <Box
                sx={{
                  width: pxToRem(106),
                  height: pxToRem(106),
                  borderRadius: pxToRem(69),
                  border: '2.32px solid #FFD415',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#2563EB',
                  color: '#FFFFFF',
                  fontSize: pxToRem(40),
                  fontWeight: 700,
                }}
              >
                {driverName.charAt(0)}
              </Box>

              <Typography
                sx={{
                  fontSize: pxToRem(19.68),
                  fontWeight: 700,
                  lineHeight: pxToRem(29.52),
                  color: '#0F172A',
                }}
              >
                {driverName}
              </Typography>

              <RowStack spacing={pxToRem(6.95)}>
                <AccessTimeIcon
                  sx={{ fontSize: pxToRem(16.21), color: '#F59E0B' }}
                />
                <Typography
                  sx={{
                    fontSize: pxToRem(15.05),
                    fontWeight: 600,
                    lineHeight: pxToRem(22.58),
                    color: '#F59E0B',
                  }}
                >
                  {tripDuration}
                </Typography>
              </RowStack>
            </Stack>

            {/* Rating Section */}
            <Stack
              spacing={pxToRem(12)}
              alignItems="center"
              sx={{ width: '100%' }}
            >
              <Typography
                sx={{
                  fontSize: pxToRem(15),
                  fontWeight: 600,
                  lineHeight: pxToRem(22.5),
                  color: '#475569',
                }}
              >
                How was the trip?
              </Typography>

              <RowStack spacing={pxToRem(13)}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <IconButton
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    sx={{ p: 0 }}
                  >
                    {star <= (hoveredRating || rating) ? (
                      <StarIcon
                        sx={{ fontSize: pxToRem(36), color: '#FFD415' }}
                      />
                    ) : (
                      <StarBorderIcon
                        sx={{ fontSize: pxToRem(36), color: '#E2E8F0' }}
                      />
                    )}
                  </IconButton>
                ))}
              </RowStack>
            </Stack>

            {/* Tip Section */}
            <Stack
              spacing={pxToRem(12)}
              sx={{ width: '100%', px: pxToRem(24) }}
            >
              <Typography
                sx={{
                  fontSize: pxToRem(15),
                  fontWeight: 600,
                  lineHeight: pxToRem(22.5),
                  color: '#475569',
                  textAlign: 'center',
                }}
              >
                Support the driver
              </Typography>

              <RowStack spacing={pxToRem(12)} justifyContent="space-between">
                {tipOptions.map((amount) => (
                  <AppButton
                    key={amount}
                    variant={tip === amount ? 'contained' : 'outlined'}
                    onClick={() => setTip(amount)}
                    sx={{
                      flex: 1,
                      height: pxToRem(48),
                      borderRadius: pxToRem(14),
                      border: tip === amount ? 'none' : '2px solid #E2E8F0',
                      bgcolor: tip === amount ? '#EFF6FF' : '#FFFFFF',
                      color: tip === amount ? '#2563EB' : '#475569',
                      fontSize: pxToRem(16),
                      fontWeight: 700,
                      lineHeight: pxToRem(24),
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: tip === amount ? '#DBEAFE' : '#F8FAFC',
                        border: tip === amount ? 'none' : '2px solid #E2E8F0',
                      },
                    }}
                  >
                    ${amount}
                  </AppButton>
                ))}
                <AppButton
                  variant="outlined"
                  sx={{
                    width: pxToRem(92),
                    height: pxToRem(48),
                    borderRadius: pxToRem(14),
                    border: '2px solid #E2E8F0',
                    fontSize: pxToRem(16),
                    fontWeight: 600,
                    color: '#475569',
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: '#F8FAFC',
                      border: '2px solid #E2E8F0',
                    },
                  }}
                >
                  Custom
                </AppButton>
              </RowStack>
            </Stack>

            {/* Comment Section */}
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Add a comment for the driver..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#F8FAFC',
                  borderRadius: pxToRem(14),
                  fontSize: pxToRem(14),
                  lineHeight: pxToRem(21),
                  '& fieldset': {
                    borderColor: '#E2E8F0',
                    borderWidth: '0.67px',
                  },
                  '&:hover fieldset': {
                    borderColor: '#CBD5E1',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2563EB',
                    borderWidth: '0.67px',
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#94A3B8',
                  opacity: 1,
                },
              }}
            />

            {/* Submit Button */}
            <AppButton
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              disabled={rating === 0}
              sx={{
                height: pxToRem(56),
                borderRadius: pxToRem(16),
                bgcolor: '#2563EB',
                fontSize: pxToRem(16),
                fontWeight: 700,
                lineHeight: pxToRem(24),
                textTransform: 'none',
                boxShadow: '0px 4px 16px rgba(37,99,235,0.3)',
                '&:hover': {
                  bgcolor: '#1E40AF',
                },
                '&:disabled': {
                  bgcolor: '#CBD5E1',
                  color: '#94A3B8',
                },
              }}
            >
              Confirm Destination Arrival
            </AppButton>
          </Stack>
        </Box>
      </Box>
    </AppModal>
  );
}
