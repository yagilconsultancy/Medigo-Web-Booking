'use client';

import {
  DataGrid,
  DataGridProps,
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel,
  GridSortDirection,
  MuiEvent,
} from '@mui/x-data-grid';
import React, { MouseEvent, useCallback, useEffect, useState } from 'react';
import { DataGridLoader, DataGridPagination } from './ui/components';
import { alpha, Stack, useTheme } from '@mui/material';
import { pxToRem } from '../../../../common';

export type GridRow = { id: string | number };

export type GridColSpec<T extends GridRow> = Omit<
  GridColDef<T>,
  'field' | 'headerName'
> & {
  field: Extract<keyof T, string> | string;
  headerName: string;
};

export type GridSortSpec<T extends GridRow> = {
  field: Extract<keyof T, string> | string;
  sort: GridSortDirection;
};

export type GridDataFetchResult<T extends GridRow> = {
  rows: T[];
  totalRows: number;
};

export type GridDataFetcher<T extends GridRow> = (
  page: number,
  pageSize: number,
  sortModel: GridSortSpec<T>[]
) => Promise<GridDataFetchResult<T>>;

export type AppDataGridProps<T extends GridRow> = Omit<
  DataGridProps,
  | 'columns'
  | 'rows'
  | 'onRowClick'
  | 'paginationModel'
  | 'rowCount'
  | 'paginationMode'
> & {
  columns: GridColSpec<T>[];
  /** If provided, the grid will fetch data from the server */
  fetchData?: GridDataFetcher<T>;
  /** If provided, the grid will use this data instead of fetching from the server. Useful for client-side pagination */
  data?: T[];
  disableRowClick?: boolean;
  initialPageSize?: number;
  checkboxSelection?: boolean;
  onRowClick?: (
    row: T,
    event: MuiEvent<MouseEvent>,
    details: GridCallbackDetails
  ) => void;
  /** When true, automatic pagination will be disabled and the value of "data" will be used. This requires manual server-side pagination handling */
  disableAutoPagination?: boolean;
  /** Total number of rows across all pages. Required when using disableAutoPagination for correct pagination controls */
  totalRows?: number;
  /** Useful for manual server-side pagination */
  isFetchingData?: boolean;
  /** When true, the pagination footer will be hidden. Defaults to false */
  hidePagination?: boolean;
  permissionErrorState?: React.ReactNode;
  emptyState?: React.ReactNode;
};

export const GridTable = <T extends GridRow>({
  columns,
  fetchData,
  data,
  sx,
  disableRowClick,
  onRowClick,
  initialPageSize = 5,
  slots,
  disableAutoPagination,
  totalRows: externalTotalRows,
  isFetchingData,
  hidePagination,
  onPaginationModelChange,
  checkboxSelection,
  pageSizeOptions = [5, 10, 15, 25, 50, 100],
  permissionErrorState,
  emptyState,
  ...moreGridProps
}: AppDataGridProps<T>) => {
  const theme = useTheme();
  const [rows, setRows] = useState<T[]>([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: initialPageSize,
    page: 0,
  });
  const [sortModel, setSortModel] = useState<GridSortSpec<T>[]>([]);

  const rowClickHandler: DataGridProps['onRowClick'] = (
    params,
    event,
    details
  ) => {
    if (disableRowClick || !onRowClick) return;

    onRowClick(params.row, event, details);
  };

  const handleRowClick = useCallback(rowClickHandler, [
    onRowClick,
    disableRowClick,
  ]);

  useEffect(() => {
    const loadData = async () => {
      if (disableAutoPagination) {
        setRows(data || []);
        if (externalTotalRows !== undefined) setRowCount(externalTotalRows);
        if (isFetchingData !== undefined) setLoading(isFetchingData);
        return;
      }

      const { page, pageSize } = paginationModel;

      setLoading(true);

      let finalData: GridDataFetchResult<T> | T[] = [];
      if (data) {
        finalData = data;
      } else if (fetchData) {
        finalData = await fetchData(page + 1, pageSize, sortModel);
      }

      if (Array.isArray(finalData)) {
        const start = page * pageSize;
        const end = start + pageSize;
        setRows(finalData.slice(start, end));
        setRowCount(finalData.length);
      } else {
        setRows(finalData.rows);
        setRowCount(finalData.totalRows);
      }

      setLoading(false);
    };

    void loadData();
  }, [
    paginationModel,
    sortModel,
    fetchData,
    data,
    disableAutoPagination,
    externalTotalRows,
    isFetchingData,
  ]);

  return (
    <DataGrid<T>
      columns={columns}
      rows={rows}
      rowCount={rowCount}
      loading={loading}
      paginationModel={paginationModel}
      checkboxSelection={checkboxSelection}
      disableRowSelectionOnClick
      pageSizeOptions={pageSizeOptions}
      rowHeight={72}
      onRowClick={handleRowClick}
      slots={{
        loadingOverlay: DataGridLoader,
        pagination: DataGridPagination,
        ...((permissionErrorState || emptyState) && {
          noRowsOverlay: () => (
            <Stack
              spacing={3}
              sx={{
                alignItems: 'center',
                justifyContent: 'center',
                maxWidth: '100%',
                minWidth: '100%',
                py: 4,
              }}
            >
              {permissionErrorState ?? emptyState}
            </Stack>
          ),
        }),
        ...slots,
      }}
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        '&, [class^=MuiDataGrid]': {
          border: 'none',
        },
        '& .MuiDataGrid-container--top [role=row]': {
          backgroundColor: alpha('#828282', 0.1),
          borderRadius: '4px',
        },
        '& .MuiDataGrid-columnHeader': {
          background: alpha('#828282', 0.1),
          borderBottom: 'none !important',
        },
        '& .MuiDataGrid-columnHeaderTitle': {
          fontFamily: theme.typography.fontFamily,
          color: theme.palette.text.secondary,
          fontWeight: 600,
          fontSize: pxToRem(12),
          lineHeight: '18px',
          fontStyle: 'semibold',
        },
        '& .MuiDataGrid-row': {
          backgroundColor: '#fff',
          borderRadius: '4px',
          boxShadow: 'none',
          transition: '.3s ease',
          cursor: disableRowClick ? 'default' : 'pointer',
          outline: 'none',
        },
        '& .MuiDataGrid-scrollbarContent': {
          '::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        },
        '& .MuiDataGrid-cell': {
          color: 'text.secondary',
          fontWeight: 400,
          fontSize: pxToRem(13),
          lineHeight: '19.5px',
          fontStyle: 'normal',
          display: 'flex',
          alignItems: 'center',
          '&:focus': {
            outline: 'none',
          },
        },
        ...sx,
      }}
      {...moreGridProps}
      hideFooter={hidePagination}
      paginationMode="server"
      onPaginationModelChange={(newPaginationModel, details) => {
        onPaginationModelChange?.(newPaginationModel, details);
        setPaginationModel(newPaginationModel);
      }}
      onSortModelChange={(newSortModel) => setSortModel([...newSortModel])}
      sortModel={sortModel}
    />
  );
};
