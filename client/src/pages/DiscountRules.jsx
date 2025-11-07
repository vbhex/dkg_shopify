import { useState, useEffect, useCallback } from 'react';
import {
  Page,
  Card,
  DataTable,
  Button,
  Modal,
  FormLayout,
  TextField,
  Select,
  Badge,
  Banner,
} from '@shopify/polaris';

function DiscountRules({ shop, host }) {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalActive, setModalActive] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    minTokenAmount: '',
    tokenContractAddress: '',
    chainId: '1',
    discountType: 'percentage',
    discountValue: '',
    maxDiscountAmount: '',
    usageLimit: '',
    perCustomerLimit: '',
    startsAt: '',
    endsAt: '',
  });

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await fetch('/api/discounts', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('shopifyToken')}`,
        },
      });
      const data = await response.json();
      setRules(data.discountRules || []);
    } catch (error) {
      console.error('Error fetching rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalOpen = (rule = null) => {
    if (rule) {
      setEditingRule(rule);
      setFormData({
        name: rule.name,
        description: rule.description || '',
        minTokenAmount: rule.minTokenAmount,
        tokenContractAddress: rule.tokenContractAddress,
        chainId: rule.chainId.toString(),
        discountType: rule.discountType,
        discountValue: rule.discountValue.toString(),
        maxDiscountAmount: rule.maxDiscountAmount?.toString() || '',
        usageLimit: rule.usageLimit?.toString() || '',
        perCustomerLimit: rule.perCustomerLimit?.toString() || '',
        startsAt: rule.startsAt || '',
        endsAt: rule.endsAt || '',
      });
    } else {
      setEditingRule(null);
      setFormData({
        name: '',
        description: '',
        minTokenAmount: '',
        tokenContractAddress: '',
        chainId: '1',
        discountType: 'percentage',
        discountValue: '',
        maxDiscountAmount: '',
        usageLimit: '',
        perCustomerLimit: '',
        startsAt: '',
        endsAt: '',
      });
    }
    setModalActive(true);
  };

  const handleModalClose = () => {
    setModalActive(false);
    setEditingRule(null);
  };

  const handleSubmit = async () => {
    try {
      const url = editingRule ? `/api/discounts/${editingRule.id}` : '/api/discounts';
      const method = editingRule ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('shopifyToken')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        handleModalClose();
        fetchRules();
      }
    } catch (error) {
      console.error('Error saving rule:', error);
    }
  };

  const handleDelete = async (ruleId) => {
    if (!confirm('Are you sure you want to delete this discount rule?')) {
      return;
    }

    try {
      const response = await fetch(`/api/discounts/${ruleId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('shopifyToken')}`,
        },
      });

      if (response.ok) {
        fetchRules();
      }
    } catch (error) {
      console.error('Error deleting rule:', error);
    }
  };

  const handleToggleActive = async (rule) => {
    try {
      const response = await fetch(`/api/discounts/${rule.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('shopifyToken')}`,
        },
        body: JSON.stringify({ isActive: !rule.isActive }),
      });

      if (response.ok) {
        fetchRules();
      }
    } catch (error) {
      console.error('Error toggling rule:', error);
    }
  };

  const chainOptions = [
    { label: 'Ethereum Mainnet', value: '1' },
    { label: 'Polygon', value: '137' },
    { label: 'Binance Smart Chain', value: '56' },
  ];

  const discountTypeOptions = [
    { label: 'Percentage', value: 'percentage' },
    { label: 'Fixed Amount', value: 'fixed' },
  ];

  const rows = rules.map((rule) => [
    rule.name,
    <Badge status={rule.isActive ? 'success' : 'critical'}>
      {rule.isActive ? 'Active' : 'Inactive'}
    </Badge>,
    `${rule.minTokenAmount} DKG`,
    rule.discountType === 'percentage'
      ? `${rule.discountValue}%`
      : `$${rule.discountValue}`,
    `${rule.usageCount}${rule.usageLimit ? ` / ${rule.usageLimit}` : ''}`,
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button size="slim" onClick={() => handleModalOpen(rule)}>
        Edit
      </Button>
      <Button size="slim" onClick={() => handleToggleActive(rule)}>
        {rule.isActive ? 'Deactivate' : 'Activate'}
      </Button>
      <Button size="slim" destructive onClick={() => handleDelete(rule.id)}>
        Delete
      </Button>
    </div>,
  ]);

  return (
    <Page
      title="Discount Rules"
      primaryAction={{
        content: 'Create Rule',
        onAction: () => handleModalOpen(),
      }}
    >
      <Card>
        {rules.length === 0 ? (
          <Card.Section>
            <p>No discount rules yet. Create your first rule to get started!</p>
          </Card.Section>
        ) : (
          <DataTable
            columnContentTypes={['text', 'text', 'text', 'text', 'text', 'text']}
            headings={['Name', 'Status', 'Min Tokens', 'Discount', 'Usage', 'Actions']}
            rows={rows}
          />
        )}
      </Card>

      <Modal
        open={modalActive}
        onClose={handleModalClose}
        title={editingRule ? 'Edit Discount Rule' : 'Create Discount Rule'}
        primaryAction={{
          content: 'Save',
          onAction: handleSubmit,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: handleModalClose,
          },
        ]}
      >
        <Modal.Section>
          <FormLayout>
            <TextField
              label="Rule Name"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
              autoComplete="off"
            />

            <TextField
              label="Description (Optional)"
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              multiline={3}
              autoComplete="off"
            />

            <TextField
              label="Token Contract Address"
              value={formData.tokenContractAddress}
              onChange={(value) => setFormData({ ...formData, tokenContractAddress: value })}
              placeholder="0x..."
              autoComplete="off"
            />

            <Select
              label="Blockchain Network"
              options={chainOptions}
              value={formData.chainId}
              onChange={(value) => setFormData({ ...formData, chainId: value })}
            />

            <TextField
              label="Minimum Token Amount"
              type="number"
              value={formData.minTokenAmount}
              onChange={(value) => setFormData({ ...formData, minTokenAmount: value })}
              autoComplete="off"
            />

            <Select
              label="Discount Type"
              options={discountTypeOptions}
              value={formData.discountType}
              onChange={(value) => setFormData({ ...formData, discountType: value })}
            />

            <TextField
              label={formData.discountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount ($)'}
              type="number"
              value={formData.discountValue}
              onChange={(value) => setFormData({ ...formData, discountValue: value })}
              suffix={formData.discountType === 'percentage' ? '%' : 'USD'}
              autoComplete="off"
            />

            {formData.discountType === 'percentage' && (
              <TextField
                label="Maximum Discount Amount (Optional)"
                type="number"
                value={formData.maxDiscountAmount}
                onChange={(value) => setFormData({ ...formData, maxDiscountAmount: value })}
                prefix="$"
                helpText="Set a cap on the discount amount"
                autoComplete="off"
              />
            )}

            <TextField
              label="Total Usage Limit (Optional)"
              type="number"
              value={formData.usageLimit}
              onChange={(value) => setFormData({ ...formData, usageLimit: value })}
              helpText="Leave empty for unlimited"
              autoComplete="off"
            />

            <TextField
              label="Per Customer Limit (Optional)"
              type="number"
              value={formData.perCustomerLimit}
              onChange={(value) => setFormData({ ...formData, perCustomerLimit: value })}
              helpText="How many times each customer can use this discount"
              autoComplete="off"
            />

            <TextField
              label="Start Date (Optional)"
              type="datetime-local"
              value={formData.startsAt}
              onChange={(value) => setFormData({ ...formData, startsAt: value })}
              autoComplete="off"
            />

            <TextField
              label="End Date (Optional)"
              type="datetime-local"
              value={formData.endsAt}
              onChange={(value) => setFormData({ ...formData, endsAt: value })}
              autoComplete="off"
            />
          </FormLayout>
        </Modal.Section>
      </Modal>
    </Page>
  );
}

export default DiscountRules;

