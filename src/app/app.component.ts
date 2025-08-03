import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { NotificationListComponent } from './notification-list/notification-list.component';


@Component({
  selector: 'app-root',
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-behavior-vs-implementation-testing';
}
