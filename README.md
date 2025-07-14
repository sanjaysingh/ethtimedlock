# TimedLocker - Lock ETH with Time Delays ⏰

Lock Ethereum for yourself or others with customizable time delays. Deploy the same contract address across multiple networks.

## What It Does

**Lock ETH** → **Wait for Timer** → **Withdraw When Ready**

- 🔒 **Lock ETH** for any address with a future unlock time
- 👥 **Designated Lockers** - control who can lock funds for you (prevents spam)
- ⏰ **Time-Based Release** - funds unlock automatically after the timer
- 🌐 **Multi-Chain** - same contract address on Ethereum, Base, Optimism, Arbitrum
- 🛡️ **Secure** - uses OpenZeppelin's reentrancy protection

## Quick Demo

🌐 **Try it live:** [ethtimedlock.github.io](https://ethtimedlock.github.io) *(connects to your MetaMask)*

## Project Structure

```
📁 app/          - Web interface (Vue.js + MetaMask)
📁 backend/      - Smart contracts (Solidity + Hardhat)
```

---

## 🌐 Web App (`app/`)

Simple web interface to interact with the deployed contracts.

### Features
- **Connect MetaMask** - works with any supported network
- **Manage Lockers** - add/remove who can lock funds for you  
- **Lock ETH** - set beneficiary and unlock time
- **View Locks** - see all your locked funds
- **Withdraw** - claim eligible unlocked funds

### Usage
1. Open `app/index.html` in your browser
2. Connect MetaMask to supported network
3. Update contract address if needed (in `app.js`)

### Supported Networks
- Ethereum Mainnet
- Base
- Optimism  
- Arbitrum One
- Sepolia Testnet

*Note: Currently uses TimedLockerV4 ABI - update to V5 ABI after deployment*

---

## ⚡ Smart Contract (`backend/`)

Solidity contracts with multi-chain deployment using CREATE2.

### Quick Start

```bash
cd backend
npm install
npm run setup          # Generate secure environment
```

Edit `.env` with your private key:
```bash
PRIVATE_KEY=your_private_key_here
```

### Deploy

```bash
# Test on Sepolia first
npm run deploy:sepolia

# Deploy to mainnets (same address everywhere!)
npm run deploy:ethereum
npm run deploy:base
npm run deploy:optimism  
npm run deploy:arbitrum
```

### Key Features

**CREATE2 Deployment** = Same address on all networks
- Preview address: `npm run preview:ethereum`
- Same salt = same address everywhere
- No nonce dependency

**Contract Functions:**
- `deposit(beneficiary, unlockTime)` - Lock ETH
- `withdraw()` - Get your unlocked funds
- `addDesignatedLocker(address)` - Allow someone to lock for you
- `removeDesignatedLocker(address)` - Remove permission

### Development Commands

```bash
npm run compile        # Build contracts  
npm run test          # Run tests
npm run manual-verify # Generate files for manual verification

# Preview addresses
npm run preview:ethereum
npm run preview:base
npm run preview:optimism
npm run preview:arbitrum

# Deploy contracts
npm run deploy:ethereum
npm run deploy:base  
npm run deploy:optimism
npm run deploy:arbitrum

# Verify contracts (separate step)
npm run verify:ethereum
npm run verify:base
npm run verify:optimism
npm run verify:arbitrum
```

## 🔧 Configuration

### Environment Setup
The setup script generates a secure random salt:
```bash
npm run setup
```

**⚠️ Keep your salt private!** Anyone with it can predict your contract addresses.

### API Keys (Optional)
Add to `.env` for automatic verification:
```bash
ETHERSCAN_API_KEY=xxx    # Ethereum & Sepolia  
BASESCAN_API_KEY=xxx     # Base
OPTIMISMSCAN_API_KEY=xxx # Optimism
ARBISCAN_API_KEY=xxx     # Arbitrum
```

### Manual Verification
Generate files for manual block explorer verification:
```bash
npm run manual-verify
```
Creates flattened contract + verification details in `verification/` folder.

## 🌐 Networks

| Network | Chain ID | Explorer |
|---------|----------|----------|
| Ethereum | 1 | etherscan.io |
| Base | 8453 | basescan.org |
| Optimism | 10 | optimistic.etherscan.io |
| Arbitrum | 42161 | arbiscan.io |
| Sepolia | 11155111 | sepolia.etherscan.io |

*RPC URLs and full config in `backend/hardhat.config.js`*

## 🔒 Security

- **Reentrancy Protection** - OpenZeppelin ReentrancyGuard
- **Designated Lockers** - prevents spam deposits
- **Future Timestamps** - unlock time must be in future
- **Solidity 0.8+** - built-in overflow protection

## 💡 Usage Example

```solidity
// Someone locks 1 ETH for you, unlockable in 1 hour
contract.deposit{value: 1 ether}(yourAddress, block.timestamp + 3600);

// After 1 hour, you can withdraw
contract.withdraw(); // Gets your 1 ETH
```

## 🐛 Troubleshooting

**"Insufficient funds"** → Need ETH for gas fees  
**"Contract already deployed"** → Use different salt or verify existing  
**"Invalid private key"** → Remove 0x prefix, check `.env`  
**"Network connection failed"** → Check RPC in `hardhat.config.js`

**Get test ETH:** Search "Sepolia faucet"

## 📝 License

MIT
