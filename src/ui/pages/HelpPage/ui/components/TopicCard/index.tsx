import { Box, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { pxToRem } from '@/common';
import { RowStack } from '@/ui/modules/components';

export type TopicCardProps = {
  icon: string;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  title: string;
  articleCount: number;
};

export function TopicCard({
  icon,
  iconBg,
  iconBorder,
  title,
  articleCount,
}: TopicCardProps) {
  return (
    <Box
      sx={{
        flex: '1 1 calc(33.333% - 8px)',
        minWidth: 180,
        borderRadius: pxToRem(16),
        border: '0.67px solid #F3F4F6',
        boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.05)',
        p: pxToRem(20),
        bgcolor: '#FFFFFF',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      <RowStack spacing={1.5}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: pxToRem(10),
            bgcolor: iconBg,
            border: `0.67px solid ${iconBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image src={icon} alt={title} width={36} height={36} />
        </Box>
        <Stack spacing={1}>
          <Typography
            sx={{
              fontSize: pxToRem(13),
              fontWeight: 700,
              color: '#0F172A',
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              fontSize: pxToRem(11),
              fontWeight: 400,
              color: '#94A3B8',
            }}
          >
            {articleCount} articles
          </Typography>
        </Stack>
      </RowStack>
    </Box>
  );
}
