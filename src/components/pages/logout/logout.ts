import {Component, OnInit} from '@angular/core';
import {useLogout} from '@/hooks/logout.hook';
import {type CreateMutationResult} from '@tanstack/angular-query-experimental';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.html',
  styleUrl: './logout.scss',
})
export class Logout implements OnInit {
  private logout: CreateMutationResult<unknown, Error, void, void> = useLogout()

  ngOnInit(): void {
    this.logout.mutate();
  }
}
