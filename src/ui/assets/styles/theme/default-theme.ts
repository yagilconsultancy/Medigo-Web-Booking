'use client';

import { createTheme } from '@mui/material';

// Customize the default theme here
export const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#2F6FED',
    },
    secondary: {
      main: '#F2F6FF',
    },
    background: {
      default: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  sidebar: {
    primary: '#4B5563',
    borderColor: '#E8ECF0',
  },
  dashboard: {
    userBg: '#CCCCCC17',
    deepBlue: '#0F172A',
    lightYellow: '#FFFBEB',
    yellowBorder: '#FDE68A',
    progressBg: '#E5E7EB',
  },
  color: {
    error: '#DC2626',
    info: '#2F80ED',
    warning: '#D97706',
    deepYellow: '#92400E',
    purple: '#7C3AED',
    success: '#059669',
    black: '#1D1D1D',
    deepBlue: '#111827',
    grey: '#374151',
    lightGrey: '#9CA3AF',
    border: '#F0F4F8',
    background: '#F7F9FB',
  },
  button: {
    contained: {
      primary: {
        background: '#2F6FED',
        color: '#FFFFFF',
        grey: '#FFFFFF33',
        hoverBackground: '#BD5A15',
        hoverColor: '#FFFFFF',
      },
      secondary: {
        background: '#ECEEEF !important',
        color: '#393939',
        hoverBackground: '#103CE2',
        hoverColor: '#FFFFFF',
      },
    },
  },
  textField: {
    outlined: {
      default: {
        colors: {
          background: '#F7F9FB',
          placeholder: '#37415180',
          text: '#111827',
          label: '#111827',
          border: '#E8ECF0',
          error: '#DC2626',
        },
      },
      focused: {
        colors: {
          background: '#F5F7FA',
          placeholder: '#11182780',
          text: '#111827',
          label: '#111827',
          border: '#EBEBEB',
          error: '#DC2626',
        },
      },
    },
    filled: {
      default: {
        colors: {
          background: '#FAFBFC',
          placeholder: '#999999',
          text: '#111827',
          label: '#111827',
          border: '#EBEBEB',
          error: '#FF5E5E',
        },
      },
      focused: {
        colors: {
          background: '#FAFBFC',
          placeholder: '#999999',
          text: '#111827',
          label: '#111827',
          border: '#EBEBEB',
          error: '#FF5E5E',
        },
      },
    },
  },
});
