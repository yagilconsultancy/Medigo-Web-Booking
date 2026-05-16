'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { pxToRem } from '@/common';
import { AppFooter, AppLayout } from '@/ui/modules/partials';
import { HeaderHelpUser } from '@/ui/modules/partials/AppHeader/ui/components';

/**
 * =========================================================
 * DATA
 * =========================================================
 */

const privacySections = [
  {
    title: '2.1 Account & Identity Information',
    items: [
      'Full name, date of birth, gender',
      'Email address and phone number',
      'Profile photo (optional)',
      'Government-issued ID verification (for safety)',
    ],
  },

  {
    title: '2.2 Booking & Trip Information',
    items: [
      'Pickup and drop-off locations',
      'Date and time of scheduled rides',
      'Trip purpose (medical appointment category)',
      'Special assistance requirements (wheelchair, oxygen, escort)',
    ],
  },

  {
    title: '2.3 Health-Related Information (Minimum Necessary)',
    items: [
      'Mobility assistance needs',
      'Allergy or medical alerts relevant to safe transport',
      'Emergency contact information',
      'Medical facility destinations',
    ],
    note:
      'We collect only the minimum health information necessary to provide safe transportation. We do NOT collect detailed medical diagnoses or treatment records.',
  },

  {
    title: '2.4 Location Data',
    items: [
      'Real-time GPS location during active rides',
      'Route and driver tracking',
      'Pickup and destination coordinates',
    ],
  },

  {
    title: '2.5 Communication Data',
    items: [
      'In-app messages with drivers',
      'Customer support interactions',
      'Feedback and ratings',
    ],
  },

  {
    title: '2.6 Device & Usage Data',
    items: [
      'Device type, operating system, app version',
      'IP address and browser information',
      'Crash reports and performance analytics',
    ],
  },

  {
    title: '2.7 Payment Information',
    items: [
      'Payment card details (processed by third-party processor)',
      'Billing address',
      'Transaction history',
    ],
    note:
      'MediGo does not store your full credit card number. Payment processing is handled by PCI-compliant third-party providers.',
  },

  {
    title: '2.8 Cookies (Web Portal)',
    description:
      'Our web portal uses cookies and similar tracking technologies to enhance user experience, analyze usage, and remember your preferences.',
  },
];

const informationUsageItems = [
  {
    label: 'Service Delivery',
    value:
      'Connect you with qualified drivers, facilitate rides, provide real-time tracking',
  },

  {
    label: 'Safety & Security',
    value:
      'Verify identities, conduct background checks, monitor for fraudulent activity',
  },

  {
    label: 'Customer Support',
    value:
      'Respond to inquiries, resolve issues, process refunds',
  },

  {
    label: 'Communication',
    value:
      'Send booking confirmations, ride updates, service announcements',
  },

  {
    label: 'Improvement',
    value:
      'Analyze usage patterns, develop new features, enhance user experience',
  },

  {
    label: 'Legal Compliance',
    value:
      'Meet regulatory requirements, respond to legal requests',
  },

  {
    label: 'Marketing',
    value:
      'Send promotional offers (you may opt-out anytime)',
  },
];

const sharingSections = [
  {
    title: '4.1 With Transportation Providers',
    description:
      'We share necessary information with your assigned driver, including your name, pickup/drop-off locations, special assistance needs, and contact information to facilitate safe transport.',
  },

  {
    title: '4.2 With Payment Processors',
    description:
      'Payment information is shared with PCI-compliant third-party payment processors to complete transactions.',
  },

  {
    title: '4.3 With Service Providers',
    items: [
      'Cloud hosting services (data storage)',
      'Analytics platforms (usage insights)',
      'Customer support tools',
      'Background check services (driver verification)',
    ],
  },

  {
    title: '4.4 For Legal & Compliance Purposes',
    description:
      'We may disclose information when required by law, in response to legal processes, to protect rights and safety, or to prevent fraud and abuse.',
  },

  {
    title: '4.5 Business Transfers',
    description:
      'In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.',
  },
];

