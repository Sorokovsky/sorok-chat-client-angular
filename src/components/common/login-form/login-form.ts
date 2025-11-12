import {Component} from '@angular/core';
import {Form} from '@/components/ui/form/form';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {Heading} from '@/components/ui/heading/heading';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-login-form',
  imports: [
    Form,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    Heading,
    MatButton
  ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {

}
