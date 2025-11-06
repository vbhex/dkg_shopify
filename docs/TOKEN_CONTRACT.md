# DKG Token Contract Interface

This file documents the expected DKG token contract interface.

## ERC-20 Standard Interface

The DKG token must implement the standard ERC-20 interface:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    /**
     * @dev Returns the name of the token.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the symbol of the token.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the number of decimals used for token amounts.
     */
    function decimals() external view returns (uint8);

    /**
     * @dev Returns the total supply of tokens.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the token balance of `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Transfers `amount` tokens from caller to `recipient`.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns remaining tokens that `spender` can transfer from `owner`.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Approves `spender` to transfer `amount` tokens from caller.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Transfers `amount` tokens from `sender` to `recipient` using allowance.
     */
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}
```

## Required Functions for This App

The app only uses **read-only** functions and does **NOT** require any transactions:

### 1. balanceOf(address)
Returns the token balance of a wallet address.

**Usage**: Check if user has minimum required tokens.

```javascript
const balance = await tokenContract.balanceOf(walletAddress);
```

### 2. decimals()
Returns the number of decimal places for the token.

**Usage**: Convert raw balance to human-readable format.

```javascript
const decimals = await tokenContract.decimals();
const formattedBalance = balance / (10 ** decimals);
```

### 3. symbol() (Optional)
Returns the token symbol (e.g., "DKG").

**Usage**: Display token information in UI.

```javascript
const symbol = await tokenContract.symbol();
```

### 4. name() (Optional)
Returns the full token name.

**Usage**: Display token information in UI.

```javascript
const name = await tokenContract.name();
```

## Deployment Requirements

### Supported Networks

The app supports DKG token on:

1. **Ethereum Mainnet** (Chain ID: 1)
   - Most common and secure
   - Higher gas fees
   
2. **Polygon** (Chain ID: 137)
   - Lower gas fees
   - Fast transactions
   
3. **Binance Smart Chain** (Chain ID: 56)
   - Low gas fees
   - High throughput

### Contract Verification

Before using the contract address:

1. Verify contract is deployed on target network
2. Check contract on block explorer:
   - Ethereum: https://etherscan.io/
   - Polygon: https://polygonscan.com/
   - BSC: https://bscscan.com/

3. Confirm contract implements ERC-20 standard
4. Test `balanceOf()` and `decimals()` functions work

## Testing Token Balance

### Using Ethers.js (as in the app):

```javascript
import { ethers } from 'ethers';

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

// Connect to provider
const provider = new ethers.JsonRpcProvider('YOUR_RPC_URL');

// Create contract instance
const tokenContract = new ethers.Contract(
  'TOKEN_CONTRACT_ADDRESS',
  ERC20_ABI,
  provider
);

// Get balance
const walletAddress = '0x...';
const balance = await tokenContract.balanceOf(walletAddress);
const decimals = await tokenContract.decimals();

// Format balance
const formattedBalance = ethers.formatUnits(balance, decimals);
console.log(`Balance: ${formattedBalance} DKG`);
```

### Using Web3.js:

```javascript
const Web3 = require('web3');
const web3 = new Web3('YOUR_RPC_URL');

const contract = new web3.eth.Contract(ERC20_ABI, 'TOKEN_CONTRACT_ADDRESS');

const balance = await contract.methods.balanceOf(walletAddress).call();
const decimals = await contract.methods.decimals().call();
const formattedBalance = balance / (10 ** decimals);
```

## Common Token Configurations

### Typical ERC-20 Token

```
Name: DeakeeGroup Token
Symbol: DKG
Decimals: 18
Total Supply: 1,000,000,000 (1 billion)
```

### Minimum Balance Examples

For discount rules, typical minimum balances:

- **100 DKG** = `100000000000000000000` (in wei, if 18 decimals)
- **1,000 DKG** = `1000000000000000000000`
- **10,000 DKG** = `10000000000000000000000`

The app handles conversion automatically.

## Security Considerations

1. **Read-Only Operations**: App only reads balances, never writes
2. **No Gas Fees**: Users never pay gas for verification
3. **No Approvals**: App never requests token approvals
4. **No Transactions**: All operations are view/pure functions

## Troubleshooting

### "Contract not found" Error

**Cause**: Wrong contract address or wrong network

**Solution**:
- Verify contract address is correct
- Check you're connected to correct network
- Verify contract is deployed

### Balance Returns 0

**Cause**: Wallet doesn't have tokens or wrong network

**Solution**:
- Verify wallet address is correct
- Check wallet on block explorer
- Ensure you're on correct network

### "Invalid decimals" Error

**Cause**: Contract doesn't implement decimals() function

**Solution**:
- Verify contract implements full ERC-20 standard
- Check contract on block explorer
- Contact token developer

## Integration Checklist

Before going live:

- [ ] DKG token contract deployed and verified
- [ ] Contract address added to `.env`
- [ ] Correct network/chain ID configured
- [ ] RPC endpoint tested and working
- [ ] Test wallet with tokens available for testing
- [ ] Balance checking tested with real wallet
- [ ] Decimal conversion verified
- [ ] Multiple wallet addresses tested
- [ ] Edge cases tested (0 balance, high balance)

## Example DKG Token Contract

If you need to deploy a test token for development:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DeakeeGroupToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("DeakeeGroup Token", "DKG") {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }
}
```

Deploy with initial supply of 1 billion:
```javascript
const initialSupply = 1000000000; // 1 billion
await deploy("DeakeeGroupToken", [initialSupply]);
```

---

**Need Help?**
- Check Etherscan for contract details
- Test on testnet first (Goerli, Mumbai, BSC Testnet)
- Verify with small amounts before production

