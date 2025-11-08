import {Component} from '@angular/core';
import {Logo} from "@/components/ui/logo/logo";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-site-logo',
  imports: [
    Logo,
    RouterLink
  ],
  templateUrl: './site-logo.html',
  styleUrl: './site-logo.scss',
})
export class SiteLogo {

}
