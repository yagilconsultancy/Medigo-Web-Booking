import '@mui/material/styles';

export type ButtonStateStyle = {
  background: string;
  color: string;
  hoverBackground: string;
  hoverColor: string;
  grey?: string;
};

export type ButtonVariantStyle = {
  primary: ButtonStateStyle;
  secondary: ButtonStateStyle;
  // inherit: ButtonStateStyle;
};

export type ButtonStyle = {
  contained: ButtonVariantStyle;
  // outlined: ButtonVariantStyle;
  // text: ButtonVariantStyle;
};

export type SidebarStyle = {
  primary: string;
  borderColor: string;
};

export type TextFieldStateStyle = {
  colors: {
    background: string;
    placeholder: string;
    text: string;
    label: string;
    border: string;
    error: string;
  };
};

export type TextFieldVariantStyle = {
  default: TextFieldStateStyle;
  focused: TextFieldStateStyle;
};

export type TextFieldStyle = {
  filled: TextFieldVariantStyle;
  outlined: TextFieldVariantStyle;
};

type ColorType = {
  error: string;
  info: string;
  warning: string;
  success: string;
  deepYellow: string;
  purple: string;
  black: string;
  grey: string;
  lightGrey: string;
  background: string;
  deepBlue: string;
  border: string;
};

type DashboardStyle = {
  userBg: string;
  deepBlue: string;
  lightYellow: string;
  yellowBorder: string;
  progressBg: string;
};

interface ThemeExtension {
  button: ButtonStyle;
  color: ColorType;
  sidebar: SidebarStyle;
  textField: TextFieldStyle;
  dashboard: DashboardStyle;
}

declare module '@mui/material/styles' {
  interface Theme extends ThemeExtension {}

  interface ThemeOptions {
    button: ButtonStyle;
    color: ColorType;
    sidebar: SidebarStyle;
    textField: TextFieldStyle;
    dashboard: DashboardStyle;
  }

  interface ThemeOptions extends ThemeExtension {}
}

export {};
