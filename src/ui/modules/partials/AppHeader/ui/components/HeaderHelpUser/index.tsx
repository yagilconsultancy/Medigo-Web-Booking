import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Avatar, Box, Divider, Typography } from '@mui/material';
import { pxToRem } from '../../../../../../../common';

export type HeaderHelpUserProps = {
  helpLabel?: string;
  online?: boolean;
};

export function HeaderHelpUser({
  helpLabel = 'Need help?',
  online = true,
}: HeaderHelpUserProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: pxToRem(12) }}>
      <Typography
        sx={{
          fontSize: pxToRem(12),
          lineHeight: pxToRem(18),
          fontWeight: 400,
          color: '#94A3B8',
        }}
      >
        {helpLabel}
      </Typography>

      <Divider
        orientation="vertical"
        flexItem
        sx={{ height: pxToRem(20), bgcolor: '#E2E8F0' }}
      />

      <Box
        sx={{
          width: pxToRem(87),
          height: pxToRem(41),
          borderRadius: pxToRem(14),
          display: 'flex',
          alignItems: 'center',
          px: pxToRem(4),
          boxSizing: 'border-box',
          gap: pxToRem(10),
        }}
      >
        <Box
          sx={{ position: 'relative', width: pxToRem(32), height: pxToRem(32) }}
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

        <KeyboardArrowDownIcon
          sx={{ fontSize: pxToRem(14), color: '#94A3B8' }}
        />
      </Box>
    </Box>
  );
}
