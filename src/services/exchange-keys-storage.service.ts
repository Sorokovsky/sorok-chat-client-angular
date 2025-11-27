import {Injectable} from '@angular/core';
import {DiffieHellmanService} from '@/services/diffie-hellman.service';
import {type DiffieHellmanKeysPair} from '@/schemes/diffie-hellman-key-pairs.schema';

@Injectable({
  providedIn: 'root',
})
export class ExchangeKeysStorageService {
  private readonly staticPublicKeyName: string = "static-public-key";
  private readonly staticPrivateKeyName: string = "static-private-key";
  private readonly diffieHellmanService: DiffieHellmanService;

  constructor(diffieHellmanService: DiffieHellmanService) {
    this.diffieHellmanService = diffieHellmanService;
  }

  public getStaticKeys(): DiffieHellmanKeysPair {
    const publicStaticString: string | null = localStorage.getItem(this.staticPublicKeyName);
    const privateStaticString: string | null = localStorage.getItem(this.staticPrivateKeyName);
    let keys: DiffieHellmanKeysPair;
    if (privateStaticString === null || publicStaticString === null) {
      keys = this.diffieHellmanService.generateKeysPair();
      localStorage.setItem(this.staticPrivateKeyName, keys.privateKey.toString());
      localStorage.setItem(this.staticPublicKeyName, keys.publicKey.toString());

    } else {
      keys = {privateKey: BigInt(privateStaticString), publicKey: BigInt(publicStaticString)};
    }
    return keys;
  }

  public getEphemeralKeys(chatId: number): DiffieHellmanKeysPair {
    const privateName: string = `ephemeral_private-${chatId}`;
    const publicName: string = `ephemeral_public-${chatId}`;
    const ephemeralPublicString: string | null = localStorage.getItem(publicName);
    const ephemeralPrivateString: string | null = localStorage.getItem(privateName);
    let keys: DiffieHellmanKeysPair;
    if (ephemeralPublicString === null || ephemeralPrivateString === null) {
      keys = this.diffieHellmanService.generateKeysPair();
      localStorage.setItem(privateName, keys.privateKey.toString());
      localStorage.setItem(publicName, keys.publicKey.toString());
    } else {
      keys = {
        privateKey: BigInt(ephemeralPrivateString),
        publicKey: BigInt(ephemeralPublicString),
      };
    }
    return keys;
  }
}
