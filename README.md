# DarkSight Protocol

> **Privacy-Preserving Prediction Market Infrastructure on Solana**

DarkSight is a protocol for private prediction markets, enabling institutional capital to participate in price discovery without revealing positions or strategies. It utilizes **Groth16 Zero-Knowledge Proofs** and **Light Protocol's ZK Compression** to achieve privacy and scalability on Solana.

## Repository Structure

This monorepo contains the core components of the DarkSight protocol:

### 1. [Circuits](./circuits) (`/circuits`)
**Status: Pre-Alpha Logic**
Core Zero-Knowledge constraints implemented in Circom.
- **Deposit Circuit**: Shielded pool deposits with Merkle tree insertion.
- **Position Update**: AMM invariant ($x \cdot y = k$) checks and balance enforcement.
- **Withdrawal**: Nullifier generation and Merkle inclusion proofs.

### 2. [SDK](./sdk) (`/sdk`)
**Status: Functional Simulation**
TypeScript SDK for client-side interaction.
- **Cryptography**: Client-side Pedersen commitments and nullifier generation (Baby JubJub).
- **State Management**: Local Sparse Merkle Tree for witness generation.
- **API**: Full deposit, trade, and withdraw flow simulation.

### 3. [Research](./research) (`/research`)
**Status: Validated**
Formal proofs and empirical simulations.
- **Privacy Guarantees**: Formal bounds on linkability ($P_{link} \le \frac{1}{k(1+\rho)} + \epsilon$).
- **Simulations**: Executable Python Monte Carlo simulations validating the privacy theorem.
- **Threat Model**: Comprehensive security analysis.

## Architecture

DarkSight separates **public price discovery** from **private position management**:

1.  **Shielded Pool**: Users deposit funds into a unified anonymity set.
2.  **Private Trading**: Trades are executed via ZK proofs that verify the AMM invariant without revealing the trade size or direction.
3.  **Temporal Mixing**: Batched processing breaks timing correlation.

## Getting Started

### Prerequisites
- Node.js 18+
- Rust / Cargo
- Python 3.10+ (for simulations)

### Installation

```bash
# Install SDK and Circuit dependencies
cd sdk && npm install
cd ../circuits && npm install
```

## Security

⚠️ **This codebase is in Pre-Alpha.**
- Circuits have not been audited.
- Trusted setup has not been performed.
- Do not use in production environments.

## License

MIT License


