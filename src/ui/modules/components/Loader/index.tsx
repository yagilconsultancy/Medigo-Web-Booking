import { CircularProgress, CircularProgressProps } from '@mui/material';

export type LoaderProps = CircularProgressProps & {
  loaderColor?: string;
};

export const Loader = ({
  size = '28px',
  loaderColor = 'white',
  sx,
  ...rest
}: LoaderProps) => {
  return (
    <CircularProgress
      size={size}
      sx={{
        color: loaderColor || 'white',
        ...sx,
      }}
      {...rest}
    />
  );
};