const retentionItems = [
  {
    label: 'Account Information',
    value: 'Retained while your account is active',
  },

  {
    label: 'Trip Records',
    value:
      'Retained for up to 7 years (tax and legal requirements)',
  },

  {
    label: 'Financial Records',
    value:
      'Retained for up to 7 years (accounting compliance)',
  },

  {
    label: 'Communications',
    value:
      'Retained for 2 years or as needed for support',
  },
];

const rightsItems = [
  {
    label: 'Access',
    value: 'Request a copy of your personal information',
  },

  {
    label: 'Correction',
    value:
      'Request correction of inaccurate information',
  },

  {
    label: 'Deletion',
    value:
      'Request deletion of your account and data',
  },

  {
    label: 'Portability',
    value:
      'Request transfer of your data to another service',
  },

  {
    label: 'Opt-Out',
    value:
      'Unsubscribe from marketing communications',
  },

  {
    label: 'Withdraw Consent',
    value:
      'Withdraw consent for data processing (may limit services)',
  },
];

/**
 * =========================================================
 * REUSABLE COMPONENTS
 * =========================================================
 */

type PrivacyListSectionProps = {
  title: string;
  items?: string[];
  note?: string;
  description?: string;
};

function PrivacyListSection({
  title,
  items,
  note,
  description,
}: PrivacyListSectionProps) {
  return (
    <Stack spacing={pxToRem(8)}>
      <Typography
        sx={{
          color: '#0F172A',
          fontSize: pxToRem(14),
          fontWeight: 700,
        }}
      >
        {title}
      </Typography>

      {description && (
        <Typography
          sx={{
            color: '#374151',
            fontSize: pxToRem(16),
            lineHeight: pxToRem(24),
          }}
        >
          {description}
        </Typography>
      )}

      {!!items?.length && (
        <Stack
          component="ul"
          sx={{
            m: 0,
            pl: pxToRem(22),
            color: '#374151',
          }}
          spacing={pxToRem(6)}
        >
          {items.map((item) => (
            <Typography
              key={item}
              component="li"
              sx={{
                fontSize: pxToRem(16),
                lineHeight: pxToRem(24),
              }}
            >
              {item}
            </Typography>
          ))}
        </Stack>
      )}

      {note && (
        <Typography
          sx={{
            color: '#6B7280',
            fontSize: pxToRem(14),
            lineHeight: pxToRem(22),
            fontStyle: 'italic',
          }}
        >
          {note}
        </Typography>
      )}
    </Stack>
  );
}

type LabelValueListProps = {
  items: {
    label: string;
    value: string;
  }[];
};

function LabelValueList({
  items,
}: LabelValueListProps) {
  return (
    <Stack
      component="ul"
      sx={{
        m: 0,
        pl: pxToRem(22),
      }}
      spacing={pxToRem(12)}
    >
      {items.map((item) => (
        <Typography
          key={item.label}
          component="li"
          sx={{
            color: '#374151',
            fontSize: pxToRem(16),
            lineHeight: pxToRem(24),
          }}
        >
          <Box
            component="span"
            sx={{
              fontWeight: 700,
              color: '#111827',
            }}
          >
            {item.label}:{' '}
          </Box>

          {item.value}
        </Typography>
      ))}
    </Stack>
  );
}

/**
 * =========================================================
 * TEXT
 * =========================================================
 */

const INTRO_TEXT =
  'MediGo Inc. ("MediGo", "we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our healthcare transportation platform.';

const USING_TEXT =
  'By using MediGo services, you agree to the collection and use of information in accordance with this policy.';

const NOTICE_TEXT =
  'MediGo is NOT an emergency service. In case of a medical emergency, please call 911 or your local emergency number immediately. MediGo is designed for non-emergency medical transportation only.';

/**
 * =========================================================
 * PAGE
 * =========================================================
 */

