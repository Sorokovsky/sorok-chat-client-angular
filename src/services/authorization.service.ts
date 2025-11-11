import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import type {LoginUser} from '@/schemes/login-user.schema';
import {LOGIN_URL} from '@/constants/backend-api.constants';
import {type User, UserSchema} from '@/schemes/user.schema';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  private readonly httpClient: HttpClient = inject(HttpClient);

  public register(loginDto: LoginUser): Observable<User> {
    return this.httpClient.post(LOGIN_URL, loginDto)
      .pipe(
        map((response: unknown): User => UserSchema.parse(response))
      );
  }
}
