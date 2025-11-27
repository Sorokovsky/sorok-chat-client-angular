import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {type CreateMutationResult} from '@tanstack/angular-query-experimental';
import {type User} from '@/schemes/user.schema';
import {MIN_PASSWORD_LENGTH} from '@/constants/validation.constants';
import {Form} from '@/components/ui/form/form';
import {type RegisterUser, RegisterUserSchema} from '@/schemes/register-user.schema';
import {useRegistration} from '@/hooks/registration.hook';

@Component({
  selector: 'app-register',
  imports: [
    Form,
    ReactiveFormsModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  protected registerForm: FormGroup;
  protected title: string = "Реєстрація";
  protected submitText: string = "Зареєструватися";
  private registerMutation: CreateMutationResult<User, Error, RegisterUser, void> = useRegistration();

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
    const firstName: FormControl<string | null> = formBuilder.control('', {
      validators: [Validators.required],
    });
    //@ts-ignore
    firstName.meta = {label: "Ім'я"};
    const lastName: FormControl<string | null> = formBuilder.control('', {
      validators: [Validators.required],
    });
    //@ts-ignore
    lastName.meta = {label: "Прізвище"};
    const middleName: FormControl<string | null> = formBuilder.control('', {
      validators: [Validators.required],
    });
    //@ts-ignore
    middleName.meta = {label: "По батькові"};
    this.registerForm = formBuilder.group({
      email,
      password,
      firstName,
      lastName,
      middleName,
    })
  }

  public register(): void {
    const data: unknown = this.registerForm.value;
    const registerDto: RegisterUser = RegisterUserSchema.parse(data);
    this.registerMutation.mutate(registerDto);
  }
}
