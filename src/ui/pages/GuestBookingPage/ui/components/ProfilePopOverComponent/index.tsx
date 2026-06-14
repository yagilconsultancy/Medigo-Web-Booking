'use client';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  Avatar,
  Box,
  ButtonBase,
  Divider,
  IconButton,
  Popover,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, pxToRem, useGetGuestSession } from '@/common';
import { StyledImage } from '@/ui/modules/components';
import { LogoutModal } from '../LogoutModal';

import icon13 from '../../assets/icons/Icon-13.svg';
import icon14 from '../../assets/icons/Icon-14.svg';
import icon15 from '../../assets/icons/Icon-15.svg';
import icon16 from '../../assets/icons/Icon-16.svg';
import icon17 from '../../assets/icons/Icon-17.svg';
import icon18 from '../../assets/icons/Icon-18.svg';

export type ProfilePopOverComponentProps = {
  online?: boolean;
  anchorEl?: HTMLElement | null;
  open?: boolean;
  onClose?: () => void;
  hideTrigger?: boolean;
};

export function ProfilePopOverComponent({
  online = true,
  anchorEl: anchorElProp,
  open: openProp,
  onClose,
  hideTrigger = false,
}: ProfilePopOverComponentProps) {
  const router = useRouter();
  const sessionId = getAuthToken();
  const { data: profileResponse } = useGetGuestSession(sessionId);
  const profile = profileResponse?.success ? profileResponse.data : null;
  const name = profile
    ? `${profile.first_name} ${profile.last_name}`.trim()
    : 'User';
  const email = profile?.email || 'user@medigo.com';
  const [uncontrolledAnchorEl, setUncontrolledAnchorEl] =
    useState<HTMLElement | null>(null);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const anchorEl = anchorElProp ?? uncontrolledAnchorEl;
  const open = openProp ?? Boolean(anchorEl);
  const handleClose = onClose ?? (() => setUncontrolledAnchorEl(null));

  const items = useMemo(
    () => [
      {
        key: 'profile',
        label: 'Profile',
        link: '/profile',
        description: 'Manage your account details',
        icon: icon13,
      },
      {
        key: 'rides',
        label: 'My rides',
        link: '/my-rides',
        description: 'View your ride history',
        icon: icon14,
      },
      //   {
      //     key: 'schedule',
      //     label: 'Scheduled rides',
      //     link: '/scheduled-rides',
      //     description: 'Upcoming scheduled trips',
      //     icon: icon15,
      //   },
      //   {
      //     key: 'payments',
      //     label: 'Payments',
      //     link: '/payments',
      //     description: 'Payment methods and receipts',
      //     icon: icon16,
      //   },
      {
        key: 'help',
        label: 'Help',
        link: '/help',
        description: 'Get support and FAQs',
        icon: icon17,
      },
      {
        key: 'logout',
        label: 'Logout',
        description: 'Sign out of your account',
        icon: icon18,
        danger: true,
      },
    ],
    []
  );

  return (
    <>
      {!hideTrigger ? (
        <ButtonBase
          onClick={(e) => setUncontrolledAnchorEl(e.currentTarget)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: pxToRem(8),
            borderRadius: pxToRem(999),
            px: pxToRem(6),
            py: pxToRem(4),
            '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.04)' },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: pxToRem(32),
              height: pxToRem(32),
            }}
          >
            <Avatar
              sx={{
                width: pxToRem(32),
                height: pxToRem(32),
                bgcolor: 'transparent',
                backgroundImage:
                  'linear-gradient(135deg, rgb(124, 58, 237) 0%, rgb(91, 33, 182) 100%)',
                boxShadow:
                  '0px 1px 3px 0px rgba(0,0,0,0.10), 0px 1px 2px 0px rgba(0,0,0,0.10)',
              }}
            />
            {online ? (
              <Box
                sx={{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  width: pxToRem(10),
                  height: pxToRem(10),
                  bgcolor: '#16A34A',
                  borderRadius: '999999px',
                  border: '2px solid',
                  borderColor: (theme) => theme.palette.common.white,
                }}
              />
            ) : null}
          </Box>
          <IconButton
            size="small"
            sx={{ p: 0, color: '#94A3B8' }}
            aria-label="Open profile menu"
          >
            <KeyboardArrowDownIcon sx={{ fontSize: pxToRem(18) }} />
          </IconButton>
        </ButtonBase>
      ) : null}

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: pxToRem(8),
            width: pxToRem(280),
            borderRadius: pxToRem(14),
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
          },
        }}
      >
        <Box sx={{ p: pxToRem(14) }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: pxToRem(10) }}>
            <Avatar
              sx={{
                width: pxToRem(40),
                height: pxToRem(40),
                bgcolor: 'transparent',
                backgroundImage:
                  'linear-gradient(135deg, rgb(124, 58, 237) 0%, rgb(91, 33, 182) 100%)',
                boxShadow:
                  '0px 1px 3px 0px rgba(0,0,0,0.10), 0px 1px 2px 0px rgba(0,0,0,0.10)',
              }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: pxToRem(12),
                  fontWeight: 800,
                  color: '#0F172A',
                  lineHeight: pxToRem(16),
                }}
              >
                {name}
              </Typography>
              <Typography
                sx={{
                  mt: pxToRem(2),
                  fontSize: pxToRem(10),
                  color: '#94A3B8',
                  lineHeight: pxToRem(14),
                }}
              >
                {email}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ p: pxToRem(8) }}>
          {items.map((item) => (
            <ButtonBase
              key={item.key}
              onClick={() => {
                if (item.key === 'logout') {
                  handleClose();
                  setLogoutModalOpen(true);
                  return;
                }
                router.push(item.link!);
                handleClose();
              }}
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: pxToRem(10),
                px: pxToRem(10),
                py: pxToRem(10),
                textAlign: 'left',
                '&:hover': { bgcolor: '#F8FAFC' },
              }}
            >
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: pxToRem(10) }}
              >
                <Box
                  sx={{
                    width: pxToRem(28),
                    height: pxToRem(28),
                    borderRadius: pxToRem(10),
                    bgcolor: '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <StyledImage
                    src={item.icon}
                    alt=""
                    sx={{ width: pxToRem(15), height: pxToRem(15) }}
                  />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: pxToRem(12),
                      fontWeight: 700,
                      color: item.danger ? '#EF4444' : '#0F172A',
                      lineHeight: pxToRem(16),
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    sx={{
                      mt: pxToRem(1),
                      fontSize: pxToRem(10),
                      color: '#94A3B8',
                      lineHeight: pxToRem(14),
                    }}
                  >
                    {item.description}
                  </Typography>
                </Box>
              </Box>

              <ArrowForwardIosIcon
                sx={{
                  fontSize: pxToRem(12),
                  color: item.danger ? '#EF4444' : '#94A3B8',
                }}
              />
            </ButtonBase>
          ))}
        </Box>
      </Popover>

      <LogoutModal open={logoutModalOpen} setOpen={setLogoutModalOpen} />
    </>
  );
}
