import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NotificationListComponent } from './notification-list/notification-list.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-behavior-vs-implementation-testing';
}
