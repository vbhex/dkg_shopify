import { ethers } from 'ethers';

// ERC-20 Token ABI (minimal interface for balance checking)
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
];

class BlockchainService {
  constructor() {
    this.providers = {
      1: new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL), // Ethereum Mainnet
      137: new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL), // Polygon
      56: new ethers.JsonRpcProvider(process.env.BSC_RPC_URL), // BSC
    };
  }

  /**
   * Get provider for specific chain
   */
  getProvider(chainId) {
    const provider = this.providers[chainId];
    if (!provider) {
      throw new Error(`Unsupported chain ID: ${chainId}`);
    }
    return provider;
  }

  /**
   * Verify wallet address format
   */
  isValidAddress(address) {
    return ethers.isAddress(address);
  }

  /**
   * Get token balance for a wallet address
   */
  async getTokenBalance(walletAddress, tokenContractAddress, chainId = 1) {
    try {
      if (!this.isValidAddress(walletAddress)) {
        throw new Error('Invalid wallet address');
      }

      if (!this.isValidAddress(tokenContractAddress)) {
        throw new Error('Invalid token contract address');
      }

      const provider = this.getProvider(chainId);
      const tokenContract = new ethers.Contract(
        tokenContractAddress,
        ERC20_ABI,
        provider
      );

      // Get balance and decimals
      const [balance, decimals] = await Promise.all([
        tokenContract.balanceOf(walletAddress),
        tokenContract.decimals(),
      ]);

      // Convert balance to human-readable format
      const formattedBalance = ethers.formatUnits(balance, decimals);

      return {
        balance: balance.toString(),
        formattedBalance,
        decimals: Number(decimals),
      };
    } catch (error) {
      console.error('Error getting token balance:', error);
      throw new Error(`Failed to get token balance: ${error.message}`);
    }
  }

  /**
   * Get token information
   */
  async getTokenInfo(tokenContractAddress, chainId = 1) {
    try {
      if (!this.isValidAddress(tokenContractAddress)) {
        throw new Error('Invalid token contract address');
      }

      const provider = this.getProvider(chainId);
      const tokenContract = new ethers.Contract(
        tokenContractAddress,
        ERC20_ABI,
        provider
      );

      const [name, symbol, decimals] = await Promise.all([
        tokenContract.name(),
        tokenContract.symbol(),
        tokenContract.decimals(),
      ]);

      return {
        name,
        symbol,
        decimals: Number(decimals),
        address: tokenContractAddress,
        chainId,
      };
    } catch (error) {
      console.error('Error getting token info:', error);
      throw new Error(`Failed to get token info: ${error.message}`);
    }
  }

  /**
   * Verify if wallet has minimum required tokens
   */
  async verifyTokenOwnership(walletAddress, tokenContractAddress, minAmount, chainId = 1) {
    try {
      const { balance, formattedBalance, decimals } = await this.getTokenBalance(
        walletAddress,
        tokenContractAddress,
        chainId
      );

      // Compare with minimum required amount
      const balanceBigInt = BigInt(balance);
      const minAmountBigInt = BigInt(ethers.parseUnits(minAmount.toString(), decimals));

      const hasEnoughTokens = balanceBigInt >= minAmountBigInt;

      return {
        hasEnoughTokens,
        balance: formattedBalance,
        required: minAmount.toString(),
        chainId,
      };
    } catch (error) {
      console.error('Error verifying token ownership:', error);
      throw new Error(`Failed to verify token ownership: ${error.message}`);
    }
  }

  /**
   * Verify message signature (for Web3 authentication)
   */
  verifySignature(message, signature, expectedAddress) {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
    } catch (error) {
      console.error('Error verifying signature:', error);
      return false;
    }
  }

  /**
   * Generate a verification message for wallet signature
   */
  generateVerificationMessage(shopDomain, nonce) {
    return `Sign this message to verify your wallet ownership for ${shopDomain}.\n\nNonce: ${nonce}\n\nThis will not trigger any blockchain transaction or cost any gas fees.`;
  }
}

export default new BlockchainService();

