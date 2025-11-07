import { useState, useEffect } from 'react';
import {
  Page,
  Layout,
  Card,
  TextContainer,
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
      const response = await fetch('/api/discounts/stats', {
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
            title="Welcome to DKG Token Discounts"
            status="info"
          >
            <p>
              This app allows your customers who hold DKG tokens to receive exclusive discounts.
              Set up discount rules and track usage from this dashboard.
            </p>
          </Banner>
        </Layout.Section>

        <Layout.Section>
          <Card sectioned>
            <TextContainer>
              <Text variant="headingMd" as="h2">Getting Started</Text>
              <List type="number">
                <List.Item>Create discount rules based on DKG token ownership</List.Item>
                <List.Item>Configure minimum token requirements and discount amounts</List.Item>
                <List.Item>
                  Install the storefront widget to allow customers to verify their wallets
                </List.Item>
                <List.Item>Track discount usage and analytics</List.Item>
              </List>
            </TextContainer>
          </Card>
        </Layout.Section>

        {stats && (
          <>
            <Layout.Section oneHalf>
              <Card title="Active Discount Rules" sectioned>
                <Text variant="headingXl" as="h2">
                  {stats.activeRules}
                </Text>
                <Text variant="bodyMd" as="p" color="subdued">
                  Total Rules: {stats.totalRules}
                </Text>
              </Card>
            </Layout.Section>

            <Layout.Section oneHalf>
              <Card title="Verified Customers" sectioned>
                <Text variant="headingXl" as="h2">
                  {stats.totalVerifiedCustomers}
                </Text>
                <Text variant="bodyMd" as="p" color="subdued">
                  Customers with verified wallets
                </Text>
              </Card>
            </Layout.Section>

            <Layout.Section oneHalf>
              <Card title="Total Discounts Used" sectioned>
                <Text variant="headingXl" as="h2">
                  {stats.totalDiscountsUsed}
                </Text>
                <Text variant="bodyMd" as="p" color="subdued">
                  Across all rules
                </Text>
              </Card>
            </Layout.Section>

            <Layout.Section oneHalf>
              <Card title="Total Discount Amount" sectioned>
                <Text variant="headingXl" as="h2">
                  ${stats.totalDiscountAmount.toFixed(2)}
                </Text>
                <Text variant="bodyMd" as="p" color="subdued">
                  Total savings for customers
                </Text>
              </Card>
            </Layout.Section>
          </>
        )}

        <Layout.Section>
          <Card title="Storefront Integration" sectioned>
            <TextContainer>
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
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default Dashboard;

