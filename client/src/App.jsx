import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AppProvider, Frame, Navigation } from '@shopify/polaris';
import Dashboard from './pages/Dashboard';
import DiscountRules from './pages/DiscountRules';
import Analytics from './pages/Analytics';

function NavigationMarkup() {
  const navigate = useNavigate();

  return (
    <Navigation location="/">
      <Navigation.Section
        items={[
          {
            label: 'Dashboard',
            onClick: () => navigate('/'),
          },
          {
            label: 'Discount Rules',
            onClick: () => navigate('/discount-rules'),
          },
          {
            label: 'Analytics',
            onClick: () => navigate('/analytics'),
          },
        ]}
      />
    </Navigation>
  );
}

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const shop = urlParams.get('shop');
  const host = urlParams.get('host');

  return (
    <AppProvider
      i18n={{
        Polaris: {
          Common: {
            cancel: 'Cancel',
            save: 'Save',
          },
        },
      }}
    >
      <BrowserRouter>
        <Frame navigation={<NavigationMarkup />}>
          <Routes>
            <Route path="/" element={<Dashboard shop={shop} host={host} />} />
            <Route path="/discount-rules" element={<DiscountRules shop={shop} host={host} />} />
            <Route path="/analytics" element={<Analytics shop={shop} host={host} />} />
          </Routes>
        </Frame>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

