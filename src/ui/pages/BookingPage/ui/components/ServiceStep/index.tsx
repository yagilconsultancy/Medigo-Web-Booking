'use client';

import CheckIcon from '@mui/icons-material/Check';
import { Box, Chip, Paper, Skeleton, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBooking } from '../../../common';
import transportIcon from '../../assets/icons/transport-icon.svg';
import transportAsstIcon from '../../assets/icons/transport-asst-icon.svg';
import {
  FareEstimateResponse,
  formatPrice,
  pxToRem,
  useFareEstimate,
} from '@/common';
import { StyledImage } from '@/ui/modules/components';

export type ServiceStepProps = {
  accountType: 'individual' | 'facility';
};

type ServiceType = NonNullable<
  ReturnType<typeof useBooking>['booking']['service']['type']
>;

export function ServiceStep({ accountType }: ServiceStepProps) {
  const { booking, setService } = useBooking();
  const [estimateFareData, setEstimateFareData] =
    useState<FareEstimateResponse | null>(null);
  const { mutateAsync: createFareEstimate, isPending: isCreatingFareEstimate } =
    useFareEstimate();

  const RideTypesPayload = useMemo(() => {
    return {
      pickup_address: booking.address.pickupAddress,
      pickup_latitude: booking.address.pickupCoordinates.lat,
      pickup_longitude: booking.address.pickupCoordinates.lng,
      destination_address: booking.address.dropoffAddress,
      destination_latitude: booking.address.dropoffCoordinates.lat,
      destination_longitude: booking.address.dropoffCoordinates.lng,
      trip_type: 'transport_care_assistant',
    };
  }, [booking.address]);

  useEffect(() => {
    const fetchFareEstimate = async () => {
      try {
        const response = await createFareEstimate(RideTypesPayload);
        setEstimateFareData(response.data.data);
        setService({
          careAssistantFee: response.data.data.care_assistant_fee ?? null,
          currency: response.data.data.currency ?? 'CAD',
        });
        console.log(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFareEstimate();
  }, [RideTypesPayload, createFareEstimate, setService]);
  const selected = booking.service.type;
  const isLoading = isCreatingFareEstimate || estimateFareData === null;

  const loadingPrice = useMemo(
    () => (
      <Skeleton
        variant="text"
        width={pxToRem(80)}
        height={pxToRem(24)}
        sx={{
          transform: 'none',
          borderRadius: pxToRem(4),
        }}
      />
    ),
    []
  );

  const serviceCopy: Record<
    ServiceType,
    {
      title: string;
      price: React.ReactNode;
      description: string;
      items: string[];
      icon: any;
      recommended?: boolean;
    }
  > = useMemo(() => {
    const currency = estimateFareData?.currency ?? 'CAD';
    const transportOnlyFare =
      estimateFareData != null
        ? estimateFareData.total_fare - estimateFareData.care_assistant_fee
        : undefined;

    return {
      transport: {
        title: 'Transport Only',
        price: isLoading
          ? loadingPrice
          : `From ${formatPrice(transportOnlyFare, currency)}`,
        description:
          'Safe, reliable transport for patients who are independently mobile or accompanied.',
        items: [
          'Trained MediGo driver',
          'Door-to-door service',
          'Real-time ride tracking',
          'Up to 2 passengers',
        ],
        icon: transportIcon,
      },

      transport_assistant: {
        title: 'Transport + Care Assistant',
        price: isLoading
          ? loadingPrice
          : `From ${formatPrice(estimateFareData?.total_fare, currency)}`,
        description:
          'Transport with a qualified care assistant for patients who need hands-on support.',
        items: [
          'Trained MediGo driver with a care assistant',
          'Door-to-door service',
          'Real-time ride tracking',
          'Up to 2 passengers',
          'Only available on scheduled.',
        ],
        icon: transportAsstIcon,
        recommended: true,
      },
    };
  }, [estimateFareData, isLoading, loadingPrice]);

  const options = useMemo(() => {
    return (Object.keys(serviceCopy) as ServiceType[]).map((key) => ({
      key,
      ...serviceCopy[key],
    }));
  }, [serviceCopy]);

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
          Choose Your Service
        </Typography>
        <Typography
          sx={{
            mt: pxToRem(4),
            fontSize: pxToRem(14),
            lineHeight: pxToRem(20),
            fontWeight: 400,
            color: '#64748B',
          }}
        >
          Select the level of support the patient requires during transport.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: pxToRem(16), alignItems: 'stretch' }}>
        {options.map((option) => {
          const isSelected = selected === option.key;
          const borderColor = isSelected ? '#2F6FED' : '#E2E8F0';
          const bgColor = isSelected ? '#F0F7FF' : '#FFFFFF';

          return (
            <Paper
              key={option.key}
              component="button"
              type="button"
              onClick={() => setService({ type: option.key })}
              elevation={0}
              sx={{
                flex: 1,
                textAlign: 'left',
                borderRadius: pxToRem(12),
                border: `2px solid ${borderColor}`,
                bgcolor: bgColor,
                p: pxToRem(18),
                cursor: 'pointer',
                position: 'relative',
                transition:
                  'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
                '&:hover': { transform: 'translateY(-1px)' },
                boxShadow: isSelected
                  ? '0px 10px 15px rgba(0,122,255,0.12), 0px 4px 6px rgba(0,122,255,0.12)'
                  : 'none',
              }}
            >
              {option.recommended ? (
                <Chip
                  label="Recommended"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: pxToRem(-10),
                    left: '50%',
                    transform: 'translateX(-50%)',
                    height: pxToRem(18),
                    fontSize: pxToRem(10),
                    fontWeight: 700,
                    bgcolor: '#007AFF',
                    color: '#FFFFFF',
                    '& .MuiChip-label': { px: pxToRem(8) },
                  }}
                />
              ) : null}

              {isSelected ? (
                <Box
                  sx={{
                    position: 'absolute',
                    top: pxToRem(14),
                    right: pxToRem(14),
                    width: pxToRem(18),
                    height: pxToRem(18),
                    borderRadius: '999999px',
                    bgcolor: '#2F6FED',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckIcon sx={{ fontSize: pxToRem(12), color: '#FFFFFF' }} />
                </Box>
              ) : null}

              <Box
                sx={{
                  width: pxToRem(40),
                  height: pxToRem(40),
                  borderRadius: '999999px',
                  bgcolor: isSelected ? '#2F6FED' : '#F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: pxToRem(14),
                }}
              >
                <StyledImage
                  src={option.icon}
                  alt=""
                  width={18}
                  height={18}
                  sx={{
                    width: pxToRem(18),
                    height: pxToRem(18),
                    filter: isSelected ? 'brightness(0) invert(1)' : 'none',
                  }}
                />
              </Box>

              <Typography
                sx={{
                  fontSize: pxToRem(13),
                  fontWeight: 700,
                  color: isSelected ? '#2F6FED' : '#0F172A',
                }}
              >
                {option.title}
              </Typography>
              <Typography
                sx={{
                  mt: pxToRem(4),
                  fontSize: pxToRem(12),
                  fontWeight: 600,
                  color: '#0F172A',
                }}
              >
                {option.price}
              </Typography>

              <Typography
                sx={{
                  mt: pxToRem(10),
                  fontSize: pxToRem(12),
                  lineHeight: pxToRem(18),
                  color: '#64748B',
                }}
              >
                {option.description}
              </Typography>

              <Box
                sx={{
                  mt: pxToRem(14),
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
                    <Box
                      sx={{
                        width: pxToRem(12),
                        height: pxToRem(12),
                        borderRadius: '999999px',
                        bgcolor: isSelected ? '#2F6FED' : '#E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CheckIcon
                        sx={{
                          fontSize: pxToRem(10),
                          color: isSelected ? '#FFFFFF' : '#94A3B8',
                        }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        fontSize: pxToRem(11),
                        color: isSelected ? '#334155' : '#94A3B8',
                        fontWeight: 500,
                      }}
                    >
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          );
        })}
      </Box>

      <Typography
        sx={{
          mt: pxToRem(6),
          fontSize: pxToRem(11),
          color: '#94A3B8',
          textAlign: 'center',
        }}
      >
        Not sure which to choose?{' '}
        <Box
          component="span"
          sx={{ color: '#007AFF', fontWeight: 600, cursor: 'pointer' }}
        >
          See our service guide
        </Box>
      </Typography>
    </Box>
  );
}
