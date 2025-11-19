/*
 * DarkSight Withdrawal Circuit
 * 
 * Processes withdrawals with nullifier proofs to prevent double-spending.
 */

pragma circom 2.1.0;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/bitify.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

// Helper to verify Merkle Path
template MerklePathVerifier(levels) {
    signal input leaf;
    signal input root;
    signal input pathElements[levels];
    signal input pathIndices[levels];

    component selectors[levels];
    component hashers[levels];

    for (var i = 0; i < levels; i++) {
        selectors[i] = DualMux();
        selectors[i].in[0] <== i == 0 ? leaf : hashers[i-1].hash;
        selectors[i].in[1] <== pathElements[i];
        selectors[i].s <== pathIndices[i];

        hashers[i] = Poseidon(2);
        hashers[i].inputs[0] <== selectors[i].out[0];
        hashers[i].inputs[1] <== selectors[i].out[1];
    }

    root === hashers[levels-1].hash;
}

template DualMux() {
    signal input in[2];
    signal input s;
    signal output out[2];
    s * (1 - s) === 0;
    out[0] <== (in[1] - in[0])*s + in[0];
    out[1] <== (in[0] - in[1])*s + in[1];
}

template WithdrawalCircuit(levels) {
    // Public inputs
    signal input root;              // Current Merkle root
    signal input nullifierHash;     // Unique nullifier for this note
    signal input recipient;         // Address to receive funds
    
    // Private inputs
    signal input secret;            // User's secret key
    signal input amount;            // Amount in the note
    signal input pathElements[levels];
    signal input pathIndices[levels];
    
    // 1. Reconstruct the Commitment
    // We need to prove we know a commitment C that exists in the tree
    // C = Poseidon(amount, secret, nullifierHash_preimage)
    
    // Derive nullifier preimage from secret and path (index)
    var indexVal = 0;
    for(var i=0; i<levels; i++) {
        indexVal += pathIndices[i] * (2**i);
    }
    
    component nullifierGen = Poseidon(2);
    nullifierGen.inputs[0] <== secret;
    nullifierGen.inputs[1] <== indexVal;
    signal nullifierPreimage <== nullifierGen.out;
    
    // Verify Public Nullifier matches
    nullifierHash === nullifierPreimage;

    // Rebuild Commitment
    component commHasher = Poseidon(3);
    commHasher.inputs[0] <== amount;
    commHasher.inputs[1] <== secret;
    commHasher.inputs[2] <== nullifierPreimage;
    signal commitment <== commHasher.out;

    // 2. Merkle Membership Proof
    component treeVerifier = MerklePathVerifier(levels);
    treeVerifier.leaf <== commitment;
    treeVerifier.root <== root;
    for(var i=0; i<levels; i++) {
        treeVerifier.pathElements[i] <== pathElements[i];
        treeVerifier.pathIndices[i] <== pathIndices[i];
    }

    // 3. Recipient Binding
    // Ensure the proof is bound to a specific recipient to prevent front-running/replay
    // This is usually done by including the recipient in the public signals or a dummy hash
    signal recipientSquare;
    recipientSquare <== recipient * recipient; // Dummy constraint to enforce usage
}

component main {public [root, nullifierHash, recipient]} = WithdrawalCircuit(32);
