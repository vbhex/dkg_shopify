# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added
- Initial release of DKG Shopify App
- Token-gated discount system for Shopify stores
- Support for Ethereum, Polygon, and Binance Smart Chain
- Wallet verification using MetaMask
- Admin dashboard for managing discount rules
- Customer-facing storefront widget
- Flexible discount configuration (percentage or fixed amount)
- Usage limits (total and per-customer)
- Time-based discount validity
- Database schema with Prisma
- Complete API documentation
- Deployment guides for Railway, Heroku, and VPS
- Comprehensive README and setup guide

### Features
- **Discount Management**
  - Create unlimited discount rules
  - Set minimum token requirements
  - Configure percentage or fixed discounts
  - Set maximum discount caps
  - Usage limits and per-customer limits
  - Date range restrictions

- **Wallet Verification**
  - Secure Web3 wallet verification
  - No gas fees for customers
  - Support for multiple blockchain networks
  - Session-based verification (15-minute validity)

- **Admin Dashboard**
  - View all discount rules
  - Create, edit, delete rules
  - Track usage statistics
  - Monitor verified customers
  - Real-time analytics

- **Storefront Widget**
  - Beautiful, responsive UI
  - Easy integration (one-line code snippet)
  - MetaMask integration
  - Automatic discount eligibility checking
  - Copy discount code functionality

- **Developer Experience**
  - Complete API documentation
  - Setup guides for development and production
  - Support for multiple deployment platforms
  - Environment-based configuration
  - Database migrations with Prisma

### Technical Details
- Node.js 18+ backend with Express
- React frontend with Shopify Polaris
- Ethers.js for blockchain interactions
- SQLite for development, PostgreSQL for production
- Prisma ORM for database management
- Shopify App Bridge integration

### Documentation
- README.md with comprehensive overview
- SETUP.md with step-by-step setup instructions
- DEPLOYMENT.md with multiple deployment options
- API.md with complete API reference
- TOKEN_CONTRACT.md with contract requirements
- CONTRIBUTING.md with contribution guidelines

### Security
- Read-only blockchain operations
- No transaction signing required
- Secure session management
- Environment-based secrets
- HTTPS required for production

## [Unreleased]

### Planned Features
- [ ] Direct Shopify discount code creation via API
- [ ] Support for more blockchain networks (Arbitrum, Optimism, etc.)
- [ ] Advanced analytics dashboard
- [ ] A/B testing for discount strategies
- [ ] Multi-token support (check multiple tokens)
- [ ] NFT-gated discounts
- [ ] Tiered discounts based on token amount
- [ ] Integration with loyalty programs
- [ ] Email notifications for merchants
- [ ] Customer dashboard for tracking discount usage
- [ ] Export functionality for reports
- [ ] Webhook for order tracking
- [ ] Rate limiting implementation
- [ ] Redis caching for token balances
- [ ] TypeScript migration
- [ ] Comprehensive test suite
- [ ] Mobile app version
- [ ] Multi-language support

### Known Issues
- Discount codes must be manually created in Shopify (automatic creation coming soon)
- Widget styling limited to embedded options
- No bulk import/export of discount rules
- Analytics limited to basic statistics

---

## Version History

### Version Numbering

- **Major.Minor.Patch** (e.g., 1.0.0)
- **Major**: Breaking changes
- **Minor**: New features, backwards compatible
- **Patch**: Bug fixes

### Release Schedule

- **Patch releases**: As needed for critical bugs
- **Minor releases**: Monthly for new features
- **Major releases**: Quarterly or when breaking changes needed

---

For more information, see the [README](README.md) or visit our [documentation](https://docs.deakeegroup.com).

