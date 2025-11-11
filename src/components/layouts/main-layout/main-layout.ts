import {Component, OnInit} from '@angular/core';
import {ChatsSidebar} from '@/components/common/chats-sidebar/chats-sidebar';
import {Header} from '@/components/common/header/header';
import {useProfile} from '@/hooks/profile.hook';

@Component({
  selector: 'app-main-layout',
  imports: [
    ChatsSidebar,
    Header
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout implements OnInit {
  profile = useProfile();

  ngOnInit(): void {
    console.log(this.profile);
  }
}
