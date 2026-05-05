import { StyledImage } from '../StyledImage';
import { StyledLink } from '../StyledLink';
import logo from '../../../assets/icons/app-logo.svg';

export function AppLogo() {
  return (
    <StyledLink href="/">
      <StyledImage
        src={logo}
        alt="logo"
        width={200}
        height={50}
        sx={{
          width: '134px',
          height: '63px',
        }}
      />
    </StyledLink>
  );
}
