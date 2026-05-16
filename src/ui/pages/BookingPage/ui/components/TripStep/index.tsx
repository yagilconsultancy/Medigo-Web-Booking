'use client';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import RepeatIcon from '@mui/icons-material/Repeat';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  alpha,
  Box,
  ButtonBase,
  Chip,
  Paper,
  Stack,
  Switch,
  switchClasses,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { pxToRem } from '@/common';
import {
  AppDatePickerPopover,
  AppTextField,
  AppTimePickerPopover,
  RowStack,
} from '@/ui/modules/components';
import { useBooking } from '../../../common';

export type TripStepProps = {
  accountType: 'individual' | 'facility';
};

const IOSSwitch = (props: React.ComponentProps<typeof Switch>) => (
  <Switch
    focusVisibleClassName=".Mui-focusVisible"
    disableRipple
    {...props}
    sx={{
      width: pxToRem(42),
      height: pxToRem(24),
      padding: 0,
      [`& .${switchClasses.switchBase}`]: {
        padding: 0,
        margin: pxToRem(2),
        transitionDuration: '200ms',
        [`&.${switchClasses.checked}`]: {
          transform: `translateX(${pxToRem(18)})`,
          color: '#fff',
          [`& + .${switchClasses.track}`]: {
            backgroundColor: '#2F6FED',
            opacity: 1,
            border: 0,
          },
        },
      },
      [`& .${switchClasses.thumb}`]: {
        boxSizing: 'border-box',
        width: pxToRem(20),
        height: pxToRem(20),
      },
      [`& .${switchClasses.track}`]: {
        borderRadius: pxToRem(24),
        backgroundColor: '#E2E8F0',
        opacity: 1,
        transition: 'background-color 200ms',
      },
    }}
  />
);

const TIME_SLOTS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
];

const DAYS_OF_WEEK = [
  { value: 0, label: 'Mon', short: 'M' },
  { value: 1, label: 'Tue', short: 'T' },
  { value: 2, label: 'Wed', short: 'W' },
  { value: 3, label: 'Thu', short: 'T' },
  { value: 4, label: 'Fri', short: 'F' },
  { value: 5, label: 'Sat', short: 'S' },
  { value: 6, label: 'Sun', short: 'S' },
];

const toDayjsFromStoredDate = (value: string) => {
  if (!value) return null;

  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed : null;
  }

  const slashMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const month = Number(slashMatch[1]);
    const day = Number(slashMatch[2]);
    const year = Number(slashMatch[3]);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const parsed = dayjs(new Date(year, month - 1, day));
      return parsed.isValid() ? parsed : null;
    }
  }

  return null;
};

const getFrequencyDescription = (
  frequency: string | null,
  days: number[]
): string => {
  if (!frequency) return '';

  const dayLabels = days
    .sort((a, b) => a - b)
    .map((d) => DAYS_OF_WEEK.find((day) => day.value === d)?.label ?? '')
    .filter(Boolean);

  switch (frequency) {
    case 'daily':
      return dayLabels.length > 0
        ? `Every ${dayLabels.join(', ')}`
        : 'Select which days';
    case 'weekly':
      return dayLabels.length > 0
        ? `Every week on ${dayLabels.join(', ')}`
        : 'Select which days';
    case 'bi_weekly':
      return dayLabels.length > 0
        ? `Every 2 weeks on ${dayLabels.join(', ')}`
        : 'Select which days';
    case 'monthly':
      return 'Once per month on the same date';
    default:
      return '';
  }
};

