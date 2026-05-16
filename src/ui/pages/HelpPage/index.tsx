'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import SearchIcon from '@mui/icons-material/Search';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { pxToRem } from '@/common';
import { AppFooter, AppLayout } from '@/ui/modules/partials';
import { HeaderHelpUser } from '@/ui/modules/partials/AppHeader/ui/components';
import {
  AppButton,
  AppTextField,
  Centered,
  RowStack,
} from '@/ui/modules/components';
import { SupportCard, TopicCard } from './ui/components';
import type { SupportCardProps } from './ui/components/SupportCard';
import type { TopicCardProps } from './ui/components/TopicCard';

/* ─── static data ─── */

const supportCards: Omit<SupportCardProps, 'onAction'>[] = [
  {
    icon: '/help-icons/phone-icon.svg',
    iconBg: '#EFF6FF',
    iconBorder: '#DBEAFE',
    label: 'Call Us',
    contact: '1-800-MEDIGO',
    contactColor: '#155DFC',
    detail: 'Mon–Fri 7am–9pm · Sat–Sun 8am–6pm',
    buttonText: 'Call Now',
    buttonIcon: '/help-icons/call-arrow.svg',
  },
  {
    icon: '/help-icons/chat-icon.svg',
    iconBg: '#ECFDF5',
    iconBorder: '#A7F3D0',
    label: 'Live Chat',
    contact: 'Chat with Support',
    contactColor: '#047857',
    detail: 'Avg. wait time under 2 minutes',
    buttonText: 'Start Chat',
    buttonIcon: '/help-icons/chat-arrow.svg',
  },
  {
    icon: '/help-icons/email-icon.svg',
    iconBg: '#F5F3FF',
    iconBorder: '#DDD6FE',
    label: 'Email Support',
    contact: 'support@medigo.com',
    contactColor: '#6D28D9',
    detail: 'Response within 24 hours',
    buttonText: 'Send Email',
    buttonIcon: '/help-icons/email-arrow.svg',
  },
];

const topicCards: TopicCardProps[] = [
  {
    icon: '/help-icons/booking-topic.svg',
    iconBg: '#EFF6FF',
    iconBorder: '#DBEAFE',
    iconColor: '#0284C7',
    title: 'Booking & Scheduling',
    articleCount: 8,
  },
  {
    icon: '/help-icons/rides-topic.svg',
    iconBg: '#ECFDF5',
    iconBorder: '#A7F3D0',
    iconColor: '#047857',
    title: 'Rides & Drivers',
    articleCount: 6,
  },
  {
    icon: '/help-icons/payments-topic.svg',
    iconBg: '#F5F3FF',
    iconBorder: '#DDD6FE',
    iconColor: '#6D28D9',
    title: 'Payments & Billing',
    articleCount: 5,
  },
  {
    icon: '/help-icons/account-topic.svg',
    iconBg: '#FFFBEB',
    iconBorder: '#FDE68A',
    iconColor: '#B45309',
    title: 'My Account',
    articleCount: 7,
  },
  {
    icon: '/help-icons/safety-topic.svg',
    iconBg: '#FEF2F2',
    iconBorder: '#FECACA',
    iconColor: '#DC2626',
    title: 'Safety & Privacy',
    articleCount: 4,
  },
  {
    icon: '/help-icons/technical-topic.svg',
    iconBg: '#F9FAFB',
    iconBorder: '#E5E7EB',
    iconColor: '#64748B',
    title: 'Technical Support',
    articleCount: 3,
  },
];

type FaqItem = { question: string; answer: string };

const faqItems: FaqItem[] = [
  {
    question: 'How do I schedule a ride?',
    answer:
      'Go to Booking, enter your pickup and drop-off locations, choose the appointment type, then confirm your ride details. You can schedule rides for the same day or in advance.',
  },
  {
    question: 'What vehicle types are available?',
    answer:
      'We offer sedans, wheelchair-accessible vehicles, stretcher vans, and multi-passenger vehicles depending on your medical transportation needs.',
  },
  {
    question: 'How far in advance should I book?',
    answer:
      'We recommend booking at least 24 hours in advance for the best availability. Same-day bookings are available but subject to driver availability.',
  },
  {
    question: 'Can I cancel or modify a scheduled ride?',
    answer:
      'Yes. Open your scheduled ride and select Cancel or Edit. Cancellation policies may apply depending on timing and trip status.',
  },
  {
    question: 'Are my rides covered by Medicaid or Medicare?',
    answer:
      'Many non-emergency medical transport rides are covered. Contact your insurance provider or our support team to verify your coverage.',
  },
  {
    question: 'How do I track my driver in real time?',
    answer:
      'Once your ride is active, you can view real-time driver location and ETA from the My Rides section.',
  },
  {
    question: "What if my driver doesn't arrive?",
    answer:
      "If your driver hasn't arrived within the expected window, contact support immediately via live chat or call. We'll dispatch a replacement as quickly as possible.",
  },
  {
    question: 'How do I set up recurring rides?',
    answer:
      'During booking, select the recurring option to schedule repeat trips on specific days and times. You can manage recurring rides from Scheduled Rides.',
  },
];

