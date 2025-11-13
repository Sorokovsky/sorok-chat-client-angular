import {Component, input, type InputSignal, type Signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {type Page} from '@/schemes/page.schema';
import {LOGIN_PAGE, LOGOUT_PAGE, REGISTER_PAGE} from '@/constants/pages.constants';
import {useIsAuthenticated} from '@/hooks/is-authenticated.hook';

@Component({
  selector: 'app-user-links',
  imports: [
    RouterLink
  ],
  templateUrl: './user-links.html',
  styleUrl: './user-links.scss',
})
export class UserLinks {
  public isActive: InputSignal<boolean> = input<boolean>(false);
  protected authenticatedLinks: Page[] = [LOGOUT_PAGE];
  protected nonAuthenticatedLinks: Page[] = [REGISTER_PAGE, LOGIN_PAGE];
  protected isAuthenticated: Signal<boolean> = useIsAuthenticated();

  get links(): Page[] {
    if (this.isAuthenticated()) {
      return this.authenticatedLinks;
    } else {
      return this.nonAuthenticatedLinks;
    }
  }
}
