'use client';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LocalTaxiOutlinedIcon from '@mui/icons-material/LocalTaxiOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import RepeatOutlinedIcon from '@mui/icons-material/RepeatOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  ButtonBase,
  Divider,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import {
  businessDateTimeToIso,
  FareEstimateResponse,
  formatPrice,
  pxToRem,
  useFareEstimate,
} from '@/common';
import { StyledImage } from '@/ui/modules/components';
import { useBooking } from '../../../common';
import { useEffect, useMemo, useState } from 'react';

import locationIcon from '../../assets/icons/location-booking-icon.svg';
import patientIcon from '../../assets/icons/patient-booking-icon.svg';
import transportIcon from '../../assets/icons/transport-icon.svg';

type ReviewStepProps = {
  accountType: 'individual' | 'facility';
  onEditStep: (stepIndex: number) => void;
};

const makeLabel = (value: string) => (value?.trim().length ? value : '—');

export function ReviewStep({ accountType, onEditStep }: ReviewStepProps) {
  const { booking, setVehicle } = useBooking();
  const [fareEstimate, setFareEstimate] = useState<FareEstimateResponse | null>(
    null
  );
  const { mutateAsync: createFareEstimate, isPending: isCreatingFareEstimate } =
    useFareEstimate();

  const scheduledAtIso = useMemo(
    () =>
      businessDateTimeToIso(booking.trip.pickupDate, booking.trip.pickupTime),
    [booking.trip.pickupDate, booking.trip.pickupTime]
  );

  const fareEstimatePayload = useMemo(() => {
    const pickup = booking.address.pickupCoordinates;
    const dropoff = booking.address.dropoffCoordinates;
    if (!pickup || !dropoff) return null;
    if (!booking.address.pickupAddress || !booking.address.dropoffAddress) {
      return null;
    }
    if (!booking.trip.type) return null;

    const tripType =
      booking.service.type === 'transport_assistant'
        ? 'transport_care_assistant'
        : 'transport_only';

    return {
      pickup_address: booking.address.pickupAddress,
      pickup_latitude: pickup.lat,
      pickup_longitude: pickup.lng,
      destination_address: booking.address.dropoffAddress,
      destination_latitude: dropoff.lat,
      destination_longitude: dropoff.lng,
      scheduled_at: scheduledAtIso ?? undefined,
      use_highway_407: false,
      highway_407_route: '',
      is_dialysis_trip: false,
      ride_type: booking.vehicle.rideType ?? undefined,
      trip_type: tripType,
      trip_structure: booking.trip.type,
    };
  }, [
    booking.address.dropoffAddress,
    booking.address.dropoffCoordinates,
    booking.address.pickupAddress,
    booking.address.pickupCoordinates,
    booking.service.type,
    booking.vehicle.rideType,
    booking.trip.type,
    scheduledAtIso,
  ]);

  useEffect(() => {
    const run = async () => {
      if (!fareEstimatePayload) return;
      try {
        const response = await createFareEstimate(fareEstimatePayload);
        const estimate = response.data.data;
        setFareEstimate(estimate);
        if (estimate?.total_fare != null) {
          setVehicle({ estimatedTotal: estimate.total_fare });
        }
      } catch (error) {
        console.error(error);
        setFareEstimate(null);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createFareEstimate, fareEstimatePayload]);

  const serviceLabel =
    booking.service.type === 'transport'
      ? 'Transport Only'
      : booking.service.type === 'transport_assistant'
        ? 'Transport + Care Assistant'
        : '—';

  const vehicleLabel =
    booking.vehicle.type === 'standard'
      ? 'Medigo Standard'
      : booking.vehicle.type === 'wheelchair'
        ? 'Medigo Wheelchair'
        : booking.vehicle.type === 'stretcher'
          ? 'Medigo Stretcher'
          : '—';

  const tripTypeLabel =
    booking.trip.type === 'one_way'
      ? 'One Way'
      : booking.trip.type === 'round_trip'
        ? 'Round Trip'
        : '—';

  const pickupDateLabel = booking.trip.pickupDate
    ? dayjs(booking.trip.pickupDate).isValid()
      ? dayjs(booking.trip.pickupDate).format('ddd, D MMMM YYYY')
      : booking.trip.pickupDate
    : '—';

  const pickupTimeLabel = booking.trip.pickupTime
    ? booking.trip.pickupTime
    : '—';

  const recurringLabel = booking.trip.isRecurring
    ? booking.trip.recurringFrequency === 'daily'
      ? 'Daily'
      : booking.trip.recurringFrequency === 'weekly'
        ? 'Weekly'
        : booking.trip.recurringFrequency === 'bi_weekly'
          ? 'Bi-Weekly'
          : booking.trip.recurringFrequency === 'monthly'
            ? 'Monthly'
            : '—'
    : null;

  const recurringStartLabel = booking.trip.recurringStartDate
    ? dayjs(booking.trip.recurringStartDate).isValid()
      ? dayjs(booking.trip.recurringStartDate).format('MMMM D, YYYY')
      : booking.trip.recurringStartDate
    : '—';

  const recurringEndLabel =
    booking.trip.recurringEnds === 'by_date'
      ? booking.trip.recurringEndDate
        ? dayjs(booking.trip.recurringEndDate).isValid()
          ? dayjs(booking.trip.recurringEndDate).format('MMMM D, YYYY')
          : booking.trip.recurringEndDate
        : '—'
      : booking.trip.recurringRideCount
        ? `${booking.trip.recurringRideCount} rides`
        : '—';

  const renderIcon = (
    type:
      | 'addresses'
      | 'patient'
      | 'service'
      | 'appointment'
      | 'vehicle'
      | 'trip'
      | 'recurring'
  ) => {
    // const size = pxToRem(28);
    const iconSx = { width: pxToRem(14), height: pxToRem(14) };

    if (type === 'addresses') {
      return locationIcon ? (
        <StyledImage src={locationIcon} alt="" sx={iconSx} />
      ) : (
        <LocationOnOutlinedIcon sx={{ fontSize: pxToRem(16) }} />
      );
    }
    if (type === 'patient') {
      return patientIcon ? (
        <StyledImage src={patientIcon} alt="" sx={iconSx} />
      ) : (
        <PersonOutlineOutlinedIcon sx={{ fontSize: pxToRem(16) }} />
      );
    }
    if (type === 'service') {
      return transportIcon ? (
        <StyledImage src={transportIcon} alt="" sx={iconSx} />
      ) : (
        <LocalTaxiOutlinedIcon sx={{ fontSize: pxToRem(16) }} />
      );
    }
    if (type === 'appointment') {
      return <EventNoteOutlinedIcon sx={{ fontSize: pxToRem(16) }} />;
    }
    if (type === 'vehicle') {
      return <DirectionsCarOutlinedIcon sx={{ fontSize: pxToRem(16) }} />;
    }
    if (type === 'trip') {
      return <EventNoteOutlinedIcon sx={{ fontSize: pxToRem(16) }} />;
    }
    return <RepeatOutlinedIcon sx={{ fontSize: pxToRem(16) }} />;
  };

  const Section = ({
    title,
    iconType,
    onEdit,
    rows,
  }: {
    title: string;
    iconType:
      | 'addresses'
      | 'patient'
      | 'service'
      | 'appointment'
      | 'vehicle'
      | 'trip'
      | 'recurring';
    onEdit: () => void;
    rows: { label: string; value: string }[];
  }) => (
    <Paper
      elevation={0}
      sx={{
        borderRadius: pxToRem(12),
        border: '1px solid #E2E8F0',
        bgcolor: '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          px: pxToRem(16),
          py: pxToRem(12),
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: '#F8FAFC',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: pxToRem(10) }}>
          <Box
            sx={{
              width: pxToRem(28),
              height: pxToRem(28),
              borderRadius: '999999px',
              bgcolor: 'rgba(47,111,237,0.10)',
              color: '#2F6FED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {renderIcon(iconType)}
          </Box>
          <Typography
            sx={{ fontSize: pxToRem(12), fontWeight: 700, color: '#0F172A' }}
          >
            {title}
          </Typography>
        </Box>

        <ButtonBase
          onClick={onEdit}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: pxToRem(6),
            color: '#2F6FED',
            fontSize: pxToRem(11),
            fontWeight: 700,
          }}
        >
          <EditOutlinedIcon sx={{ fontSize: pxToRem(14) }} />
          Edit
        </ButtonBase>
      </Box>

      <Box
        sx={{
          px: pxToRem(16),
          py: pxToRem(14),
          display: 'flex',
          flexDirection: 'column',
          gap: pxToRem(10),
        }}
      >
        {rows.map((r) => (
          <Box
            key={r.label}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: pxToRem(16),
            }}
          >
            <Typography
              sx={{
                fontSize: pxToRem(10),
                color: '#94A3B8',
                minWidth: pxToRem(110),
              }}
            >
              {r.label}
            </Typography>
            <Typography
              sx={{
                fontSize: pxToRem(11),
                color: '#0F172A',
                textAlign: 'right',
              }}
            >
              {r.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );

  return (
    <Box
      sx={{
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: pxToRem(16),
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: pxToRem(28),
            lineHeight: pxToRem(35),
            fontWeight: 700,
            color: '#0F172A',
          }}
        >
          Review Your Booking
        </Typography>
        <Typography
          sx={{
            mt: pxToRem(4),
            fontSize: pxToRem(12),
            lineHeight: pxToRem(18),
            color: '#64748B',
          }}
        >
          Check your details before confirming. You can edit any section below.
        </Typography>
      </Box>

      <Stack spacing={pxToRem(12)}>
        <Section
          title="Addresses"
          iconType="addresses"
          onEdit={() => onEditStep(0)}
          rows={[
            {
              label: 'Pickup',
              value: makeLabel(booking.address.pickupAddress),
            },
            {
              label: 'Drop-off',
              value: makeLabel(booking.address.dropoffAddress),
            },
          ]}
        />

        <Section
          title="Patient"
          iconType="patient"
          onEdit={() => onEditStep(0)}
          rows={[
            {
              label: 'Name',
              value: makeLabel(
                `${booking.patient.firstName} ${booking.patient.lastName}`.trim()
              ),
            },
            {
              label: 'Phone',
              value: makeLabel(
                `${booking.patient.countryCode}${booking.patient.phoneNumber}`
              ),
            },
          ]}
        />

        <Section
          title="Service"
          iconType="service"
          onEdit={() => onEditStep(1)}
          rows={[{ label: 'Service type', value: serviceLabel }]}
        />

        <Section
          title="Appointment"
          iconType="appointment"
          onEdit={() => onEditStep(2)}
          rows={[
            {
              label: 'Type',
              value:
                booking.appointment.type === 'Other'
                  ? booking.appointment.otherDetails || 'Other'
                  : (booking.appointment.type ?? '—'),
            },
          ]}
        />

        <Section
          title="Vehicle"
          iconType="vehicle"
          onEdit={() => onEditStep(3)}
          rows={[
            { label: 'Vehicle', value: vehicleLabel },
            // { label: 'Ride type', value: booking.vehicle.rideType ?? '—' },
          ]}
        />

        <Section
          title="Trip Details"
          iconType="trip"
          onEdit={() => onEditStep(4)}
          rows={[
            { label: 'Trip type', value: tripTypeLabel },
            { label: 'Date', value: pickupDateLabel },
            { label: 'Pickup time', value: pickupTimeLabel },
          ]}
        />

        {recurringLabel ? (
          <Section
            title="Recurring"
            iconType="recurring"
            onEdit={() => onEditStep(4)}
            rows={[
              { label: 'Frequency', value: recurringLabel },
              { label: 'Starts', value: recurringStartLabel },
              { label: 'Ends', value: recurringEndLabel },
              { label: 'Pickup time', value: pickupTimeLabel },
            ]}
          />
        ) : null}

        <Paper
          elevation={0}
          sx={{
            borderRadius: pxToRem(12),
            border: '1px solid #E2E8F0',
            bgcolor: '#FFFFFF',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ px: pxToRem(16), py: pxToRem(12), bgcolor: '#FFFFFF' }}>
            <Typography
              sx={{ fontSize: pxToRem(12), fontWeight: 700, color: '#0F172A' }}
            >
              Fare Estimate
            </Typography>
          </Box>
          <Divider />
          <Box
            sx={{
              px: pxToRem(16),
              py: pxToRem(14),
              display: 'flex',
              flexDirection: 'column',
              gap: pxToRem(10),
            }}
          >
            {isCreatingFareEstimate ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: pxToRem(10),
                }}
              >
                <Skeleton variant="text" width="40%" height={pxToRem(18)} />
                <Skeleton variant="text" width="55%" height={pxToRem(18)} />
                <Skeleton variant="text" width="65%" height={pxToRem(20)} />
              </Box>
            ) : fareEstimate ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: pxToRem(11), color: '#64748B' }}>
                    Estimated total
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: pxToRem(14),
                      color: '#2F6FED',
                      fontWeight: 800,
                    }}
                  >
                    {formatPrice(
                      fareEstimate.total_fare,
                      fareEstimate.currency
                    )}
                  </Typography>
                </Box>

                <Accordion
                  elevation={0}
                  disableGutters
                  sx={{
                    border: '1px solid #E2E8F0',
                    borderRadius: pxToRem(10),
                    '&:before': { display: 'none' },
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon sx={{ fontSize: pxToRem(18) }} />
                    }
                    sx={{ minHeight: 'unset', px: pxToRem(12), py: pxToRem(6) }}
                  >
                    <Typography
                      sx={{
                        fontSize: pxToRem(11),
                        fontWeight: 700,
                        color: '#0F172A',
                      }}
                    >
                      Price breakdown
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: pxToRem(12), pb: pxToRem(12) }}>
                    <Stack spacing={pxToRem(8)}>
                      {[
                        ['Base fare', fareEstimate.base_fare],
                        ['Distance charge', fareEstimate.distance_charge],
                        ['Wait time charge', fareEstimate.wait_time_charge],
                        ['Surcharges', fareEstimate.surcharges_total],
                        ['Highway 407 toll', fareEstimate.highway_407_toll],
                        [
                          'Insurance gateway fee',
                          fareEstimate.insurance_gateway_fee,
                        ],
                        ['Flat surcharge', fareEstimate.flat_surcharge],
                        // ['Platform fee', fareEstimate.platform_fee],
                        [
                          'Care assistant fee',
                          booking.service.type === 'transport_assistant'
                            ? fareEstimate.care_assistant_fee
                            : 0,
                        ],
                        ['Accessibility fee', fareEstimate.accessibility_fee],
                        ['Attendant fee', fareEstimate.attendant_fee],
                      ].map(([label, amount]) => (
                        <Box
                          key={label}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: pxToRem(12),
                          }}
                        >
                          <Typography
                            sx={{ fontSize: pxToRem(11), color: '#64748B' }}
                          >
                            {label}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: pxToRem(11),
                              color: '#0F172A',
                              fontWeight: 700,
                            }}
                          >
                            {formatPrice(
                              Number(amount ?? 0),
                              fareEstimate.currency
                            )}
                          </Typography>
                        </Box>
                      ))}

                      <Divider sx={{ my: pxToRem(2) }} />

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: pxToRem(12),
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: pxToRem(11),
                            color: '#0F172A',
                            fontWeight: 800,
                          }}
                        >
                          Total
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: pxToRem(11),
                            color: '#0F172A',
                            fontWeight: 800,
                          }}
                        >
                          {formatPrice(
                            fareEstimate.total_fare,
                            fareEstimate.currency
                          )}
                        </Typography>
                      </Box>
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                <Typography sx={{ fontSize: pxToRem(10), color: '#94A3B8' }}>
                  + distance/wait-time charges may adjust at pickup.
                </Typography>
              </>
            ) : (
              <Typography sx={{ fontSize: pxToRem(11), color: '#94A3B8' }}>
                Fare estimate unavailable.
              </Typography>
            )}
          </Box>
        </Paper>
      </Stack>
    </Box>
  );
}
