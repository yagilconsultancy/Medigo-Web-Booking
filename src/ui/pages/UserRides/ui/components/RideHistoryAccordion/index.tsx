'use client';

import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import AccessibleForwardRoundedIcon from '@mui/icons-material/AccessibleForwardRounded';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import PaymentRoundedIcon from '@mui/icons-material/PaymentRounded';
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  ButtonBase,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  pxToRem,
  useAccountStore,
  useGetRideDetail,
  usePaymentsApi,
  useLiveTrackStore,
  getRideDetail,
} from '@/common';
import { AppButton, RowStack } from '@/ui/modules/components';

export type RideStatus =
  | 'completed'
  | 'cancelled'
  | 'requested'
  | 'pending'
  | 'confirmed'
  | 'driver_assigned'
  | 'driver_en_route'
  | 'driver_arrived'
  | 'in_progress'
  | 'no_show';

export type RideHistoryItem = {
  id: string;
  fullRideId: string;
  status: RideStatus;
  statusLabel: string;
  serviceName: string;
  pickupAddress: string;
  dropoffAddress: string;
  dateLabel: string;
  timeLabel: string;
  details?: {
    driverLabel?: string;
    driver?: string;
    vehicle?: string;
    distance?: string;
    duration?: string;
    ratingLabel?: string;
  };
  cancelled?: {
    requestedVehicleLabel?: string;
    cancelledTitle?: string;
    reason?: string;
    note?: string;
    chargeLabel?: string;
  };
};

const getStatusChipSx = (status: RideStatus) => {
  switch (status) {
    case 'cancelled':
    case 'no_show':
      return {
        bgcolor: '#FEF2F2',
        borderColor: '#FECACA',
        color: '#B91C1C',
      } as const;

    case 'requested':
    case 'pending':
      return {
        bgcolor: '#EFF6FF',
        borderColor: '#BFDBFE',
        color: '#155DFC',
      } as const;

    case 'confirmed':
    case 'driver_assigned':
      return {
        bgcolor: '#FEF9C3',
        borderColor: '#FDE047',
        color: '#854D0E',
      } as const;

    case 'driver_en_route':
    case 'driver_arrived':
    case 'in_progress':
      return {
        bgcolor: '#FEF3C7',
        borderColor: '#FCD34D',
        color: '#92400E',
      } as const;

    case 'completed':
      return {
        bgcolor: '#ECFDF5',
        borderColor: '#A7F3D0',
        color: '#047857',
      } as const;

    default:
      return {
        bgcolor: '#EFF6FF',
        borderColor: '#BFDBFE',
        color: '#155DFC',
      } as const;
  }
};

const RideTypeIcon = ({ serviceName }: { serviceName: string }) => {
  if (serviceName.toLowerCase().includes('wheelchair')) {
    return <AccessibleForwardRoundedIcon sx={{ fontSize: pxToRem(20) }} />;
  }

  return <DirectionsCarRoundedIcon sx={{ fontSize: pxToRem(20) }} />;
};

type PendingRidePayment = {
  rideId: string;
  rideDetail: any;
};

