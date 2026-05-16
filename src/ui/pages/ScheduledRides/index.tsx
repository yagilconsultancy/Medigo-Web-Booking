'use client';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PendingRoundedIcon from '@mui/icons-material/PendingRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { pxToRem } from '@/common';
import { AppFooter, AppLayout } from '@/ui/modules/partials';
import { HeaderHelpUser } from '@/ui/modules/partials/AppHeader/ui/components';
import { AppButton, RowStack } from '@/ui/modules/components';
import { RideStatCard } from '../UserRides/ui/components/RideStatCard';
import { CancelScheduledRideModal } from './ui/components/CancelScheduledRideModal';
import { EditScheduledRideModal } from './ui/components/EditScheduledRideModal';
import { ScheduledRideList, type ScheduledRideItem } from './ui/components/ScheduledRideList';

const RIDES: ScheduledRideItem[] = [
  {
    id: 'SR-2201',
    status: 'confirmed',
    pickupAddress: '2450 Lawrence Ave E, Toronto, ON',
    destinationAddress: 'Princess Margaret Cancer Centre – Oncology, Toronto, ON',
    dateLabel: 'Friday, Apr 24, 2026',
    timeLabel: '8:30 AM',
    driverAssigned: 'James Rivera',
    accentColor: '#22C55E',
  },
  {
    id: 'SR-2189',
    status: 'pending',
    pickupAddress: '2450 Lawrence Ave E, Toronto, ON',
    destinationAddress: 'Toronto Rehab Institute, 550 University Ave',
    dateLabel: 'Tuesday, Apr 28, 2026',
    timeLabel: '10:00 AM',
    accentColor: '#F59E0B',
  },
  {
    id: 'SR-2102',
    status: 'recurring',
    recurringLabel: 'Weekly — Monday',
    pickupAddress: '2450 Lawrence Ave E, Toronto, ON',
    destinationAddress: 'Toronto Western Hospital – Dialysis Center',
    dateLabel: 'Weekly, Every Monday',
    timeLabel: '9:00 AM',
    driverAssigned: 'Maria Chen',
    accentColor: '#7C3AED',
  },
  {
    id: 'SR-2095',
    status: 'confirmed',
    pickupAddress: '2450 Lawrence Ave E, Toronto, ON',
    destinationAddress: 'Peter Munk Cardiac Centre, 585 University Ave',
    dateLabel: 'Tuesday, May 5, 2026',
    timeLabel: '2:15 PM',
    accentColor: '#155DFC',
  },
];

