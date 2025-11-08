import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import type {LoginUser} from '@/schemes/login-user.schema';
import {LOGIN_URL} from '@/constants/backend-api.constants';
import {type User, UserSchema} from '@/schemes/user.schema';
import {catchError, map, Observable, throwError} from 'rxjs';
import {ZodError} from 'zod';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  private readonly httpClient: HttpClient = inject(HttpClient);

  public register(loginDto: LoginUser): Observable<User> {
    return this.httpClient.post(LOGIN_URL, loginDto)
      .pipe(
        map((response: unknown): User => UserSchema.parse(response)),
        catchError((error: unknown) => {
          if (error instanceof ZodError) {
            const {issues} = error;
            return throwError(() => ({
              type: "validation",
              issues,
            }));
          }
          return throwError(() => error);
        })
      );
  }
}
