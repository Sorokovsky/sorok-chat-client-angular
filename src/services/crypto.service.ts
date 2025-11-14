import {Injectable} from '@angular/core';
import {DES, enc, HmacSHA256, lib, mode, pad} from "crypto-js"

const config = {
  mode: mode.CBC,
  padding: pad.Pkcs7
};

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  public encrypt(text: string, secretKey: string): string {
    return DES.encrypt(text, secretKey, config).toString();
  }

  public decrypt(text: string, secretKey: string): string {
    const decrypted: lib.WordArray = DES.decrypt(text, secretKey, config);
    return decrypted.toString(enc.Utf8);
  }

  public isSigned(text: string, signed: string, secretKey: string): boolean {
    const newMac: string = this.sign(text, secretKey);
    return signed === newMac;
  }

  public sign(text: string, secretKey: string): string {
    return HmacSHA256(text, secretKey).toString();
  }
}
