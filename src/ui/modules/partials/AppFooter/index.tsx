import { Box, Typography, type SxProps, type Theme } from '@mui/material';
import { pxToRem } from '@/common';
import { RowStack, StyledLink } from '@/ui/modules/components';

export type AppFooterProps = {
  sx?: SxProps<Theme>;
  helpHref?: string;
};

export function AppFooter({ sx, helpHref = '/help' }: AppFooterProps) {
  return (
    <Box
      sx={{
        mt: pxToRem(70),
        pt: pxToRem(18),
        borderTop: '1px solid #E2E8F0',
        maxWidth: '1440px',
        mx: 'auto',
        ...sx,
      }}
    >
      <RowStack
        justifyContent="space-between"
        sx={{
          px: { xs: pxToRem(16), md: pxToRem(114) },
          minHeight: pxToRem(24),
        }}
      >
        <Typography
          sx={{
            color: '#94A3B8',
            fontSize: pxToRem(12),
            fontWeight: 500,
            lineHeight: pxToRem(18),
          }}
        >
          © 2026 MediGO. All rights reserved.
        </Typography>

        <RowStack spacing={1.25}>
          <StyledLink href="/privacy-policy">
            <Typography
              sx={{
                color: '#99A1AF',
                fontSize: pxToRem(12),
                fontWeight: 500,
                lineHeight: pxToRem(18),
              }}
            >
              Privacy Policy
            </Typography>
          </StyledLink>

          <Typography
            sx={{
              color: '#E5E7EB',
              fontSize: pxToRem(16),
              lineHeight: pxToRem(24),
            }}
          >
            ·
          </Typography>

          <StyledLink href="#">
            <Typography
              sx={{
                color: '#99A1AF',
                fontSize: pxToRem(12),
                fontWeight: 500,
                lineHeight: pxToRem(18),
              }}
            >
              Terms of Service
            </Typography>
          </StyledLink>

          <Typography
            sx={{
              color: '#E5E7EB',
              fontSize: pxToRem(16),
              lineHeight: pxToRem(24),
            }}
          >
            ·
          </Typography>

          <StyledLink href={helpHref}>
            <Typography
              sx={{
                color: '#99A1AF',
                fontSize: pxToRem(12),
                fontWeight: 500,
                lineHeight: pxToRem(18),
              }}
            >
              Help Center
            </Typography>
          </StyledLink>
        </RowStack>
      </RowStack>
    </Box>
  );
}
