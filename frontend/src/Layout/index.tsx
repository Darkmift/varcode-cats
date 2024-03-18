// src/components/Layout.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '@/App';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleDarkMode } from '@/store/slices/theme';
// import SnackbarManager from '@/components/common/SnackBarManager';
import { SnackbarProvider } from 'notistack';
import { useUserLogoutMutation } from '@/store/http/api/auth';
import { useSnackbar } from 'notistack';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userLogout] = useUserLogoutMutation();
  const username = useAppSelector((state) => state.auth.username); // Assuming this is how you track logged-in state
  const { enqueueSnackbar } = useSnackbar();

  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const dispatch = useAppDispatch();

  const handleToggle = () => {
    dispatch(toggleDarkMode());
  };

  const handleLogout = async () => {
    try {
      await userLogout().unwrap();
      // Optionally, perform additional actions upon successful logout
      // e.g., navigating to the login page, clearing state, etc.
      enqueueSnackbar('Logout successful...GoodBye!', { variant: 'success' });
    } catch (error) {
      console.error('Logout failed:', error);
      enqueueSnackbar('Logout failed...notify admin he messed up!', { variant: 'error' });
    }
  };

  return (
    <SnackbarProvider maxSnack={3}>
      <Box
        component={'main'}
        sx={{
          bgcolor: 'background.default',
          color: 'text.primary',
          minHeight: '100vh',
        }}
      >
        <AppBar component={'nav'} position="static">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
            {username?.length ? (
              <IconButton onClick={handleLogout} color="inherit">
                <Typography variant="button" display="block" sx={{ padding: 0 }}>
                  Logout
                </Typography>
              </IconButton>
            ) : (
              ''
            )}
          </Toolbar>
        </AppBar>

        <Container component={'section'} sx={{ padding: '10px 0' }}>
          {children}
        </Container>
        {/* <SnackbarManager /> */}
      </Box>
    </SnackbarProvider>
  );
};

export default Layout;
