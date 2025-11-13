import {Component} from '@angular/core';
import {Form} from '@/components/ui/form/form';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {LoginUser, LoginUserSchema} from '@/schemes/login-user.schema';
import {useLogin} from '@/hooks/login.hook';
import {CreateMutationResult} from '@tanstack/angular-query-experimental';
import {User} from '@/schemes/user.schema';
import {MIN_PASSWORD_LENGTH} from '@/constants/validation.constants';

@Component({
  selector: 'app-login-form',
  imports: [
    Form,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  protected loginForm: FormGroup;
  protected title: string = "Вхід";
  protected submitText: string = "Відправити";
  private loginMutation: CreateMutationResult<User, Error, LoginUser, void> = useLogin();

  constructor(formBuilder: FormBuilder) {
    const email: FormControl<string | null> = formBuilder.control('', {
      validators: [Validators.required, Validators.email],
    });
    //@ts-ignore
    email.meta = {label: "Електронна адреса"};
    const password: FormControl<string | null> = formBuilder.control('', {
      validators: [Validators.required, Validators.minLength(MIN_PASSWORD_LENGTH)],
    });
    //@ts-ignore
    password.meta = {label: "Пароль"};
    this.loginForm = formBuilder.group({
      email,
      password,
    })
  }

  public login(): void {
    const data: unknown = this.loginForm.value;
    const loginDto: LoginUser = LoginUserSchema.parse(data);
    this.loginMutation.mutate(loginDto);
  }
}
