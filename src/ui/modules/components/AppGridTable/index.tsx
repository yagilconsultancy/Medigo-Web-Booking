import { Stack } from '@mui/material';
import { ReactNode } from 'react';
import { AppDataGridProps, GridRow, GridTable } from '../GridTable';
import { AppCardparent } from '../AppCardparent';

type AppGridTableProps<T extends GridRow> = AppDataGridProps<T> & {
  children: ReactNode;
};

export const AppGridtable = <T extends GridRow>({
  children,
  ...gridProps
}: AppGridTableProps<T>) => {
  return (
    <AppCardparent>
      {/* Top Content (filters, title, actions, etc.) */}
      {children}

      {/* Grid Table */}
      <GridTable
        {...gridProps}
        sx={{
          height: 'auto',
          width: '100%',
          ...gridProps.sx,
        }}
      />
    </AppCardparent>
  );
};
