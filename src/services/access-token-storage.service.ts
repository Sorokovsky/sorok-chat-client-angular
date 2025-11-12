import {Injectable} from '@angular/core';
import type {HttpRequest, HttpResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AccessTokenStorageService {
  private readonly ACCESS_TOKEN_KEY: string = 'access_token';
  private readonly AUTHORIZATION_HEADER_NAME: string = "Authorization";
  public static readonly DEFAULT_TOKEN: string = "token";
  private readonly BEARER_PREFIX: string = "Bearer ";

  public getTokenFromLocalStorage(): string {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY) || AccessTokenStorageService.DEFAULT_TOKEN;
  }

  public getTokenFromResponse(response: HttpResponse<unknown>): string {
    const authorizationHeader: string = response.headers.get(this.AUTHORIZATION_HEADER_NAME) || AccessTokenStorageService.DEFAULT_TOKEN;
    return authorizationHeader.replaceAll(this.BEARER_PREFIX, "");
  }

  public setTokenToLocalStorage(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  public setTokenToRequest(token: string, request: HttpRequest<unknown>): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        [this.AUTHORIZATION_HEADER_NAME]: this.BEARER_PREFIX + token
      }
    });
  }
}
