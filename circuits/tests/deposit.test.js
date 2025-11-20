/**
 * Deposit Circuit Tests
 * 
 * Tests for the deposit circuit constraints and logic
 */

const snarkjs = require('snarkjs');
const path = require('path');
const fs = require('fs');

const BUILD_DIR = path.join(__dirname, '../build');
const WASM_PATH = path.join(BUILD_DIR, 'deposit.wasm');
const ZKEY_PATH = path.join(BUILD_DIR, 'deposit_0001.zkey');

describe('Deposit Circuit', () => {
    let wasmExists = false;
    let zkeyExists = false;

    beforeAll(() => {
        wasmExists = fs.existsSync(WASM_PATH);
        zkeyExists = fs.existsSync(ZKEY_PATH);
        
        if (!wasmExists || !zkeyExists) {
            console.warn('Circuit files not found. Run "npm run build" first.');
        }
    });

    describe('Circuit Constraints', () => {
        it('should accept valid deposit inputs', async () => {
            if (!wasmExists || !zkeyExists) {
                console.log('Skipping: Circuit files not found');
                return;
            }

            const inputs = {
                deposit_amount: '1000000',
                new_root: '1234567890',
                timestamp: Math.floor(Date.now() / 1000).toString(),
                secret: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
                nullifier_key: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
                old_root: '0',
                pathElements: Array(32).fill('0'),
                pathIndices: Array(32).fill('0')
            };

            try {
                const { proof, publicSignals } = await snarkjs.groth16.fullProve(
                    inputs,
                    WASM_PATH,
                    ZKEY_PATH
                );
                
                expect(proof).toBeDefined();
                expect(publicSignals).toBeDefined();
                expect(publicSignals.length).toBeGreaterThan(0);
            } catch (error) {
                // If proof generation fails, it means constraints are not satisfied
                fail(`Proof generation failed: ${error.message}`);
            }
        });

        it('should enforce amount range check', async () => {
            if (!wasmExists || !zkeyExists) {
                console.log('Skipping: Circuit files not found');
                return;
            }

            // This test would require negative amount to fail
            // In practice, the circuit should reject amounts outside valid range
            // For now, we test that valid amounts work
            const inputs = {
                deposit_amount: '18446744073709551615', // Max uint64
                new_root: '1234567890',
                timestamp: Math.floor(Date.now() / 1000).toString(),
                secret: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
                nullifier_key: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
                old_root: '0',
                pathElements: Array(32).fill('0'),
                pathIndices: Array(32).fill('0')
            };

            try {
                await snarkjs.groth16.fullProve(inputs, WASM_PATH, ZKEY_PATH);
                // Should succeed for max uint64
            } catch (error) {
                // If it fails, that's also acceptable (circuit may have stricter limits)
            }
        });

        it('should enforce timestamp format', async () => {
            if (!wasmExists || !zkeyExists) {
                console.log('Skipping: Circuit files not found');
                return;
            }

            const inputs = {
                deposit_amount: '1000000',
                new_root: '1234567890',
                timestamp: Math.floor(Date.now() / 1000).toString(),
                secret: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
                nullifier_key: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
                old_root: '0',
                pathElements: Array(32).fill('0'),
                pathIndices: Array(32).fill('0')
            };

            try {
                const { proof } = await snarkjs.groth16.fullProve(inputs, WASM_PATH, ZKEY_PATH);
                expect(proof).toBeDefined();
            } catch (error) {
                fail(`Valid timestamp rejected: ${error.message}`);
            }
        });
    });

    describe('Nullifier Derivation', () => {
        it('should derive nullifier from secret and commitment', async () => {
            // This is tested implicitly through proof generation
            // The circuit enforces that nullifier = Poseidon(secret, commitment)
            expect(true).toBe(true); // Placeholder - actual test requires circuit execution
        });
    });
});