export function RideHistoryAccordion({
  items,
  getRideHref = (rideId) => `/booking-success?ride_id=${rideId}`,
}: {
  items: RideHistoryItem[];
  getRideHref?: (rideId: string) => string;
}) {
  const [expandedId, setExpandedId] = useState<string | false>(false);
  const [pendingPayment, setPendingPayment] =
    useState<PendingRidePayment | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const router = useRouter();
  const { accountType } = useAccountStore();
  const { createPaymentIntent, isCreatingPaymentIntent } = usePaymentsApi();
  const { setLiveTrackContext } = useLiveTrackStore();

  // Fetch ride detail when we have a pending payment
  const { data: rideResponse, isLoading: isLoadingRide } = useGetRideDetail(
    pendingPayment?.rideId
  );

  const handlePayNow = (ride: RideHistoryItem) => {
    setPendingPayment({ rideId: ride.fullRideId, rideDetail: null });
  };

  // Process payment when ride detail is fetched
  useEffect(() => {
    const processPayment = async () => {
      if (
        !pendingPayment ||
        !rideResponse?.success ||
        !rideResponse.data ||
        isCreatingPaymentIntent ||
        isLoadingRide
      ) {
        return;
      }

      const rideDetail = rideResponse.data;
      const amount = rideDetail.estimated_fare ?? 0; // dollars; backend converts to cents for Stripe
      // @ts-ignore
      const currency = rideDetail.currency || 'CAD';

      const paymentResult = await createPaymentIntent({
        amount,
        currency,
        description:
          rideDetail.special_instructions || 'MediGo booking payment',
        order_id: pendingPayment.rideId,
        metadata: {
          account_type: accountType,
          service_type: rideDetail.trip_type ?? '',
          appointment_type: rideDetail.visit_type ?? '',
          vehicle_type: rideDetail.ride_type ?? '',
          trip_type: rideDetail.trip_structure ?? '',
        },
        setup_future_usage: 'on_session',
      });

      setPendingPayment(null);

      if (paymentResult) {
        router.push(
          `/checkout?ride_id=${encodeURIComponent(pendingPayment.rideId)}&client_secret=${encodeURIComponent(
            paymentResult.clientSecret
          )}&pk=${encodeURIComponent(paymentResult.publishableKey)}`
        );
      }
    };

    processPayment();
  }, [
    pendingPayment,
    rideResponse,
    isCreatingPaymentIntent,
    isLoadingRide,
    createPaymentIntent,
    accountType,
    router,
  ]);

  return (
    <Stack spacing={2}>
      {items.map((ride) => {
        const expanded = expandedId === ride.id;
        const chipSx = getStatusChipSx(ride.status);
        const isPaying =
          pendingPayment?.rideId === ride.fullRideId &&
          (isLoadingRide || isCreatingPaymentIntent);

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
            <Accordion
              disableGutters
              elevation={0}
              square
              expanded={expanded}
              onChange={(_, nextExpanded) => {
                setExpandedId(nextExpanded ? ride.id : false);
              }}
              sx={{
                '&:before': { display: 'none' },
                bgcolor: 'transparent',
              }}
            >
              <AccordionSummary
                expandIcon={
                  <KeyboardArrowDownRoundedIcon
                    sx={{ color: '#94A3B8', fontSize: pxToRem(18) }}
                  />
                }
                sx={{
                  px: pxToRem(24),
                  pt: pxToRem(24),
                  pb: pxToRem(18),
                  '& .MuiAccordionSummary-content': { my: 0 },
                  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                    transform: 'rotate(180deg)',
                  },
                }}
              >
                <RowStack
                  sx={{ width: '100%' }}
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
                        width: pxToRem(48),
                        height: pxToRem(48),
                        borderRadius: pxToRem(14),
                        bgcolor: '#EFF6FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: '#155DFC',
                      }}
                    >
                      <RideTypeIcon serviceName={ride.serviceName} />
                    </Box>

                    <Stack spacing={1.5} sx={{ minWidth: 0 }}>
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
                          icon={
                            ride.status === 'cancelled' ||
                            ride.status === 'no_show' ? (
                              <CloseRoundedIcon
                                sx={{ fontSize: pxToRem(14) }}
                              />
                            ) : ride.status === 'completed' ? (
                              <CheckCircleRoundedIcon
                                sx={{ fontSize: pxToRem(14) }}
                              />
                            ) : (
                              <RouteRoundedIcon
                                sx={{ fontSize: pxToRem(14) }}
                              />
                            )
                          }
                          label={ride.statusLabel}
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
                            ...chipSx,
                          }}
                        />
                        <Typography
                          sx={{
                            color: '#94A3B8',
                            fontSize: pxToRem(12),
                            lineHeight: pxToRem(18),
                            fontWeight: 500,
                          }}
                        >
                          {ride.serviceName}
                        </Typography>
                      </RowStack>

                      <Stack spacing={1}>
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
                            {ride.dropoffAddress}
                          </Typography>
                        </RowStack>
                      </Stack>
                    </Stack>
                  </RowStack>

                  <Stack spacing={0.5} alignItems="flex-end">
                    <RowStack spacing={1}>
                      {ride.status === 'pending' ? (
                        <AppButton
                          variant="contained"
                          size="small"
                          disabled={isPaying}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePayNow(ride);
                          }}
                          sx={{
                            height: pxToRem(32),
                            px: pxToRem(16),
                            borderRadius: pxToRem(8),
                            fontSize: pxToRem(12),
                            fontWeight: 600,
                            bgcolor: '#007AFF',
                            color: '#FFFFFF',
                            textTransform: 'none',
                            boxShadow:
                              '0px 1px 1.5px rgba(0,122,255,0.25), 0px 4px 8px rgba(0,122,255,0.18)',
                            '&:hover': {
                              bgcolor: '#0056CC',
                            },
                            '&:disabled': {
                              bgcolor: '#007AFF',
                              opacity: 0.6,
                              color: '#FFFFFF',
                            },
                          }}
                        >
                          {isPaying ? (
                            <RowStack spacing={1}>
                              <CircularProgress
                                size={14}
                                sx={{ color: '#FFFFFF' }}
                              />
                              <span>Processing...</span>
                            </RowStack>
                          ) : (
                            <RowStack spacing={0.75}>
                              <PaymentRoundedIcon
                                sx={{ fontSize: pxToRem(16) }}
                              />
                              <span>Pay Now</span>
                            </RowStack>
                          )}
                        </AppButton>
                      ) : ride.status === 'driver_en_route' ||
                        ride.status === 'driver_arrived' ||
                        ride.status === 'in_progress' ? (
                        <AppButton
                          variant="contained"
                          size="small"
                          disabled={isTracking}
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              setIsTracking(true);
                              const res = await getRideDetail(ride.fullRideId);
                              const body = res.data;
                              const driverId =
                                'data' in body && body.data
                                  ? body.data.driver_id
                                  : null;
                              setLiveTrackContext({
                                rideId: ride.fullRideId,
                                driverId,
                              });
                            } catch {
                              setLiveTrackContext({
                                rideId: ride.fullRideId,
                                driverId: null,
                              });
                            } finally {
                              setIsTracking(false);
                              router.push(
                                `/live-track?ride_id=${ride.fullRideId}`
                              );
                            }
                          }}
                          sx={{
                            height: pxToRem(32),
                            px: pxToRem(16),
                            borderRadius: pxToRem(8),
                            fontSize: pxToRem(12),
                            fontWeight: 600,
                            bgcolor: '#16A34A',
                            color: '#FFFFFF',
                            textTransform: 'none',
                            boxShadow:
                              '0px 1px 1.5px rgba(22,163,74,0.25), 0px 4px 8px rgba(22,163,74,0.18)',
                            '&:hover': {
                              bgcolor: '#15803D',
                            },
                          }}
                        >
                          <RowStack spacing={0.75}>
                            <MyLocationRoundedIcon
                              sx={{ fontSize: pxToRem(16) }}
                            />
                            <span>Track Driver</span>
                          </RowStack>
                        </AppButton>
                      ) : (
                        <Stack spacing={0.5} alignItems="flex-end">
                          <Typography
                            sx={{
                              color: '#0F172A',
                              fontWeight: 700,
                              fontSize: pxToRem(12),
                              lineHeight: pxToRem(18),
                            }}
                          >
                            {ride.dateLabel}
                          </Typography>
                          <Typography
                            sx={{
                              color: '#94A3B8',
                              fontWeight: 500,
                              fontSize: pxToRem(11),
                              lineHeight: pxToRem(16),
                            }}
                          >
                            {ride.timeLabel}
                          </Typography>
                        </Stack>
                      )}
                      <AppButton
                        variant="outlined"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(getRideHref(ride.fullRideId));
                        }}
                        sx={{
                          height: pxToRem(32),
                          px: pxToRem(16),
                          borderRadius: pxToRem(8),
                          fontSize: pxToRem(12),
                          fontWeight: 600,
                          border: '1px solid #E5E7EB',
                          color: '#0F172A',
                          textTransform: 'none',
                          '&:hover': {
                            bgcolor: '#F9FAFB',
                            border: '1px solid #D1D5DB',
                          },
                        }}
                      >
                        View Ride
                      </AppButton>
                    </RowStack>
                  </Stack>
                </RowStack>
              </AccordionSummary>

              <AccordionDetails sx={{ px: 0, pb: 0 }}>
                <Divider sx={{ borderColor: '#F3F4F6' }} />

                {ride.status === 'cancelled' ? (
                  // Cancelled rides - show cancellation info
                  <Box sx={{ px: pxToRem(24), py: pxToRem(18) }}>
                    <Stack spacing={1.25}>
                      <Typography
                        sx={{
                          color: '#94A3B8',
                          fontSize: pxToRem(10),
                          fontWeight: 700,
                          letterSpacing: pxToRem(1),
                        }}
                      >
                        REQUESTED VEHICLE
                      </Typography>
                      <Typography
                        sx={{
                          color: '#0F172A',
                          fontSize: pxToRem(13),
                          fontWeight: 600,
                        }}
                      >
                        {ride.cancelled?.requestedVehicleLabel ??
                          ride.serviceName}
                      </Typography>
                    </Stack>

                    <Box
                      sx={{
                        mt: pxToRem(16),
                        bgcolor: '#FEF2F2',
                        border: '1px solid #FECACA',
                        borderRadius: pxToRem(12),
                        p: pxToRem(16),
                      }}
                    >
                      <RowStack
                        justifyContent="space-between"
                        alignItems="flex-start"
                        gap={2}
                      >
                        <RowStack
                          alignItems="flex-start"
                          gap={pxToRem(12)}
                          sx={{ minWidth: 0 }}
                        >
                          <Box
                            sx={{
                              width: pxToRem(36),
                              height: pxToRem(36),
                              borderRadius: pxToRem(12),
                              bgcolor: 'rgba(185,28,28,0.08)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              color: '#B91C1C',
                            }}
                          >
                            <CloseRoundedIcon sx={{ fontSize: pxToRem(18) }} />
                          </Box>

                          <Stack spacing={0.75} sx={{ minWidth: 0 }}>
                            <Typography
                              sx={{
                                color: '#B91C1C',
                                fontSize: pxToRem(13),
                                fontWeight: 700,
                              }}
                            >
                              {ride.cancelled?.cancelledTitle ??
                                'Ride Cancelled'}
                            </Typography>
                            {ride.cancelled?.reason ? (
                              <Typography
                                sx={{
                                  color: '#B91C1C',
                                  fontSize: pxToRem(12),
                                  fontWeight: 500,
                                }}
                              >
                                {ride.cancelled.reason}
                              </Typography>
                            ) : null}
                            {ride.cancelled?.note ? (
                              <Typography
                                sx={{
                                  color: '#F87171',
                                  fontSize: pxToRem(12),
                                  fontWeight: 500,
                                }}
                              >
                                {ride.cancelled.note}
                              </Typography>
                            ) : null}
                          </Stack>
                        </RowStack>

                        {ride.cancelled?.chargeLabel ? (
                          <Chip
                            label={ride.cancelled.chargeLabel}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(248,113,113,0.12)',
                              color: '#B91C1C',
                              fontWeight: 600,
                              fontSize: pxToRem(11),
                              height: pxToRem(22),
                            }}
                          />
                        ) : null}
                      </RowStack>
                    </Box>
                  </Box>
                ) : (
                  // Completed or Requested rides - show ride details
                  <Box sx={{ px: pxToRem(24), py: pxToRem(18) }}>
                    <RowStack
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                          xs: '1fr',
                          sm: 'repeat(2, minmax(0, 1fr))',
                          md: 'repeat(4, minmax(0, 1fr))',
                        },
                        gap: pxToRem(24),
                        alignItems: 'start',
                      }}
                    >
                      <Stack spacing={0.5}>
                        <Typography
                          sx={{
                            color: '#94A3B8',
                            fontSize: pxToRem(10),
                            fontWeight: 700,
                            letterSpacing: pxToRem(1),
                          }}
                        >
                          {ride.details?.driverLabel ?? 'DRIVER'}
                        </Typography>
                        <Typography
                          sx={{
                            color: '#0F172A',
                            fontSize: pxToRem(12),
                            fontWeight: 600,
                          }}
                        >
                          {ride.details?.driver ?? '-'}
                        </Typography>
                      </Stack>

                      <Stack spacing={0.5}>
                        <Typography
                          sx={{
                            color: '#94A3B8',
                            fontSize: pxToRem(10),
                            fontWeight: 700,
                            letterSpacing: pxToRem(1),
                          }}
                        >
                          VEHICLE
                        </Typography>
                        <Typography
                          sx={{
                            color: '#0F172A',
                            fontSize: pxToRem(12),
                            fontWeight: 600,
                          }}
                        >
                          {ride.details?.vehicle ?? '-'}
                        </Typography>
                      </Stack>

                      <Stack spacing={0.5}>
                        <Typography
                          sx={{
                            color: '#94A3B8',
                            fontSize: pxToRem(10),
                            fontWeight: 700,
                            letterSpacing: pxToRem(1),
                          }}
                        >
                          DISTANCE
                        </Typography>
                        <Typography
                          sx={{
                            color: '#0F172A',
                            fontSize: pxToRem(12),
                            fontWeight: 600,
                          }}
                        >
                          {ride.details?.distance ?? '-'}
                        </Typography>
                      </Stack>

                      <Stack spacing={0.5}>
                        <Typography
                          sx={{
                            color: '#94A3B8',
                            fontSize: pxToRem(10),
                            fontWeight: 700,
                            letterSpacing: pxToRem(1),
                          }}
                        >
                          DURATION
                        </Typography>
                        <Typography
                          sx={{
                            color: '#0F172A',
                            fontSize: pxToRem(12),
                            fontWeight: 600,
                          }}
                        >
                          {ride.details?.duration ?? '-'}
                        </Typography>
                      </Stack>
                    </RowStack>

                    {ride.status === 'completed' && (
                      <>
                        <Divider
                          sx={{ borderColor: '#F3F4F6', my: pxToRem(16) }}
                        />

                        <RowStack
                          justifyContent="space-between"
                          gap={2}
                          flexWrap="wrap"
                        >
                          <Stack spacing={0.75}>
                            <Typography
                              sx={{
                                color: '#94A3B8',
                                fontSize: pxToRem(10),
                                fontWeight: 700,
                                letterSpacing: pxToRem(1),
                              }}
                            >
                              YOUR RATING
                            </Typography>

                            <RowStack spacing={1}>
                              <RowStack spacing={0.25}>
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <StarRoundedIcon
                                    key={i}
                                    sx={{
                                      color: '#F59E0B',
                                      fontSize: pxToRem(16),
                                    }}
                                  />
                                ))}
                              </RowStack>

                              <Typography
                                sx={{
                                  color: '#64748B',
                                  fontSize: pxToRem(12),
                                  fontWeight: 600,
                                }}
                              >
                                {ride.details?.ratingLabel ?? 'Rated 5 stars'}
                              </Typography>
                            </RowStack>
                          </Stack>

                          <ButtonBase
                            onClick={() => undefined}
                            sx={{ borderRadius: pxToRem(10) }}
                          >
                            <RowStack
                              spacing={1}
                              sx={{
                                bgcolor: '#EFF6FF',
                                borderRadius: pxToRem(10),
                                px: pxToRem(14),
                                py: pxToRem(9),
                                color: '#155DFC',
                              }}
                            >
                              <ReceiptLongRoundedIcon
                                sx={{ fontSize: pxToRem(16) }}
                              />
                              <Typography
                                sx={{
                                  color: '#155DFC',
                                  fontSize: pxToRem(13),
                                  fontWeight: 600,
                                  lineHeight: pxToRem(20),
                                }}
                              >
                                Receipt
                              </Typography>
                            </RowStack>
                          </ButtonBase>
                        </RowStack>
                      </>
                    )}
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          </Paper>
        );
      })}
    </Stack>
  );
}
