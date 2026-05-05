import {
  GridLoadingOverlayVariant,
  GridOverlay,
  GridOverlayProps,
  gridRowCountSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import {
  CircularProgress,
  LinearProgress,
  Skeleton,
  Stack,
} from '@mui/material';
import { CSSProperties, forwardRef, ReactElement } from 'react';

const LOADING_VARIANTS: Record<
  GridLoadingOverlayVariant,
  {
    component: () => ReactElement;
    style: CSSProperties;
  }
> = {
  'circular-progress': {
    component: () => <CircularProgress color="primary" />,
    style: {},
  },
  'linear-progress': {
    component: () => <LinearProgress color="primary" />,
    style: { display: 'block' },
  },
  skeleton: {
    component: () => (
      <Stack spacing={1} sx={{ width: '100%', p: 2 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            height={52}
            sx={{ borderRadius: '4px' }}
          />
        ))}
      </Stack>
    ),
    style: { height: 400, alignItems: 'flex-start' },
  },
};

export type DataGridLoaderProps = GridOverlayProps & {
  variant?: GridLoadingOverlayVariant;
  noRowsVariant?: GridLoadingOverlayVariant;
};

export const DataGridLoader = forwardRef<HTMLDivElement, DataGridLoaderProps>(
  function DataGridLoader(props, ref) {
    const {
      variant = 'linear-progress',
      noRowsVariant = 'skeleton',
      style,
      ...other
    } = props;

    const apiRef = useGridApiContext();
    const rowsCount = useGridSelector(apiRef, gridRowCountSelector);
    const activeVariant =
      LOADING_VARIANTS[rowsCount === 0 ? noRowsVariant : variant];
    const Component = activeVariant.component;

    return (
      <GridOverlay
        style={{ ...activeVariant.style, ...style }}
        {...other}
        ref={ref}
      >
        <Component />
      </GridOverlay>
    );
  }
);

// **This is the key line** to satisfy `react/display-name`:
DataGridLoader.displayName = 'DataGridLoader';
