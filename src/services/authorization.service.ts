import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
  LOGIN_URL,
  LOGOUT_URL,
  PROFILE_URL,
  REGISTRATION_URL,
  SET_PUBLIC_RSA_KEY_URL
} from '@/constants/backend-api.constants';
import {type User, UserSchema} from '@/schemes/user.schema';
import {map, type Observable} from 'rxjs';
import {type RegisterUser} from '@/schemes/register-user.schema';
import {type LoginUser} from '@/schemes/login-user.schema';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  private readonly httpClient: HttpClient = inject(HttpClient);

  public register(registerDto: RegisterUser): Observable<User> {
    return this.httpClient.post<User>(REGISTRATION_URL, registerDto)
      .pipe(map((response: unknown): User => UserSchema.parse(response)));
  }

  public login(loginDto: LoginUser): Observable<User> {
    return this.httpClient.put<User>(LOGIN_URL, loginDto)
      .pipe(map((response: unknown): User => UserSchema.parse(response)));
  }

  public logout(): Observable<void> {
    return this.httpClient.delete<void>(LOGOUT_URL)
      .pipe(map((): void => {
      }));
  }

  public getProfile(): Observable<User> {
    return this.httpClient.get<User>(PROFILE_URL)
      .pipe(map((response: unknown): User => UserSchema.parse(response)));
  }

  public setPublicRsaKey(publicRsaKey: string): Observable<User> {
    return this.httpClient.put<User>(SET_PUBLIC_RSA_KEY_URL, {publicRsaKey})
  }
}
