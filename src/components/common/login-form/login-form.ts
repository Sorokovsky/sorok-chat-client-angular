import {Component} from '@angular/core';
import {Form} from '@/components/ui/form/form';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {Heading} from '@/components/ui/heading/heading';
import {MatButton} from '@angular/material/button';
import {InputError} from '@/components/ui/input-error/input-error';
import {LoginUser, LoginUserSchema} from '@/schemes/login-user.schema';
import {useLogin} from '@/hooks/login.hook';
import {CreateMutationResult} from '@tanstack/angular-query-experimental';
import {User} from '@/schemes/user.schema';

@Component({
  selector: 'app-login-form',
  imports: [
    Form,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    Heading,
    MatButton,
    InputError
  ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  protected loginForm: FormGroup;
  private loginMutation: CreateMutationResult<User, Error, LoginUser, void> = useLogin();

  constructor(formBuilder: FormBuilder) {
    this.loginForm = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    })
  }

  public login() {
    const data: unknown = this.loginForm.value;
    const loginDto: LoginUser = LoginUserSchema.parse(data);
    this.loginMutation.mutate(loginDto);
  }
}
