// src/components/Layout.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '@/App';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleDarkMode } from '@/store/slices/theme';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const dispatch = useAppDispatch();

  const handleToggle = () => {
    dispatch(toggleDarkMode());
  };
  return (
    <Box
      component={'main'}
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        minHeight: '100vh',
      }}
    >
      <AppBar component={'nav'} position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <Link to={NAV_LINKS.HOME} style={{ textDecoration: 'none', color: 'inherit' }}>
              CATS-APP
            </Link>
            <Box component={'span'}>&nbsp;</Box>
            <Link to={NAV_LINKS.SEARCH} style={{ textDecoration: 'none', color: 'inherit' }}>
              Search
            </Link>
            <IconButton sx={{ ml: 1 }} onClick={handleToggle} color="inherit">
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Typography>
        </Toolbar>
      </AppBar>

      <Container component={'section'} sx={{ padding: '10px 0' }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
