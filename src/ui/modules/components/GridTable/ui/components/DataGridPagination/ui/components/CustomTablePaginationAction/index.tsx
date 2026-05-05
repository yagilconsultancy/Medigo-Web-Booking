import React from 'react';
import { Box, IconButton, Button, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { pxToRem } from '../../../../../../../../../../common';
import { RowStack } from '../../../../../../../RowStack';

interface CustomTablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

export const CustomTablePaginationActions = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
}: CustomTablePaginationActionsProps) => {
  const totalPages = Math.ceil(count / rowsPerPage);

  // Calculate visible range
  const start = page * rowsPerPage + 1;
  const end = Math.min((page + 1) * rowsPerPage, count);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 10) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(0);

      if (page > 3) pages.push('...');

      for (
        let i = Math.max(1, page - 2);
        i <= Math.min(totalPages - 2, page + 2);
        i++
      ) {
        pages.push(i);
      }

      if (page < totalPages - 4) pages.push('...');

      pages.push(totalPages - 1);
    }

    return pages;
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
    >
      {/* Dynamic text */}
      <Typography
        sx={{
          fontWeight: 400,
          fontSize: pxToRem(12.5),
          lineHeight: '18.75px',
          color: 'text.secondary',
        }}
      >
        Showing {start}–{end} of {count} vehicles
      </Typography>

      <RowStack>
        {/* Previous Button */}
        <IconButton
          onClick={(event) => onPageChange(event, page - 1)}
          disabled={page === 0}
          sx={{
            background: '#F7F9FB',
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            border: '0.67px solid #E8ECF0',
            color: page === 0 ? '#ccc' : '#000',
          }}
        >
          <ChevronLeft />
        </IconButton>

        {/* Page Numbers */}
        <Box display="flex" alignItems="center">
          {getPageNumbers().map((p, index) =>
            p === '...' ? (
              <Typography key={index} sx={{ mx: 1, fontSize: pxToRem(14) }}>
                ...
              </Typography>
            ) : (
              <Button
                key={p}
                variant={page === p ? 'contained' : 'text'}
                color={page === p ? 'primary' : 'inherit'}
                onClick={(event) => onPageChange(event, Number(p))}
                sx={{
                  minWidth: '32px',
                  height: '32px',
                  mx: '4px',
                  borderRadius: '5px',
                }}
              >
                {Number(p) + 1}
              </Button>
            )
          )}
        </Box>

        {/* Next Button */}
        <IconButton
          onClick={(event) => onPageChange(event, page + 1)}
          disabled={page >= totalPages - 1}
          sx={{
            background: '#F7F9FB',
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            border: '0.67px solid #E8ECF0',
            color: page >= totalPages - 1 ? '#ccc' : '#000',
          }}
        >
          <ChevronRight />
        </IconButton>
      </RowStack>
    </Box>
  );
};
