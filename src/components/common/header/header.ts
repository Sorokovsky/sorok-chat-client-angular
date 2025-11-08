import {Component} from '@angular/core';
import {SiteLogo} from '@/components/common/site-logo/site-logo';

@Component({
  selector: 'app-header',
  imports: [
    SiteLogo
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

}
