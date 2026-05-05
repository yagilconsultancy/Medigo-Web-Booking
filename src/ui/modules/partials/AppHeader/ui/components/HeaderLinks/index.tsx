import { useMediaQuery, useTheme } from '@mui/material';
import { pxToRem } from '../../../../../../../common';
import { StyledLink } from '../../../../../components';

type HeaderLinkProps = {
  href: string;
  link: string;
  dropDown?: boolean;
  pathName: boolean;
};

export function HeaderLink({
  link,
  href = '#',
  dropDown,
  pathName,
}: HeaderLinkProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // console.log(pathName, isMobile);
  return (
    <StyledLink
      href={href}
      sx={{
        color: (theme) => {
          if (isMobile && pathName) return theme.color.black; // Mobile homepage = black
          if (!pathName) return theme.color.black; // Not homepage = black
          if (dropDown) return theme.color.grey; // Dropdown active = grey
          return theme.palette.background.default; // Desktop homepage = white
        },
        fontFamily: (theme) => theme.typography.fontFamily,
        fontSize: pxToRem(16),
        lineHeight: '22.4px',
        transition: 'all .3s ease-in-out',
        '&:hover': {
          color: 'primary.main',
        },
      }}
    >
      {link}
    </StyledLink>
  );
}
