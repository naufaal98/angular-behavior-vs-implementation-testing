import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

export interface User {
  name: string;
}

@Component({
  selector: 'app-user-info',
  standalone: true,
  template: `
    @if (welcomeMessage) {
      <p role="status">{{ welcomeMessage }}</p>
    }
  `,
})
export class UserInfoComponent implements OnChanges {
  @Input({ required: true }) user!: User;

  welcomeMessage = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      this.updateWelcomeMessage();
    }
  }

  private updateWelcomeMessage(): void {
    this.welcomeMessage = `Welcome, ${this.user.name}!`;
  }
}
