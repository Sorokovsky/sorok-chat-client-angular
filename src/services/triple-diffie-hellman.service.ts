import {Injectable} from '@angular/core';
import {DiffieHellmanService} from '@/services/diffie-hellman.service';
import {Sha256KeyDerivationFunction} from '@/services/sha256-key-derivation-function';

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
}
