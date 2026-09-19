/**
 * URL ID Security & Obfuscation Utilities for Ella Creations
 * Encrypts and decrypts database IDs / SKUs so internal IDs are never exposed in public URLs.
 */

const SECRET_KEY = 'ella_luxury_jewels_secret_v1_2026';

/**
 * Generate pseudo-random keystream for a given length based on the secret key
 */
function getKeystream(length, salt = 0x5a) {
  const stream = new Uint8Array(length);
  const keyLen = SECRET_KEY.length;
  let state = salt;
  for (let i = 0; i < length; i++) {
    const kChar = SECRET_KEY.charCodeAt(i % keyLen);
    state = ((state * 31 + kChar + i) & 0xff);
    stream[i] = state ^ kChar;
  }
  return stream;
}

/**
 * Calculate simple 2-byte checksum
 */
function getChecksum(bytes) {
  let c1 = 0x45; // 'E'
  let c2 = 0x43; // 'C'
  for (let i = 0; i < bytes.length; i++) {
    c1 = (c1 + bytes[i]) & 0xff;
    c2 = (c2 ^ bytes[i]) & 0xff;
  }
  return (c1 << 8) | c2;
}

/**
 * Encrypt any raw ID string into an opaque URL-safe token.
 * E.g., "ec-17873184005" -> "e_8f3d1a..."
 * @param {string|number} rawId 
 * @returns {string} Encrypted token starting with "e_"
 */
export function encryptId(rawId) {
  if (rawId === undefined || rawId === null || rawId === '') return '';
  const str = String(rawId);
  
  // If already encrypted, return as is
  if (str.startsWith('e_') && /^[a-z0-9_]+$/i.test(str)) {
    return str;
  }

  const textEncoder = typeof TextEncoder !== 'undefined' ? new TextEncoder() : null;
  const rawBytes = textEncoder ? textEncoder.encode(str) : Buffer.from(str, 'utf-8');
  const checksum = getChecksum(rawBytes);
  
  // Payload: [rawBytes..., checksumHigh, checksumLow]
  const payload = new Uint8Array(rawBytes.length + 2);
  payload.set(rawBytes, 0);
  payload[rawBytes.length] = (checksum >> 8) & 0xff;
  payload[rawBytes.length + 1] = checksum & 0xff;

  const keystream = getKeystream(payload.length);
  let hexResult = '';
  for (let i = 0; i < payload.length; i++) {
    const encryptedByte = payload[i] ^ keystream[i];
    hexResult += encryptedByte.toString(16).padStart(2, '0');
  }

  return `e_${hexResult}`;
}

/**
 * Decrypt an encrypted URL token back to the original raw ID string.
 * If the input is not encrypted or invalid, gracefully returns the input string for backward compatibility.
 * @param {string} token 
 * @returns {string} Decrypted raw ID
 */
export function decryptId(token) {
  if (!token || typeof token !== 'string') return token || '';
  
  const trimmed = token.trim();
  if (!trimmed.startsWith('e_')) {
    // Already plain ID or legacy slug format
    return trimmed;
  }

  const hexPart = trimmed.slice(2);
  if (hexPart.length < 6 || hexPart.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(hexPart)) {
    return trimmed;
  }

  try {
    const byteLen = hexPart.length / 2;
    const encryptedBytes = new Uint8Array(byteLen);
    for (let i = 0; i < byteLen; i++) {
      encryptedBytes[i] = parseInt(hexPart.substr(i * 2, 2), 16);
    }

    const keystream = getKeystream(byteLen);
    const decryptedPayload = new Uint8Array(byteLen);
    for (let i = 0; i < byteLen; i++) {
      decryptedPayload[i] = encryptedBytes[i] ^ keystream[i];
    }

    const rawBytes = decryptedPayload.subarray(0, byteLen - 2);
    const expectedChecksum = (decryptedPayload[byteLen - 2] << 8) | decryptedPayload[byteLen - 1];
    const actualChecksum = getChecksum(rawBytes);

    if (expectedChecksum !== actualChecksum) {
      // Checksum mismatch, return input safely
      return trimmed;
    }

    const textDecoder = typeof TextDecoder !== 'undefined' ? new TextDecoder() : null;
    const decryptedStr = textDecoder ? textDecoder.decode(rawBytes) : Buffer.from(rawBytes).toString('utf-8');
    return decryptedStr;
  } catch (err) {
    console.warn('Failed decrypting ID token:', err);
    return trimmed;
  }
}
