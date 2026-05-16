'use client';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import TocRoundedIcon from '@mui/icons-material/TocRounded';
import { Box, Button, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { pxToRem } from '@/common';
import { AppFooter, AppLayout } from '@/ui/modules/partials';
import { HeaderHelpUser } from '@/ui/modules/partials/AppHeader/ui/components';
import { AppButton, RowStack } from '@/ui/modules/components';
import { RideHistoryAccordion, type RideHistoryItem } from './ui/components/RideHistoryAccordion';
import { RideStatCard } from './ui/components/RideStatCard';

type RideTabKey = 'all' | 'completed' | 'cancelled';

const tabOrder: RideTabKey[] = ['all', 'completed', 'cancelled'];

const TAB_LABELS: Record<RideTabKey, string> = {
  all: 'All Rides',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const RIDES: RideHistoryItem[] = [
  {
    id: 'R-10483',
    status: 'completed',
    serviceName: 'MediGO Wheelchair',
    pickupAddress: '2450 Lawrence Ave E, Toronto, ON',
    dropoffAddress: 'Sunnybrook Health Sciences Centre, Toronto, ON',
    dateLabel: 'Apr 18, 2026',
    timeLabel: '9:00 AM',
    details: {
      driver: 'James Rivera',
      vehicle: 'Toyota Sienna — WAV',
      distance: '6.2 km',
      duration: '18 min',
      ratingLabel: 'Rated 5 stars',
    },
    cancelled: undefined,
  },
  {
    id: 'R-10391',
    status: 'completed',
    serviceName: 'MediGO Standard',
    pickupAddress: 'Sunnybrook Health Sciences Centre, Toronto, ON',
    dropoffAddress: '2450 Lawrence Ave E, Toronto, ON',
    dateLabel: 'Apr 10, 2026',
    timeLabel: '2:30 PM',
    details: {
      driver: 'James Rivera',
      vehicle: 'Toyota Sienna — Standard',
      distance: '4.9 km',
      duration: '14 min',
      ratingLabel: 'Rated 5 stars',
    },
    cancelled: undefined,
  },
  {
    id: 'R-10288',
    status: 'completed',
    serviceName: 'MediGO Wheelchair',
    pickupAddress: '2450 Lawrence Ave E, Toronto, ON',
    dropoffAddress: 'Toronto Rehab Institute, 550 University Ave',
    dateLabel: 'Mar 27, 2026',
    timeLabel: '11:00 AM',
    details: {
      driver: 'James Rivera',
      vehicle: 'Toyota Sienna — WAV',
      distance: '7.3 km',
      duration: '22 min',
      ratingLabel: 'Rated 5 stars',
    },
    cancelled: undefined,
  },
  {
    id: 'R-10201',
    status: 'cancelled',
    serviceName: 'MediGO Wheelchair',
    pickupAddress: '2450 Lawrence Ave E, Toronto, ON',
    dropoffAddress: 'Toronto General Hospital, 200 Elizabeth St',
    dateLabel: 'Mar 15, 2026',
    timeLabel: '8:45 AM',
    details: undefined,
    cancelled: {
      requestedVehicleLabel: 'MediGO Wheelchair',
      cancelledTitle: 'Cancelled by you',
      reason: 'Reason: Appointment rescheduled',
      note: 'No driver was assigned before cancellation. Your account was not charged.',
      chargeLabel: 'No charge',
    },
  },
  {
    id: 'R-10145',
    status: 'completed',
    serviceName: 'MediGO Standard',
    pickupAddress: 'Toronto General Hospital, 200 Elizabeth St',
    dropoffAddress: '2450 Lawrence Ave E, Toronto, ON',
    dateLabel: 'Mar 3, 2026',
    timeLabel: '3:15 PM',
    details: {
      driver: 'James Rivera',
      vehicle: 'Toyota Sienna — Standard',
      distance: '5.8 km',
      duration: '16 min',
      ratingLabel: 'Rated 5 stars',
    },
    cancelled: undefined,
  },
  {
    id: 'R-10088',
    status: 'completed',
    serviceName: 'MediGO Stretcher',
    pickupAddress: '2450 Lawrence Ave E, Toronto, ON',
    dropoffAddress: 'Princess Margaret Cancer Centre, 610 University Ave',
    dateLabel: 'Feb 19, 2026',
    timeLabel: '10:00 AM',
    details: {
      driver: 'James Rivera',
      vehicle: 'Transit — Stretcher',
      distance: '9.4 km',
      duration: '28 min',
      ratingLabel: 'Rated 5 stars',
    },
    cancelled: undefined,
  },
];

export function UserRidesPage() {
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);
  const activeTab = tabOrder[tabIndex] ?? 'all';

  const filteredRides = useMemo(() => {
    if (activeTab === 'all') return RIDES;
    return RIDES.filter((ride) => ride.status === activeTab);
  }, [activeTab]);

  const headerIdentity = useMemo(() => {
    return { name: 'Sarah Johnson', email: 'user@medigo.com' };
  }, []);

  const stats = useMemo(() => {
    const total = RIDES.length;
    const completed = RIDES.filter((ride) => ride.status === 'completed').length;
    const cancelled = RIDES.filter((ride) => ride.status === 'cancelled').length;

    return [
      {
        icon: <TocRoundedIcon sx={{ fontSize: pxToRem(18) }} />,
        value: `${total}`,
        label: 'Total Rides',
      },
      {
        icon: <CheckCircleRoundedIcon sx={{ fontSize: pxToRem(18) }} />,
        value: `${completed}`,
        label: 'Completed',
      },
      {
        icon: <CancelRoundedIcon sx={{ fontSize: pxToRem(18) }} />,
        value: `${cancelled}`,
        label: 'Cancelled',
      },
      {
        icon: <RouteRoundedIcon sx={{ fontSize: pxToRem(18) }} />,
        value: '41.1',
        label: 'Miles Traveled',
      },
    ];
  }, []);

  return (
    <AppLayout
      headerProps={{
        showRightContent: true,
        rightContent: (
          <HeaderHelpUser name={headerIdentity.name} email={headerIdentity.email} />
        ),
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

          <RowStack justifyContent="space-between" alignItems="flex-start" gap={2}>
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
            {stats.map((stat) => (
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
              {filteredRides.length} rides
            </Typography>
          </RowStack>

          <RideHistoryAccordion items={filteredRides} />
        </Box>

        <AppFooter />
      </Box>
    </AppLayout>
  );
}
