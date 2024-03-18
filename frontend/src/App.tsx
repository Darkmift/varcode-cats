import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TopFive from './pages/TopFive';
import SearchResults from './pages/SearchResults';
import Layout from './Layout';
import AppMuiThemeProvider from './providers/AppMuiThemeProviderWrapper';
import LoginUser from './pages/LoginUser';
import ProtectedRoute from './components/common/ProtectedRoute';

export const NAV_LINKS = {
  HOME: '/',
  SEARCH: '/search-results',
  USER_LOGIN: '/user-login',
};

const App = () => {
  return (
    <Router>
      <AppMuiThemeProvider>
        <Layout>
          <Routes>
            <Route
              path={NAV_LINKS.HOME}
              element={
                <ProtectedRoute>
                  <TopFive />
                </ProtectedRoute>
              }
            />
            <Route
              path={NAV_LINKS.SEARCH}
              element={
                <ProtectedRoute>
                  <SearchResults />
                </ProtectedRoute>
              }
            />
            <Route path={NAV_LINKS.USER_LOGIN} element={<LoginUser />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </AppMuiThemeProvider>
    </Router>
  );
};

export default App;