export function ScheduledRidesPage() {
  const router = useRouter();

  const [editOpen, setEditOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [activeRide, setActiveRide] = useState<ScheduledRideItem | null>(null);

  const headerIdentity = useMemo(() => {
    return { name: 'Sarah Johnson', email: 'user@medigo.com' };
  }, []);

  const stats = useMemo(() => {
    const confirmed = RIDES.filter((ride) => ride.status === 'confirmed').length;
    const pending = RIDES.filter((ride) => ride.status === 'pending').length;
    const recurring = RIDES.filter((ride) => ride.status === 'recurring').length;

    return [
      {
        icon: <CheckCircleRoundedIcon sx={{ fontSize: pxToRem(18) }} />,
        value: `${confirmed}`,
        label: 'CONFIRMED',
        iconContainerSx: { bgcolor: '#ECFDF5', color: '#047857' },
      },
      {
        icon: <PendingRoundedIcon sx={{ fontSize: pxToRem(18) }} />,
        value: `${pending}`,
        label: 'PENDING',
        iconContainerSx: { bgcolor: '#FFFBEB', color: '#92400E' },
      },
      {
        icon: <ReplayRoundedIcon sx={{ fontSize: pxToRem(18) }} />,
        value: `${recurring}`,
        label: 'RECURRING',
        iconContainerSx: { bgcolor: '#F5F3FF', color: '#6D28D9' },
      },
    ] as const;
  }, []);

  const nextRide = RIDES[0] ?? null;

  return (
    <AppLayout
      headerProps={{
        showRightContent: true,
        rightContent: (
          <HeaderHelpUser />
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
                Scheduled Rides
              </Typography>
              <Typography
                sx={{
                  color: '#64748B',
                  fontSize: pxToRem(12),
                  lineHeight: pxToRem(18),
                }}
              >
                Manage your upcoming appointments
              </Typography>
            </Stack>

            <AppButton
              variant="contained"
              startIcon={<AddRoundedIcon />}
              sx={{
                borderRadius: pxToRem(999),
                px: pxToRem(18),
                py: pxToRem(10),
                boxShadow: '0px 2px 5px rgba(21,93,252,0.28)',
              }}
            >
              Schedule Ride
            </AppButton>
          </RowStack>

          <Box
            sx={{
              mt: pxToRem(18),
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: pxToRem(16),
            }}
          >
            {stats.map((stat) => (
              <RideStatCard
                key={stat.label}
                icon={stat.icon}
                value={stat.value}
                label={stat.label}
                labelSx={{
                  fontWeight: 700,
                  letterSpacing: pxToRem(1.1),
                  textTransform: 'uppercase',
                }}
                iconContainerSx={stat.iconContainerSx}
              />
            ))}
          </Box>

          {nextRide ? (
            <Box
              sx={{
                mt: pxToRem(18),
                borderRadius: pxToRem(16),
                bgcolor: '#155DFC',
                color: '#FFFFFF',
                px: pxToRem(20),
                py: pxToRem(16),
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <RowStack justifyContent="space-between" alignItems="center" gap={2} flexWrap="wrap">
                <RowStack spacing={2} sx={{ minWidth: 0 }}>
                  <Box
                    sx={{
                      width: pxToRem(40),
                      height: pxToRem(40),
                      borderRadius: pxToRem(14),
                      bgcolor: 'rgba(255,255,255,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <CalendarMonthRoundedIcon sx={{ fontSize: pxToRem(18), color: '#FFFFFF' }} />
                  </Box>

                  <Stack spacing={pxToRem(2)} sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: pxToRem(10), fontWeight: 700, letterSpacing: pxToRem(1.1), opacity: 0.8 }}>
                      NEXT RIDE
                    </Typography>
                    <Typography sx={{ fontSize: pxToRem(13), fontWeight: 700 }}>
                      {nextRide.dateLabel} • {nextRide.timeLabel}
                    </Typography>
                    <Typography sx={{ fontSize: pxToRem(11), opacity: 0.9 }} noWrap>
                      {nextRide.destinationAddress}
                      {nextRide.driverAssigned ? ` · Driver ${nextRide.driverAssigned} assigned` : ''}
                    </Typography>
                  </Stack>
                </RowStack>

                <AppButton
                  variant="contained"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.18)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.18)' },
                    borderRadius: pxToRem(999),
                    px: pxToRem(16),
                    py: pxToRem(8),
                    color: '#FFFFFF',
                  }}
                  endIcon={<KeyboardArrowRightRoundedIcon />}
                >
                  Details
                </AppButton>
              </RowStack>
            </Box>
          ) : null}

          <Box sx={{ mt: pxToRem(18) }}>
            <ScheduledRideList
              items={RIDES}
              onEdit={(ride) => {
                setActiveRide(ride);
                setEditOpen(true);
              }}
              onCancel={(ride) => {
                setActiveRide(ride);
                setCancelOpen(true);
              }}
            />
          </Box>
        </Box>

        <AppFooter />
      </Box>

      <EditScheduledRideModal open={editOpen} setOpen={setEditOpen} ride={activeRide} />
      <CancelScheduledRideModal open={cancelOpen} setOpen={setCancelOpen} ride={activeRide} />
    </AppLayout>
  );
}
