'use client';

import { Box, Button, Paper } from '@mui/material';
import { useFormik } from 'formik';
import { pxToRem } from '@/common';
import greyCellIcon from '../../assets/icons/grey-cell.svg';
import purplePhoneIcon from '../../assets/icons/purple-phone.svg';
import { SectionTitle } from '../SectionTitle';
import { IOSSwitch } from '../IOSSwitch';

type NotificationsFormValues = {
  rideConfirmation: boolean;
  driverAssigned: boolean;
  rideReminders: boolean;
  smsAlerts: boolean;
  pushNotifications: boolean;
  promotionalEmails: boolean;
};

function getInitialValues(): NotificationsFormValues {
  return {
    rideConfirmation: true,
    driverAssigned: true,
    rideReminders: true,
    smsAlerts: true,
    pushNotifications: true,
    promotionalEmails: false,
  };
}

export function NotificationsTab() {
  const formik = useFormik<NotificationsFormValues>({
    initialValues: getInitialValues(),
    onSubmit: () => {
      // no-op: wire to API later
    },
  });

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{ display: 'grid', gap: pxToRem(16) }}
    >
      {/* <Paper
        elevation={0}
        sx={{
          borderRadius: pxToRem(12),
          border: '1px solid #E2E8F0',
          bgcolor: '#FFFFFF',
          p: pxToRem(16),
        }}
      >
        <SectionTitle
          label="Ride Updates"
          iconSrc={greyCellIcon as any}
          bgSection="#F8FAFC"
        />

        <Box sx={{ mt: pxToRem(12), display: 'grid', gap: pxToRem(12) }}>
          {[
            {
              key: 'rideConfirmation' as const,
              title: 'Ride Confirmation',
              desc: 'When your ride is booked or confirmed',
            },
            {
              key: 'driverAssigned' as const,
              title: 'Driver Assigned',
              desc: 'When a driver is matched to your ride',
            },
            {
              key: 'rideReminders' as const,
              title: 'Ride Reminders',
              desc: '30-minute & 10-minute reminders',
            },
          ].map((row) => (
            <Box
              key={row.key}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: pxToRem(12),
              }}
            >
              <Box>
                <Box sx={{ fontSize: pxToRem(11), fontWeight: 900 }}>
                  {row.title}
                </Box>
                <Box sx={{ fontSize: pxToRem(10), color: '#94A3B8' }}>
                  {row.desc}
                </Box>
              </Box>
              <IOSSwitch
                checked={formik.values[row.key]}
                onChange={(e) =>
                  formik.setFieldValue(row.key, e.target.checked)
                }
              />
            </Box>
          ))}
        </Box>
      </Paper> */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: pxToRem(12),
          border: '1px solid #E2E8F0',
          bgcolor: '#FFFFFF',
          p: pxToRem(16),
        }}
      >
        <SectionTitle
          label="Communication"
          iconSrc={purplePhoneIcon as any}
          bgSection="#F5F3FF"
        />

        <Box sx={{ mt: pxToRem(12), display: 'grid', gap: pxToRem(12) }}>
          {[
            {
              key: 'smsAlerts' as const,
              title: 'SMS Alerts',
              desc: 'Text messages to your phone',
            },
            {
              key: 'pushNotifications' as const,
              title: 'Push Notifications',
              desc: 'In-app & browser notifications',
            },
            {
              key: 'promotionalEmails' as const,
              title: 'Promotional Emails',
              desc: 'Special offers and updates',
            },
          ].map((row) => (
            <Box
              key={row.key}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: pxToRem(12),
              }}
            >
              <Box>
                <Box sx={{ fontSize: pxToRem(11), fontWeight: 900 }}>
                  {row.title}
                </Box>
                <Box sx={{ fontSize: pxToRem(10), color: '#94A3B8' }}>
                  {row.desc}
                </Box>
              </Box>
              <IOSSwitch
                checked={formik.values[row.key]}
                onChange={(e) =>
                  formik.setFieldValue(row.key, e.target.checked)
                }
              />
            </Box>
          ))}
        </Box>
      </Paper>

      <Button
        type="submit"
        variant="contained"
        sx={{
          borderRadius: pxToRem(10),
          bgcolor: '#2563EB',
          textTransform: 'none',
          fontWeight: 900,
          height: pxToRem(44),
          '&:hover': { bgcolor: '#2563EB' },
        }}
      >
        Save Preferences
      </Button>
    </Box>
  );
}
