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
          <Card title="Storefront Integration - Cart Drawer Widget">
            <div style={{ padding: '16px' }}>
              <Banner status="info">
                <p style={{ marginBottom: '8px' }}>
                  <strong>📍 Best Practice: Add to Cart Drawer</strong>
                </p>
                <p>
                  Most customers use the cart drawer popup (not the /cart page). Add the widget there for maximum visibility!
                </p>
              </Banner>

              <div style={{ marginTop: '20px' }}>
                <Text variant="headingMd" as="h3">
                  Installation Steps:
                </Text>
                <div style={{ marginTop: '12px' }}>
                  <List type="number">
                    <List.Item>
                      Go to: <strong>Shopify Admin → Online Store → Themes → Edit code</strong>
                    </List.Item>
                    <List.Item>
                      Open: <strong>snippets/cart-summary.liquid</strong> (contains the checkout button)
                    </List.Item>
                    <List.Item>
                      Find: <code>&lt;div class="cart__ctas"&gt;</code> with the checkout <code>&lt;button&gt;</code>
                    </List.Item>
                    <List.Item>
                      Add the widget code <strong>before</strong> the <code>&lt;button type="submit" id="checkout"&gt;</code>
                    </List.Item>
                  </List>
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <Text variant="headingMd" as="h3">
                  Widget Code:
                </Text>
                <div
                  style={{
                    background: '#f4f6f8',
                    padding: '16px',
                    borderRadius: '8px',
                    marginTop: '12px',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    overflow: 'auto',
                    border: '1px solid #e1e3e5',
                  }}
                >
                  {`{%- if cart.item_count > 0 -%}
  <!-- DKG Token Holder Widget -->
  <div style="margin: 12px; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    <div style="font-size: 14px; font-weight: 600; color: white; text-align: center; margin-bottom: 8px;">
      🪙 Token Holder Exclusive
    </div>
    <div style="font-size: 12px; color: rgba(255,255,255,0.9); text-align: center; margin-bottom: 12px;">
      Connect your wallet to unlock special discounts
    </div>
    <script src="https://${window.location.host}/storefront/dkg-widget.js" defer></script>
    <div id="dkg-token-widget" data-shop="{{ shop.permanent_domain }}"></div>
  </div>
{%- endif -%}`}
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <Text variant="headingMd" as="h3">
                  Example Placement:
                </Text>
                <div
                  style={{
                    background: '#f4f6f8',
                    padding: '16px',
                    borderRadius: '8px',
                    marginTop: '12px',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    overflow: 'auto',
                    border: '1px solid #e1e3e5',
                  }}
                >
                  {`<div class="cart__ctas">
  {%- if cart.item_count > 0 -%}
    <!-- DKG Token Holder Widget -->
    <div style="margin-bottom: 16px; padding: 16px; ...">
      ...widget code here...
    </div>
  {%- endif -%}
  
  <button
    type="submit"
    id="checkout"
    class="cart__checkout-button button"
    name="checkout"
    form="cart-form"
  >
    {{ 'content.checkout' | t }}
  </button>
</div>`}
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <Banner status="warning">
                  <p style={{ marginBottom: '8px' }}>
                    <strong>⚠️ Important: Avoid Duplicates</strong>
                  </p>
                  <p>
                    Only add the widget code to <strong>ONE</strong> file. Since <code>snippets/cart-summary.liquid</code> is used by both the cart drawer and the full cart page, adding it here covers both locations.
                  </p>
                  <p style={{ marginTop: '8px' }}>
                    <strong>Do NOT add to:</strong> cart-drawer.liquid, main-cart.liquid, or any other cart files.
                  </p>
                </Banner>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e1e3e5' }}>
                <Text variant="headingMd" as="h3">
                  Why This Works:
                </Text>
                <Text variant="bodyMd" as="p" style={{ marginTop: '8px' }}>
                  The <code>snippets/cart-summary.liquid</code> file is rendered by both the cart drawer popup AND the full <code>/cart</code> page. By adding the widget here once, it automatically appears in both places - perfect for maximum visibility!
                </Text>
              </div>

              <div style={{ marginTop: '20px' }}>
                <Text variant="bodyMd" as="p" tone="subdued">
                  <strong>Need help?</strong> The widget uses the <code>defer</code> attribute to prevent blocking page rendering, and <code>{'{{ shop.permanent_domain }}'}</code> automatically passes your shop's domain to the widget.
                </Text>
              </div>

              <div style={{ marginTop: '16px' }}>
                <Button
                  url="https://help.shopify.com/en/manual/online-store/themes/theme-structure/extend/edit-theme-code"
                  external
                >
                  Shopify Guide: Editing Theme Code
                </Button>
              </div>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default Dashboard;

