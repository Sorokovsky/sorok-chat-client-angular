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


  constructor(
    exchangeKeysStorageService: ExchangeKeysStorageService,
    tripleDiffieHellmanService: TripleDiffieHellmanService
  ) {
    this.exchangeKeysStorageService = exchangeKeysStorageService;
    this.tripleDiffieHellmanService = tripleDiffieHellmanService;
  }

  public async getChatKey(chatStaticPublicKey: string, chatEphemeralPublicKey: string, chatId: number): Promise<string> {
    const myStaticKeys: DiffieHellmanKeysPair = this.exchangeKeysStorageService.getStaticKeys();
    const myEphemeralKeys: DiffieHellmanKeysPair = this.exchangeKeysStorageService.getEphemeralKeys(chatId);
    return await this.tripleDiffieHellmanService.generateSharedKey(myStaticKeys, myEphemeralKeys, BigInt(chatStaticPublicKey), BigInt(chatEphemeralPublicKey));
  }
}
