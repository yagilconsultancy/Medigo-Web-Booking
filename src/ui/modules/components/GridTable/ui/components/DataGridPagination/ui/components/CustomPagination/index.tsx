import React from 'react';
import { Box, TablePagination } from '@mui/material';
import { CustomTablePaginationActions } from '../CustomTablePaginationAction';

interface PaginationProps {
  count: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const CustomPagination = ({
  count,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    onPageChange(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onPageSizeChange(parseInt(event.target.value, 10));
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: '20px 0',
      }}
    >
      <TablePagination
        component="div"
        count={count}
        page={page}
        rowsPerPage={pageSize}
        labelDisplayedRows={() => ''}
        ActionsComponent={CustomTablePaginationActions}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '0.67px solid #F0F4F8',
          // width: 'auto',
          '.MuiTablePagination-toolbar': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            padding: '0px 16px',
          },
          '.MuiTablePagination-spacer': {
            display: 'none',
          },
          '.MuiTablePagination-selectLabel, .MuiTablePagination-select': {
            display: 'none',
          },
        }}
      />
    </Box>
  );
};
