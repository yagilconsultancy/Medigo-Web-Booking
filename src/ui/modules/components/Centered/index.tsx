import { Stack, StackProps } from '@mui/material';

export const Centered = ({
  direction,
  justifyContent,
  alignItems,
  ...rest
}: StackProps) => {
  return (
    <Stack
      direction={direction || 'row'}
      justifyContent={justifyContent || 'center'}
      alignItems={alignItems || 'center'}
      {...rest}
    />
  );
};
