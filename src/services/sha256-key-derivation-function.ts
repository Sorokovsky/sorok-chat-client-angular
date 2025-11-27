import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Sha256KeyDerivationFunction {
  private readonly KEY_LENGTH: number = 32;

  public async deriveSecrets(
    input: BufferSource,
    info: string = 'TripleDH_Session_Key',
    salt: BufferSource = new Uint8Array(32) // нулі — як у Signal
  ): Promise<Uint8Array> {
    const infoBytes = new TextEncoder().encode(info);

    const prk = await this.hmacSha256(salt, input);

    const result = new Uint8Array(this.KEY_LENGTH);
    let previous = new Uint8Array(0);
    let offset = 0;

    for (let i = 1; offset < this.KEY_LENGTH; i++) {
      const blockInput = new Uint8Array(previous.length + infoBytes.length + 1);
      blockInput.set(previous);
      blockInput.set(infoBytes, previous.length);
      blockInput[blockInput.length - 1] = i;

      previous = (await this.hmacSha256(prk as BufferSource, blockInput)) as Uint8Array<ArrayBuffer>;

      const copyBytes = Math.min(this.KEY_LENGTH - offset, previous.length);
      result.set(previous.subarray(0, copyBytes), offset);
      offset += copyBytes;
    }

    return result.subarray(0, this.KEY_LENGTH);
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
