import {Injectable} from '@angular/core';
import {RsaKeyPair} from '@/schemes/rsa-key-pair.scheme';
import {RsaKeyGenerationService} from '@/services/rsa-key-generation.service';

@Injectable({
  providedIn: 'root',
})
export class RsaKeysStorageService {
  private readonly PRIVATE_KEY: string = "private-rsa-key";
  private readonly PUBLIC_KEY: string = "public-rsa-key";
  private readonly rsaKeyGenerationService: RsaKeyGenerationService;

  constructor(rsaKeyGenerationService: RsaKeyGenerationService) {
    this.rsaKeyGenerationService = rsaKeyGenerationService;
  }

  public async getKeyPair(): Promise<RsaKeyPair> {
    const privateKey: string | null = localStorage.getItem(this.PRIVATE_KEY);
    const publicKey: string | null = localStorage.getItem(this.PUBLIC_KEY);
    let keyPair: RsaKeyPair;
    if (privateKey === null || publicKey === null) {
      keyPair = await this.rsaKeyGenerationService.generateRsaKeyPair();
      localStorage.setItem(this.PRIVATE_KEY, keyPair.privateKey);
      localStorage.setItem(this.PUBLIC_KEY, keyPair.publicKey);
    } else {
      keyPair = {
        privateKey,
        publicKey
      }
    }
    return keyPair;
  }
}
