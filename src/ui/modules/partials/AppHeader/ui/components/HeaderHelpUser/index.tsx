import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Avatar, Box, ButtonBase, Divider } from '@mui/material';
import { useState } from 'react';
import { pxToRem } from '../../../../../../../common';
import { ProfilePopOverComponent } from '@/ui/pages/BookingPage/ui/components';
import { StyledLink } from '@/ui/modules/components';

export type HeaderHelpUserProps = {
  helpLabel?: string;
  online?: boolean;
};

export function HeaderHelpUser({
  helpLabel = 'Need help?',
  online = true,
}: HeaderHelpUserProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: pxToRem(12) }}>
      <StyledLink
        href="/help"
        sx={{
          fontSize: pxToRem(12),
          lineHeight: pxToRem(18),
          fontWeight: 400,
          color: '#94A3B8',
        }}
      >
        {helpLabel}
      </StyledLink>

      <Divider
        orientation="vertical"
        flexItem
        sx={{ height: pxToRem(20), bgcolor: '#E2E8F0' }}
      />

      <ButtonBase
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          width: pxToRem(87),
          height: pxToRem(41),
          borderRadius: pxToRem(14),
          display: 'flex',
          alignItems: 'center',
          px: pxToRem(4),
          boxSizing: 'border-box',
          gap: pxToRem(10),
          '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.04)' },
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
      </ButtonBase>

      <ProfilePopOverComponent
        hideTrigger
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        online={online}
      />
    </Box>
  );
}
