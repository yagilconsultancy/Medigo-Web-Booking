'use client';

import SwapVertIcon from '@mui/icons-material/SwapVert';
import {
  Box,
  InputAdornment,
  List,
  ListItem,
  Paper,
  Typography,
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useBooking } from '../../../common';
import locationIcon from '../../assets/icons/location-booking-icon.svg';
import pickupIcon from '../../assets/icons/pickup-booking-icon.svg';
import dropoffIcon from '../../assets/icons/dropoff-booking-icon.svg';
import patientIcon from '../../assets/icons/patient-booking-icon.svg';
import { PlacePrediction, pxToRem, usePlacesAutocomplete } from '@/common';
import {
  AppPhoneInput,
  AppTextField,
  StyledImage,
} from '@/ui/modules/components';

export type AddressStepProps = {
  accountType: 'individual' | 'facility';
};

export function AddressStep({ accountType }: AddressStepProps) {
  const { booking, setAddress, setPatient } = useBooking();

  const [pickupInput, setPickupInput] = useState(booking.address.pickupAddress);
  const [dropoffInput, setDropoffInput] = useState(
    booking.address.dropoffAddress
  );

  const pickupAutocomplete = usePlacesAutocomplete(pickupInput);
  const dropoffAutocomplete = usePlacesAutocomplete(dropoffInput);

  const fetchPlaceCoordinates = async (
    placeId: string
  ): Promise<{ lat: number; lng: number } | null> => {
    if (typeof window === 'undefined') return null;
    const g = (window as any).google;
    if (!g?.maps?.places?.Place) return null;

    try {
      const place = new g.maps.places.Place({ id: placeId });
      await place.fetchFields({ fields: ['location'] });

      const loc = place.location;
      if (!loc) return null;
      return { lat: loc.lat(), lng: loc.lng() };
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Place details error:', err);
      return null;
    }
  };

  const handleSelectPickup = async (prediction: PlacePrediction) => {
    pickupAutocomplete.clearPredictions();
    setPickupInput(prediction.description);
    const coords = await fetchPlaceCoordinates(prediction.placeId);
    setAddress({
      pickupAddress: prediction.description,
      pickupCoordinates: coords,
    });
  };

  const handleSelectDropoff = async (prediction: PlacePrediction) => {
    dropoffAutocomplete.clearPredictions();
    setDropoffInput(prediction.description);
    const coords = await fetchPlaceCoordinates(prediction.placeId);
    setAddress({
      dropoffAddress: prediction.description,
      dropoffCoordinates: coords,
    });
  };

  const handleSwapLocations = () => {
    pickupAutocomplete.clearPredictions();
    dropoffAutocomplete.clearPredictions();

    setPickupInput(dropoffInput);
    setDropoffInput(pickupInput);
    setAddress({
      pickupAddress: dropoffInput,
      dropoffAddress: pickupInput,
      pickupCoordinates: booking.address.dropoffCoordinates,
      dropoffCoordinates: booking.address.pickupCoordinates,
    });
  };

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
          Where are you going?
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
          Enter the pickup and drop-off addresses for this journey.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: pxToRem(12),
          border: '1px solid #E2E8F0',
          bgcolor: '#FFFFFF',
          overflow: 'visible',
        }}
      >
        <Box
          sx={{
            px: pxToRem(20),
            py: pxToRem(16),
            borderBottom: '1px solid #EEF2F6',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: pxToRem(10) }}>
            <StyledImage
              src={pickupIcon}
              alt=""
              width={16}
              height={16}
              sx={{ width: pxToRem(16), height: pxToRem(16) }}
            />
            <Typography
              sx={{
                fontSize: pxToRem(13),
                lineHeight: pxToRem(19.5),
                fontWeight: 600,
                color: '#0F172A',
              }}
            >
              Pickup location
            </Typography>
          </Box>
        </Box>

        <Box sx={{ px: pxToRem(20), py: pxToRem(16) }}>
          <Box sx={{ position: 'relative' }}>
            <AppTextField
              value={pickupInput}
              onChange={(e) => {
                setPickupInput(e.target.value);
                setAddress({
                  pickupAddress: e.target.value,
                  pickupCoordinates: null,
                });
              }}
              placeholder="Enter pickup address..."
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <StyledImage
                      src={locationIcon}
                      alt=""
                      width={16}
                      height={18}
                      sx={{ width: pxToRem(16), height: pxToRem(18) }}
                    />
                  </InputAdornment>
                ),
              }}
            />

            {pickupAutocomplete.predictions.length > 0 ? (
              <List
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 2000,
                  background: '#fff',
                  border: '1px solid #E2E8F0',
                  borderRadius: pxToRem(8),
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  maxHeight: pxToRem(380),
                  overflowY: 'auto',
                  mt: 1,
                }}
              >
                {pickupAutocomplete.predictions.map((prediction) => (
                  <ListItem
                    key={prediction.placeId}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#EFEFEF' },
                      display: 'flex',
                      gap: 1,
                    }}
                    onClick={() => handleSelectPickup(prediction)}
                  >
                    <StyledImage
                      src={locationIcon}
                      alt="location"
                      width={16}
                      height={18}
                      sx={{ width: pxToRem(16), height: pxToRem(18) }}
                    />
                    <Typography variant="body2">
                      {prediction.description}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            ) : null}
          </Box>
        </Box>

        <Box
          sx={{
            px: pxToRem(20),
            py: pxToRem(12),
            display: 'flex',
            justifyContent: 'center',
            borderTop: '1px solid #EEF2F6',
            borderBottom: '1px solid #EEF2F6',
          }}
        >
          <Box
            component="button"
            type="button"
            onClick={handleSwapLocations}
            sx={{
              width: pxToRem(32),
              height: pxToRem(32),
              borderRadius: '999999px',
              border: '1px solid #E2E8F0',
              bgcolor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 120ms ease, box-shadow 120ms ease',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow:
                  '0px 1px 3px rgba(0,0,0,0.10), 0px 1px 2px rgba(0,0,0,0.10)',
              },
            }}
          >
            <SwapVertIcon sx={{ fontSize: pxToRem(16), color: '#94A3B8' }} />
          </Box>
        </Box>

        <Box
          sx={{
            px: pxToRem(20),
            py: pxToRem(16),
            borderBottom: '1px solid #EEF2F6',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: pxToRem(10) }}>
            <StyledImage
              src={dropoffIcon}
              alt=""
              width={16}
              height={16}
              sx={{ width: pxToRem(16), height: pxToRem(16) }}
            />
            <Typography
              sx={{
                fontSize: pxToRem(13),
                lineHeight: pxToRem(19.5),
                fontWeight: 600,
                color: '#0F172A',
              }}
            >
              Drop-off location
            </Typography>
          </Box>
        </Box>

        <Box sx={{ px: pxToRem(20), py: pxToRem(16) }}>
          <Box sx={{ position: 'relative' }}>
            <AppTextField
              value={dropoffInput}
              onChange={(e) => {
                setDropoffInput(e.target.value);
                setAddress({
                  dropoffAddress: e.target.value,
                  dropoffCoordinates: null,
                });
              }}
              placeholder="Enter drop-off address..."
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <StyledImage
                      src={locationIcon}
                      alt=""
                      width={16}
                      height={18}
                      sx={{ width: pxToRem(16), height: pxToRem(18) }}
                    />
                  </InputAdornment>
                ),
              }}
            />

            {dropoffAutocomplete.predictions.length > 0 ? (
              <List
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 2000,
                  background: '#fff',
                  border: '1px solid #E2E8F0',
                  borderRadius: pxToRem(8),
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  maxHeight: pxToRem(380),
                  overflowY: 'auto',
                  mt: 1,
                }}
              >
                {dropoffAutocomplete.predictions.map((prediction) => (
                  <ListItem
                    key={prediction.placeId}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#EFEFEF' },
                      display: 'flex',
                      gap: 1,
                    }}
                    onClick={() => handleSelectDropoff(prediction)}
                  >
                    <StyledImage
                      src={locationIcon}
                      alt="location"
                      width={16}
                      height={18}
                      sx={{ width: pxToRem(16), height: pxToRem(18) }}
                    />
                    <Typography variant="body2">
                      {prediction.description}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            ) : null}
          </Box>
        </Box>
      </Paper>

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
            px: pxToRem(20),
            py: pxToRem(16),
            borderBottom: '1px solid #EEF2F6',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: pxToRem(10) }}>
            <StyledImage
              src={patientIcon}
              alt=""
              width={16}
              height={16}
              sx={{ width: pxToRem(16), height: pxToRem(16) }}
            />
            <Typography
              sx={{
                fontSize: pxToRem(13),
                lineHeight: pxToRem(19.5),
                fontWeight: 700,
                color: '#0F172A',
              }}
            >
              Patient Details
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: pxToRem(12),
              lineHeight: pxToRem(18),
              fontWeight: 400,
              color: '#64748B',
            }}
          >
            Who is being transported?
          </Typography>
        </Box>

        <Box
          sx={{
            px: pxToRem(20),
            py: pxToRem(16),
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: pxToRem(16),
          }}
        >
          <Formik
            initialValues={{
              firstName: booking.patient.firstName,
              lastName: booking.patient.lastName,
              phoneNumber: booking.patient.phoneNumber,
              countryCode: booking.patient.countryCode,
              countryIso3: booking.patient.countryIso3,
            }}
            enableReinitialize
            onSubmit={() => undefined}
          >
            <Form style={{ display: 'contents' }}>
              <Box>
                <Typography
                  sx={{
                    fontSize: pxToRem(12),
                    fontWeight: 600,
                    color: '#0F172A',
                  }}
                >
                  First Name{' '}
                  <Box component="span" sx={{ color: '#E11D48' }}>
                    *
                  </Box>
                </Typography>
                <AppTextField
                  name="firstName"
                  value={booking.patient.firstName}
                  onChange={(e) => setPatient({ firstName: e.target.value })}
                  placeholder="First name"
                  fullWidth
                  sx={{ mt: pxToRem(8) }}
                />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: pxToRem(12),
                    fontWeight: 600,
                    color: '#0F172A',
                  }}
                >
                  Last Name{' '}
                  <Box component="span" sx={{ color: '#E11D48' }}>
                    *
                  </Box>
                </Typography>
                <AppTextField
                  name="lastName"
                  value={booking.patient.lastName}
                  onChange={(e) => setPatient({ lastName: e.target.value })}
                  placeholder="Last name"
                  fullWidth
                  sx={{ mt: pxToRem(8) }}
                />
              </Box>
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Typography
                  sx={{
                    fontSize: pxToRem(12),
                    fontWeight: 600,
                    color: '#0F172A',
                  }}
                >
                  Phone Number{' '}
                  <Box component="span" sx={{ color: '#E11D48' }}>
                    *
                  </Box>
                </Typography>
                <Box sx={{ mt: pxToRem(8) }}>
                  <AppPhoneInput
                    name="phoneNumber"
                    placeholder="(555) 000-0000"
                    countries={[
                      {
                        id: 'ca',
                        iso3: 'CAN',
                        iso2: 'CA',
                        emoji: '🇨🇦',
                        phonecode: '1',
                      },
                    ]}
                    countryIso3FieldName="countryIso3"
                    countryCodeFieldName="countryCode"
                    disabled={false}
                    onPhoneChange={(value) =>
                      setPatient({ phoneNumber: value })
                    }
                    onCountryChange={(country) =>
                      setPatient({
                        countryIso3: country.iso3,
                        countryCode: `+${country.phonecode}`,
                      })
                    }
                  />
                </Box>
                <Typography
                  sx={{
                    mt: pxToRem(6),
                    fontSize: pxToRem(11),
                    color: '#94A3B8',
                  }}
                >
                  We&apos;ll send ride updates to this number
                </Typography>
              </Box>
            </Form>
          </Formik>
        </Box>
      </Paper>
    </Box>
  );
}
