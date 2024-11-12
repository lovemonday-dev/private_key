const crypto = require('crypto');
const secp256k1 = require('secp256k1');
const bs58 = require('bs58');
const bitcoin = require('bitcoinjs-lib');

// Generate public key from private key
function getPublicKey(privateKey) {
    const compressed = secp256k1.publicKeyCreate(privateKey, true);  // true for compressed format
    const uncompressed = secp256k1.publicKeyCreate(privateKey, false);  // true for compressed format
    return { compressed, uncompressed };
}


// Hashing functions
function hash160(buffer) {
    const sha256Hash = crypto.createHash('sha256').update(buffer).digest();
    const ripemd160Hash = crypto.createHash('ripemd160').update(sha256Hash).digest();
    return ripemd160Hash;
}

function sha256(buffer) {
    return crypto.createHash('sha256').update(buffer).digest();
}

// Generate P2PKH (Legacy Address)
function generateP2PKHAddress(publicKey) {
    const publicKeyHash = hash160(publicKey);
    const version = Buffer.from([0x00]);  // 0x00 is for P2PKH mainnet
    const checksum = sha256(sha256(Buffer.concat([version, publicKeyHash]))).slice(0, 4);
    const address = Buffer.concat([version, publicKeyHash, checksum]);
    return bs58.encode(address);
}

// Generate P2SH-P2WPKH Address (Wrapped SegWit Address)
function generateP2SHAddress(publicKey) {
    const publicKeyHash = hash160(publicKey);

    // Create redeem script: OP_0 <20-byte-pubKeyHash>
    const redeemScript = Buffer.concat([Buffer.from([0x00, 0x14]), publicKeyHash]);

    // Hash redeemScript for P2SH address
    const redeemScriptHash = hash160(redeemScript);
    const version = Buffer.from([0x05]);  // 0x05 is for P2SH mainnet
    const checksum = sha256(sha256(Buffer.concat([version, redeemScriptHash]))).slice(0, 4);
    const address = Buffer.concat([version, redeemScriptHash, checksum]);
    return bs58.encode(address);
}

// Generate Bech32 P2WPKH Address (Native SegWit)
function generateBech32Address(publicKey) {
    const network = bitcoin.networks.bitcoin;
    const { address } = bitcoin.payments.p2wpkh({ pubkey: publicKey, network });
    return address
}

// const privateKeyHex = '0000000000000000000000000000000000000000000000000000000000000001';
// const buffer = Buffer.from(privateKeyHex, 'hex');


// Generate addresses
const generateBitcoinAddress = (privateKey) => {

    const publicKey = getPublicKey(privateKey);
    const p2pkhAddress = generateP2PKHAddress(publicKey.compressed);
    const p2shAddress = generateP2SHAddress(publicKey.compressed);
    const bechAddress = generateBech32Address(publicKey.compressed);
    const p2pkhAddressUn = generateP2PKHAddress(publicKey.uncompressed);
    return `${p2pkhAddress}|${p2shAddress}|${bechAddress}|${p2pkhAddressUn}|`
}

module.exports = {
    generateBitcoinAddress
}
