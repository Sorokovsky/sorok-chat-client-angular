import {Component, effect, Signal} from '@angular/core';
import {Header} from '@/components/common/header/header';
import {Router, RouterOutlet} from '@angular/router';
import {useIsAuthenticated} from '@/hooks/is-authenticated.hook';

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
  private isAuthenticated: Signal<boolean> = useIsAuthenticated();
  private readonly router: Router;

  constructor(router: Router) {
    this.router = router;
    effect((): void => {
      const authenticated: boolean = this.isAuthenticated();
      if (authenticated) {
        this.router.navigate(['/chats']);
      }
    });
  }

}
