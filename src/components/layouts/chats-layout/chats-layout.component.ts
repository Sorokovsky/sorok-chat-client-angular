import {Component, effect, Signal} from '@angular/core';
import {ChatsSidebar} from '@/components/common/chats-sidebar/chats-sidebar';
import {Header} from '@/components/common/header/header';
import {Router, RouterOutlet} from '@angular/router';
import {useIsAuthenticated} from '@/hooks/is-authenticated.hook';
import {LOGIN_PAGE} from '@/constants/pages.constants';

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
      const authenticated: boolean = this.isAuthenticated();
      if (!authenticated) {
        this.router.navigate([LOGIN_PAGE.compiledPaths()]);
      }
    });
  }
}
