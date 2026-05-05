'use client';

import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import {
  alpha,
  Box,
  Divider,
  Popover,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import { RowStack } from '../RowStack';
import { AppSearchField } from '../TextField';
import { StyledImage } from '../StyledImage';
import Grid from '@mui/material/Grid';
import filterIcon from './ui/assets/icons/filter.svg';
import downloadIcon from './ui/assets/icons/download.svg';
import { pxToRem } from '../../../../common';
import { AppDropdownMenu } from '../AppDropdownMenu';
import { AppButton } from '../AppButton';
import { ArrowForwardIos } from '@mui/icons-material';
import { toast } from 'sonner';
import { AppDataGridProps, GridRow, GridTable } from '../GridTable';

// Initialize dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(quarterOfYear);
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

interface DateRange {
  startDate: Dayjs;
  endDate: Dayjs;
  label: string;
}

interface DateFilter {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  label: string;
}

// Preset date ranges
const getDateRanges = (): DateRange[] => {
  const today = dayjs();
  return [
    {
      startDate: today.startOf('day'),
      endDate: today.endOf('day'),
      label: 'Today',
    },
    {
      startDate: today.subtract(7, 'day').startOf('day'),
      endDate: today.endOf('day'),
      label: 'Last 7 days',
    },
    {
      startDate: today.subtract(14, 'day').startOf('day'),
      endDate: today.endOf('day'),
      label: 'Last 14 days',
    },
    {
      startDate: today.subtract(30, 'day').startOf('day'),
      endDate: today.endOf('day'),
      label: 'Last 30 days',
    },
    {
      startDate: today.startOf('month'),
      endDate: today.endOf('month'),
      label: 'This month',
    },
    {
      startDate: today.subtract(1, 'month').startOf('month'),
      endDate: today.subtract(1, 'month').endOf('month'),
      label: 'Last month',
    },
    {
      startDate: today.startOf('quarter'),
      endDate: today.endOf('quarter'),
      label: 'This quarter',
    },
    {
      startDate: today.startOf('year'),
      endDate: today.endOf('year'),
      label: 'This year',
    },
    {
      startDate: today.subtract(1, 'year').startOf('year'),
      endDate: today.subtract(1, 'year').endOf('year'),
      label: 'Last year',
    },
    {
      startDate: today.subtract(3, 'month').startOf('day'),
      endDate: today.endOf('day'),
      label: 'Last 3 months',
    },
    {
      startDate: today.subtract(6, 'month').startOf('day'),
      endDate: today.endOf('day'),
      label: 'Last 6 months',
    },
  ];
};

interface Buttons {
  text: string;
  icon: any;
  onClick?: () => void;
}

export interface AppSearchFilterTableProps<T extends GridRow> extends Omit<
  AppDataGridProps<T>,
  'fetchData'
> {
  fetchData: (
    page: number,
    pageSize: number,
    // sortModel: GridSortSpec<T>[],
    search?: string,

    startDate?: string,
    endDate?: string,
    filter?: string
  ) => Promise<{ rows: T[]; totalRows: number }>;
  filters?: string[];
  searchPlaceHolder?: string;
  name?: string;
  download?: boolean;
  dateDateFilter?: boolean;
  addBtn?: Buttons;
  downloadClick?: (event?: React.MouseEvent<HTMLElement> | undefined) => void;
}

export const AppSearchFilterTable = <T extends GridRow>({
  fetchData,
  columns,
  filters = [],
  onRowClick,
  disableRowClick,
  name = '',
  searchPlaceHolder,
  download,
  downloadClick,
  dateDateFilter,
  addBtn,
  ...dataGridProps
}: AppSearchFilterTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(
    null
  );
  const [downloadAnchorEl, setDownloadAnchorEl] = useState<HTMLElement | null>(
    null
  );
  const [filterDateAnchorEl, setFilterDateAnchorEl] =
    useState<HTMLElement | null>(null);
  const [dateAnchorEl, setDateAnchorEl] = useState<HTMLElement | null>(null);
  const theme = useTheme();
  const dateFilterOpen = Boolean(filterDateAnchorEl);
  const dateFilterId = dateFilterOpen ? 'date-filter-popover' : undefined;
  const downloadAnchorOpen = Boolean(downloadAnchorEl);
  const downloadAnchorId = downloadAnchorOpen ? 'download-popover' : undefined;

  // Date filter states
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    startDate: null,
    endDate: null,
    label: 'Select date range',
  });

  // console.log("date filter", dateFilter.startDate.format("YYYY-MM-DD"), dateFilter.endDate.format("YYYY-MM-DD"));

  // Filter and date popover
  const handleFilTerDateClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterDateAnchorEl(event.currentTarget);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleDateClick = (event: React.MouseEvent<HTMLElement>) => {
    setDateAnchorEl(event.currentTarget);
  };
  const handleDownloadClick = (event: React.MouseEvent<HTMLElement>) => {
    setDownloadAnchorEl(event.currentTarget);
  };

  const handleFilterChange = (option: string) => {
    setSelectedFilter(option);
    setFilterAnchorEl(null);
  };

  const handleDateRangeSelect = (option: string) => {
    const selectedRange = getDateRanges().find(
      (range) => range.label === option
    );
    // console.log("range", selectedRange)
    if (selectedRange) {
      setDateFilter({
        startDate: selectedRange.startDate,
        endDate: selectedRange.endDate,
        label: selectedRange.label,
      });
    }
    setDateAnchorEl(null);
  };

  const handleFetchData = useCallback(
    async (page: number, pageSize: number) => {
      const formattedStartDate = dateFilter.startDate
        ? dateFilter.startDate.format('YYYY-MM-DD')
        : undefined;
      const formattedEndDate = dateFilter.endDate
        ? dateFilter.endDate.format('YYYY-MM-DD')
        : undefined;

      // const sortingParams = sortModel.map(({ field, sort }) => ({
      //   field,
      //   sort,
      // }));
      // console.log("Start date", formattedStartDate, "end date", formattedEndDate);

      return fetchData(
        page,
        pageSize,
        // sortingParams,
        searchTerm,
        formattedStartDate,
        formattedEndDate,
        selectedFilter
      );
    },
    [fetchData, searchTerm, dateFilter, selectedFilter]
  );

  return (
    <Box
      sx={{
        borderRadius: '10px',
        marginTop: '31px',
        background: theme.palette.background.default,
      }}
    >
      <Grid
        container
        justifyContent="space-between"
        sx={{ mt: '44px', mb: '16px', px: { md: '24px', xs: 0 } }}
        spacing={2}
      >
        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <Typography
            sx={{
              fontFamily: theme.typography.fontFamily,
              fontWeight: 126,
              fontSize: {
                xs: pxToRem(16),
                md: pxToRem(20),
              },
              lineHeight: {
                xs: '20px',
                md: '26px',
              },
              color: theme.color.black,
            }}
          >
            {name}
          </Typography>
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <RowStack
            spacing={{
              xs: 2,
            }}
            direction={{
              xs: 'column',
              md: 'row',
            }}
            sx={{
              [theme.breakpoints.down('sm')]: {
                overflowX: 'auto',
              },
            }}
          >
            <Box
              sx={{
                flexShrink: 0,
              }}
            >
              {dateDateFilter || filters.length > 0 ? (
                <>
                  <RowStack
                    spacing={'8px'}
                    onClick={handleFilTerDateClick}
                    sx={{
                      padding: '10px 16px',
                      border: `1px solid #D0D5DD`,
                      borderRadius: '8px',
                      boxShadow: '#1018280D',
                      gap: '8px',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                      // minWidth: '91px',
                    }}
                  >
                    {/* <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: pxToRem(14),
                        lineHeight: '19.07px',
                      }}
                    >
                      {selectedFilter || 'All'}
                    </Typography> */}

                    <StyledImage src={filterIcon} alt="filter" />
                  </RowStack>
                  <Popover
                    id={dateFilterId}
                    open={dateFilterOpen}
                    anchorEl={filterDateAnchorEl}
                    onClose={() => setFilterDateAnchorEl(null)}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    sx={{ fontFamily: theme.typography.fontFamily }}
                  >
                    <Stack
                      divider={<Divider orientation="horizontal" flexItem />}
                    >
                      {filters.length > 0 && (
                        <AppButton
                          sx={{
                            background: 'none',
                            color: theme.color.grey,
                            fontWeight: 84,
                            fontSize: pxToRem(12),
                            lineHeight: '15.6px',
                            '&:hover': {
                              background: alpha(theme.color.grey, 0.1),
                            },
                          }}
                          onClick={handleFilterClick}
                          endIcon={<ArrowForwardIos />}
                        >
                          Status
                        </AppButton>
                      )}
                      {dateDateFilter ? (
                        <AppButton
                          sx={{
                            background: 'none',
                            color: theme.color.grey,
                            fontWeight: 84,
                            fontSize: pxToRem(12),
                            lineHeight: '15.6px',
                            '&:hover': {
                              background: alpha(theme.color.grey, 0.1),
                            },
                          }}
                          onClick={handleDateClick}
                          endIcon={<ArrowForwardIos />}
                        >
                          Date
                        </AppButton>
                      ) : null}
                    </Stack>
                  </Popover>
                  <AppDropdownMenu
                    open={Boolean(filterAnchorEl)}
                    options={[...filters]}
                    anchorEl={filterAnchorEl}
                    onClose={() => setFilterAnchorEl(null)}
                    selectedOption={selectedFilter}
                    onOptionSelected={handleFilterChange}
                  />
                </>
              ) : null}
            </Box>

            <Box
              sx={{
                flexShrink: 0,
              }}
            >
              {download && (
                <>
                  <RowStack
                    onClick={handleDownloadClick}
                    sx={{
                      padding: '10px 16px',
                      border: `1px solid #D0D5DD`,
                      borderRadius: '8px',
                      boxShadow: '#1018280D',
                      gap: '8px',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                      // minWidth: '91px',
                      width: 'content-fit',
                    }}
                  >
                    <StyledImage src={downloadIcon} alt="download" />
                  </RowStack>
                  <Popover
                    id={downloadAnchorId}
                    open={downloadAnchorOpen}
                    anchorEl={downloadAnchorEl}
                    onClose={() => setDownloadAnchorEl(null)}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    sx={{ fontFamily: theme.typography.fontFamily }}
                  >
                    <Stack
                      divider={<Divider orientation="horizontal" flexItem />}
                    >
                      <AppButton
                        sx={{
                          background: 'none',
                          color: theme.color.grey,
                          fontWeight: 84,
                          fontSize: pxToRem(12),
                          lineHeight: '15.6px',
                          '&:hover': {
                            background: alpha(theme.color.grey, 0.1),
                          },
                        }}
                        onClick={downloadClick}
                        // endIcon={<ArrowForwardIos />}
                      >
                        Download
                      </AppButton>
                    </Stack>
                  </Popover>
                </>
              )}
            </Box>

            <AppDropdownMenu
              open={Boolean(dateAnchorEl)}
              options={getDateRanges().map((range) => range.label)}
              anchorEl={dateAnchorEl}
              onClose={() => setDateAnchorEl(null)}
              selectedOption={dateFilter.label}
              onOptionSelected={handleDateRangeSelect}
            />
            <Box
              sx={{
                flexShrink: 0,
              }}
            >
              <AppSearchField
                placeholder={searchPlaceHolder || 'Search...'}
                value={searchTerm}
                boxProps={{
                  sx: {
                    width: { xs: '100%', md: '40%', lg: '326px' },
                    height: '38px',
                    borderRadius: '12px',
                    // border: `1px solid ${theme.dashboard.borderColor}`,
                    boxShadow: '#1018280D',
                  },
                }}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Box>
            <Box
              sx={{
                flexShrink: 0,
              }}
            >
              {addBtn && (
                <AppButton
                  sx={{
                    padding: '15px 24px',
                  }}
                  startIcon={addBtn.icon}
                  onClick={addBtn.onClick}
                >
                  {addBtn.text}
                </AppButton>
              )}
            </Box>
          </RowStack>
        </Grid>
      </Grid>

      <GridTable
        {...dataGridProps}
        columns={columns}
        fetchData={handleFetchData}
        disableRowClick={disableRowClick}
        onRowClick={onRowClick}
      />
    </Box>
  );
};
