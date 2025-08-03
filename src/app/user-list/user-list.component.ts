import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { User } from './user';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>User Directory</h2>

      @if (state.isLoading) {
        <p class="loading">Loading users...</p>
      }

      @if (state.error) {
        <p class="error">Failed to load users. Please try again later.</p>
      }

      @if (!state.isLoading && !state.error && state.users.length > 0) {
        <ul class="user-list">
          @for (user of state.users; track user.id) {
            <li>
              <img [src]="'https://i.pravatar.cc/70?u=' + user.id" [alt]="user.name">
              <div>
                <p class="name">{{ user.name }}</p>
                <p class="email">{{ user.email }}</p>
              </div>
            </li>
          }
        </ul>
      }
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 1rem;
    }
    h2 {
      text-align: center;
      margin-bottom: 2rem;
      color: #1f2937;
    }
    .loading, .error {
      text-align: center;
      font-size: 1.2rem;
      color: #6b7280;
    }
    .error {
      color: #ef4444;
    }
    .user-list {
      list-style: none;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    .user-list li {
      display: flex;
      align-items: center;
      padding: 1rem;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .user-list li:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
    }
    .user-list img {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      margin-right: 1rem;
    }
    .user-list .name {
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }
    .user-list .email {
      color: #6b7280;
      margin: 0.25rem 0 0;
    }
  `]
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);

  state = {
    users: [] as User[],
    isLoading: true,
    error: null as string | null,
  };

  ngOnInit(): void {
    this.userService.getUsers()
      .pipe(
        finalize(() => this.state.isLoading = false)
      )
      .subscribe({
        next: (users) => {
          this.state.users = users;
        },
        error: (err: HttpErrorResponse) => {
          this.state.error = err.message;
          console.error('Failed to load users:', err);
        }
      });
  }
}