const supportHours = [
  { day: 'Mon – Fri', hours: '7:00 AM – 9:00 PM' },
  { day: 'Saturday', hours: '8:00 AM – 6:00 PM' },
  { day: 'Sunday', hours: '9:00 AM – 5:00 PM' },
  { day: 'Dispatch', hours: '24 / 7' },
];

/* ─── component ─── */

export function HelpPage() {
  const router = useRouter();
  const [expandedKey, setExpandedKey] = useState<string | false>(false);

  return (
    <AppLayout
      headerProps={{
        rightContent: <HeaderHelpUser helpLabel="Help Center" online />,
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
        <Box sx={{ maxWidth: '1278px', mx: 'auto' }}>
          {/* ── Back Button ── */}
          <AppButton
            startIcon={<ArrowBackIcon />}
            variant="text"
            sx={{
              color: '#64748B',
              fontSize: pxToRem(11),
              fontWeight: 700,
              textTransform: 'none',
              mb: pxToRem(10),
              width: 'fit-content',
              px: 0,
              background: 'transparent',
              '&:hover': {
                background: 'rgba(15, 23, 42, 0.04) !important',
              },
            }}
            onClick={() => router.back()}
          >
            Back
          </AppButton>

          {/* ── Hero / Header ── */}
          <Centered
            sx={{
              borderRadius: pxToRem(20),
              background: 'linear-gradient(135deg, #155DFC 0%, #1E40AF 100%)',
              p: { xs: pxToRem(24), md: pxToRem(40) },
              mb: pxToRem(24),
              height: '326px',
            }}
            direction={'column'}
          >
            <Typography
              sx={{
                fontSize: { xs: pxToRem(22), md: pxToRem(30) },
                fontWeight: 700,
                color: '#FFFFFF',
              }}
            >
              How can we help you?
            </Typography>

            <Typography
              sx={{
                mt: pxToRem(8),
                fontSize: pxToRem(14),
                fontWeight: 400,
                color: '#BEDBFF',
              }}
            >
              Search our knowledge base or browse by topic below
            </Typography>

            <TextField
              placeholder="Search FAQs, topics, guides..."
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mt: pxToRem(20),
                maxWidth: 520,
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#FFFFFF',
                  borderRadius: pxToRem(14),
                  fontSize: pxToRem(13),
                  boxShadow: '0px 2px 8px 0px rgba(21, 93, 252, 0.22)',
                  '& fieldset': { border: 'none' },
                },
              }}
            />
          </Centered>

          {/* ── Support Cards ── */}
          <RowStack
            sx={{
              gap: pxToRem(12),
              flexWrap: { xs: 'wrap', md: 'nowrap' },
              mb: pxToRem(32),
            }}
            alignItems="stretch"
          >
            {supportCards.map((card) => (
              <SupportCard key={card.label} {...card} />
            ))}
          </RowStack>

          {/* ── Browse by Topic ── */}
          <Typography
            sx={{
              fontSize: pxToRem(13),
              fontWeight: 700,
              color: '#94A3B8',
              mb: pxToRem(14),
            }}
          >
            Browse by Topic
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: pxToRem(12),
              mb: pxToRem(32),
            }}
          >
            {topicCards.map((topic) => (
              <TopicCard key={topic.title} {...topic} />
            ))}
          </Box>

          {/* ── FAQs ── */}
          <Typography
            sx={{
              fontSize: pxToRem(13),
              fontWeight: 700,
              color: '#94A3B8',
              mb: pxToRem(14),
            }}
          >
            Frequently Asked Questions
          </Typography>

          <Stack spacing={1} sx={{ mb: pxToRem(32) }}>
            {faqItems.map((item) => {
              const expanded = expandedKey === item.question;

              return (
                <Accordion
                  key={item.question}
                  disableGutters
                  elevation={0}
                  square
                  expanded={expanded}
                  onChange={(_, nextExpanded) =>
                    setExpandedKey(nextExpanded ? item.question : false)
                  }
                  sx={{
                    '&:before': { display: 'none' },
                    border: '0.67px solid #F3F4F6',
                    borderRadius: `${pxToRem(14)} !important`,
                    overflow: 'hidden',
                    bgcolor: '#FFFFFF',
                    boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.04)',
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          bgcolor: '#F9FAFB',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {expanded ? (
                          <RemoveRoundedIcon
                            sx={{ color: '#94A3B8', fontSize: 16 }}
                          />
                        ) : (
                          <AddRoundedIcon
                            sx={{ color: '#94A3B8', fontSize: 16 }}
                          />
                        )}
                      </Box>
                    }
                    sx={{
                      px: pxToRem(16),
                      minHeight: pxToRem(61),
                      '& .MuiAccordionSummary-content': { my: pxToRem(10) },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: pxToRem(14),
                        fontWeight: 600,
                        color: '#0F172A',
                        lineHeight: pxToRem(19.25),
                      }}
                    >
                      {item.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{ px: pxToRem(16), pb: pxToRem(16), pt: 0 }}
                  >
                    <Typography
                      sx={{
                        fontSize: pxToRem(13),
                        lineHeight: pxToRem(19.5),
                        fontWeight: 400,
                        color: '#64748B',
                      }}
                    >
                      {item.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Stack>

          {/* ── Support Hours ── */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: pxToRem(16),
              border: '0.67px solid #F3F4F6',
              boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.05)',
              p: pxToRem(20),
              mb: pxToRem(20),
            }}
          >
            <RowStack spacing={1} sx={{ mb: pxToRem(16) }}>
              <Image
                src="/help-icons/clock-icon.svg"
                alt="Clock"
                width={20}
                height={20}
              />
              <Typography
                sx={{
                  fontSize: pxToRem(14),
                  fontWeight: 700,
                  color: '#0F172A',
                }}
              >
                Support Hours
              </Typography>
            </RowStack>

            <Stack spacing={0}>
              {supportHours.map((row) => (
                <Box
                  key={row.day}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    py: pxToRem(10),
                    px: pxToRem(12),
                    borderBottom: '1px solid #F3F4F6',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: pxToRem(13),
                      fontWeight: 400,
                      color: '#64748B',
                    }}
                  >
                    {row.day}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: pxToRem(13),
                      fontWeight: 600,
                      color: row.day === 'Dispatch' ? '#009966' : '#0F172A',
                    }}
                  >
                    {row.hours}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Box
              sx={{
                mt: pxToRem(16),
                bgcolor: '#ECFDF5',
                borderRadius: pxToRem(8),
                px: pxToRem(12),
                py: pxToRem(8),
                // width: 'fit-content',
              }}
            >
              <RowStack spacing={1} width={'100%'}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: '#007A55',
                  }}
                />
                <Typography
                  sx={{
                    fontSize: pxToRem(12),
                    fontWeight: 600,
                    color: '#007A55',
                  }}
                >
                  Support is currently open
                </Typography>
              </RowStack>
            </Box>
          </Paper>

          {/* ── Send a Message ── */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: pxToRem(16),
              border: '0.67px solid #F3F4F6',
              boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.05)',
              p: pxToRem(20),
              mb: pxToRem(32),
            }}
          >
            <Typography
              sx={{
                fontSize: pxToRem(14),
                fontWeight: 700,
                color: '#0F172A',
                mb: pxToRem(20),
              }}
            >
              Send a Message
            </Typography>

            <Stack spacing={2.5}>
              {/* Subject */}
              <Box>
                <Typography
                  sx={{
                    fontSize: pxToRem(11),
                    fontWeight: 700,
                    color: '#94A3B8',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    mb: pxToRem(8),
                  }}
                >
                  Subject
                </Typography>
                <AppTextField
                  placeholder="What's your question about?"
                  fullWidth
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#F8FAFC',
                      borderRadius: pxToRem(12),
                      fontSize: pxToRem(13),
                      '& fieldset': { border: '0.67px solid #E5E7EB' },
                    },
                  }}
                />
              </Box>

              {/* Message */}
              <Box>
                <Typography
                  sx={{
                    fontSize: pxToRem(11),
                    fontWeight: 700,
                    color: '#94A3B8',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    mb: pxToRem(8),
                  }}
                >
                  Message
                </Typography>
                <AppTextField
                  placeholder="Describe your issue in detail..."
                  fullWidth
                  multiline
                  rows={5}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#F8FAFC',
                      borderRadius: pxToRem(12),
                      fontSize: pxToRem(13),
                      '& fieldset': { border: '0.67px solid #E5E7EB' },
                    },
                  }}
                />
              </Box>

              <AppButton
                sx={{
                  color: '#FFFFFF',
                  textTransform: 'none',
                  borderRadius: pxToRem(12),
                  fontSize: pxToRem(13),
                  fontWeight: 700,
                  px: pxToRem(24),
                  py: pxToRem(10),
                  alignSelf: 'flex-end',
                  boxShadow: '0px 2px 8px 0px rgba(21, 93, 252, 0.22)',
                  // '&:hover': {
                  //   bgcolor: '#1E40AF !important',
                  //   background: '#1E40AF !important',
                  // },
                }}
                fullWidth
              >
                Send Message
              </AppButton>
            </Stack>
          </Paper>

          <AppFooter />
        </Box>
      </Box>
    </AppLayout>
  );
}
