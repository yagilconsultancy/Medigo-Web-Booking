import { Stack } from '@mui/material';
import { CardTitle } from '../CardTitle';
import { CardDesc } from '../CardDesc';

type CardTitleAndDescProps = {
  title: string;
  desc: string;
};

export const CardTitleAndDesc = ({ title, desc }: CardTitleAndDescProps) => {
  return (
    <Stack spacing={0.3}>
      <CardTitle title={title} />
      <CardDesc desc={desc} />
    </Stack>
  );
};
