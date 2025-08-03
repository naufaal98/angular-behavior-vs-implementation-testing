import { render, screen, within } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { NotificationListComponent } from './notification-list.component';
import { Notification } from './notification.model';

describe('NotificationListComponent', () => {
  // ===================================================================
  // 1. TESTING IMPLEMENTATION DETAILS
  // ===================================================================
  describe('Testing Implementation Details', () => {
    let component: NotificationListComponent;

    beforeEach(() => {
      component = new NotificationListComponent();
      // Set initial state for each test
      component.notifications = [
        { id: 1, message: 'Order shipped', read: false },
        { id: 2, message: 'Login detected', read: true },
        { id: 3, message: 'Ticket updated', read: false },
      ];
    });

    it('should get a notification by its ID', () => {
      const notification = component.getNotificationById(2);
      expect(notification).toBeDefined();
      expect(notification?.message).toBe('Login detected');
    });

    it('should return undefined for a non-existent ID', () => {
      const notification = component.getNotificationById(999);
      expect(notification).toBeUndefined();
    });

    it('should get all read notifications', () => {
      const readNotifications = component.getReadNotifications();
      expect(readNotifications.length).toBe(1);
      expect(readNotifications[0].message).toBe('Login detected');
    });

    it('should correctly calculate the unread count', () => {
      // This tests the `unreadCount` property directly
      expect(component.unreadCount).toBe(2);
    });

    it('should mark a notification as read', () => {
      component.markAsRead(1);
      expect(component.getNotificationById(1)?.read).toBe(true);
    });

    it('should mark all notifications as read', () => {
      component.markAllAsRead();
      expect(component.getReadNotifications().length).toBe(3);
    });

    it('should clear all read notifications', () => {
      component.clearReadNotifications();
      expect(component.notifications.length).toBe(2);
      expect(component.getReadNotifications().length).toBe(0);
    });
  });

  // ===================================================================
  // 2. TESTING BEHAVIOR (USER'S PERSPECTIVE)
  // ===================================================================
  describe('Testing Behavior (User Perspective)', () => {
    async function setup() {
      const { fixture } = await render(NotificationListComponent);
      return { fixture };
    }

    it('should display the initial list of notifications and the unread count', async () => {
      await setup();
      // User sees the notifications
      expect(screen.getByText('Your order has shipped.')).toBeInTheDocument();
      expect(screen.getByText('A new login was detected.')).toBeInTheDocument();
      expect(screen.getByText('Your support ticket was updated.')).toBeInTheDocument();

      // User sees the correct unread count in the filter button
      const unreadFilterButton = screen.getByRole('button', { name: /Unread/ });
      expect(unreadFilterButton).toHaveTextContent('Unread (2)');
    });

    it('should mark a notification as read when the user clicks the button', async () => {
      await setup();
      const firstMessage = 'Your order has shipped.';

      // Find the button associated with the first notification
      const notificationItem = screen.getByText(firstMessage).closest('li');
      if (!notificationItem) throw new Error('Notification item not found');

      const markAsReadButton = within(notificationItem).getByRole('button', { name: /Mark as Read/i });
      
      // User clicks the button
      await userEvent.click(markAsReadButton);

      // The button within the specific item should disappear
      const updatedNotificationItem = screen.getByText(firstMessage).closest('li');
      if (!updatedNotificationItem) throw new Error('Notification item not found after update');
      expect(within(updatedNotificationItem).queryByRole('button', { name: /Mark as Read/i })).not.toBeInTheDocument();
      
      // The unread count in the filter button should decrease
      const unreadFilterButton = screen.getByRole('button', { name: /Unread/ });
      expect(unreadFilterButton).toHaveTextContent('Unread (1)');
    });

    it('should filter the notifications when the user clicks the filter buttons', async () => {
      await setup();

      // User clicks 'Read' filter. Use a precise regex to avoid matching 'Mark all as Read'.
      await userEvent.click(screen.getByRole('button', { name: /^Read$/ }));
      expect(screen.queryByText('Your order has shipped.')).not.toBeInTheDocument();
      expect(screen.getByText('Your support ticket was updated.')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem').length).toBe(1);

      // User clicks 'Unread' filter
      await userEvent.click(screen.getByRole('button', { name: /Unread/ }));
      expect(screen.getByText('Your order has shipped.')).toBeInTheDocument();
      expect(screen.queryByText('Your support ticket was updated.')).not.toBeInTheDocument();
      expect(screen.getAllByRole('listitem').length).toBe(2);

      // User clicks 'All' filter. Use a precise regex to avoid matching 'Mark All as Read'.
      await userEvent.click(screen.getByRole('button', { name: /^All$/ }));
      expect(screen.getByText('Your order has shipped.')).toBeInTheDocument();
      expect(screen.getByText('Your support ticket was updated.')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem').length).toBe(3);
    });

    it('should display a message when a filter results in an empty list', async () => {
      await setup();

      // Mark all as read
      await userEvent.click(screen.getByRole('button', { name: /Mark All as Read/i }));

      // Filter by unread
      await userEvent.click(screen.getByRole('button', { name: /Unread/ }));

      // User should see a friendly message
      expect(screen.getByText('No notifications to display.')).toBeInTheDocument();
    });

    it('should clear all read notifications when the user clicks the clear button', async () => {
      await setup();

      // There is one read notification initially
      expect(screen.getByText('Your support ticket was updated.')).toBeInTheDocument();

      // User clicks the clear button
      await userEvent.click(screen.getByRole('button', { name: /Clear Read/i }));

      // The read notification should be gone
      expect(screen.queryByText('Your support ticket was updated.')).not.toBeInTheDocument();
      expect(screen.getAllByRole('listitem').length).toBe(2);
    });
  });
});
