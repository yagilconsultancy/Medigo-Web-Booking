'use client';

import { useMemo, useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { AppButton, StyledImage } from '../../modules/components';
import { AppLayout } from '../../modules/partials';
import { pxToRem } from '../../../common';
import facilityBookingIcon from './ui/assets/icons/facility-booking-icon.svg';
import individualBookingIcon from './ui/assets/icons/individual-booking-icon.svg';

type BookingType = 'individual' | 'facility';

export function AuthPage() {
  const router = useRouter();
  const [bookingType, setBookingType] = useState<BookingType | null>(null);

  const isContinueDisabled = bookingType === null;

  const bookingOptions = useMemo(
    () => [
      {
        id: 'individual' as const,
        title: 'Individual',
        description: 'Book for yourself or a family member',
        icon: individualBookingIcon,
        items: ['Personal transport', 'Family bookings', 'Ride tracking'],
      },
      {
        id: 'facility' as const,
        title: 'Facility',
        description: 'Book on behalf of patients from a healthcare facility',
        icon: facilityBookingIcon,
        items: [
          'Multi-patient management',
          'Bulk scheduling',
          'Staff dashboard',
        ],
      },
    ],
    []
  );

  const handleSelect = (value: BookingType) => setBookingType(value);

  return (
    <AppLayout headerProps={{ showRightContent: false }}>
      <Box
        sx={{
          width: '100%',
          minHeight: `calc(100vh - ${pxToRem(64)})`,
          bgcolor: '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 6, md: 10 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: pxToRem(520) }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: pxToRem(8),
              mb: pxToRem(40),
            }}
          >
            <Typography
              sx={{
                fontSize: pxToRem(28),
                lineHeight: pxToRem(35),
                fontWeight: 700,
                color: '#101828',
                textAlign: 'center',
              }}
            >
              Who are you booking for?
            </Typography>
            <Typography
              sx={{
                fontSize: pxToRem(15),
                lineHeight: pxToRem(24),
                fontWeight: 400,
                color: '#64748B',
                textAlign: 'center',
              }}
            >
              Choose how you&apos;ll be using MediGo to get started.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: pxToRem(22), mb: pxToRem(32) }}>
            {bookingOptions.map((option) => {
              const isActive = bookingType === option.id;

              return (
                <Box
                  key={option.id}
                  component="button"
                  type="button"
                  onClick={() => handleSelect(option.id)}
                  sx={{
                    width: pxToRem(252),
                    height: pxToRem(268),
                    borderRadius: pxToRem(16),
                    p: pxToRem(24),
                    textAlign: 'left',
                    border: isActive
                      ? '2px solid #007AFF'
                      : '2px solid #E2E8F0',
                    bgcolor: isActive ? '#F0F7FF' : '#FFFFFF',
                    boxShadow: isActive
                      ? '0px 10px 15px 0px rgba(0,122,255,0.12), 0px 4px 6px 0px rgba(0,122,255,0.12)'
                      : 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: pxToRem(8),
                    outline: 'none',
                    transition:
                      'transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease, background-color 140ms ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  {isActive ? (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: pxToRem(16),
                        right: pxToRem(16),
                        width: pxToRem(16),
                        height: pxToRem(16),
                        borderRadius: '999999px',
                        border: '1.5px solid #007AFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          width: pxToRem(6),
                          height: pxToRem(6),
                          borderRadius: '999999px',
                          bgcolor: '#007AFF',
                        }}
                      />
                    </Box>
                  ) : null}

                  <Box
                    sx={{
                      width: pxToRem(48),
                      height: pxToRem(48),
                      borderRadius: pxToRem(14),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: isActive ? '#007AFF' : '#F1F5F9',
                    }}
                  >
                    <StyledImage
                      src={option.icon}
                      alt={`${option.title} booking icon`}
                      width={24}
                      height={24}
                      sx={{
                        width: pxToRem(24),
                        height: pxToRem(24),
                        filter: isActive ? 'brightness(0) invert(1)' : 'none',
                      }}
                    />
                  </Box>

                  <Typography
                    sx={{
                      mt: pxToRem(12),
                      fontSize: pxToRem(15),
                      lineHeight: pxToRem(22.5),
                      fontWeight: 700,
                      color: isActive ? '#007AFF' : '#101828',
                    }}
                  >
                    {option.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: pxToRem(12),
                      lineHeight: pxToRem(18),
                      fontWeight: 500,
                      color: '#94A3B8',
                      maxWidth:
                        option.id === 'individual'
                          ? pxToRem(162)
                          : pxToRem(191),
                    }}
                  >
                    {option.description}
                  </Typography>

                  <Box
                    sx={{
                      mt: pxToRem(10),
                      display: 'flex',
                      flexDirection: 'column',
                      gap: pxToRem(8),
                    }}
                  >
                    {option.items.map((item) => (
                      <Box
                        key={item}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: pxToRem(8),
                        }}
                      >
                        <CheckIcon
                          sx={{
                            fontSize: pxToRem(12),
                            color: isActive ? '#007AFF' : '#94A3B8',
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: pxToRem(11),
                            lineHeight: pxToRem(16.5),
                            fontWeight: 500,
                            color: isActive ? '#334155' : '#94A3B8',
                          }}
                        >
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              );
            })}
          </Box>

          <AppButton
            variant="contained"
            fullWidth
            disabled={isContinueDisabled}
            sx={{
              height: pxToRem(52),
              borderRadius: pxToRem(14),
              fontSize: pxToRem(15),
              lineHeight: pxToRem(22.5),
              fontWeight: 600,
              bgcolor: '#007AFF',
              boxShadow: isContinueDisabled
                ? 'none'
                : '0px 1px 3px 0px rgba(0,0,0,0.10), 0px 1px 2px 0px rgba(0,0,0,0.10)',
              '&:hover': {
                bgcolor: '#007AFF',
              },
              '&:disabled': {
                bgcolor: '#007AFF',
                opacity: 0.5,
                color: '#FFFFFF',
              },
            }}
            onClick={() => {
              if (!bookingType) return;
              router.push(`/login?account=${bookingType}`);
            }}
          >
            Continue
            {!isContinueDisabled ? (
              <ArrowForwardIcon sx={{ fontSize: pxToRem(16) }} />
            ) : null}
          </AppButton>
        </Box>
      </Box>
    </AppLayout>
  );
}
