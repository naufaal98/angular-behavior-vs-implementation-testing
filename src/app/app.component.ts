import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CounterComponent } from './counter/counter.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CounterComponent, LoginFormComponent, UserProfileComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-testing-demo';
}
