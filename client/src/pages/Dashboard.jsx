import { useState, useEffect } from 'react';
import {
  Page,
  Layout,
  Card,
  Text,
  Banner,
  List,
  Button,
} from '@shopify/polaris';

function Dashboard({ shop, host }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/discounts/stats?shop=${encodeURIComponent(shop || 'test.myshopify.com')}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('shopifyToken')}`,
        },
      });
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="DKG Token Discounts Dashboard">
      <Layout>
        <Layout.Section>
          <Banner
            title="Demo Mode - Your Store's Discount Manager"
            status="info"
          >
            <p>
              <strong>Store: {shop || 'test.myshopify.com'}</strong>
            </p>
            <p style={{ marginTop: '8px' }}>
              You are managing discount rules for YOUR store only. In production, this interface will be embedded directly in your Shopify Admin.
              Other stores cannot see or modify your rules - each merchant controls their own discounts.
            </p>
          </Banner>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <div style={{ padding: '16px' }}>
              <Text variant="headingMd" as="h2">Getting Started</Text>
              <div style={{ marginTop: '12px' }}>
                <List type="number">
                  <List.Item>Create discount rules based on DKG token ownership</List.Item>
                  <List.Item>Configure minimum token requirements and discount amounts</List.Item>
                  <List.Item>
                    Install the storefront widget to allow customers to verify their wallets
                  </List.Item>
                  <List.Item>Track discount usage and analytics</List.Item>
                </List>
              </div>
            </div>
          </Card>
        </Layout.Section>

        {stats && (
          <>
            <Layout.Section>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Card title="Active Discount Rules">
                  <div style={{ padding: '16px' }}>
                    <Text variant="headingXl" as="h2">
                      {stats.activeRules}
                    </Text>
                    <Text variant="bodyMd" as="p" tone="subdued">
                      Total Rules: {stats.totalRules}
                    </Text>
                  </div>
                </Card>

                <Card title="Verified Customers">
                  <div style={{ padding: '16px' }}>
                    <Text variant="headingXl" as="h2">
                      {stats.totalVerifiedCustomers}
                    </Text>
                    <Text variant="bodyMd" as="p" tone="subdued">
                      Customers with verified wallets
                    </Text>
                  </div>
                </Card>

                <Card title="Total Discounts Used">
                  <div style={{ padding: '16px' }}>
                    <Text variant="headingXl" as="h2">
                      {stats.totalDiscountsUsed}
                    </Text>
                    <Text variant="bodyMd" as="p" tone="subdued">
                      Across all rules
                    </Text>
                  </div>
                </Card>

                <Card title="Total Discount Amount">
                  <div style={{ padding: '16px' }}>
                    <Text variant="headingXl" as="h2">
                      ${stats.totalDiscountAmount.toFixed(2)}
                    </Text>
                    <Text variant="bodyMd" as="p" tone="subdued">
                      Total savings for customers
                    </Text>
                  </div>
                </Card>
              </div>
            </Layout.Section>
          </>
        )}

        <Layout.Section>
          <Card title="Storefront Integration">
            <div style={{ padding: '16px' }}>
              <Text variant="bodyMd" as="p">
                To enable token verification on your storefront, add the following code to your theme:
              </Text>
              <div
                style={{
                  background: '#f4f6f8',
                  padding: '16px',
                  borderRadius: '8px',
                  marginTop: '16px',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  overflow: 'auto',
                }}
              >
                {`<script src="https://${window.location.host}/storefront/dkg-widget.js"></script>
<div id="dkg-token-widget" data-shop="${shop}"></div>`}
              </div>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default Dashboard;

