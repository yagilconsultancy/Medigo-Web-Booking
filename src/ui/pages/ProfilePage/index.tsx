'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { pxToRem, useGetMyProfile } from '@/common';
import { AppFooter, AppLayout } from '@/ui/modules/partials';
import { HeaderHelpUser } from '@/ui/modules/partials/AppHeader/ui/components';
import {
  AppButton,
  RowStack,
  VisuallyHiddenInput,
} from '@/ui/modules/components';
import { NotificationsTab, PersonalTab, SecurityTab } from './ui/components';

type ProfileTabKey = 'personal' | 'security' | 'notifications';

const tabOrder: ProfileTabKey[] = ['personal', 'security', 'notifications'];

export type ProfileSnapshot = {
  name: string;
  email: string;
  phone: string;
  avatarUrl?: File | string;
  dateOfBirth?: string;
  gender?: string;
  homeAddress?: string;
  medicalNotes?: string;
};

const DEFAULT_SNAPSHOT: ProfileSnapshot = {
  name: '',
  email: '',
  phone: '',
};

export function ProfilePage() {
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);
  const activeTab = tabOrder[tabIndex] ?? 'personal';

  const { data: profileResponse } = useGetMyProfile();
  const profile = profileResponse?.success ? profileResponse.data : null;

  const [snapshot, setSnapshot] = useState<ProfileSnapshot>(DEFAULT_SNAPSHOT);
  const personalSubmitRef = useRef<null | (() => void)>(null);
  const [isPersonalFormValid, setIsPersonalFormValid] = useState(false);
  const lastBlobUrlRef = useRef<string | null>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (profile && !hasInitialized.current) {
      hasInitialized.current = true;
      setSnapshot({
        name: `${profile.first_name} ${profile.last_name}`.trim(),
        email: profile.email || '',
        phone: profile.phone || '',
        avatarUrl: profile.avatar_url || undefined,
        dateOfBirth: profile.date_of_birth || undefined,
        gender: profile.gender || undefined,
        homeAddress: profile.home_address || undefined,
        medicalNotes: profile.medical_notes || undefined,
      });
    }
  }, [profile]);

  useEffect(() => {
    return () => {
      if (lastBlobUrlRef.current?.startsWith('blob:')) {
        URL.revokeObjectURL(lastBlobUrlRef.current);
      }
    };
  }, []);

  const headerIdentity = useMemo(() => {
    return {
      name: snapshot.name?.trim() || 'User',
      email: snapshot.email?.trim() || 'user@medigo.com',
    };
  }, [snapshot.email, snapshot.name]);

  return (
    <AppLayout
      headerProps={{
        showRightContent: true,
        rightContent: <HeaderHelpUser />,
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

          <Typography
            sx={{
              color: '#0F172A',
              fontSize: {
                xs: pxToRem(18),
                md: pxToRem(24),
                lg: pxToRem(30),
              },
            }}
          >
            My Profile
          </Typography>

          <Paper
            elevation={0}
            sx={{
              mt: pxToRem(18),
              borderRadius: pxToRem(12),
              border: '1px solid #E2E8F0',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ bgcolor: '#EFF6FF', height: '90px' }} />
            <Box sx={{ px: pxToRem(18), pb: pxToRem(14) }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '32px',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  mt: '-20px',
                }}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: '32px' }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      src={
                        snapshot.avatarUrl instanceof File
                          ? lastBlobUrlRef.current || undefined
                          : typeof snapshot.avatarUrl === 'string'
                            ? snapshot.avatarUrl
                            : undefined
                      }
                      sx={{
                        width: '120px',
                        height: '120px',
                        borderRadius: pxToRem(14),
                        border: '3px solid #FFFFFF',
                        bgcolor: '#E2E8F0',
                        color: '#0F172A',
                        fontWeight: 700,
                      }}
                    >
                      {headerIdentity.name.slice(0, 1).toUpperCase()}
                    </Avatar>

                    <IconButton
                      component="label"
                      sx={{
                        position: 'absolute',
                        right: pxToRem(-6),
                        bottom: pxToRem(-6),
                        width: pxToRem(24),
                        height: pxToRem(24),
                        bgcolor: '#2F6FED',
                        color: '#FFFFFF',
                        '&:hover': { bgcolor: '#2F6FED' },
                      }}
                      aria-label="Change profile photo"
                    >
                      <PhotoCameraOutlinedIcon sx={{ fontSize: pxToRem(14) }} />
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.currentTarget.files?.[0] ?? null;
                          if (!file) return;
                          if (lastBlobUrlRef.current?.startsWith('blob:')) {
                            URL.revokeObjectURL(lastBlobUrlRef.current);
                          }
                          const previewUrl = URL.createObjectURL(file);
                          lastBlobUrlRef.current = previewUrl;
                          setSnapshot((prev) => ({
                            ...prev,
                            avatarUrl: file,
                          }));
                        }}
                      />
                    </IconButton>
                  </Box>

                  <Box sx={{ minWidth: 0, pt: '40px' }}>
                    <Box
                      sx={{
                        fontSize: {
                          xs: pxToRem(16),
                          md: pxToRem(20),
                          lg: pxToRem(28),
                        },
                        fontWeight: 700,
                        color: '#0F172A',
                      }}
                    >
                      {headerIdentity.name}
                    </Box>

                    <RowStack sx={{ mt: pxToRem(4) }} spacing={2}>
                      <Chip
                        size="small"
                        label="Premium Member"
                        sx={{
                          height: pxToRem(18),
                          fontSize: pxToRem(10),
                          fontWeight: 700,
                          bgcolor: '#EFF6FF',
                          color: '#2563EB',
                          '& .MuiChip-label': { px: pxToRem(8) },
                        }}
                      />
                      <RowStack spacing={1}>
                        <Box
                          sx={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#10B981',
                          }}
                        />
                        <Box
                          sx={{
                            fontSize: pxToRem(10),
                            fontWeight: 700,
                            color: '#10B981',
                          }}
                        >
                          Active
                        </Box>
                      </RowStack>
                    </RowStack>
                  </Box>
                </Box>

                {activeTab === 'personal' ? (
                  <AppButton
                    type="button"
                    disabled={!isPersonalFormValid}
                    onClick={() => personalSubmitRef.current?.()}
                    sx={{
                      bgcolor: '#2F6FED',
                      fontSize: pxToRem(11),
                      textTransform: 'none',
                      padding: '12px 24px',
                      '&:disabled': { opacity: 0.5 },
                    }}
                  >
                    Save Changes
                  </AppButton>
                ) : null}
              </Box>

              <Tabs
                value={tabIndex}
                onChange={(_, v) => setTabIndex(v)}
                sx={{
                  mt: pxToRem(12),
                  minHeight: 'unset',
                  '& .MuiTab-root': {
                    minHeight: 'unset',
                    textTransform: 'none',
                    fontSize: pxToRem(11),
                    fontWeight: 800,
                    color: '#64748B',
                    px: pxToRem(12),
                    py: pxToRem(10),
                  },
                  '& .Mui-selected': { color: '#2563EB' },
                  '& .MuiTabs-indicator': { bgcolor: '#2563EB' },
                }}
              >
                <Tab label="Personal Info" />
                <Tab label="Security" />
                <Tab label="Notifications" />
              </Tabs>
            </Box>
          </Paper>

          <Box sx={{ mt: pxToRem(16) }}>
            {activeTab === 'personal' ? (
              <PersonalTab
                snapshot={snapshot}
                onSnapshotChange={setSnapshot}
                registerSubmit={(submit, isFormValid) => {
                  personalSubmitRef.current = submit;
                  setIsPersonalFormValid(isFormValid);
                }}
              />
            ) : null}
            {activeTab === 'security' ? (
              <SecurityTab phone={snapshot.phone} />
            ) : null}
            {activeTab === 'notifications' ? <NotificationsTab /> : null}
          </Box>
        </Box>

        <AppFooter />
      </Box>
    </AppLayout>
  );
}
