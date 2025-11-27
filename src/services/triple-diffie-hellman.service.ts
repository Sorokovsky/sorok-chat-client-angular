import {Injectable} from '@angular/core';
import {DiffieHellmanService} from '@/services/diffie-hellman.service';
import {Sha256KeyDerivationFunction} from '@/services/sha256-key-derivation-function';
import {type DiffieHellmanKeysPair} from '@/schemes/diffie-hellman-key-pairs.schema';

@Injectable({
  providedIn: 'root',
})
export class TripleDiffieHellmanService {
  private readonly diffieHellmanService: DiffieHellmanService;
  private readonly keyDerivationFunctionService: Sha256KeyDerivationFunction;

  constructor(
    diffieHellmanService: DiffieHellmanService,
    keyDerivationFunctionService: Sha256KeyDerivationFunction
  ) {
    this.diffieHellmanService = diffieHellmanService;
    this.keyDerivationFunctionService = keyDerivationFunctionService;
  }

  public async generateSharedKey(staticKeys: DiffieHellmanKeysPair, ephemeralKeys: DiffieHellmanKeysPair): Promise<string> {
    const first: bigint = this.diffieHellmanService.generateSharedSecret(staticKeys.privateKey, ephemeralKeys.publicKey);
    const second: bigint = this.diffieHellmanService.generateSharedSecret(ephemeralKeys.privateKey, staticKeys.publicKey);
    const third: bigint = this.diffieHellmanService.generateSharedSecret(ephemeralKeys.privateKey, ephemeralKeys.publicKey);
    const seed = new Uint8Array(96);
    seed.set(this.bigIntToBufferSource(first), 0);
    seed.set(this.bigIntToBufferSource(second), 32);
    seed.set(this.bigIntToBufferSource(third), 64);
    const shared: Uint8Array = await this.keyDerivationFunctionService.generateSharedKey(seed as BufferSource);
    return btoa(String.fromCharCode(...shared));
  }

  private bigIntToBufferSource(value: bigint): Uint8Array {
    const bytes = new Uint8Array(32);
    let i = 32;
    let temp: bigint = value;
    while (temp > 0n && i > 0) {
      bytes[--i] = Number(temp & 0xFFn);
      temp >>= 8n;
    }
    return bytes;
  }
}
