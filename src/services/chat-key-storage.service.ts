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

  public async getChatKey(chatId: number): Promise<string> {
    const chatStaticPublicKey: string | null = localStorage.getItem(`static-public-chat-${chatId}`);
    const chatEphemeralPublicKey: string | null = localStorage.getItem(`ephemeral-public-chat-${chatId}`);
    const myStaticKeys: DiffieHellmanKeysPair = this.exchangeKeysStorageService.getMyStaticKeys();
    const myEphemeralKeys: DiffieHellmanKeysPair = this.exchangeKeysStorageService.getMyEphemeralKeys(chatId);
    const staticPublicKey: string = chatStaticPublicKey ?? myStaticKeys.publicKey.toString();
    const ephemeralPublicKey: string = chatEphemeralPublicKey ?? myEphemeralKeys.publicKey.toString();
    return await this.tripleDiffieHellmanService.generateSharedKey(
      myStaticKeys,
      myEphemeralKeys,
      BigInt(staticPublicKey),
      BigInt(ephemeralPublicKey)
    );
  }
}
