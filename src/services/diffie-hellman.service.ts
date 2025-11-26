import {Injectable} from '@angular/core';
import {DiffieHellmanConstants} from '@/constants/diffie-hellman.constants';
import {DiffieHellmanKeysPair} from '@/schemes/diffie-hellman-key-pairs.schema';

@Injectable({
  providedIn: 'root',
})
export class DiffieHellmanService {
  private readonly p: bigint;
  private readonly g: bigint;

  constructor() {
    this.p = BigInt("0x" + DiffieHellmanConstants.P)
    this.g = BigInt(DiffieHellmanConstants.G);
    if (this.p <= 2n) throw new Error("P має бути більшим за 2");
    if (this.g <= 1n || this.g >= this.p) throw new Error("G має бути в межах [2, P-2)");
    if (this.modPow(this.g, this.p - 1n, this.p) !== 1n) {
      throw new Error("G має задовільняти g^(p-1) == 1 (mod p)");
    }
  }

  public generateKeysPair(): DiffieHellmanKeysPair {
    const privateKey: bigint = this.generatePrivateKey();
    const publicKey: bigint = this.modPow(this.g, privateKey, this.p);
    return {publicKey, privateKey};
  }

  public generateSharedSecret(privateKey: bigint, otherPublicKey: bigint): bigint {
    if (otherPublicKey <= 1n || otherPublicKey >= this.p - 1n) {
      throw new Error('Публічний ключ має бути в [2, P-2]');
    }
    if (otherPublicKey === 1n) {
      throw new Error('Отримано тривіальний публічний ключ (1)');
    }
    if (privateKey <= 1n || privateKey >= this.p - 1n) {
      throw new Error('Приватний ключ недійсний');
    }

    return this.modPow(otherPublicKey, privateKey, this.p);
  }

  private generatePrivateKey(): bigint {
    const byteLength: number = this.p.toString(16).length / 2;
    const buffer: Uint8Array = new Uint8Array(byteLength);

    let privateKey: bigint;
    do {
      crypto.getRandomValues(buffer);
      buffer[byteLength - 1] &= 0x7f;
      if (byteLength > 0) buffer[byteLength - 1] &= 0x7f;

      let hex: string = '';
      for (const byte of buffer) {
        hex += byte.toString(16).padStart(2, '0');
      }
      privateKey = BigInt('0x' + hex);

      privateKey = (privateKey % (this.p - 2n)) + 2n;
    } while (privateKey >= this.p - 1n || privateKey < 2n);

    return privateKey;
  }

  private modPow(base: bigint, exponent: bigint, module: bigint): bigint {
    let result: bigint = 1n;
    base = base % module;
    while (exponent > 0n) {
      if (exponent & 1n) {
        result = (result * base) % module;
      }
      exponent >>= 1n;
      base = (base * base) % module;
    }
    return result;
  }
}
