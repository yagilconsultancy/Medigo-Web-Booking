'use client';

import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { Box, Paper, Skeleton, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { toast } from 'sonner';
import dayjs from 'dayjs';

import {
  pxToRem,
  useGetRideDetail,
  useResolvedApiQuery,
} from '@/common';
import { AppFooter, AppLayout } from '@/ui/modules/partials';
import { HeaderHelpUser } from '@/ui/modules/partials/AppHeader/ui/components';
import { AppButton, RowStack } from '@/ui/modules/components';

/* ─── types ─── */

type DetailRow = {
  icon: string;
  label: string;
  value: string;
  secondary?: string;
  route?: { pickup: string; dropoff: string };
};

type NextStep = {
  icon: string;
  iconBg: string;
  title: string;
  description: string;
  showConnector?: boolean;
};

/* ─── static data ─── */

const nextSteps: NextStep[] = [
  {
    icon: '/booking-icons/sms-step-icon.svg',
    iconBg: '#EFF6FF',
    title: 'SMS confirmation sent',
    description: 'Booking details delivered to your phone',
    showConnector: true,
  },
  {
    icon: '/booking-icons/driver-step-icon.svg',
    iconBg: '#F5F3FF',
    title: 'Driver assigned',
    description: "You'll be notified within 2 hours of pickup",
    showConnector: true,
  },
  {
    icon: '/booking-icons/tracking-step-icon.svg',
    iconBg: '#ECFDF5',
    title: 'Live tracking link',
    description: 'Shared 30 minutes before your pickup time',
  },
];

/* ─── component ─── */

export function BookingSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rideId = searchParams.get('ride_id') || '';

  const { data: rideResponse, isLoading } = useGetRideDetail(rideId || undefined);
  // const {} = useResolvedApiQuery(
  //   useGetRideDetail,
  //   null,
  //   rideId
  // )
  const rideDetail = rideResponse?.success ? rideResponse.data : null;

  const bookingRef = rideId
    ? `${rideId}`
    : '';

  const patientName = rideDetail
    ? `${rideDetail.passenger_first_name ?? ''} ${rideDetail.passenger_last_name ?? ''}`.trim()
    : '';
  const pickup = rideDetail?.pickup_address ?? '';
  const dropoff = rideDetail?.destination_address ?? '';
  const dateTime = rideDetail?.scheduled_at
    ? dayjs(rideDetail.scheduled_at).format('dddd, DD MMMM YYYY')
    : '';
  const time = rideDetail?.scheduled_at
    ? dayjs(rideDetail.scheduled_at).format('HH:mm')
    : '';
  const vehicleType = rideDetail?.ride_type ?? '';
  const serviceType = rideDetail?.trip_type ?? '';
  const totalPaid = rideDetail?.estimated_fare != null
    ? `$${rideDetail.estimated_fare.toFixed(2)}`
    : '$0.00';

  const details: DetailRow[] = useMemo(
    () => [
      {
        icon: '/booking-icons/patient-icon.svg',
        label: 'Patient',
        value: patientName,
      },
      {
        icon: '/booking-icons/route-icon.svg',
        label: 'Route',
        value: '',
        route: { pickup, dropoff },
      },
      {
        icon: '/booking-icons/datetime-icon.svg',
        label: 'Date & Time',
        value: `${dateTime} · ${time}`,
      },
      {
        icon: '/booking-icons/vehicle-icon.svg',
        label: 'Vehicle & Service',
        value: vehicleType,
        secondary: serviceType,
      },
    ],
    [patientName, pickup, dropoff, dateTime, time, vehicleType, serviceType]
  );

  const handleCopyRef = () => {
    navigator.clipboard.writeText(bookingRef);
    toast.success('Booking reference copied!');
  };

  if (isLoading) {
    return (
      <AppLayout
        headerProps={{ showRightContent: true, rightContent: <HeaderHelpUser /> }}
      >
        <Box
          sx={{
            bgcolor: '#F8FAFC',
            minHeight: `calc(100vh - ${pxToRem(64)})`,
            display: 'flex',
            justifyContent: 'center',
            px: { xs: pxToRem(16), md: pxToRem(40) },
            py: pxToRem(56),
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 580 }}>
            <Skeleton variant="circular" width={72} height={72} sx={{ mx: 'auto', mb: pxToRem(20) }} />
            <Skeleton variant="text" width={200} sx={{ mx: 'auto', mb: pxToRem(8) }} />
            <Skeleton variant="rounded" height={300} sx={{ borderRadius: pxToRem(16) }} />
          </Box>
        </Box>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      headerProps={{ showRightContent: true, rightContent: <HeaderHelpUser /> }}
    >
      <Box
        sx={{
          bgcolor: '#F8FAFC',
          minHeight: `calc(100vh - ${pxToRem(64)})`,
          display: 'flex',
          justifyContent: 'center',
          px: { xs: pxToRem(16), md: pxToRem(40) },
          py: pxToRem(56),
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 580 }}>
          {/* ── Success Header ── */}
          <Box sx={{ textAlign: 'center', mb: pxToRem(32) }}>
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                bgcolor: '#DCFCE7',
                boxShadow: '0px 0px 0px 10px rgba(240, 253, 244, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: pxToRem(20),
              }}
            >
              <Image
                src="/booking-icons/success-check.svg"
                alt="Success"
                width={36}
                height={36}
              />
            </Box>

            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: pxToRem(6),
                bgcolor: '#F0FDF4',
                border: '0.67px solid #BBF7D0',
                borderRadius: 999,
                px: pxToRem(12),
                py: pxToRem(4),
                mb: pxToRem(12),
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: '#16A34A',
                }}
              />
              <Typography
                sx={{
                  fontSize: pxToRem(12),
                  fontWeight: 600,
                  color: '#16A34A',
                }}
              >
                Confirmed
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: pxToRem(28),
                fontWeight: 700,
                color: '#0F172A',
                letterSpacing: '-0.02em',
              }}
            >
              Booking Confirmed!
            </Typography>

            <Typography
              sx={{
                mt: pxToRem(8),
                fontSize: pxToRem(14),
                fontWeight: 400,
                color: '#64748B',
                lineHeight: pxToRem(23),
              }}
            >
              Your medical transport has been successfully booked.
            </Typography>
            <Typography
              sx={{
                fontSize: pxToRem(14),
                fontWeight: 400,
                color: '#64748B',
                lineHeight: pxToRem(23),
              }}
            >
              Keep your reference number for any queries.
            </Typography>
          </Box>

          {/* ── Booking Details Card ── */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: pxToRem(16),
              border: '0.67px solid #E2E8F0',
              boxShadow:
                '0px 6px 24px 0px rgba(0, 0, 0, 0.06), 0px 1px 3px 0px rgba(0, 0, 0, 0.04)',
              overflow: 'hidden',
              mb: pxToRem(20),
            }}
          >
            {/* Reference Header */}
            <Box
              sx={{
                background:
                  'linear-gradient(135deg, rgba(240, 253, 244, 1) 0%, rgba(220, 252, 231, 1) 100%)',
                borderBottom: '0.67px solid #C8E6C9',
                px: pxToRem(24),
                py: pxToRem(20),
              }}
            >
              <Typography
                sx={{
                  fontSize: pxToRem(10),
                  fontWeight: 600,
                  color: '#6BAE85',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  mb: pxToRem(8),
                }}
              >
                Booking Reference
              </Typography>
              <RowStack justifyContent="space-between">
                <Typography
                  sx={{
                    fontSize: pxToRem(24),
                    fontWeight: 800,
                    color: '#14532D',
                    letterSpacing: '0.06em',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {bookingRef}
                </Typography>
                <AppButton
                  variant="text"
                  onClick={handleCopyRef}
                  startIcon={
                    <ContentCopyRoundedIcon sx={{ fontSize: 14, color: '#16A34A' }} />
                  }
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.7)',
                    border: '0.67px solid #A7F3D0',
                    borderRadius: pxToRem(10),
                    color: '#16A34A',
                    fontSize: pxToRem(12),
                    fontWeight: 500,
                    textTransform: 'none',
                    px: pxToRem(12),
                    py: pxToRem(6),
                    background: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.9) !important',
                    },
                  }}
                >
                  Copy
                </AppButton>
              </RowStack>
            </Box>

            {/* Detail Rows */}
            <Box>
              {details.map((detail, idx) => (
                <Box
                  key={detail.label}
                  sx={{
                    display: 'flex',
                    gap: pxToRem(14),
                    px: pxToRem(24),
                    py: pxToRem(16),
                    borderBottom:
                      idx < details.length - 1
                        ? '0.67px solid #F1F5F9'
                        : 'none',
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: pxToRem(14),
                      bgcolor: '#F8FAFC',
                      border: '0.67px solid #EEF2F7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={detail.icon}
                      alt=""
                      width={16}
                      height={16}
                    />
                  </Box>

                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: pxToRem(10),
                        fontWeight: 600,
                        color: '#94A3B8',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        mb: pxToRem(4),
                      }}
                    >
                      {detail.label}
                    </Typography>

                    {detail.route ? (
                      <Stack spacing={0.75}>
                        <RowStack spacing={1}>
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: '#2563EB',
                              flexShrink: 0,
                              mt: pxToRem(6),
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: pxToRem(13),
                              fontWeight: 500,
                              color: '#101828',
                              lineHeight: pxToRem(18),
                            }}
                          >
                            {detail.route.pickup}
                          </Typography>
                        </RowStack>
                        <Box
                          sx={{
                            ml: pxToRem(2.5),
                            width: 1,
                            height: 14,
                            bgcolor: '#DBEAFE',
                          }}
                        />
                        <RowStack spacing={1}>
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: '#EF4444',
                              flexShrink: 0,
                              mt: pxToRem(6),
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: pxToRem(13),
                              fontWeight: 500,
                              color: '#101828',
                              lineHeight: pxToRem(18),
                            }}
                          >
                            {detail.route.dropoff}
                          </Typography>
                        </RowStack>
                      </Stack>
                    ) : (
                      <>
                        <Typography
                          sx={{
                            fontSize: pxToRem(14),
                            fontWeight: 600,
                            color: '#101828',
                            lineHeight: pxToRem(21),
                          }}
                        >
                          {detail.value}
                        </Typography>
                        {detail.secondary ? (
                          <Typography
                            sx={{
                              mt: pxToRem(2),
                              fontSize: pxToRem(12),
                              fontWeight: 400,
                              color: '#64748B',
                            }}
                          >
                            {detail.secondary.replace('_', ' ')}
                          </Typography>
                        ) : null}
                      </>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Total Paid */}
            <Box
              sx={{
                mx: pxToRem(20),
                mb: pxToRem(20),
                bgcolor: '#F8FAFC',
                border: '0.67px solid #E2E8F0',
                borderRadius: pxToRem(14),
                px: pxToRem(20),
                py: pxToRem(16),
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{
                  fontSize: pxToRem(12),
                  fontWeight: 500,
                  color: '#64748B',
                }}
              >
                Total paid
              </Typography>
              <Box sx={{ textAlign: 'right' }}>
                <Typography
                  sx={{
                    fontSize: pxToRem(26),
                    fontWeight: 800,
                    color: '#0F172A',
                    letterSpacing: '-0.02em',
                    lineHeight: pxToRem(26),
                  }}
                >
                  {totalPaid}
                </Typography>
                <Typography
                  sx={{
                    mt: pxToRem(4),
                    fontSize: pxToRem(11),
                    fontWeight: 500,
                    color: '#2563EB',
                    cursor: 'pointer',
                  }}
                >
                  View full breakdown
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* ── What Happens Next ── */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: pxToRem(16),
              border: '0.67px solid #E2E8F0',
              boxShadow:
                '0px 4px 16px 0px rgba(0, 0, 0, 0.04), 0px 1px 3px 0px rgba(0, 0, 0, 0.03)',
              overflow: 'hidden',
              mb: pxToRem(32),
            }}
          >
            <Box
              sx={{
                px: pxToRem(24),
                py: pxToRem(20),
                borderBottom: '0.67px solid #F1F5F9',
              }}
            >
              <Typography
                sx={{
                  fontSize: pxToRem(13),
                  fontWeight: 700,
                  color: '#0F172A',
                }}
              >
                What happens next
              </Typography>
            </Box>

            <Box sx={{ px: pxToRem(24), py: pxToRem(16) }}>
              {nextSteps.map((step, idx) => (
                <Box
                  key={step.title}
                  sx={{
                    display: 'flex',
                    gap: pxToRem(16),
                    position: 'relative',
                    pb: idx < nextSteps.length - 1 ? pxToRem(24) : 0,
                  }}
                >
                  {/* Icon + Connector */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: pxToRem(14),
                        bgcolor: step.iconBg,
                        border: `0.67px solid ${step.iconBg}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Image
                        src={step.icon}
                        alt=""
                        width={16}
                        height={16}
                      />
                    </Box>
                    {step.showConnector ? (
                      <Box
                        sx={{
                          width: 1,
                          flex: 1,
                          bgcolor: '#E2E8F0',
                          mt: pxToRem(6),
                        }}
                      />
                    ) : null}
                  </Box>

                  {/* Text */}
                  <Box sx={{ pt: pxToRem(4) }}>
                    <Typography
                      sx={{
                        fontSize: pxToRem(13),
                        fontWeight: 600,
                        color: '#101828',
                        lineHeight: pxToRem(19.5),
                      }}
                    >
                      {step.title}
                    </Typography>
                    <Typography
                      sx={{
                        mt: pxToRem(1),
                        fontSize: pxToRem(12),
                        fontWeight: 400,
                        color: '#94A3B8',
                        lineHeight: pxToRem(18),
                      }}
                    >
                      {step.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* ── Action Buttons ── */}
          <Stack spacing={pxToRem(17)}>
            <AppButton
              fullWidth
              onClick={() => router.push('/my-rides')}
              sx={{
                bgcolor: '#2F6FED',
                color: '#FFFFFF',
                height: 48,
                borderRadius: pxToRem(14),
                fontSize: pxToRem(14),
                fontWeight: 600,
                boxShadow:
                  '0px 4px 12px 0px rgba(0, 122, 255, 0.18), 0px 1px 3px 0px rgba(0, 122, 255, 0.25)',
                '&:hover': { bgcolor: '#2F6FED !important', background: '#2F6FED !important' },
              }}
            >
              Track Trip
            </AppButton>

            <AppButton
              fullWidth
              variant="outlined"
              onClick={() => router.push('/booking')}
              sx={{
                height: 48,
                borderRadius: pxToRem(14),
                border: '0.67px solid #2F6FED',
                color: '#2F6FED',
                fontSize: pxToRem(14),
                fontWeight: 500,
                background: 'transparent',
                '&:hover': { background: 'rgba(47, 111, 237, 0.04) !important' },
              }}
            >
              Book Another Trip
            </AppButton>

            <AppButton
              fullWidth
              variant="text"
              startIcon={
                <Image
                  src="/booking-icons/download-icon.svg"
                  alt=""
                  width={16}
                  height={16}
                  style={{ opacity: 0.7 }}
                />
              }
              sx={{
                height: 48,
                borderRadius: pxToRem(14),
                color: '#475569',
                fontSize: pxToRem(14),
                fontWeight: 400,
                opacity: 0.7,
                background: 'transparent',
                '&:hover': { background: 'rgba(0, 0, 0, 0.04) !important' },
              }}
            >
              Download Receipt
            </AppButton>
          </Stack>

          <AppFooter sx={{ mt: pxToRem(40) }} />
        </Box>
      </Box>
    </AppLayout>
  );
}
