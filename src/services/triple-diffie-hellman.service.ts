import {Injectable} from '@angular/core';
import {DiffieHellmanService} from '@/services/diffie-hellman.service';
import {Sha256KeyDerivationFunction} from '@/services/sha256-key-derivation-function';
import {type DiffieHellmanKeysPair} from '@/schemes/diffie-hellman-key-pairs.schema';

@Injectable({
  providedIn: 'root',
})
export class TripleDiffieHellmanService {
  constructor(
    private dh: DiffieHellmanService,
    private kdf: Sha256KeyDerivationFunction
  ) {
  }

  public async generateSharedKey(
    myStatic: DiffieHellmanKeysPair,
    myEphemeral: DiffieHellmanKeysPair,
    otherStaticPub: bigint,
    otherEphemeralPub: bigint
  ): Promise<string> {
    const dh1 = this.dh.generateSharedSecret(myStatic.privateKey, otherEphemeralPub);
    const dh2 = this.dh.generateSharedSecret(myEphemeral.privateKey, otherStaticPub);
    const dh3 = this.dh.generateSharedSecret(myEphemeral.privateKey, otherEphemeralPub);

    const seed = new Uint8Array(96);
    seed.set(this.bigIntToBytes(dh1), 0);
    seed.set(this.bigIntToBytes(dh2), 32);
    seed.set(this.bigIntToBytes(dh3), 64);

    const key = await this.kdf.deriveSecrets(seed, 'TripleDH_Session_v1');
    return this.uint8ToBase64(key);
  }

  // ПРАВИЛЬНИЙ big-endian запис
  private bigIntToBytes(n: bigint): Uint8Array {
    const bytes = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      bytes[31 - i] = Number(n & 0xFFn);
      n >>= 8n;
    }
    return bytes;
  }

  // Безпечний Base64
  private uint8ToBase64(arr: Uint8Array): string {
    let binary = '';
    for (const byte of arr) binary += String.fromCharCode(byte);
    return btoa(binary);
  }
}