export function TripStep({ accountType }: TripStepProps) {
  const { booking, setTrip } = useBooking();

  const tripType = booking.trip.type;
  const pickupDateValue = toDayjsFromStoredDate(booking.trip.pickupDate);
  const pickupTime = booking.trip.pickupTime;
  const recurring = booking.trip.isRecurring;
  const recurringEndDateValue = toDayjsFromStoredDate(
    booking.trip.recurringEndDate
  );

  const frequencyOptions = useMemo(
    () => [
      {
        key: 'daily' as const,
        label: 'Daily',
        description: 'Every selected day',
      },
      { key: 'weekly' as const, label: 'Weekly', description: 'Once per week' },
      {
        key: 'bi_weekly' as const,
        label: 'Bi-Weekly',
        description: 'Every 2 weeks',
      },
      {
        key: 'monthly' as const,
        label: 'Monthly',
        description: 'Once per month',
      },
    ],
    []
  );

  const toggleDay = (dayValue: number) => {
    const current = booking.trip.recurringDaysOfWeek;
    const next = current.includes(dayValue)
      ? current.filter((d) => d !== dayValue)
      : [...current, dayValue];
    setTrip({ recurringDaysOfWeek: next });
  };

  const frequencyDesc = getFrequencyDescription(
    booking.trip.recurringFrequency,
    booking.trip.recurringDaysOfWeek
  );

  const showDaysOfWeek = booking.trip.recurringFrequency !== 'monthly';

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
          Trip Details
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
          Define when and how you&apos;d like to travel.
        </Typography>
      </Box>

      {/* Trip Type */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: pxToRem(12),
          border: '1px solid #E2E8F0',
          bgcolor: '#FFFFFF',
          p: pxToRem(16),
        }}
      >
        <Typography
          sx={{ fontSize: pxToRem(12), fontWeight: 700, color: '#0F172A' }}
        >
          Trip Type
        </Typography>

        <Box
          sx={{
            mt: pxToRem(12),
            display: 'flex',
            gap: pxToRem(12),
            flexWrap: 'wrap',
          }}
        >
          {[
            {
              key: 'one_way' as const,
              title: 'One Way',
              subtitle: 'Single journey',
              icon: <ArrowForwardIcon sx={{ fontSize: pxToRem(14) }} />,
            },
            {
              key: 'round_trip' as const,
              title: 'Round Trip',
              subtitle: 'Return journey included',
              icon: <AutorenewIcon sx={{ fontSize: pxToRem(14) }} />,
            },
          ].map((t) => {
            const isSelected = tripType === t.key;
            return (
              <Paper
                key={t.key}
                component={ButtonBase}
                onClick={() => setTrip({ type: t.key })}
                elevation={0}
                sx={{
                  flex: '1 1 0',
                  minWidth: pxToRem(260),
                  borderRadius: pxToRem(12),
                  border: isSelected
                    ? '1px solid #2F6FED'
                    : '1px solid #E2E8F0',
                  bgcolor: isSelected ? alpha('#2F6FED', 0.06) : '#FFFFFF',
                  px: pxToRem(14),
                  py: pxToRem(12),
                  display: 'flex',
                  gap: pxToRem(10),
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
              >
                <Box
                  sx={{
                    width: pxToRem(28),
                    height: pxToRem(28),
                    borderRadius: '999999px',
                    bgcolor: isSelected ? '#2F6FED' : '#F1F5F9',
                    color: isSelected ? '#FFFFFF' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {t.icon}
                </Box>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography
                    sx={{
                      fontSize: pxToRem(12),
                      fontWeight: 700,
                      color: '#0F172A',
                    }}
                  >
                    {t.title}
                  </Typography>
                  <Typography
                    sx={{
                      mt: pxToRem(2),
                      fontSize: pxToRem(10),
                      color: '#94A3B8',
                    }}
                  >
                    {t.subtitle}
                  </Typography>
                </Box>
              </Paper>
            );
          })}
        </Box>
      </Paper>

      {/* Pickup Date & Time */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: pxToRem(12),
          border: '1px solid #E2E8F0',
          bgcolor: '#FFFFFF',
          p: pxToRem(16),
        }}
      >
        <Typography
          sx={{ fontSize: pxToRem(12), fontWeight: 700, color: '#0F172A' }}
        >
          Pickup Date &amp; Time
        </Typography>

        <Stack spacing={pxToRem(14)} sx={{ mt: pxToRem(12) }}>
          <Box>
            <Typography
              sx={{ fontSize: pxToRem(11), fontWeight: 700, color: '#0F172A' }}
            >
              Pickup Date{' '}
              <Box component="span" sx={{ color: '#EF4444' }}>
                *
              </Box>
            </Typography>
            <Box sx={{ mt: pxToRem(8) }}>
              <AppDatePickerPopover
                value={pickupDateValue}
                onChange={(d) =>
                  setTrip({ pickupDate: d ? d.format('YYYY-MM-DD') : '' })
                }
                format="MM/DD/YYYY"
                buttonSx={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  borderRadius: pxToRem(12),
                }}
              />
            </Box>
          </Box>

          <Box>
            <Typography
              sx={{ fontSize: pxToRem(11), fontWeight: 700, color: '#0F172A' }}
            >
              Pickup Time{' '}
              <Box component="span" sx={{ color: '#EF4444' }}>
                *
              </Box>
            </Typography>

            <Box
              sx={{
                mt: pxToRem(10),
                display: 'flex',
                gap: pxToRem(8),
                flexWrap: 'wrap',
              }}
            >
              {TIME_SLOTS.map((t) => {
                const isSelected = pickupTime === t;
                return (
                  <ButtonBase
                    key={t}
                    onClick={() => setTrip({ pickupTime: t })}
                    sx={{
                      px: pxToRem(10),
                      py: pxToRem(6),
                      borderRadius: pxToRem(8),
                      border: isSelected
                        ? '1px solid #2F6FED'
                        : '1px solid #E2E8F0',
                      bgcolor: isSelected ? '#2F6FED' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : '#0F172A',
                      fontSize: pxToRem(10),
                      fontWeight: 600,
                    }}
                  >
                    {t}
                  </ButtonBase>
                );
              })}
            </Box>

            <Box sx={{ mt: pxToRem(16) }}>
              <AppTimePickerPopover
                value={pickupTime}
                onChange={(t) => setTrip({ pickupTime: t })}
              />
            </Box>
          </Box>
        </Stack>
      </Paper>

      {/* Recurring Ride */}
      {/* <Paper
        elevation={0}
        sx={{
          borderRadius: pxToRem(12),
          border: '1px solid #E2E8F0',
          bgcolor: '#FFFFFF',
          p: pxToRem(16),
        }}
      >
        <Typography
          sx={{ fontSize: pxToRem(12), fontWeight: 700, color: '#0F172A' }}
        >
          Recurring Ride
          <Chip
            size="small"
            sx={{
              ml: pxToRem(8),
              height: pxToRem(18),
              fontSize: pxToRem(9),
              fontWeight: 600,
              bgcolor: '#F1F5F9',
              color: '#94A3B8',
              '& .MuiChip-label': { px: pxToRem(6) },
            }}
          />
        </Typography>
        <Typography
          sx={{ mt: pxToRem(4), fontSize: pxToRem(10), color: '#94A3B8' }}
        >
          Schedule multiple rides at once
        </Typography>

        <Paper
          elevation={0}
          sx={{
            mt: pxToRem(12),
            borderRadius: pxToRem(12),
            border: '1px solid #EEF2F7',
            bgcolor: '#F8FAFC',
            px: pxToRem(14),
            py: pxToRem(12),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: pxToRem(12),
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: pxToRem(10) }}>
            <Box
              sx={{
                width: pxToRem(28),
                height: pxToRem(28),
                borderRadius: '999999px',
                bgcolor: alpha('#2F6FED', 0.1),
                color: '#2F6FED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <RepeatIcon sx={{ fontSize: pxToRem(14) }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: pxToRem(12),
                  fontWeight: 700,
                  color: '#0F172A',
                }}
              >
                Make this recurring
              </Typography>
              <Typography
                sx={{ mt: pxToRem(2), fontSize: pxToRem(10), color: '#94A3B8' }}
              >
                Save time on repeat bookings
              </Typography>
            </Box>
          </Box>

          <IOSSwitch
            checked={recurring}
            onChange={(e) =>
              setTrip({
                isRecurring: e.target.checked,
                ...(!e.target.checked && {
                  recurringFrequency: 'weekly',
                  recurringDaysOfWeek: [],
                  recurringEndDate: '',
                  recurringRideCount: null,
                }),
              })
            }
          />
        </Paper>

        {recurring ? (
          <Stack spacing={pxToRem(20)} sx={{ mt: pxToRem(20) }}>
            <Box>
              <Typography
                sx={{
                  fontSize: pxToRem(11),
                  fontWeight: 700,
                  color: '#0F172A',
                  mb: pxToRem(10),
                }}
              >
                Frequency{' '}
                <Box component="span" sx={{ color: '#EF4444' }}>
                  *
                </Box>
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: pxToRem(8),
                }}
              >
                {frequencyOptions.map((f) => {
                  const isSelected =
                    booking.trip.recurringFrequency === f.key;
                  return (
                    <ButtonBase
                      key={f.key}
                      onClick={() =>
                        setTrip({
                          recurringFrequency: f.key,
                          ...(f.key === 'monthly' && {
                            recurringDaysOfWeek: [],
                          }),
                        })
                      }
                      sx={{
                        flexDirection: 'column',
                        gap: pxToRem(2),
                        px: pxToRem(12),
                        py: pxToRem(10),
                        borderRadius: pxToRem(12),
                        border: isSelected
                          ? '1.5px solid #2F6FED'
                          : '1px solid #EEF2F7',
                        bgcolor: isSelected
                          ? alpha('#2F6FED', 0.04)
                          : '#FFFFFF',
                        transition: 'all 150ms',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: pxToRem(11),
                          fontWeight: 700,
                          color: isSelected ? '#2F6FED' : '#0F172A',
                        }}
                      >
                        {f.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: pxToRem(9),
                          color: '#94A3B8',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {f.description}
                      </Typography>
                    </ButtonBase>
                  );
                })}
              </Box>
            </Box>

            {showDaysOfWeek ? (
              <Box>
                <Typography
                  sx={{
                    fontSize: pxToRem(11),
                    fontWeight: 700,
                    color: '#0F172A',
                    mb: pxToRem(4),
                  }}
                >
                  Repeat On{' '}
                  <Box component="span" sx={{ color: '#EF4444' }}>
                    *
                  </Box>
                </Typography>
                <Typography
                  sx={{
                    fontSize: pxToRem(10),
                    color: '#94A3B8',
                    mb: pxToRem(10),
                  }}
                >
                  Select the days this ride should repeat
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    gap: pxToRem(6),
                  }}
                >
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected =
                      booking.trip.recurringDaysOfWeek.includes(day.value);
                    const isWeekend = day.value >= 5;
                    return (
                      <ButtonBase
                        key={day.value}
                        onClick={() => toggleDay(day.value)}
                        sx={{
                          flex: 1,
                          flexDirection: 'column',
                          gap: pxToRem(2),
                          py: pxToRem(10),
                          borderRadius: pxToRem(10),
                          border: isSelected
                            ? '1.5px solid #2F6FED'
                            : '1px solid #EEF2F7',
                          bgcolor: isSelected
                            ? alpha('#2F6FED', 0.06)
                            : isWeekend
                              ? '#FAFAFA'
                              : '#FFFFFF',
                          transition: 'all 150ms',
                          position: 'relative',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: pxToRem(10),
                            fontWeight: 700,
                            color: isSelected ? '#2F6FED' : '#0F172A',
                          }}
                        >
                          {day.label}
                        </Typography>
                        {isSelected ? (
                          <Box
                            sx={{
                              width: 5,
                              height: 5,
                              borderRadius: '50%',
                              bgcolor: '#2F6FED',
                            }}
                          />
                        ) : null}
                      </ButtonBase>
                    );
                  })}
                </Box>

                {frequencyDesc &&
                booking.trip.recurringDaysOfWeek.length > 0 ? (
                  <RowStack
                    spacing={1}
                    sx={{
                      mt: pxToRem(10),
                      px: pxToRem(10),
                      py: pxToRem(8),
                      borderRadius: pxToRem(8),
                      bgcolor: alpha('#2F6FED', 0.04),
                      border: '1px solid',
                      borderColor: alpha('#2F6FED', 0.1),
                    }}
                  >
                    <CalendarTodayRoundedIcon
                      sx={{ fontSize: 13, color: '#2F6FED' }}
                    />
                    <Typography
                      sx={{
                        fontSize: pxToRem(11),
                        fontWeight: 600,
                        color: '#2F6FED',
                      }}
                    >
                      {frequencyDesc}
                    </Typography>
                  </RowStack>
                ) : null}
              </Box>
            ) : (
              <RowStack
                spacing={1}
                sx={{
                  px: pxToRem(10),
                  py: pxToRem(8),
                  borderRadius: pxToRem(8),
                  bgcolor: '#F8FAFC',
                  border: '1px solid #EEF2F7',
                }}
              >
                <InfoOutlinedIcon
                  sx={{ fontSize: 13, color: '#94A3B8' }}
                />
                <Typography
                  sx={{
                    fontSize: pxToRem(11),
                    fontWeight: 500,
                    color: '#64748B',
                  }}
                >
                  Repeats monthly on the same date as your pickup
                </Typography>
              </RowStack>
            )}

            <Box>
              <Typography
                sx={{
                  fontSize: pxToRem(11),
                  fontWeight: 700,
                  color: '#0F172A',
                  mb: pxToRem(10),
                }}
              >
                Ends{' '}
                <Box component="span" sx={{ color: '#EF4444' }}>
                  *
                </Box>
              </Typography>
              <Box
                sx={{
                  width: 'fit-content',
                  p: pxToRem(3),
                  borderRadius: pxToRem(12),
                  bgcolor: '#F1F5F9',
                  display: 'flex',
                  gap: pxToRem(4),
                }}
              >
                {[
                  { key: 'by_date' as const, label: 'By Date' },
                  { key: 'no_of_rides' as const, label: 'No of Rides' },
                ].map((o) => {
                  const isSelected = booking.trip.recurringEnds === o.key;
                  return (
                    <ButtonBase
                      key={o.key}
                      onClick={() => setTrip({ recurringEnds: o.key })}
                      sx={{
                        px: pxToRem(16),
                        py: pxToRem(8),
                        borderRadius: pxToRem(10),
                        bgcolor: isSelected ? '#FFFFFF' : 'transparent',
                        border: isSelected
                          ? '1px solid #2F6FED'
                          : '1px solid transparent',
                        fontSize: pxToRem(10),
                        fontWeight: 700,
                        color: '#0F172A',
                      }}
                    >
                      {o.label}
                    </ButtonBase>
                  );
                })}
              </Box>

              {booking.trip.recurringEnds === 'by_date' ? (
                <Box sx={{ mt: pxToRem(10) }}>
                  <AppDatePickerPopover
                    value={recurringEndDateValue}
                    onChange={(d) =>
                      setTrip({
                        recurringEndDate: d ? d.format('YYYY-MM-DD') : '',
                      })
                    }
                    format="MM/DD/YYYY"
                    buttonSx={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      borderRadius: pxToRem(12),
                    }}
                  />
                </Box>
              ) : (
                <AppTextField
                  value={
                    booking.trip.recurringRideCount
                      ? String(booking.trip.recurringRideCount)
                      : ''
                  }
                  onChange={(e) =>
                    setTrip({
                      recurringRideCount: Number(e.target.value || 0) || null,
                    })
                  }
                  placeholder="e.g. 10"
                  sx={{ mt: pxToRem(10) }}
                  type="number"
                />
              )}
            </Box>
          </Stack>
        ) : null}
      </Paper> */}

      {/* Additional Notes */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: pxToRem(12),
          border: '1px solid #E2E8F0',
          bgcolor: '#FFFFFF',
          p: pxToRem(16),
        }}
      >
        <Typography
          sx={{ fontSize: pxToRem(12), fontWeight: 700, color: '#0F172A' }}
        >
          Additional Notes
        </Typography>
        <Typography
          sx={{ mt: pxToRem(4), fontSize: pxToRem(10), color: '#94A3B8' }}
        >
          Anything the driver or care assistant should know in advance.
        </Typography>

        <AppTextField
          value={booking.trip.notes}
          onChange={(e) => setTrip({ notes: e.target.value })}
          placeholder="e.g. Patient uses a walking frame. Please call 10 minutes before arrival."
          multiline
          minRows={3}
          sx={{ mt: pxToRem(10) }}
        />
      </Paper>
    </Box>
  );
}
