import { Stack, StackProps } from '@mui/material';

export const RowStack = (props: StackProps) => {
  return <Stack alignItems="center" {...props} direction="row" />;
};
