'use client';

import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';
import { pxToRem } from '@/common';
import { useRidesApi } from '@/common/hooks/api/collection/useRidesApi';
import { useGetDriverContact } from '@/common/hooks/api/query/rides';
import { AppButton, AppModal, RowStack } from '@/ui/modules/components';

export type RateDriverModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rideId: string;
  tripDuration: string;
  onSubmitted: () => void;
};

export function RateDriverModal({
  open,
  setOpen,
  rideId,
  tripDuration,
  onSubmitted,
}: RateDriverModalProps) {
  const { submitRideRating } = useRidesApi();
  const {
    data: driverContact,
    isLoading,
    isError,
  } = useGetDriverContact(rideId, { enabled: open && Boolean(rideId) });
  const driverContactData = driverContact?.success ? driverContact.data : null;
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setRating(0);
      setHoveredRating(0);
      setComment('');
      setSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (rating === 0 || submitting) return;

    setSubmitting(true);
    const result = await submitRideRating(rideId, {
      rating_type: 'driver',
      rating,
      comment: comment.trim() || null,
    });

    setSubmitting(false);

    if (result) {
      setOpen(false);
      onSubmitted();
    }
  };

  const driverName = driverContactData
    ? `${driverContactData.first_name} ${driverContactData.last_name}`.trim()
    : 'Driver';
  const driverInitial = driverContactData
    ? `${driverContactData.first_name?.[0] ?? ''}${driverContactData.last_name?.[0] ?? ''}`.trim() ||
      'D'
    : 'D';
  const vehicleSummary = driverContactData
    ? [
        driverContactData.vehicle_color,
        driverContactData.vehicle_make,
        driverContactData.vehicle_model,
      ]
        .filter(Boolean)
        .join(' ')
    : '';
  const vehiclePlate = driverContactData?.vehicle_plate ?? '';

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
              {isLoading ? (
                <CircularProgress size={36} />
              ) : isError ? (
                <Typography
                  sx={{
                    fontSize: pxToRem(15),
                    fontWeight: 600,
                    color: '#B91C1C',
                  }}
                >
                  Driver details unavailable
                </Typography>
              ) : (
                <>
                  <Avatar
                    src={driverContactData?.avatar_url ?? undefined}
                    alt={driverName}
                    sx={{
                      width: pxToRem(106),
                      height: pxToRem(106),
                      border: '2.32px solid #FFD415',
                      bgcolor: '#2563EB',
                      color: '#FFFFFF',
                      fontSize: pxToRem(40),
                      fontWeight: 700,
                    }}
                  >
                    {driverInitial}
                  </Avatar>

                  <Typography
                    sx={{
                      fontSize: pxToRem(19.68),
                      fontWeight: 700,
                      lineHeight: pxToRem(29.52),
                      color: '#0F172A',
                      textAlign: 'center',
                    }}
                  >
                    {driverName}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: pxToRem(14),
                      fontWeight: 500,
                      color: '#475569',
                      textAlign: 'center',
                    }}
                  >
                    {driverContactData?.phone ?? 'No phone number'}
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

                  {driverContactData?.rating != null && (
                    <Typography
                      sx={{
                        fontSize: pxToRem(14),
                        fontWeight: 600,
                        color: '#0F172A',
                      }}
                    >
                      Rating: {driverContactData.rating.toFixed(1)}
                    </Typography>
                  )}

                  {vehicleSummary && (
                    <Typography
                      sx={{
                        fontSize: pxToRem(14),
                        fontWeight: 500,
                        color: '#475569',
                        textAlign: 'center',
                      }}
                    >
                      {vehicleSummary}
                      {vehiclePlate ? ` · ${vehiclePlate}` : ''}
                    </Typography>
                  )}
                </>
              )}
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
              disabled={rating === 0 || submitting}
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
              {submitting ? 'Submitting...' : 'Confirm Destination Arrival'}
            </AppButton>
          </Stack>
        </Box>
      </Box>
    </AppModal>
  );
}
