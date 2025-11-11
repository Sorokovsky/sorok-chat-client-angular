import {inject} from '@angular/core';
import {
  type HttpEvent,
  type HttpHandlerFn,
  type HttpInterceptorFn,
  type HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {type Observable, tap} from "rxjs";
import {AccessTokenStorageService} from '@/services/access-token-storage.service';

export const authenticationInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const accessTokenStorageService = inject(AccessTokenStorageService);
  const accessToken: string = accessTokenStorageService.getTokenFromLocalStorage();
  const modifiedRequest: HttpRequest<unknown> = accessTokenStorageService.setTokenToRequest(accessToken, request);
  return next(modifiedRequest)
    .pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          const newAccessToken: string = accessTokenStorageService.getTokenFromResponse(event);
          accessTokenStorageService.setTokenToLocalStorage(newAccessToken);
        }
      })
    )
}
