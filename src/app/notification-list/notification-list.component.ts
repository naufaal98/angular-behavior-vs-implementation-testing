import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notification } from './notification.model';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <h2>Notifications</h2>

      <div class="filters">
        <button (click)="setFilter('all')" [class.active]="filter === 'all'">All</button>
        <button (click)="setFilter('unread')" [class.active]="filter === 'unread'">Unread ({{ unreadCount }})</button>
        <button (click)="setFilter('read')" [class.active]="filter === 'read'">Read</button>
      </div>

      @if (filteredNotifications.length === 0) {
        <p class="no-notifications">No notifications to display.</p>
      }

      <ul class="notification-list">
        @for (notification of filteredNotifications; track notification.id) {
          <li class="notification-item" [class.read]="notification.read">
            <span>{{ notification.message }}</span>
            @if (!notification.read) {
              <button (click)="markAsRead(notification.id)">Mark as Read</button>
            }
          </li>
        }
      </ul>

      <div class="actions">
        <button (click)="markAllAsRead()" [disabled]="unreadCount === 0">Mark All as Read</button>
        <button (click)="clearReadNotifications()">Clear Read</button>
      </div>
    </div>
  `,
  styles: [`
    .notification-container { max-width: 500px; margin: auto; font-family: sans-serif; }
    .filters button { margin-right: 10px; border: 1px solid #ccc; background: #f0f0f0; padding: 5px 10px; cursor: pointer; }
    .filters button.active { background: #007bff; color: white; border-color: #007bff; }
    .notification-list { list-style: none; padding: 0; margin-top: 20px; }
    .notification-item { display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee; }
    .notification-item.read { color: #888; }
    .notification-item button { background: #28a745; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px; }
    .actions { margin-top: 20px; }
    .actions button { margin-right: 10px; }
    .no-notifications { text-align: center; color: #888; margin-top: 20px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationListComponent {
  notifications: Notification[] = [
    { id: 1, message: 'Your order has shipped.', read: false },
    { id: 2, message: 'A new login was detected.', read: false },
    { id: 3, message: 'Your support ticket was updated.', read: true },
  ];

  filter: 'all' | 'read' | 'unread' = 'all';

  get filteredNotifications(): Notification[] {
    if (this.filter === 'read') {
      return this.notifications.filter(n => n.read);
    }
    if (this.filter === 'unread') {
      return this.notifications.filter(n => !n.read);
    }
    return this.notifications;
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  // Public methods for user interaction
  setFilter(filter: 'all' | 'read' | 'unread'): void {
    this.filter = filter;
  }

  markAsRead(id: number): void {
    // Re-assigning the array to a new array to ensure change detection runs.
    this.notifications = this.notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
  }

  markAllAsRead(): void {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
  }

  clearReadNotifications(): void {
    this.notifications = this.notifications.filter(n => !n.read);
  }

  // Methods for implementation-detail testing
  getNotificationById(id: number): Notification | undefined {
    return this.notifications.find(n => n.id === id);
  }

  getReadNotifications(): Notification[] {
    return this.notifications.filter(n => n.read);
  }
}
