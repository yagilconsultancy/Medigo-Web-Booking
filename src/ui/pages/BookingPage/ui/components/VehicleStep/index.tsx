'use client';

import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import DoorFrontOutlinedIcon from '@mui/icons-material/DoorFrontOutlined';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import { Box, Paper, Typography } from '@mui/material';
import { useMemo } from 'react';
import { pxToRem } from '@/common';
import { StyledImage } from '@/ui/modules/components';
import { useBooking } from '../../../common';

import passengerIcon from '../../assets/icons/passenger-icon.svg';

import medigoStandardImage from '../../assets/images/medigo-standard.png';
import medigoWheelchairImage from '../../assets/images/medigo-wheelchair.png';
import medigoStretcherImage from '../../assets/images/medigo-stretcher.png';

export type VehicleStepProps = {
  accountType: 'individual' | 'facility';
};

type VehicleType = NonNullable<
  ReturnType<typeof useBooking>['booking']['vehicle']['type']
>;

type VehicleOption = {
  key: VehicleType;
  label: string;
  subLabel: string;
  description: string;
  image: any;
  priceLabel: string;
  features: { icon: JSX.Element; label: string }[];
};

export function VehicleStep({ accountType }: VehicleStepProps) {
  const { booking, setVehicle } = useBooking();

  const options = useMemo<VehicleOption[]>(
    () => [
      {
        key: 'standard',
        label: 'Medigo Standard',
        subLabel: 'Comfortable everyday transport',
        description:
          'A modern, comfortable car for ambulatory patients who can transfer independently.',
        image: medigoStandardImage,
        priceLabel: 'From $45',
        features: [
          {
            icon: (
              <StyledImage
                src={passengerIcon}
                alt=""
                width={12}
                height={12}
                sx={{ width: pxToRem(12), height: pxToRem(12) }}
              />
            ),
            label: 'Up to 3 passengers',
          },
          {
            icon: <DirectionsCarOutlinedIcon sx={{ fontSize: pxToRem(14) }} />,
            label: 'Sedan / SUV',
          },
          {
            icon: <DoorFrontOutlinedIcon sx={{ fontSize: pxToRem(14) }} />,
            label: 'Door-to-door',
          },
          {
            icon: <GpsFixedIcon sx={{ fontSize: pxToRem(14) }} />,
            label: 'GPS tracked',
          },
        ],
      },
      {
        key: 'stretcher',
        label: 'Medigo Stretcher',
        subLabel: 'Transport for patients lying flat',
        description:
          'Non-emergency ambulance transport for patients who require a full-length stretcher and clinical crew.',
        image: medigoStretcherImage,
        priceLabel: 'From $120',
        features: [
          {
            icon: (
              <Typography sx={{ fontSize: pxToRem(12), fontWeight: 700 }}>
                1
              </Typography>
            ),
            label: '1 patient + 2 crew',
          },
          {
            icon: (
              <Typography sx={{ fontSize: pxToRem(12), fontWeight: 700 }}>
                O
              </Typography>
            ),
            label: 'Full stretcher',
          },
          {
            icon: (
              <Typography sx={{ fontSize: pxToRem(12), fontWeight: 700 }}>
                +
              </Typography>
            ),
            label: 'Medical crew',
          },
          {
            icon: (
              <Typography sx={{ fontSize: pxToRem(12), fontWeight: 700 }}>
                C
              </Typography>
            ),
            label: 'Climate controlled',
          },
        ],
      },
      {
        key: 'wheelchair',
        label: 'Medigo Wheelchair',
        subLabel: 'Fully accessible van transport',
        description:
          'Modified vehicle with hydraulic lift and wheelchair restraints for full accessibility.',
        image: medigoWheelchairImage,
        priceLabel: 'From $75',
        features: [
          {
            icon: (
              <StyledImage
                src={passengerIcon}
                alt=""
                width={12}
                height={12}
                sx={{ width: pxToRem(12), height: pxToRem(12) }}
              />
            ),
            label: '1 wheelchair + 2 passengers',
          },
          {
            icon: (
              <Typography sx={{ fontSize: pxToRem(12), fontWeight: 700 }}>
                H
              </Typography>
            ),
            label: 'Hydraulic lift',
          },
          {
            icon: (
              <Typography sx={{ fontSize: pxToRem(12), fontWeight: 700 }}>
                R
              </Typography>
            ),
            label: 'Restraint system',
          },
          {
            icon: (
              <Typography sx={{ fontSize: pxToRem(12), fontWeight: 700 }}>
                W
              </Typography>
            ),
            label: 'Wide entry',
          },
        ],
      },
    ],
    []
  );

  const selected = booking.vehicle.type;

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
          Select Your Vehicle
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
          Choose the vehicle that best meets the patient&apos;s mobility and
          clinical needs.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: pxToRem(12) }}>
        {options.map((option) => {
          const isSelected = selected === option.key;

          return (
            <Paper
              key={option.key}
              component="button"
              type="button"
              onClick={() => setVehicle({ type: option.key })}
              elevation={0}
              sx={{
                width: '100%',
                borderRadius: pxToRem(12),
                border: isSelected ? '2px solid #2F6FED' : '1px solid #E2E8F0',
                bgcolor: '#FFFFFF',
                cursor: 'pointer',
                p: pxToRem(16),
                textAlign: 'left',
                transition:
                  'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  borderColor: '#2F6FED',
                  boxShadow:
                    '0px 10px 15px rgba(47,111,237,0.10), 0px 4px 6px rgba(47,111,237,0.08)',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: pxToRem(14),
                  alignItems: 'flex-start',
                }}
              >
                <Box
                  sx={{
                    width: pxToRem(52),
                    height: pxToRem(52),
                    borderRadius: pxToRem(10),
                    border: '1px solid #E2E8F0',
                    bgcolor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}
                >
                  <StyledImage
                    src={option.image}
                    alt=""
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: pxToRem(12),
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: pxToRem(13),
                          fontWeight: 700,
                          color: isSelected ? '#2F6FED' : '#0F172A',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {option.label}
                      </Typography>
                      <Typography
                        sx={{
                          mt: pxToRem(2),
                          fontSize: pxToRem(11),
                          color: '#64748B',
                        }}
                      >
                        {option.subLabel}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: pxToRem(12),
                        flexShrink: 0,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: pxToRem(12),
                          fontWeight: 700,
                          color: isSelected ? '#2F6FED' : '#0F172A',
                        }}
                      >
                        {option.priceLabel}
                      </Typography>
                      {isSelected ? (
                        <RadioButtonCheckedIcon
                          sx={{ fontSize: pxToRem(20), color: '#2F6FED' }}
                        />
                      ) : (
                        <RadioButtonUncheckedIcon
                          sx={{ fontSize: pxToRem(20), color: '#CBD5E1' }}
                        />
                      )}
                    </Box>
                  </Box>

                  <Typography
                    sx={{
                      mt: pxToRem(6),
                      fontSize: pxToRem(12),
                      lineHeight: pxToRem(18),
                      color: '#64748B',
                    }}
                  >
                    {option.description}
                  </Typography>

                  <Box
                    sx={{
                      mt: pxToRem(10),
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: pxToRem(12),
                      alignItems: 'center',
                      color: isSelected ? '#2F6FED' : '#94A3B8',
                    }}
                  >
                    {option.features.map((f) => (
                      <Box
                        key={f.label}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: pxToRem(6),
                        }}
                      >
                        <Box
                          sx={{
                            width: pxToRem(16),
                            height: pxToRem(16),
                            borderRadius: '999999px',
                            bgcolor: '#F1F5F9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isSelected ? '#2F6FED' : '#94A3B8',
                            '& svg': { color: 'inherit' },
                          }}
                        >
                          {f.icon}
                        </Box>
                        <Typography
                          sx={{
                            fontSize: pxToRem(11),
                            color: isSelected ? '#2F6FED' : '#94A3B8',
                            fontWeight: 600,
                          }}
                        >
                          {f.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}
