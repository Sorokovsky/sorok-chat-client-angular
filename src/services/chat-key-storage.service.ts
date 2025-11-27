import {Injectable} from '@angular/core';
import {ExchangeKeysStorageService} from '@/services/exchange-keys-storage.service';
import {TripleDiffieHellmanService} from '@/services/triple-diffie-hellman.service';
import {DiffieHellmanKeysPair} from '@/schemes/diffie-hellman-key-pairs.schema';

@Injectable({
  providedIn: 'root',
})
export class ChatKeyStorageService {
  private readonly exchangeKeysStorageService: ExchangeKeysStorageService;
  private readonly tripleDiffieHellmanService: TripleDiffieHellmanService;
  private readonly chatKeys: Map<string, string> = new Map<string, string>();


  constructor(
    exchangeKeysStorageService: ExchangeKeysStorageService,
    tripleDiffieHellmanService: TripleDiffieHellmanService
  ) {
    this.exchangeKeysStorageService = exchangeKeysStorageService;
    this.tripleDiffieHellmanService = tripleDiffieHellmanService;
  }

  public async getChatKey(chatStaticPublicKey: string, chatEphemeralPublicKey: string, chatId: number): Promise<string> {
    const key: string | undefined = this.chatKeys.get(String(chatId));
    if (key !== undefined) return key;
    const myStaticKeys: DiffieHellmanKeysPair = this.exchangeKeysStorageService.getStaticKeys();
    const myEphemeralKeys: DiffieHellmanKeysPair = this.exchangeKeysStorageService.getEphemeralKeys();
    const staticKeys: DiffieHellmanKeysPair = {
      privateKey: myStaticKeys.privateKey,
      publicKey: BigInt(chatStaticPublicKey)
    };
    const ephemeralKeys: DiffieHellmanKeysPair = {
      privateKey: myEphemeralKeys.privateKey,
      publicKey: BigInt(chatEphemeralPublicKey)
    };
    return await this.tripleDiffieHellmanService.generateSharedKey(staticKeys, ephemeralKeys);
  }
}
