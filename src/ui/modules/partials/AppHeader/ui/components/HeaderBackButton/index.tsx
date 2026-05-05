import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { pxToRem } from '../../../../../../../common';
import { StyledLink } from '../../../../../components';

export type HeaderBackButtonProps = {
  label?: string;
  href?: string;
};

export function HeaderBackButton({
  href,
  label = 'Back',
}: HeaderBackButtonProps) {
  const router = useRouter();

  if (!href) {
    return (
      <Box
        component="button"
        type="button"
        onClick={() => router.back()}
        sx={{
          appearance: 'none',
          background: 'transparent',
          border: 0,
          padding: 0,
          display: 'inline-flex',
          alignItems: 'center',
          gap: pxToRem(6),
          color: '#64748B',
          cursor: 'pointer',
        }}
      >
        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
          <NavigateBeforeIcon sx={{ fontSize: pxToRem(14) }} />
        </Box>
        <Typography
          sx={{
            fontSize: pxToRem(13),
            lineHeight: pxToRem(19.5),
            fontWeight: 500,
            color: 'inherit',
          }}
        >
          {label}
        </Typography>
      </Box>
    );
  }

  return (
    <StyledLink
      href={href}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: pxToRem(6),
        color: '#64748B',
      }}
    >
      <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
        <NavigateBeforeIcon sx={{ fontSize: pxToRem(14) }} />
      </Box>
      <Typography
        sx={{
          fontSize: pxToRem(13),
          lineHeight: pxToRem(19.5),
          fontWeight: 500,
          color: 'inherit',
        }}
      >
        {label}
      </Typography>
    </StyledLink>
  );
}
