/**
 * Zero-Knowledge Client-Side Cryptography Utilities
 * Uses Web Crypto API (AES-GCM-256, PBKDF2)
 */

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer as ArrayBuffer;
}

function stringToBuffer(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

function bufferToString(buffer: ArrayBuffer): string {
  return new TextDecoder().decode(buffer);
}

export function generateSalt(): string {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function deriveMasterKeys(password: string, saltHex: string): Promise<{
  encryptionKeyHex: string;
  authVerifierHex: string;
}> {
  const passwordBuffer = stringToBuffer(password);
  
  const saltMatch = saltHex.match(/.{1,2}/g) || [];
  const saltBytes = new Uint8Array(saltMatch.map(byte => parseInt(byte, 16)));

  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    passwordBuffer as unknown as BufferSource,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes as unknown as BufferSource,
      iterations: 100000,
      hash: 'SHA-256'
    },
    baseKey,
    512
  );

  const encryptionKeyBytes = new Uint8Array(derivedBits, 0, 32);
  const authKeyBytes = new Uint8Array(derivedBits, 32, 32);

  const encryptionKeyHex = Array.from(encryptionKeyBytes, byte => byte.toString(16).padStart(2, '0')).join('');

  const verifierBuffer = await window.crypto.subtle.digest('SHA-256', authKeyBytes as unknown as BufferSource);
  const authVerifierHex = Array.from(new Uint8Array(verifierBuffer), byte => byte.toString(16).padStart(2, '0')).join('');

  return {
    encryptionKeyHex,
    authVerifierHex
  };
}

export async function encryptDataLocal(plainText: string, encryptionKeyHex: string): Promise<string> {
  if (!plainText) return "";
  
  const keyMatch = encryptionKeyHex.match(/.{1,2}/g) || [];
  const keyBytes = new Uint8Array(keyMatch.map(byte => parseInt(byte, 16)));
  
  const aesKey = await window.crypto.subtle.importKey(
    'raw',
    keyBytes as unknown as BufferSource,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encodedText = stringToBuffer(plainText);

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv as unknown as BufferSource
    },
    aesKey,
    encodedText as unknown as BufferSource
  );

  const ivBase64 = arrayBufferToBase64(iv.buffer as ArrayBuffer);
  const ciphertextBase64 = arrayBufferToBase64(encryptedBuffer);

  return `${ivBase64}.${ciphertextBase64}`;
}

export async function decryptDataLocal(encryptedStr: string, encryptionKeyHex: string): Promise<string> {
  if (!encryptedStr) return "";
  
  try {
    const parts = encryptedStr.split('.');
    if (parts.length !== 2) {
      throw new Error("Invalid encrypted format");
    }

    const iv = new Uint8Array(base64ToArrayBuffer(parts[0]));
    const ciphertext = base64ToArrayBuffer(parts[1]);

    const keyMatch = encryptionKeyHex.match(/.{1,2}/g) || [];
    const keyBytes = new Uint8Array(keyMatch.map(byte => parseInt(byte, 16)));

    const aesKey = await window.crypto.subtle.importKey(
      'raw',
      keyBytes as unknown as BufferSource,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv as unknown as BufferSource
      },
      aesKey,
      ciphertext as unknown as BufferSource
    );

    return bufferToString(decryptedBuffer);
  } catch (error) {
    console.error("Local decryption failure:", error);
    return "🔓 [Decryption Error - Invalid Key/Tampered Ciphertext]";
  }
}
