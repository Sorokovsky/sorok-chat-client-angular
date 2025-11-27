import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Sha256KeyDerivationFunction {
  private readonly KEY_LENGTH: number = 32;

  public async generateSharedKey(seed: BufferSource): Promise<Uint8Array> {
    if (seed.byteLength === 0) throw new Error("Cід не може бути порожнім");
    const salt = new Uint8Array(this.KEY_LENGTH);
    const info = new Uint8Array(0);
    const pkr: Uint8Array = await this.hmacSha256(salt, seed);
    const input = new Uint8Array(info.length + 1);
    input.set(info)
    input[info.length] = 1;
    return await this.hmacSha256(pkr as BufferSource, input);
  }

  private async hmacSha256(key: BufferSource, data: BufferSource): Promise<Uint8Array> {
    const cryptoKey: CryptoKey = await crypto.subtle.importKey(
      "raw",
      key,
      {name: "HMAC", hash: "SHA-256"},
      false,
      ['sign']
    );
    const signature: ArrayBuffer = await crypto.subtle.sign("HMAC", cryptoKey, data);
    return new Uint8Array(signature);

  }
}
