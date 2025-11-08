import {Component} from '@angular/core';
import {SiteLogo} from '@/components/common/site-logo/site-logo';
import {BurgerIcon} from '@/components/ui/burger-icon/burger-icon';

@Component({
  selector: 'app-header',
  imports: [
    SiteLogo,
    BurgerIcon
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

}
