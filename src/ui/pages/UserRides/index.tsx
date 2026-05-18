'use client';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import TocRoundedIcon from '@mui/icons-material/TocRounded';
import {
  Box,
  Button,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { pxToRem, useGetMyRides } from '@/common';
import { AppFooter, AppLayout } from '@/ui/modules/partials';
import { HeaderHelpUser } from '@/ui/modules/partials/AppHeader/ui/components';
import { AppButton, RowStack } from '@/ui/modules/components';
import { EmptyState } from '@/ui/modules/blocks';
import {
  RideHistoryAccordion,
  type RideHistoryItem,
} from './ui/components/RideHistoryAccordion';
import { RideStatCard } from './ui/components/RideStatCard';

type RideTabKey = 'all' | 'completed' | 'cancelled';

const tabOrder: RideTabKey[] = ['all', 'completed', 'cancelled'];

const TAB_LABELS: Record<RideTabKey, string> = {
  all: 'All Rides',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

// const RIDES: RideHistoryItem[] = [
//   {
//     id: 'R-10483',
//     status: 'completed',
//     serviceName: 'MediGO Wheelchair',
//     pickupAddress: '2450 Lawrence Ave E, Toronto, ON',
//     dropoffAddress: 'Sunnybrook Health Sciences Centre, Toronto, ON',
//     dateLabel: 'Apr 18, 2026',
//     timeLabel: '9:00 AM',
//     details: {
//       driver: 'James Rivera',
//       vehicle: 'Toyota Sienna — WAV',
//       distance: '6.2 km',
//       duration: '18 min',
//       ratingLabel: 'Rated 5 stars',
//     },
//     cancelled: undefined,
//   },
//   {
//     id: 'R-10391',
//     status: 'completed',
//     serviceName: 'MediGO Standard',
//     pickupAddress: 'Sunnybrook Health Sciences Centre, Toronto, ON',
//     dropoffAddress: '2450 Lawrence Ave E, Toronto, ON',
//     dateLabel: 'Apr 10, 2026',
//     timeLabel: '2:30 PM',
//     details: {
//       driver: 'James Rivera',
//       vehicle: 'Toyota Sienna — Standard',
//       distance: '4.9 km',
//       duration: '14 min',
//       ratingLabel: 'Rated 5 stars',
//     },
//     cancelled: undefined,
//   },
//   {
//     id: 'R-10288',
//     status: 'completed',
//     serviceName: 'MediGO Wheelchair',
//     pickupAddress: '2450 Lawrence Ave E, Toronto, ON',
//     dropoffAddress: 'Toronto Rehab Institute, 550 University Ave',
//     dateLabel: 'Mar 27, 2026',
//     timeLabel: '11:00 AM',
//     details: {
//       driver: 'James Rivera',
//       vehicle: 'Toyota Sienna — WAV',
//       distance: '7.3 km',
//       duration: '22 min',
//       ratingLabel: 'Rated 5 stars',
//     },
//     cancelled: undefined,
//   },
//   {
//     id: 'R-10201',
//     status: 'cancelled',
//     serviceName: 'MediGO Wheelchair',
//     pickupAddress: '2450 Lawrence Ave E, Toronto, ON',
//     dropoffAddress: 'Toronto General Hospital, 200 Elizabeth St',
//     dateLabel: 'Mar 15, 2026',
//     timeLabel: '8:45 AM',
//     details: undefined,
//     cancelled: {
//       requestedVehicleLabel: 'MediGO Wheelchair',
//       cancelledTitle: 'Cancelled by you',
//       reason: 'Reason: Appointment rescheduled',
//       note: 'No driver was assigned before cancellation. Your account was not charged.',
//       chargeLabel: 'No charge',
//     },
//   },
//   {
//     id: 'R-10145',
//     status: 'completed',
//     serviceName: 'MediGO Standard',
//     pickupAddress: 'Toronto General Hospital, 200 Elizabeth St',
//     dropoffAddress: '2450 Lawrence Ave E, Toronto, ON',
//     dateLabel: 'Mar 3, 2026',
//     timeLabel: '3:15 PM',
//     details: {
//       driver: 'James Rivera',
//       vehicle: 'Toyota Sienna — Standard',
//       distance: '5.8 km',
//       duration: '16 min',
//       ratingLabel: 'Rated 5 stars',
//     },
//     cancelled: undefined,
//   },
//   {
//     id: 'R-10088',
//     status: 'completed',
//     serviceName: 'MediGO Stretcher',
//     pickupAddress: '2450 Lawrence Ave E, Toronto, ON',
//     dropoffAddress: 'Princess Margaret Cancer Centre, 610 University Ave',
//     dateLabel: 'Feb 19, 2026',
//     timeLabel: '10:00 AM',
//     details: {
//       driver: 'James Rivera',
//       vehicle: 'Transit — Stretcher',
//       distance: '9.4 km',
//       duration: '28 min',
//       ratingLabel: 'Rated 5 stars',
//     },
//     cancelled: undefined,
//   },
// ];

export function UserRidesPage() {
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);
  const activeTab = tabOrder[tabIndex] ?? 'all';
  const myRidesResponse = useGetMyRides({ page: 1, limit: 100 });
  const isLoading = myRidesResponse.isLoading;
  const myRidesData = myRidesResponse.data?.success
    ? myRidesResponse.data.data
    : null;
  const myRides = myRidesData?.rides ?? [];
  const summary = myRidesData?.summary;

  const formatRideStatus = (status: string): RideHistoryItem['status'] => {
    // Map all possible backend status values to frontend status types
    switch (status) {
      case 'completed':
        return 'completed';
      case 'cancelled':
        return 'cancelled';
      case 'requested':
        return 'requested';
      case 'pending':
        return 'pending';
      case 'confirmed':
        return 'confirmed';
      case 'driver_assigned':
        return 'driver_assigned';
      case 'driver_en_route':
        return 'driver_en_route';
      case 'driver_arrived':
        return 'driver_arrived';
      case 'in_progress':
        return 'in_progress';
      case 'no_show':
        return 'no_show';
      default:
        return 'requested';
    }
  };

  const getStatusLabel = (status: RideHistoryItem['status']): string => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'requested':
        return 'Requested';
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'driver_assigned':
        return 'Driver Assigned';
      case 'driver_en_route':
        return 'Driver is in the area';
      case 'driver_arrived':
        return 'Driver Arrived';
      case 'in_progress':
        return 'In Progress';
      case 'no_show':
        return 'No Show';
      default:
        return 'Requested';
    }
  };

  const formatRideType = (rideType: string) => {
    switch (rideType) {
      case 'wheelchair':
        return 'MediGO Wheelchair';

      case 'stretcher':
        return 'MediGO Stretcher';

      default:
        return 'MediGO Standard';
    }
  };

  const rides: RideHistoryItem[] = useMemo(() => {
    if (!myRides) return [];

    return myRides.map((ride: any) => {
      const status = formatRideStatus(ride.status);
      return {
        id: ride.id.slice(0, 8).toUpperCase(),
        fullRideId: ride.id,
        status,
        statusLabel: getStatusLabel(status),

        serviceName: formatRideType(ride.ride_type),

        pickupAddress: ride.pickup_address,

        dropoffAddress: ride.destination_address,

        dateLabel: new Date(ride.scheduled_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),

        timeLabel: new Date(ride.scheduled_at).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        }),

        details: ride.driver_name
          ? {
              driver: ride.driver_name,
              vehicle:
                ride.driver_vehicle_make && ride.driver_vehicle_model
                  ? `${ride.driver_vehicle_make} ${ride.driver_vehicle_model} — ${formatRideType(ride.ride_type).replace('MediGO ', '')}`
                  : formatRideType(ride.ride_type),
              distance: ride.estimated_distance_miles
                ? `${ride.estimated_distance_miles.toFixed(1)} mi`
                : '-',
              duration: ride.estimated_duration_minutes
                ? `${ride.estimated_duration_minutes} min`
                : '-',
              ratingLabel: ride.driver_rating
                ? `Rated ${ride.driver_rating} stars`
                : 'Not rated yet',
            }
          : ride.status === 'cancelled'
            ? undefined
            : {
                driver: 'Driver not yet assigned',
                vehicle: formatRideType(ride.ride_type),
                distance: ride.estimated_distance_miles
                  ? `${ride.estimated_distance_miles.toFixed(1)} mi`
                  : '-',
                duration: ride.estimated_duration_minutes
                  ? `${ride.estimated_duration_minutes} min`
                  : '-',
                ratingLabel: 'Pending',
              },

        cancelled:
          ride.status === 'cancelled'
            ? {
                requestedVehicleLabel: formatRideType(ride.ride_type),

                cancelledTitle: 'Ride Cancelled',

                reason: ride.special_instructions
                  ? `Reason: ${ride.special_instructions}`
                  : undefined,

                note: 'This ride was cancelled.',

                chargeLabel: 'No charge',
              }
            : undefined,
      };
    });
  }, [myRides]);

  const filteredRides = useMemo(() => {
    if (activeTab === 'all') return rides;
    return rides.filter((ride) => ride.status === activeTab);
  }, [activeTab, rides]);

  const statCards = useMemo(() => {
    return [
      {
        icon: <TocRoundedIcon sx={{ fontSize: pxToRem(18) }} />,
        value: summary?.total_rides?.toString() ?? '0',
        label: 'Total Rides',
      },
      {
        icon: <CheckCircleRoundedIcon sx={{ fontSize: pxToRem(18) }} />,
        value: summary?.completed_rides?.toString() ?? '0',
        label: 'Completed',
      },
      {
        icon: <CancelRoundedIcon sx={{ fontSize: pxToRem(18) }} />,
        value: summary?.cancelled_rides?.toString() ?? '0',
        label: 'Cancelled',
      },
      {
        icon: <RouteRoundedIcon sx={{ fontSize: pxToRem(18) }} />,
        value: summary?.miles_traveled?.toFixed(1) ?? '0.0',
        label: 'Miles Traveled',
      },
    ];
  }, [summary]);

  return (
    <AppLayout
      headerProps={{
        showRightContent: true,
        rightContent: <HeaderHelpUser />,
      }}
    >
      <Box
        sx={{
          bgcolor: '#F8FAFC',
          minHeight: `calc(100vh - ${pxToRem(64)})`,
          px: { xs: pxToRem(16), md: pxToRem(40) },
          py: pxToRem(28),
        }}
      >
        <Box sx={{ maxWidth: '1278px', mx: 'auto', px: '114px' }}>
          <Button
            startIcon={<ArrowBackIcon />}
            variant="text"
            size="small"
            sx={{
              color: '#64748B',
              fontSize: pxToRem(11),
              fontWeight: 700,
              textTransform: 'none',
              mb: pxToRem(10),
              width: 'fit-content',
              px: 0,
            }}
            onClick={() => router.back()}
          >
            Back
          </Button>

          <RowStack
            justifyContent="space-between"
            alignItems="flex-start"
            gap={2}
          >
            <Stack spacing={pxToRem(6)}>
              <Typography
                sx={{
                  color: '#0F172A',
                  fontWeight: 700,
                  fontSize: {
                    xs: pxToRem(18),
                    md: pxToRem(24),
                    lg: pxToRem(30),
                  },
                }}
              >
                My Rides
              </Typography>
              <Typography
                sx={{
                  color: '#64748B',
                  fontSize: pxToRem(12),
                  lineHeight: pxToRem(18),
                }}
              >
                Your complete ride history
              </Typography>
            </Stack>

            <AppButton
              variant="contained"
              startIcon={<AddRoundedIcon />}
              sx={{
                borderRadius: pxToRem(999),
                px: pxToRem(18),
                py: pxToRem(10),
                boxShadow: '0px 8px 20px rgba(21,93,252,0.16)',
              }}
              onClick={() => router.push('/booking')}
            >
              Book a Ride
            </AppButton>
          </RowStack>

          <Box
            sx={{
              mt: pxToRem(18),
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
              },
              gap: pxToRem(16),
            }}
          >
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    sx={{
                      height: pxToRem(100),
                      borderRadius: pxToRem(12),
                    }}
                  />
                ))
              : statCards.map((stat) => (
                  <RideStatCard
                    key={stat.label}
                    icon={stat.icon}
                    value={stat.value}
                    label={stat.label}
                  />
                ))}
          </Box>

          <RowStack
            sx={{ mt: pxToRem(18), mb: pxToRem(10) }}
            justifyContent="space-between"
            alignItems="center"
            gap={2}
            flexWrap="wrap"
          >
            <Tabs
              value={tabIndex}
              onChange={(_, next) => setTabIndex(next)}
              TabIndicatorProps={{ style: { display: 'none' } }}
              sx={{
                minHeight: 'auto',
                '& .MuiTabs-flexContainer': { gap: pxToRem(10) },
              }}
            >
              {tabOrder.map((key) => (
                <Tab
                  key={key}
                  label={TAB_LABELS[key]}
                  sx={{
                    minHeight: 'auto',
                    p: 0,
                    textTransform: 'none',
                    fontSize: pxToRem(11),
                    fontWeight: 700,
                    borderRadius: pxToRem(999),
                    px: pxToRem(14),
                    py: pxToRem(7),
                    border: '1px solid #E5E7EB',
                    bgcolor: '#FFFFFF',
                    color: '#64748B',
                    '&.Mui-selected': {
                      bgcolor: '#155DFC',
                      borderColor: '#155DFC',
                      color: '#FFFFFF',
                    },
                  }}
                />
              ))}
            </Tabs>

            <Typography
              sx={{
                color: '#94A3B8',
                fontSize: pxToRem(11),
                fontWeight: 600,
              }}
            >
              {isLoading ? '...' : `${filteredRides.length} rides`}
            </Typography>
          </RowStack>

          {isLoading ? (
            <Stack spacing={2}>
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  sx={{
                    height: pxToRem(120),
                    borderRadius: pxToRem(12),
                  }}
                />
              ))}
            </Stack>
          ) : filteredRides.length === 0 ? (
            <Box
              sx={{
                bgcolor: '#FFFFFF',
                borderRadius: pxToRem(12),
                border: '1px solid #E2E8F0',
                py: pxToRem(60),
              }}
            >
              <EmptyState
                emptyState={
                  <Stack spacing={1} alignItems="center">
                    <Typography
                      sx={{
                        color: '#0F172A',
                        fontSize: pxToRem(16),
                        fontWeight: 600,
                        textAlign: 'center',
                      }}
                    >
                      No rides found
                    </Typography>
                    <Typography
                      sx={{
                        color: '#64748B',
                        fontSize: pxToRem(13),
                        textAlign: 'center',
                      }}
                    >
                      {activeTab === 'all'
                        ? "You haven't booked any rides yet"
                        : `You have no ${activeTab} rides`}
                    </Typography>
                  </Stack>
                }
              />
            </Box>
          ) : (
            <RideHistoryAccordion items={filteredRides} />
          )}
        </Box>

        <AppFooter />
      </Box>
    </AppLayout>
  );
}
