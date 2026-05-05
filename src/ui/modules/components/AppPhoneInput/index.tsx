'use client';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  Box,
  InputAdornment,
  Paper,
  Popover,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useField } from 'formik';
import { useMemo, useRef, useState } from 'react';
import { FormikAppTextField } from '../TextField';
import { pxToRem } from '@/common';

export type ApiCountriesData = {
  id: string;
  iso3: string;
  iso2: string;
  emoji: string;
  phonecode: string;
};

export type AppPhoneInputProps = {
  name: string;
  placeholder?: string;
  countries: ApiCountriesData[];
  disabled?: boolean;
  countryIso3FieldName?: string;
  countryCodeFieldName?: string;
  onPhoneChange?: (value: string) => void;
  onCountryChange?: (country: ApiCountriesData) => void;
};

export function AppPhoneInput({
  name,
  placeholder = 'Input your phone number',
  countries,
  disabled = false,
  countryIso3FieldName = 'countryIso3',
  countryCodeFieldName = 'countryCode',
  onPhoneChange,
  onCountryChange,
}: AppPhoneInputProps) {
  const [, , countryCodeHelpers] = useField(countryCodeFieldName);
  const [countryIso3Field, , countryIso3Helpers] =
    useField(countryIso3FieldName);

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const anchorRef = useRef<HTMLDivElement>(null);

  const selectedCountry = useMemo(() => {
    return (
      countries.find((c) => c.iso3 === countryIso3Field.value) ?? countries[0]
    );
  }, [countries, countryIso3Field.value]);

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return countries;
    const query = searchQuery.toLowerCase();
    return countries.filter(
      (country) =>
        country.iso3.toLowerCase().includes(query) ||
        country.iso2.toLowerCase().includes(query) ||
        country.phonecode.includes(query)
    );
  }, [countries, searchQuery]);

  const handleCountrySelect = (country: ApiCountriesData) => {
    countryIso3Helpers.setValue(country.iso3);
    countryCodeHelpers.setValue(`+${country.phonecode}`);
    onCountryChange?.(country);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleToggle = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      <FormikAppTextField
        name={name}
        type="tel"
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onPhoneChange?.(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Box
                ref={anchorRef}
                onClick={handleToggle}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: pxToRem(6),
                  cursor: disabled ? 'default' : 'pointer',
                  pr: pxToRem(6),
                  '&:hover': disabled ? undefined : { opacity: 0.8 },
                }}
              >
                <Typography sx={{ fontSize: pxToRem(18) }}>
                  {selectedCountry?.emoji}
                </Typography>
                <Typography
                  sx={{
                    fontSize: pxToRem(13),
                    color: '#4A5565',
                    fontWeight: 600,
                  }}
                >
                  +{selectedCountry?.phonecode}
                </Typography>
                <KeyboardArrowDownIcon
                  sx={{
                    fontSize: pxToRem(16),
                    color: '#94A3B8',
                    transition: 'transform 0.2s ease',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </Box>
            </InputAdornment>
          ),
        }}
      />

      <Popover
        open={isOpen}
        anchorEl={anchorRef.current}
        onClose={handleClose}
        style={{ zIndex: 1300, minWidth: '300px' }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: pxToRem(8),
            maxHeight: pxToRem(360),
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            width: pxToRem(250),
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid #E0E0E0' }}>
            <TextField
              fullWidth
              placeholder="Search country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#F5F5F5',
                  borderRadius: pxToRem(8),
                  fontSize: pxToRem(14),
                },
              }}
            />
          </Box>

          <Stack
            spacing={0}
            sx={{ maxHeight: pxToRem(320), overflowY: 'auto', p: 1 }}
          >
            {filteredCountries.map((country) => (
              <Box
                key={country.id}
                onClick={() => handleCountrySelect(country)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderRadius: pxToRem(8),
                  transition: 'background-color 0.2s',
                  '&:hover': { backgroundColor: '#F5F5F5' },
                  backgroundColor:
                    selectedCountry?.id === country.id
                      ? '#F0F0F0'
                      : 'transparent',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Typography sx={{ fontSize: pxToRem(20) }}>
                    {country.emoji}
                  </Typography>

                  <Stack>
                    <Typography
                      sx={{
                        fontSize: pxToRem(14),
                        fontWeight: 600,
                        color: '#202020',
                      }}
                    >
                      {country.iso3}
                    </Typography>
                    <Typography sx={{ fontSize: pxToRem(12), color: '#666' }}>
                      {country.phonecode}
                    </Typography>
                  </Stack>
                </Stack>

                <Typography
                  sx={{ fontSize: pxToRem(12), color: '#999', fontWeight: 600 }}
                >
                  {country.iso2}
                </Typography>
              </Box>
            ))}

            {filteredCountries.length === 0 ? (
              <Box
                sx={{
                  padding: pxToRem(40),
                  textAlign: 'center',
                  color: '#999',
                }}
              >
                <Typography sx={{ fontSize: pxToRem(14) }}>
                  No countries found
                </Typography>
              </Box>
            ) : null}
          </Stack>
        </Paper>
      </Popover>
    </>
  );
}
