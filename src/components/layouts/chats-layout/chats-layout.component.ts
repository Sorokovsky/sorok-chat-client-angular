import {Component, effect, Signal} from '@angular/core';
import {ChatsSidebar} from '@/components/common/chats-sidebar/chats-sidebar';
import {Header} from '@/components/common/header/header';
import {Router, RouterOutlet} from '@angular/router';
import {useIsAuthenticated} from '@/hooks/is-authenticated.hook';

@Component({
  selector: 'app-chats-layout',
  imports: [
    ChatsSidebar,
    Header,
    RouterOutlet
  ],
  templateUrl: './chats-layout.html',
  styleUrl: './chats-layout.scss',
})
export class ChatsLayout {
  private isAuthenticated: Signal<boolean> = useIsAuthenticated();
  private readonly router: Router;

  constructor(router: Router) {
    this.router = router;
    effect((): void => {
      const authenticated = this.isAuthenticated();
      if (!authenticated) {
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
