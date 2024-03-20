import { useAppSelector } from '@/store';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import React from 'react';
import { useMemo } from 'react';

const AppMuiThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
          primary: {
            main: isDarkMode ? '#90caf9' : '#1976d2', // Blue shades
          },
          secondary: {
            main: isDarkMode ? '#f48fb1' : '#d81b60', // Pink shades
          },
          background: {
            default: isDarkMode ? '#57503c' : '#DEF7FD', // Darker for dark mode, lighter for light mode
            paper: isDarkMode ? '#1e1e1e' : '#ffffff',
          },
          text: {
            primary: isDarkMode ? '#DEF7FD' : '#000000',
            secondary: isDarkMode ? '#b3b3b3' : '#4f4f4f',
            disabled: isDarkMode ? '#9197ff' : '#27283b',
          },
        },
      }),
    [isDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default AppMuiThemeProvider;
