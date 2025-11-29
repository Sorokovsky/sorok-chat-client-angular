import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {type CreateMutationResult} from '@tanstack/angular-query-experimental';
import {type User} from '@/schemes/user.schema';
import {MIN_PASSWORD_LENGTH} from '@/constants/validation.constants';
import {Form} from '@/components/ui/form/form';
import {type RegisterUser, RegisterUserSchema} from '@/schemes/register-user.schema';
import {useRegistration} from '@/hooks/registration.hook';
import {RsaKeysStorageService} from '@/services/rsa-keys-storage.service';
import {RsaKeyPair} from '@/schemes/rsa-key-pair.scheme';

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
  private readonly rsaKeyPairStorage: RsaKeysStorageService;


  constructor(formBuilder: FormBuilder, rsaKeyPairStorage: RsaKeysStorageService) {
    this.rsaKeyPairStorage = rsaKeyPairStorage;
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

  public async register(): Promise<void> {
    const data: unknown = this.registerForm.value;
    const registerDto: Omit<RegisterUser, "publicRsaKey"> = RegisterUserSchema.omit({publicRsaKey: true}).parse(data);
    const keys: RsaKeyPair = await this.rsaKeyPairStorage.getKeyPair();
    this.registerMutation.mutate({...registerDto, publicRsaKey: keys.publicKey});
  }
}
