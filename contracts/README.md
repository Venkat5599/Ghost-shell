# Ghost Shell Smart Contracts - 攻殻機動隊

On-chain security registry and pre-transaction guard for DeFi applications.

## Contracts

### GhostShellRegistry
Central registry for storing security manifests on-chain.

**Features:**
- Store security audit results
- Risk scoring (0-100)
- IPFS integration for full reports
- Auditor authorization system
- Manifest invalidation

### GhostShellGuard
Abstract contract that adds automatic security checks to your contracts.

**Features:**
- Pre-transaction risk checks
- Automatic blocking of critical-risk interactions
- Risk warnings for medium-risk contracts
- Easy integration via inheritance

### SecureVault (Example)
Example vault demonstrating Ghost Shell integration.

## Installation

```bash
npm install
```

## Compile

```bash
npm run compile
```

## Test

```bash
npm run test
```

## Deploy

### Local (Hardhat)
```bash
npm run deploy
```

### HashKey Testnet
```bash
npm run deploy:testnet
```

## Usage Example

### 1. Deploy Registry
```typescript
const registry = await GhostShellRegistry.deploy();
```

### 2. Authorize Backend Auditor
```typescript
await registry.authorizeAuditor(backendAddress);
```

### 3. Integrate in Your Contract
```solidity
contract MyVault is GhostShellGuard {
    constructor(address _registry) GhostShellGuard(_registry) {}
    
    function deposit(address token, uint256 amount) 
        external 
        ghostShellProtected(token) // Automatic security check!
    {
        // Your logic here
    }
}
```

### 4. Register Manifests (Backend)
```typescript
await registry.registerManifest(
    manifestId,
    contractAddress,
    riskScore,
    riskLevel,
    ipfsHash
);
```

## Architecture

```
┌─────────────────────────────────────────┐
│         Ghost Shell Backend             │
│    (Scans & Generates Manifests)        │
└──────────────┬──────────────────────────┘
               │
               │ registerManifest()
               ▼
┌─────────────────────────────────────────┐
│      GhostShellRegistry (On-Chain)      │
│   - Stores security manifests           │
│   - Manages auditor permissions         │
│   - Provides safety checks              │
└──────────────┬──────────────────────────┘
               │
               │ checkSecurity()
               ▼
┌─────────────────────────────────────────┐
│      Your DeFi Contract                 │
│   + GhostShellGuard                     │
│   - Automatic pre-transaction checks    │
│   - Blocks critical-risk interactions   │
└─────────────────────────────────────────┘
```

## Security Features

✅ **Pre-Transaction Blocking** - Stops users before they interact with risky contracts
✅ **On-Chain Transparency** - All security data stored on-chain
✅ **IPFS Integration** - Full audit reports stored on IPFS
✅ **Auditor Authorization** - Only authorized auditors can register manifests
✅ **Manifest Invalidation** - Ability to revoke incorrect audits
✅ **ReentrancyGuard** - Built-in reentrancy protection

## Risk Levels

- **SAFE (0-30)**: Low risk, safe to interact
- **WARNING (31-70)**: Medium risk, proceed with caution
- **CRITICAL (71-100)**: High risk, transaction blocked

## Integration Guide

### Step 1: Inherit GhostShellGuard
```solidity
import "./GhostShellGuard.sol";

contract MyContract is GhostShellGuard {
    constructor(address _registry) GhostShellGuard(_registry) {}
}
```

### Step 2: Add Protection Modifier
```solidity
function interactWithExternal(address target) 
    external 
    ghostShellProtected(target) // Add this!
{
    // Your logic
}
```

### Step 3: Deploy with Registry Address
```typescript
const myContract = await MyContract.deploy(registryAddress);
```

That's it! Your contract now has automatic security checks.

## Testing

Run the test suite:
```bash
npm run test
```

Expected output:
```
  GhostShellRegistry
    ✓ Should set the right owner
    ✓ Should authorize owner as auditor
    ✓ Should allow owner to authorize auditor
    ✓ Should allow authorized auditor to register manifest
    ✓ Should return true for safe contracts
    ✓ Should return false for critical contracts
```

## License

MIT
