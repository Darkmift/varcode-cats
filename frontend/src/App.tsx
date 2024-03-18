import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TopFive from './pages/TopFive';
import SearchResults from './pages/SearchResults';
import Layout from './Layout';
import AppMuiThemeProvider from './providers/AppMuiThemeProviderWrapper';

export const NAV_LINKS = {
  HOME: '/',
  SEARCH: '/search-results',
};

const App = () => {
  return (
    <Router>
      <AppMuiThemeProvider>
        <Layout>
          <Routes>
            <Route path={NAV_LINKS.HOME} element={<TopFive />} />
            <Route path={NAV_LINKS.SEARCH} element={<SearchResults />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </AppMuiThemeProvider>
    </Router>
  );
};

export default App;
