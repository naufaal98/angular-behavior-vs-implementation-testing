import { Component } from '@angular/core';
import { User, UserInfoComponent } from './user-info.component';

@Component({
  selector: 'app-user-info-page',
  standalone: true,
  imports: [UserInfoComponent],
  template: `
    <div style="padding: 2rem;">
      <h1>User Info</h1>
      <p>This page demonstrates testing a component with inputs.</p>
      <hr />
      <app-user-info [user]="currentUser"></app-user-info>
    </div>
  `,
})
export class UserInfoPageComponent {
  currentUser: User = { name: 'Alice' };
}
