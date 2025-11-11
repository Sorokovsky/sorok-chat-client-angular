import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LOGIN_URL, LOGOUT_URL, REGISTRATION_URL} from '@/constants/backend-api.constants';
import {type User, UserSchema} from '@/schemes/user.schema';
import {lastValueFrom, map, type Observable} from 'rxjs';
import {type RegisterUser} from '@/schemes/register-user.schema';
import {type LoginUser} from '@/schemes/login-user.schema';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  private readonly httpClient: HttpClient = inject(HttpClient);

  public async register(registerDto: RegisterUser): Promise<User> {
    const response: Observable<User> = this.httpClient.post(REGISTRATION_URL, registerDto)
      .pipe(map((response: unknown): User => UserSchema.parse(response)));
    return await lastValueFrom(response);
  }

  public async login(loginDto: LoginUser): Promise<User> {
    const response: Observable<User> = this.httpClient.put(LOGIN_URL, loginDto)
      .pipe(map((response: unknown): User => UserSchema.parse(response)));
    return await lastValueFrom(response);
  }

  public async logout(): Promise<void> {
    const response: Observable<void> = this.httpClient.delete(LOGOUT_URL)
      .pipe(map((): void => {
      }));
    return await lastValueFrom(response)
  }
}
