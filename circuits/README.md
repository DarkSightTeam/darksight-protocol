# DarkSight Circuits

Zero-knowledge proof circuits for DarkSight privacy-preserving prediction markets.

## Overview

This repository contains the Circom circuit implementations for DarkSight's three core operations:
1. **Deposit Circuit**: Shielded pool deposits with Merkle tree insertion
2. **Position Update Circuit**: Private position updates and trade execution
3. **Withdrawal Circuit**: Withdrawals with nullifier proofs

## Status

⚠️ **Pre-Alpha**: These circuits are in active development. The implementations are not yet complete and have not been audited.

## Architecture

### Deposit Circuit

Handles deposits into the shielded pool with Merkle tree insertion proofs.

**Public Inputs**:
- `deposit_amount`: Visible amount entering shielded pool
- `new_root`: Updated Merkle root after insertion
- `timestamp`: Block timestamp for temporal mixing

**Private Inputs**:
- `secret`: User's private randomness
- `nullifier`: Derived from secret
- `merkle_path`: Witness for tree insertion

**Constraints**:
1. Commitment correctly formed: `C = H(amount, secret, nullifier)`
2. Merkle path valid: `verify_path(old_root, new_root, commitment, path)`
3. Range proof: `0 < amount < 2^64`
4. Temporal mixing: `timestamp ∈ [current - 6h, current]`

### Position Update Circuit

Manages private position updates and trade execution.

**Public Inputs**:
- `market_id`: Which prediction market
- `new_pool_state`: Encrypted aggregate pool state
- `price_impact`: Public price update

**Private Inputs**:
- `position_before`: Previous position commitment
- `position_after`: New position commitment
- `trade_amount`: Size and direction
- `secret_key`: For authorization

**Constraints**:
1. Valid state transition: `position_after = position_before + trade`
2. Sufficient balance: `balance_after ≥ 0`
3. Valid market: `market_id ∈ active_markets`
4. Price calculation correct per AMM formula
5. Authorization: `verify_sig(secret_key, hash(inputs))`

### Withdrawal Circuit

Processes withdrawals with nullifier proofs to prevent double-spending.

**Public Inputs**:
- `nullifier`: Prevent double-spending
- `amount`: Withdrawal amount
- `recipient`: Destination address (optionally shielded)

**Private Inputs**:
- `position`: Complete position state
- `merkle_path`: Proof of inclusion
- `secret`: Proves ownership

**Constraints**:
1. Position exists: `verify_merkle(root, position, path)`
2. Nullifier correct: `nullifier = H(secret, position)`
3. Amount valid: `amount ≤ position.balance`
4. Authorization: `verify_sig(secret, hash(inputs))`

## Setup

### Prerequisites

- Node.js 18+
- Circom 2.x
- SnarkJS

### Installation

```bash
npm install
```

### Build Circuits

```bash
npm run build
```

### Generate Proofs

```bash
npm run generate-proofs
```

### Run Tests

```bash
npm test
```

## Circuit Specifications

See [specs/](./specs/) for detailed circuit specifications matching the whitepaper.

## Test Vectors

See [test-vectors/](./test-vectors/) for comprehensive test vectors.

## Benchmarks

See [benchmarks/](./benchmarks/) for proof generation time benchmarks.

## Security

⚠️ **Warning**: These circuits have not been audited. Do not use in production.

## License

MIT License - See [LICENSE](./LICENSE) file for details.

