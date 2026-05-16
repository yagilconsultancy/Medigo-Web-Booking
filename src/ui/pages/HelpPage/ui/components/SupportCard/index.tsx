import { Box, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { pxToRem } from '@/common';
import { AppButton } from '@/ui/modules/components';

export type SupportCardProps = {
  icon: string;
  iconBg: string;
  iconBorder: string;
  label: string;
  contact: string;
  contactColor: string;
  detail: string;
  buttonText: string;
  buttonIcon: string;
  onAction?: () => void;
};

export function SupportCard({
  icon,
  iconBg,
  iconBorder,
  label,
  contact,
  contactColor,
  detail,
  buttonText,
  buttonIcon,
  onAction,
}: SupportCardProps) {
  return (
    <Box
      sx={{
        flex: 1,
        borderRadius: pxToRem(16),
        border: '0.67px solid #F3F4F6',
        boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.05)',
        p: pxToRem(20),
        bgcolor: '#FFFFFF',
      }}
    >
      <Stack spacing={1.5}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: pxToRem(13),
            bgcolor: iconBg,
            border: `0.67px solid ${iconBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image src={icon} alt={label} width={44} height={44} />
        </Box>

        <Typography
          sx={{
            fontSize: pxToRem(11),
            fontWeight: 700,
            color: '#94A3B8',
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            fontSize: pxToRem(14),
            fontWeight: 700,
            color: contactColor,
          }}
        >
          {contact}
        </Typography>

        <Typography
          sx={{
            fontSize: pxToRem(11),
            fontWeight: 400,
            color: '#94A3B8',
          }}
        >
          {detail}
        </Typography>

        <AppButton
          variant="text"
          onClick={onAction}
          endIcon={
            <Image src={buttonIcon} alt="" width={14} height={14} />
          }
          sx={{
            width: 'fit-content',
            textTransform: 'none',
            color: contactColor,
            fontSize: pxToRem(11),
            fontWeight: 700,
            px: 0,
            background: 'transparent',
            '&:hover': { background: 'transparent !important' },
          }}
        >
          {buttonText}
        </AppButton>
      </Stack>
    </Box>
  );
}
