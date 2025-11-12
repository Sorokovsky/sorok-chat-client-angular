import {Component, OnInit} from '@angular/core';
import {LoginForm} from '@/components/common/login-form/login-form';
import {useProfile} from '@/hooks/profile.hook';
import {CreateQueryResult} from '@tanstack/angular-query-experimental';
import {User} from '@/schemes/user.schema';

@Component({
  selector: 'app-login',
  imports: [
    LoginForm
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  private profile: CreateQueryResult<User> = useProfile();

  ngOnInit(): void {
    console.log(this.profile.data())
  }

}
