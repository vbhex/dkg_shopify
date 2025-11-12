(function() {
  'use strict';

  // Widget Configuration
  const WIDGET_ID = 'dkg-token-widget';
  const API_BASE_URL = 'https://group.deakee.com';

  // Widget Styles
  const widgetStyles = `
    .dkg-widget {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 8px;
      padding: 16px;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      max-width: 400px;
      margin: 20px auto;
    }

    .dkg-widget-title {
      font-size: 18px;
      font-weight: 700;
      margin: 0 0 4px 0;
    }

    .dkg-widget-subtitle {
      font-size: 13px;
      opacity: 0.9;
      margin: 0 0 12px 0;
    }

    .dkg-widget-button {
      background: white;
      color: #667eea;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      width: 100%;
    }

    .dkg-widget-button:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .dkg-widget-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .dkg-widget-status {
      margin-top: 12px;
      padding: 10px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      font-size: 13px;
    }

    .dkg-widget-discounts {
      margin-top: 12px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      padding: 12px;
    }

    .dkg-widget-discount-item {
      background: rgba(255, 255, 255, 0.2);
      padding: 10px;
      border-radius: 6px;
      margin-bottom: 10px;
    }

    .dkg-widget-discount-item:last-child {
      margin-bottom: 0;
    }

    .dkg-widget-discount-name {
      font-weight: 600;
      margin-bottom: 4px;
      font-size: 14px;
    }

    .dkg-widget-discount-value {
      font-size: 16px;
      font-weight: 700;
      color: #ffd700;
    }

    .dkg-widget-error {
      background: rgba(255, 0, 0, 0.2);
      color: white;
      padding: 10px;
      border-radius: 6px;
      margin-top: 12px;
      font-size: 13px;
    }

    .dkg-widget-success {
      background: rgba(0, 255, 0, 0.2);
      color: white;
      padding: 10px;
      border-radius: 6px;
      margin-top: 12px;
      font-size: 13px;
    }

    .dkg-widget-loader {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: dkg-spin 0.8s linear infinite;
    }

    @keyframes dkg-spin {
      to { transform: rotate(360deg); }
    }

    .dkg-wallet-info {
      background: rgba(255, 255, 255, 0.2);
      padding: 10px;
      border-radius: 6px;
      margin-top: 12px;
      font-size: 12px;
    }

    .dkg-widget-code {
      background: rgba(0, 0, 0, 0.3);
      padding: 8px 10px;
      border-radius: 6px;
      font-family: monospace;
      font-size: 13px;
      margin-top: 8px;
      word-break: break-all;
    }
  `;

  // Widget Class
  class DKGTokenWidget {
    constructor(container, shop) {
      this.container = container;
      this.shop = shop;
      this.provider = null;
      this.signer = null;
      this.walletAddress = null;
      this.sessionToken = null;
      this.eligibleDiscounts = [];

      this.init();
    }

    init() {
      // Inject styles
      this.injectStyles();

      // Render widget
      this.render();

      // Wait a bit for cart drawer to be fully rendered, then attach listeners
      setTimeout(() => {
        this.attachButtonListener();
        this.checkExistingConnection();
      }, 100);
    }

    injectStyles() {
      if (!document.getElementById('dkg-widget-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'dkg-widget-styles';
        styleSheet.textContent = widgetStyles;
        document.head.appendChild(styleSheet);
      }
    }

    render() {
      this.container.innerHTML = `
        <div class="dkg-widget">
          <h2 class="dkg-widget-title">🪙 DKG Token Holder Discounts</h2>
          <p class="dkg-widget-subtitle">Connect your wallet to unlock exclusive discounts</p>
          <button class="dkg-widget-button" id="dkg-connect-button">
            Connect Wallet
          </button>
          <div id="dkg-widget-content"></div>
        </div>
      `;
    }

    attachButtonListener() {
      const connectButton = this.container.querySelector('#dkg-connect-button');
      if (connectButton) {
        // Remove any existing listeners
        connectButton.replaceWith(connectButton.cloneNode(true));
        
        // Get the new button and attach listener
        const newButton = this.container.querySelector('#dkg-connect-button');
        if (newButton) {
          newButton.addEventListener('click', () => this.handleButtonClick());
        }
      } else {
        console.warn('DKG Widget: Connect button not found, retrying...');
        // Retry after a short delay
        setTimeout(() => this.attachButtonListener(), 50);
      }
    }

    handleButtonClick() {
      if (this.walletAddress) {
        // If already connected, disconnect
        this.disconnectWallet();
      } else {
        // If not connected, connect
        this.connectWallet();
      }
    }

    async checkExistingConnection() {
      // Check if MetaMask is already connected
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' 
          });
          
          if (accounts.length > 0) {
            this.walletAddress = accounts[0];
            this.updateButtonState('Disconnect Wallet', false);
            this.showWalletInfo();
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    }

    disconnectWallet() {
      // Reset widget state
      this.walletAddress = null;
      this.sessionToken = null;
      this.eligibleDiscounts = [];
      
      // Clear content
      const contentDiv = this.container.querySelector('#dkg-widget-content');
      if (contentDiv) {
        contentDiv.innerHTML = '';
      }
      
      // Update button
      this.updateButtonState('Connect Wallet', false);
    }

    showWalletInfo() {
      const contentDiv = this.container.querySelector('#dkg-widget-content');
      if (contentDiv) {
        contentDiv.innerHTML = `
          <div class="dkg-wallet-info">
            Connected: ${this.formatAddress(this.walletAddress)}<br>
            <span style="font-size: 11px; opacity: 0.8;">Click "Disconnect Wallet" above or verify your tokens to see discounts</span>
          </div>
        `;
      }
    }

    async connectWallet() {
      try {
        // Check if MetaMask is installed
        if (typeof window.ethereum === 'undefined') {
          this.showError('Please install MetaMask to continue');
          window.open('https://metamask.io/download/', '_blank');
          return;
        }

        this.updateButtonState('Connecting...', true);

        // Request account access
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        this.walletAddress = accounts[0];
        
        // Get chain ID
        const chainId = await window.ethereum.request({
          method: 'eth_chainId',
        });

        this.updateButtonState('Verifying...', true);

        // Start verification process
        await this.verifyTokenOwnership(parseInt(chainId, 16));

      } catch (error) {
        console.error('Error connecting wallet:', error);
        this.showError(error.message || 'Failed to connect wallet');
        this.updateButtonState('Connect Wallet', false);
      }
    }

    async verifyTokenOwnership(chainId) {
      try {
        // Step 1: Initialize verification session
        const initResponse = await fetch(`${API_BASE_URL}/api/verify/init`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            shop: this.shop,
            walletAddress: this.walletAddress,
            chainId,
          }),
        });

        const initData = await initResponse.json();
        
        if (!initResponse.ok) {
          throw new Error(initData.error || 'Failed to initialize verification');
        }

        this.sessionToken = initData.sessionToken;

        // Step 2: Request signature from user
        this.updateButtonState('Please sign message...', true);
        
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [initData.message, this.walletAddress],
        });

        // Step 3: Verify signature
        this.updateButtonState('Verifying signature...', true);

        const verifyResponse = await fetch(`${API_BASE_URL}/api/verify/signature`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionToken: this.sessionToken,
            signature,
          }),
        });

        const verifyData = await verifyResponse.json();

        if (!verifyResponse.ok) {
          throw new Error(verifyData.error || 'Signature verification failed');
        }

        // Step 4: Check token balance and eligible discounts
        this.updateButtonState('Checking token balance...', true);

        const balanceResponse = await fetch(`${API_BASE_URL}/api/verify/token-balance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            shop: this.shop,
            walletAddress: this.walletAddress,
            sessionToken: this.sessionToken,
          }),
        });

        const balanceData = await balanceResponse.json();

        if (!balanceResponse.ok) {
          throw new Error(balanceData.error || 'Failed to check token balance');
        }

        this.eligibleDiscounts = balanceData.eligibleDiscounts || [];

        // Show results
        this.showResults();

      } catch (error) {
        console.error('Error verifying token ownership:', error);
        this.showError(error.message || 'Verification failed');
        this.updateButtonState('Connect Wallet', false);
      }
    }

    showResults() {
      const contentDiv = document.getElementById('dkg-widget-content');
      
      if (this.eligibleDiscounts.length === 0) {
        contentDiv.innerHTML = `
          <div class="dkg-widget-status">
            <strong>✓ Wallet Verified</strong><br>
            Unfortunately, you don't have enough DKG tokens for any discounts.
          </div>
          <div class="dkg-wallet-info">
            Connected: ${this.formatAddress(this.walletAddress)}
          </div>
        `;
        this.updateButtonState('Disconnect Wallet', false);
        return;
      }

      // Show eligible discounts
      let discountsHTML = '<div class="dkg-widget-discounts">';
      discountsHTML += '<strong>🎉 You\'re eligible for these discounts:</strong><br><br>';
      
      this.eligibleDiscounts.forEach((discount, index) => {
        const discountDisplay = discount.discountType === 'percentage' 
          ? `${discount.discountValue}% OFF`
          : `$${discount.discountValue} OFF`;
        
        discountsHTML += `
          <div class="dkg-widget-discount-item">
            <div class="dkg-widget-discount-name">${discount.name}</div>
            <div class="dkg-widget-discount-value">${discountDisplay}</div>
            ${discount.description ? `<div style="margin-top: 4px; font-size: 12px; opacity: 0.9;">${discount.description}</div>` : ''}
            <button 
              class="dkg-widget-button" 
              style="margin-top: 8px; padding: 8px 16px; font-size: 14px;"
              onclick="window.dkgWidget.applyDiscount('${discount.id}')"
            >
              Apply This Discount
            </button>
          </div>
        `;
      });
      
      discountsHTML += '</div>';
      
      contentDiv.innerHTML = `
        <div class="dkg-widget-success">
          <strong>✓ Verification Successful!</strong><br>
          Your wallet has been verified and you have ${this.eligibleDiscounts.length} discount(s) available.
        </div>
        ${discountsHTML}
        <div class="dkg-wallet-info">
          Connected: ${this.formatAddress(this.walletAddress)}
        </div>
      `;

      this.updateButtonState('Disconnect Wallet', false);
    }

    async applyDiscount(discountRuleId) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/apply-discount`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            shop: this.shop,
            discountRuleId,
            walletAddress: this.walletAddress,
            sessionToken: this.sessionToken,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to apply discount');
        }

        // Show discount code
        this.showDiscountCode(data.discountCode, data.discountRule);

      } catch (error) {
        console.error('Error applying discount:', error);
        alert(error.message || 'Failed to apply discount');
      }
    }

    showDiscountCode(code, rule) {
      const contentDiv = this.container.querySelector('#dkg-widget-content');
      if (!contentDiv) return;
      
      contentDiv.innerHTML = `
        <div class="dkg-widget-success">
          <strong>🎉 Discount Applied!</strong><br>
          Use this code at checkout:
          <div class="dkg-widget-code">${code}</div>
          <button 
            class="dkg-widget-button" 
            style="margin-top: 12px; padding: 8px 16px; font-size: 14px;"
            onclick="navigator.clipboard.writeText('${code}').then(() => alert('Discount code copied!'))"
          >
            Copy Code
          </button>
        </div>
        <div class="dkg-wallet-info">
          Discount: ${rule.discountType === 'percentage' ? `${rule.discountValue}%` : `$${rule.discountValue}`} OFF
        </div>
      `;
    }

    showError(message) {
      const contentDiv = this.container.querySelector('#dkg-widget-content');
      if (!contentDiv) return;
      
      contentDiv.innerHTML = `
        <div class="dkg-widget-error">
          ⚠️ ${message}
        </div>
      `;
    }

    updateButtonState(text, disabled) {
      const button = this.container.querySelector('#dkg-connect-button');
      if (button) {
        button.textContent = text;
        button.disabled = disabled;
      }
    }

    formatAddress(address) {
      return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }
  }

  // Track initialized widgets to avoid duplicates
  const initializedWidgets = new WeakSet();

  // Initialize widget on page load
  function initializeWidget() {
    const widgets = document.querySelectorAll(`#${WIDGET_ID}`);
    
    widgets.forEach(widget => {
      // Skip if already initialized
      if (initializedWidgets.has(widget)) {
        return;
      }

      const shop = widget.getAttribute('data-shop');
      
      if (!shop) {
        console.error('DKG Widget: data-shop attribute is required');
        return;
      }

      // Mark as initialized
      initializedWidgets.add(widget);
      
      // Create widget instance
      new DKGTokenWidget(widget, shop);
    });
  }

  // Watch for dynamically added cart drawer content
  function observeCartDrawer() {
    const observer = new MutationObserver((mutations) => {
      // Check if any cart drawer or cart summary elements were added
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          // Look for widget elements in the added nodes
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Check if the node itself is the widget
              if (node.id === WIDGET_ID) {
                initializeWidget();
              }
              // Check if the node contains the widget
              else if (node.querySelector && node.querySelector(`#${WIDGET_ID}`)) {
                initializeWidget();
              }
            }
          });
        }
      }
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return observer;
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initializeWidget();
      observeCartDrawer();
    });
  } else {
    initializeWidget();
    observeCartDrawer();
  }

  // Also expose for manual initialization
  window.DKGTokenWidget = DKGTokenWidget;
  window.initializeDKGWidget = initializeWidget;

})();

