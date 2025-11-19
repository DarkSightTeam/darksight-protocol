# DarkSight SDK

> **⚠️ Status: Pre-Alpha SDK Design**  
> The DarkSight SDK described below has not yet been released. Package names, method signatures, and costs are subject to change as implementation progresses. This documentation represents the planned API and architecture based on our technical whitepaper.

TypeScript/JavaScript SDK for building privacy-preserving prediction markets on Solana using zero-knowledge proofs.

## Installation

The DarkSight SDK will be published to npm as `@darksight/sdk` once the public testnet is live. The API below describes the planned interface.

```bash
npm install @darksight/sdk
# Coming soon
```

## Quick Start

Once released, you will initialize the SDK with your Solana wallet connection:

```typescript
import { DarkSightSDK } from '@darksight/sdk';
import { Connection, Wallet } from '@solana/web3.js';

const connection = new Connection('https://api.mainnet-beta.solana.com');
const wallet = new Wallet(/* your wallet */);

const sdk = new DarkSightSDK({
  connection,
  wallet,
  network: 'mainnet-beta'
});

await sdk.initialize();
```

## Features

- 🔒 **Private Positions**: Trade without revealing your positions
- ⚡ **ZK Proofs**: Client-side proof generation using WebAssembly
- 🌊 **Temporal Mixing**: Automatic batching with randomized delays
- 💰 **Low Costs**: ~$0.01 per trade via ZK Compression
- 📊 **Market Creation**: Create and manage prediction markets
- 🔐 **Shielded Pool**: Deposit and withdraw funds privately

## Core API

### Initialization

```typescript
const sdk = new DarkSightSDK({
  connection: Connection,
  wallet: Wallet,
  network: 'mainnet-beta' | 'devnet' | 'testnet',
  proofConfig?: {
    wasmPath?: string;
    timeout?: number;
    useWorker?: boolean;
  }
});

await sdk.initialize();
```

### Depositing Funds

```typescript
const deposit = await sdk.deposit(1000); // 1000 SOL
console.log('Deposited:', deposit.amount);
```

### Creating Markets

```typescript
const market = await sdk.createMarket({
  question: 'Will Bitcoin reach $100K by end of 2025?',
  outcomes: ['Yes', 'No'],
  resolutionDate: new Date('2025-12-31'),
  initialLiquidity: 10000
});
```

### Trading

```typescript
const position = await sdk.createPosition({
  marketId: market.id,
  outcome: 'Yes',
  amount: 500
});
```

### Withdrawing

```typescript
const withdraw = await sdk.withdraw({
  amount: 750,
  recipient: wallet.publicKey
});
```

## Architecture

The SDK consists of:

- **Core SDK**: Main `DarkSightSDK` class
- **Circuits**: ZK proof generation (WASM)
- **Merkle Tree**: Sparse Merkle tree implementation
- **Commitments**: Pedersen commitment utilities
- **Types**: TypeScript type definitions

## Development Status

This SDK is currently in pre-alpha development. The API is subject to change.

## Documentation

- [Full API Reference](./docs/API.md)
- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Examples](./examples/)

## License

MIT License - See [LICENSE](./LICENSE) file for details.