export function PrivacyPage() {
  const router = useRouter();

  const headerIdentity = useMemo(() => {
    return {
      name: 'Sarah Johnson',
      email: 'user@medigo.com',
    };
  }, []);

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
        <Box
          sx={{
            maxWidth: '1278px',
            mx: 'auto',
            px: { xs: 0, md: '114px' },
          }}
        >
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
              Privacy & Policy
            </Typography>

            <Typography
              sx={{
                color: '#64748B',
                fontSize: pxToRem(12),
                lineHeight: pxToRem(18),
              }}
            >
              A summary of MediGo’s privacy and policy
            </Typography>
          </Stack>

          <Paper
            elevation={0}
            sx={{
              mt: pxToRem(18),
              borderRadius: pxToRem(14),
              border: '1px solid #E2E8F0',
              bgcolor: '#FFFFFF',
              p: pxToRem(24),
            }}
          >
            <Stack spacing={pxToRem(24)}>
              <Stack spacing={pxToRem(2)}>
                <Typography
                  sx={{
                    color: '#6B7280',
                    fontSize: pxToRem(13),
                    fontWeight: 700,
                  }}
                >
                  Effective Date:{' '}
                  <Box
                    component="span"
                    sx={{ fontWeight: 400 }}
                  >
                    February 26, 2026
                  </Box>
                </Typography>

                <Typography
                  sx={{
                    color: '#6B7280',
                    fontSize: pxToRem(13),
                    fontWeight: 700,
                  }}
                >
                  Last Updated:{' '}
                  <Box
                    component="span"
                    sx={{ fontWeight: 400 }}
                  >
                    February 26, 2026
                  </Box>
                </Typography>
              </Stack>

              <Box
                sx={{
                  bgcolor: '#FEF2F2',
                  borderLeft: `${pxToRem(4)} solid #EF4444`,
                  borderRadius: pxToRem(16),
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  px: pxToRem(20),
                  py: pxToRem(16),
                }}
              >
                <Typography
                  sx={{
                    color: '#7F1D1D',
                    fontSize: pxToRem(14),
                    fontWeight: 700,
                    mb: pxToRem(6),
                  }}
                >
                  ⚠️ Non-Emergency Service Notice
                </Typography>

                <Typography
                  sx={{
                    color: '#7F1D1D',
                    fontSize: pxToRem(14),
                    lineHeight: pxToRem(21),
                  }}
                >
                  {NOTICE_TEXT}
                </Typography>
              </Box>

              {/* 1. INTRODUCTION */}

              <Stack spacing={pxToRem(10)}>
                <Typography
                  sx={{
                    color: '#0F172A',
                    fontSize: pxToRem(16),
                    fontWeight: 700,
                  }}
                >
                  1. Introduction
                </Typography>

                <Typography
                  sx={{
                    color: '#374151',
                    fontSize: pxToRem(16),
                    lineHeight: pxToRem(24),
                  }}
                >
                  {INTRO_TEXT}
                </Typography>

                <Typography
                  sx={{
                    color: '#374151',
                    fontSize: pxToRem(16),
                    lineHeight: pxToRem(24),
                  }}
                >
                  {USING_TEXT}
                </Typography>
              </Stack>

              {/* 2. INFORMATION WE COLLECT */}

              <Stack spacing={pxToRem(18)}>
                <Typography
                  sx={{
                    color: '#0F172A',
                    fontSize: pxToRem(16),
                    fontWeight: 700,
                  }}
                >
                  2. Information We Collect
                </Typography>

                {privacySections.map((section) => (
                  <PrivacyListSection
                    key={section.title}
                    title={section.title}
                    items={section.items}
                    note={section.note}
                    description={section.description}
                  />
                ))}
              </Stack>

              {/* 3. HOW WE USE YOUR INFORMATION */}

              <Stack spacing={pxToRem(16)}>
                <Typography
                  sx={{
                    color: '#0F172A',
                    fontSize: pxToRem(16),
                    fontWeight: 700,
                  }}
                >
                  3. How We Use Your Information
                </Typography>

                <LabelValueList
                  items={informationUsageItems}
                />
              </Stack>

              {/* 4. HOW WE SHARE YOUR INFORMATION */}

              <Stack spacing={pxToRem(18)}>
                <Typography
                  sx={{
                    color: '#0F172A',
                    fontSize: pxToRem(16),
                    fontWeight: 700,
                  }}
                >
                  4. How We Share Your Information
                </Typography>

                {sharingSections.map((section) => (
                  <PrivacyListSection
                    key={section.title}
                    title={section.title}
                    items={section.items}
                    description={section.description}
                  />
                ))}
              </Stack>

              {/* 5. CROSS-BORDER PROCESSING */}

              <Stack spacing={pxToRem(10)}>
                <Typography
                  sx={{
                    color: '#0F172A',
                    fontSize: pxToRem(16),
                    fontWeight: 700,
                  }}
                >
                  5. Cross-Border Processing
                </Typography>

                <Typography
                  sx={{
                    color: '#374151',
                    fontSize: pxToRem(16),
                    lineHeight: pxToRem(24),
                  }}
                >
                  MediGo operates in Canada. Your information may
                  be processed and stored on servers located in
                  Canada and the United States. By using our
                  services, you consent to this transfer and
                  processing.
                </Typography>

                <Typography
                  sx={{
                    color: '#374151',
                    fontSize: pxToRem(16),
                    lineHeight: pxToRem(24),
                  }}
                >
                  We implement appropriate safeguards to protect
                  your information in accordance with applicable
                  data protection laws.
                </Typography>
              </Stack>

              {/* 6. DATA RETENTION */}

              <Stack spacing={pxToRem(16)}>
                <Typography
                  sx={{
                    color: '#0F172A',
                    fontSize: pxToRem(16),
                    fontWeight: 700,
                  }}
                >
                  6. Data Retention
                </Typography>

                <LabelValueList items={retentionItems} />

                <Typography
                  sx={{
                    color: '#374151',
                    fontSize: pxToRem(16),
                    lineHeight: pxToRem(24),
                  }}
                >
                  You may request deletion of your account at any
                  time, subject to legal retention requirements.
                </Typography>
              </Stack>

              {/* 7. SECURITY SAFEGUARDS */}

              <Stack spacing={pxToRem(12)}>
                <Typography
                  sx={{
                    color: '#0F172A',
                    fontSize: pxToRem(16),
                    fontWeight: 700,
                  }}
                >
                  7. Security Safeguards
                </Typography>

                <Typography
                  sx={{
                    color: '#374151',
                    fontSize: pxToRem(16),
                    lineHeight: pxToRem(24),
                  }}
                >
                  We implement industry-standard security
                  measures to protect your information:
                </Typography>

                <Stack
                  component="ul"
                  sx={{
                    m: 0,
                    pl: pxToRem(22),
                  }}
                  spacing={pxToRem(6)}
                >
                  {[
                    'Encryption of data in transit (TLS/SSL)',
                    'Encryption of sensitive data at rest',
                    'Access controls and authentication',
                    'Regular security audits and monitoring',
                    'Employee training on data protection',
                  ].map((item) => (
                    <Typography
                      key={item}
                      component="li"
                      sx={{
                        color: '#374151',
                        fontSize: pxToRem(16),
                        lineHeight: pxToRem(24),
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Stack>

                <Typography
                  sx={{
                    color: '#6B7280',
                    fontSize: pxToRem(14),
                    lineHeight: pxToRem(22),
                    fontStyle: 'italic',
                  }}
                >
                  While we strive to protect your information,
                  no method of transmission over the internet or
                  electronic storage is 100% secure.
                </Typography>
              </Stack>

              {/* 8. YOUR RIGHTS */}

              <Stack spacing={pxToRem(16)}>
                <Typography
                  sx={{
                    color: '#0F172A',
                    fontSize: pxToRem(16),
                    fontWeight: 700,
                  }}
                >
                  8. Your Rights
                </Typography>

                <Typography
                  sx={{
                    color: '#374151',
                    fontSize: pxToRem(16),
                    lineHeight: pxToRem(24),
                  }}
                >
                  You have the following rights regarding your
                  personal information:
                </Typography>

                <LabelValueList items={rightsItems} />

                <Typography
                  sx={{
                    color: '#374151',
                    fontSize: pxToRem(16),
                    lineHeight: pxToRem(24),
                  }}
                >
                  To exercise these rights, contact our Privacy
                  Officer at{' '}
                  <Box
                    component="span"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    privacy@medigo.com
                  </Box>
                </Typography>
              </Stack>

              {/* 9. CHILDREN'S PRIVACY */}

              <Stack spacing={pxToRem(10)}>
                <Typography
                  sx={{
                    color: '#0F172A',
                    fontSize: pxToRem(16),
                    fontWeight: 700,
                  }}
                >
                  9. Children&apos;s Privacy
                </Typography>

                <Typography
                  sx={{
                    color: '#374151',
                    fontSize: pxToRem(16),
                    lineHeight: pxToRem(24),
                  }}
                >
                  MediGo services are not directed to individuals
                  under 18 years of age.
                </Typography>

                <Typography
                  sx={{
                    color: '#374151',
                    fontSize: pxToRem(16),
                    lineHeight: pxToRem(24),
                  }}
                >
                  If you are a parent or guardian booking rides
                  for a minor, you are responsible for providing
                  consent and ensuring appropriate supervision
                  during transport.
                </Typography>
              </Stack>

              {/* 10. POLICY UPDATES */}

              <Stack spacing={pxToRem(12)}>
                <Typography
                  sx={{
                    color: '#0F172A',
                    fontSize: pxToRem(16),
                    fontWeight: 700,
                  }}
                >
                  10. Policy Updates
                </Typography>

                <Typography
                  sx={{
                    color: '#374151',
                    fontSize: pxToRem(16),
                    lineHeight: pxToRem(24),
                  }}
                >
                  We may update this Privacy Policy from time to
                  time. We will notify you of material changes
                  by:
                </Typography>

                <Stack
                  component="ul"
                  sx={{
                    m: 0,
                    pl: pxToRem(22),
                  }}
                  spacing={pxToRem(6)}
                >
                  {[
                    'In-app notification',
                    'Email to your registered address',
                    'Posting the updated policy with a new effective date',
                  ].map((item) => (
                    <Typography
                      key={item}
                      component="li"
                      sx={{
                        color: '#374151',
                        fontSize: pxToRem(16),
                        lineHeight: pxToRem(24),
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Stack>

                <Typography
                  sx={{
                    color: '#374151',
                    fontSize: pxToRem(16),
                    lineHeight: pxToRem(24),
                  }}
                >
                  Continued use of MediGo after changes indicates
                  acceptance of the updated policy.
                </Typography>
              </Stack>

              {/* 11. CONTACT US */}

              <Stack spacing={pxToRem(8)}>
                <Typography
                  sx={{
                    color: '#0F172A',
                    fontSize: pxToRem(16),
                    fontWeight: 700,
                  }}
                >
                  11. Contact Us
                </Typography>

                <Box
                  sx={{
                    bgcolor: '#F8FAFC',
                    border: '1px solid #E5E7EB',
                    borderRadius: pxToRem(12),
                    p: pxToRem(16),
                  }}
                >
                  <Stack spacing={pxToRem(6)}>
                    <Typography
                      sx={{
                        color: '#6B7280',
                        fontSize: pxToRem(14),
                      }}
                    >
                      MediGo Inc. – Privacy Officer
                    </Typography>

                    <Typography
                      sx={{
                        color: '#6B7280',
                        fontSize: pxToRem(14),
                      }}
                    >
                      Email:{' '}
                      <Box
                        component="span"
                        sx={{
                          color: '#2F6FED',
                          textDecoration: 'underline',
                        }}
                      >
                        privacy@medigo.com
                      </Box>
                    </Typography>

                    <Typography
                      sx={{
                        color: '#6B7280',
                        fontSize: pxToRem(14),
                      }}
                    >
                      Phone: 1-855-MEDIGO (1-855-633-4461)
                    </Typography>

                    <Typography
                      sx={{
                        color: '#6B7280',
                        fontSize: pxToRem(14),
                      }}
                    >
                      Address: 123 Healthcare Drive, Suite 400,
                      Toronto, ON M5H 2N2, Canada
                    </Typography>
                  </Stack>
                </Box>

                <Box
                  sx={{
                    mt: pxToRem(4),
                    display: 'flex',
                    gap: pxToRem(10),
                    alignItems: 'flex-start',
                    color: '#94A3B8',
                  }}
                >
                  <InfoRoundedIcon
                    sx={{
                      fontSize: pxToRem(18),
                    }}
                  />

                  <Typography
                    sx={{
                      color: '#94A3B8',
                      fontSize: pxToRem(12),
                      lineHeight: pxToRem(18),
                    }}
                  >
                    This page reflects the content provided in
                    the product design.
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Paper>

          <AppFooter />
        </Box>
      </Box>
    </AppLayout>
  );
}
