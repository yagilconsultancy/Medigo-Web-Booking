import { Menu, MenuItem, MenuProps, Stack, Typography } from '@mui/material';
import { pxToRem } from '../../../../common';

export type AppDropdownMenuProps = MenuProps & {
  title?: string;
  options?: string[];
  selectedOption?: string;
  onOptionSelected?: (option: string, optionIndex: number) => void;
  minWidth?: string;
  matchAnchorWidth?: boolean;
};

export const AppDropdownMenu = ({
  title,
  options,
  selectedOption,
  onOptionSelected,
  children,
  sx,
  minWidth = '140px',
  anchorEl,
  matchAnchorWidth = true,
  ...rest
}: AppDropdownMenuProps) => {
  const anchorWidth =
    matchAnchorWidth && anchorEl
      ? (anchorEl as HTMLElement).clientWidth
      : undefined;

  return (
    <Menu
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      anchorEl={anchorEl}
      {...rest}
      sx={{
        ...sx,
      }}
      slotProps={{
        paper: {
          sx: {
            background: '#FFFFFF',
            boxShadow:
              '0px 14px 22px -9px rgba(16, 25, 40, 0.14), 0px 0px 3px -1px rgba(16, 25, 40, 0.04)',
            minWidth: anchorWidth || minWidth,
            borderRadius: '4px',

            '& .MuiMenu-list': {
              paddingBottom: 0,
            },
          },
        },
      }}
    >
      {title && (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontSize: pxToRem(12),
            color: '#000000',
            fontWeight: 700,
            padding: '13px',
            marginBottom: '0',
          }}
        >
          {title}
        </Typography>
      )}

      {options && (
        <Stack>
          {options.map((option, index) => (
            <MenuItem
              key={index}
              onClick={() =>
                onOptionSelected && onOptionSelected(option, index)
              }
              sx={{
                padding: '8px 13px',
              }}
            >
              <Typography
                sx={{
                  fontSize: pxToRem(12),
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: selectedOption === option ? 700 : 400,
                }}
              >
                {option}
              </Typography>
            </MenuItem>
          ))}
        </Stack>
      )}

      {children}
    </Menu>
  );
};
