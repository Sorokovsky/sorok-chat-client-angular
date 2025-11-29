import {Injectable} from '@angular/core';
import {type RsaKeyPair} from '@/schemes/rsa-key-pair.scheme';

@Injectable({
  providedIn: 'root',
})
export class RsaKeyGenerationService {
  private readonly BEGIN_PRIVATE_KEY_PREFIX: string = "-----BEGIN PRIVATE KEY-----";
  private readonly END_PRIVATE_KEY_SUFFIX: string = "----END PRIVATE KEY-----";
  private readonly BEGIN_PUBLIC_KEY_PREFIX: string = "-----BEGIN PUBLIC KEY-----";
  private readonly END_PUBLIC_KEY_SUFFIX: string = "-----END PUBLIC KEY-----"

  public async generateRsaKeyPair(bits: 3072 | 4096 = 3072): Promise<RsaKeyPair> {
    const pair: CryptoKeyPair = await crypto.subtle.generateKey(
      {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: bits,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["sign", "verify"]
    );
    const [privateKey, publicKey] = await Promise.all([
      this.exportPrivateKey(pair.privateKey),
      this.exportPublicKey(pair.publicKey),
    ]);
    return {
      privateKey,
      publicKey
    }
  }

  async importPrivateKey(pem: string): Promise<CryptoKey> {
    const der: ArrayBuffer = this.pemToArrayBuffer(pem);
    return await crypto.subtle.importKey(
      'pkcs8',
      der,
      {name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256'},
      true,
      ['sign']
    );
  }

  async importPublicKey(pem: string): Promise<CryptoKey> {
    const der: ArrayBuffer = this.pemToArrayBuffer(pem);
    return await crypto.subtle.importKey(
      'spki',
      der,
      {name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256'},
      true,
      ['verify']
    );
  }

  private async exportPrivateKey(key: CryptoKey): Promise<string> {
    const exported: ArrayBuffer = await crypto.subtle.exportKey('pkcs8', key);
    return this.arrayBufferToPem(exported, this.BEGIN_PRIVATE_KEY_PREFIX, this.END_PRIVATE_KEY_SUFFIX);
  }

  private async exportPublicKey(key: CryptoKey): Promise<string> {
    const exported: ArrayBuffer = await crypto.subtle.exportKey('spki', key);
    return this.arrayBufferToPem(exported, this.BEGIN_PUBLIC_KEY_PREFIX, this.END_PUBLIC_KEY_SUFFIX);
  }

  private arrayBufferToPem(buffer: ArrayBuffer, header: string, footer: string): string {
    const base64: string = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    const wrapped: string = base64.match(/.{1,64}/g)!.join('\n');
    return `${header}\n${wrapped}\n${footer}`;
  }

  private pemToArrayBuffer(pem: string): ArrayBuffer {
    const b64 = pem
      .replace(/-----BEGIN[^-]*-----/g, '')
      .replace(/-----END[^-]*-----/g, '')
      .replace(/\s+/g, '');
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
