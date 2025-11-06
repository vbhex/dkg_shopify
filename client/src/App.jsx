import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppProvider, Page, Card, Navigation } from '@shopify/polaris';
import { HomeMinor, DiscountsMajor, AnalyticsMinor } from '@shopify/polaris-icons';
import Dashboard from './pages/Dashboard';
import DiscountRules from './pages/DiscountRules';
import Analytics from './pages/Analytics';

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
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <div style={{ width: '240px', borderRight: '1px solid #ddd' }}>
            <Navigation location="/">
              <Navigation.Section
                items={[
                  {
                    url: `/`,
                    label: 'Dashboard',
                    icon: HomeMinor,
                  },
                  {
                    url: `/discount-rules`,
                    label: 'Discount Rules',
                    icon: DiscountsMajor,
                  },
                  {
                    url: `/analytics`,
                    label: 'Analytics',
                    icon: AnalyticsMinor,
                  },
                ]}
              />
            </Navigation>
          </div>
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Dashboard shop={shop} host={host} />} />
              <Route path="/discount-rules" element={<DiscountRules shop={shop} host={host} />} />
              <Route path="/analytics" element={<Analytics shop={shop} host={host} />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

