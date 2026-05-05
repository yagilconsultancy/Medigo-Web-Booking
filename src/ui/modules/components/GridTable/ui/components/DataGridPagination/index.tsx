import {
  gridPaginationSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import React from 'react';
import { CustomPagination } from './ui/components';

// Wrapper Component stays the same...

export const DataGridPagination = () => {
  const apiRef = useGridApiContext();
  const pagination = useGridSelector(apiRef, gridPaginationSelector);
  const { paginationModel, rowCount } = pagination;

  const handlePageChange = (newPage: number) => {
    apiRef.current.setPaginationModel({
      ...paginationModel,
      page: newPage,
    });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    apiRef.current.setPaginationModel({
      page: 0,
      pageSize: newPageSize,
    });
  };

  return (
    <CustomPagination
      count={rowCount}
      page={paginationModel.page}
      pageSize={paginationModel.pageSize}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
  );
};
