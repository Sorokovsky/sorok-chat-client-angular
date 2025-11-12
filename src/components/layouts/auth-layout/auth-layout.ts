import {Component} from '@angular/core';
import {Header} from '@/components/common/header/header';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [
    Header,
    RouterOutlet
  ],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {

}
