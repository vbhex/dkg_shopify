# Contributing to DKG Shopify App

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, Node version, etc.)

### Suggesting Features

1. Check if the feature has already been suggested
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
6. Push to your fork
7. Open a Pull Request

## Development Setup

```bash
# Fork and clone the repo
git clone https://github.com/your-username/dkg_shopify.git
cd dkg_shopify

# Install dependencies
npm install
cd client && npm install && cd ..

# Create .env file
cp .env.example .env
# Fill in your values

# Start development
npm run dev
```

## Coding Standards

### JavaScript/Node.js

- Use ES6+ features
- Use `const` and `let`, never `var`
- Use async/await instead of callbacks
- Follow existing code style
- Add comments for complex logic
- Use meaningful variable names

### React

- Use functional components with hooks
- Keep components small and focused
- Use prop-types or TypeScript for type checking
- Follow Shopify Polaris component patterns

### Database

- Use Prisma for all database operations
- Always use transactions for multiple operations
- Add indexes for frequently queried fields
- Include proper error handling

### API Design

- Use RESTful conventions
- Return appropriate HTTP status codes
- Include error messages in responses
- Document all endpoints

## Testing

### Before Submitting PR

- [ ] All existing tests pass
- [ ] New code has tests
- [ ] Manual testing completed
- [ ] No console errors
- [ ] Works in development environment
- [ ] Database migrations work

### Testing Checklist

```bash
# Run linter
npm run lint

# Run tests (when implemented)
npm test

# Build production
npm run client:build

# Test production build
NODE_ENV=production npm start
```

## Commit Message Guidelines

Format: `<type>: <subject>`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat: add support for multiple discount codes
fix: wallet verification fails on Polygon
docs: update deployment guide
refactor: optimize token balance checking
```

## Pull Request Process

1. Update README.md if needed
2. Update documentation for API changes
3. Add tests for new features
4. Ensure all tests pass
5. Request review from maintainers
6. Address review feedback
7. Wait for approval and merge

## Project Structure

```
dkg_shopify/
├── server/          # Backend code
├── client/          # Frontend code
├── prisma/          # Database schema
├── storefront/      # Customer widget
├── docs/            # Documentation
└── tests/           # Test files
```

## Key Areas for Contribution

### High Priority

- [ ] Add comprehensive test coverage
- [ ] Implement discount code generation in Shopify
- [ ] Add support for more blockchain networks
- [ ] Improve error handling
- [ ] Add more analytics features

### Medium Priority

- [ ] Add TypeScript support
- [ ] Implement caching for token balances
- [ ] Add more discount rule options
- [ ] Improve widget customization
- [ ] Add multi-language support

### Nice to Have

- [ ] GraphQL API option
- [ ] Mobile app
- [ ] Advanced analytics dashboard
- [ ] A/B testing for discounts
- [ ] Integration with other e-commerce platforms

## Documentation

When adding features:
- Update API.md for API changes
- Update README.md for user-facing changes
- Add inline code comments
- Update SETUP.md if setup process changes

## Questions?

- Open an issue for questions
- Check existing issues and PRs
- Review documentation
- Contact maintainers

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for making DKG Shopify App better! 🎉

