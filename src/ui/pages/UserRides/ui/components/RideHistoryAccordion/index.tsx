'use client';

import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import AccessibleForwardRoundedIcon from '@mui/icons-material/AccessibleForwardRounded';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  ButtonBase,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { pxToRem } from '@/common';
import { RowStack } from '@/ui/modules/components';

export type RideStatus = 'completed' | 'cancelled' | 'requested';

export type RideHistoryItem = {
  id: string;
  status: RideStatus;
  serviceName: string;
  pickupAddress: string;
  dropoffAddress: string;
  dateLabel: string;
  timeLabel: string;
  details?: {
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
  if (status === 'cancelled') {
    return {
      bgcolor: '#FEF2F2',
      borderColor: '#FECACA',
      color: '#B91C1C',
    } as const;
  }

  if (status === 'requested') {
    return {
      bgcolor: '#EFF6FF',
      borderColor: '#BFDBFE',
      color: '#155DFC',
    } as const;
  }

  return {
    bgcolor: '#ECFDF5',
    borderColor: '#A7F3D0',
    color: '#047857',
  } as const;
};

const RideTypeIcon = ({ serviceName }: { serviceName: string }) => {
  if (serviceName.toLowerCase().includes('wheelchair')) {
    return <AccessibleForwardRoundedIcon sx={{ fontSize: pxToRem(20) }} />;
  }

  return <DirectionsCarRoundedIcon sx={{ fontSize: pxToRem(20) }} />;
};

export function RideHistoryAccordion({ items }: { items: RideHistoryItem[] }) {
  const [expandedId, setExpandedId] = useState<string | false>(false);

  return (
    <Stack spacing={2}>
      {items.map((ride) => {
        const expanded = expandedId === ride.id;
        const chipSx = getStatusChipSx(ride.status);

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
                            ride.status === 'cancelled' ? (
                              <CloseRoundedIcon
                                sx={{ fontSize: pxToRem(14) }}
                              />
                            ) : ride.status === 'requested' ? (
                              <RouteRoundedIcon
                                sx={{ fontSize: pxToRem(14) }}
                              />
                            ) : (
                              <CheckCircleRoundedIcon
                                sx={{ fontSize: pxToRem(14) }}
                              />
                            )
                          }
                          label={
                            ride.status === 'cancelled'
                              ? 'Cancelled'
                              : ride.status === 'requested'
                                ? 'Requested'
                                : 'Completed'
                          }
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
                          DRIVER
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
