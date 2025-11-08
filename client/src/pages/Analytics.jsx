import { useState, useEffect } from 'react';
import {
  Page,
  Layout,
  Card,
  DataTable,
  Text,
  Badge,
} from '@shopify/polaris';

function Analytics({ shop, host }) {
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
    <Page title="Analytics">
      <Layout>
        <Layout.Section>
          <Card title="Overview">
            <div style={{ padding: '16px' }}>
              {stats && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <Text variant="headingMd" as="h3">Total Rules</Text>
                    <Text variant="headingXl" as="p">{stats.totalRules}</Text>
                  </div>
                  <div>
                    <Text variant="headingMd" as="h3">Active Rules</Text>
                    <Text variant="headingXl" as="p">{stats.activeRules}</Text>
                  </div>
                  <div>
                    <Text variant="headingMd" as="h3">Verified Customers</Text>
                    <Text variant="headingXl" as="p">{stats.totalVerifiedCustomers}</Text>
                  </div>
                  <div>
                    <Text variant="headingMd" as="h3">Total Discounts Used</Text>
                    <Text variant="headingXl" as="p">{stats.totalDiscountsUsed}</Text>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Text variant="headingMd" as="h3">Total Discount Amount</Text>
                    <Text variant="headingXl" as="p">${stats.totalDiscountAmount.toFixed(2)}</Text>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card title="Coming Soon">
            <div style={{ padding: '16px' }}>
              <Text variant="bodyMd" as="p">
                Advanced analytics including:
              </Text>
              <ul style={{ marginTop: '12px' }}>
                <li>Discount usage trends over time</li>
                <li>Customer engagement metrics</li>
                <li>Revenue impact analysis</li>
                <li>Token holder demographics</li>
                <li>Conversion rate tracking</li>
              </ul>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default Analytics;

