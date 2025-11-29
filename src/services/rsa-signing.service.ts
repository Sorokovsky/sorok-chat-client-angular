import {Injectable} from '@angular/core';
import {RsaKeyGenerationService} from '@/services/rsa-key-generation.service';

@Injectable({
  providedIn: 'root',
})
export class RsaSigningService {
  private readonly rsaKeyGenerationService: RsaKeyGenerationService;

  constructor(rsaKeyGenerationService: RsaKeyGenerationService) {
    this.rsaKeyGenerationService = rsaKeyGenerationService;
  }

  public async sign(data: BufferSource, privateKey: string): Promise<ArrayBuffer> {
    const privateRsaKey: CryptoKey = await this.rsaKeyGenerationService.importPrivateKey(privateKey);
    return await crypto.subtle.sign({name: "RSASSA-PKCS1-v1_5"}, privateRsaKey, data);
  }

  public async verify(data: BufferSource, signature: ArrayBuffer, publicKey: string): Promise<boolean> {
    const publicRsaKey: CryptoKey = await this.rsaKeyGenerationService.importPublicKey(publicKey);
    return await crypto.subtle.verify({name: "RSASSA-PKCS1-v1_5"}, publicRsaKey, signature, data);
  }
}
