import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CounterComponent } from './counter/counter.component';
import { LoginFormComponent } from './login-form/login-form.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CounterComponent, LoginFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-testing-demo';
}
