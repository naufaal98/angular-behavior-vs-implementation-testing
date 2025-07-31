import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { UserProfileComponent } from './user-profile.component';

describe('User Profile Testing Demo', () => {
    describe('UserProfileComponent | Testing Implementation Details', () => {
        let component: UserProfileComponent;

        beforeEach(() => {
            component = new UserProfileComponent();
        });

        describe('User State Management', () => {
            it('should initialize with no user', () => {
                expect(component.currentUser()).toBeNull();
                expect(component.isLoading()).toBe(false);
                expect(component.error()).toBeNull();
            });

            it('should clear user data when clearUser is called', () => {
                // Set some initial state
                component.currentUser.set({
                    id: 1,
                    name: 'Test User',
                    email: 'test@example.com',
                    role: 'user',
                    isActive: true
                });
                component.error.set('Some error');

                component.clearUser();

                expect(component.currentUser()).toBeNull();
                expect(component.error()).toBeNull();
            });

            it('should toggle user status correctly', () => {
                const mockUser = {
                    id: 1,
                    name: 'Test User',
                    email: 'test@example.com',
                    role: 'user' as const,
                    isActive: true
                };
                component.currentUser.set(mockUser);

                component.toggleUserStatus();

                expect(component.currentUser()?.isActive).toBe(false);

                component.toggleUserStatus();

                expect(component.currentUser()?.isActive).toBe(true);
            });

            it('should not toggle status when no user is set', () => {
                component.currentUser.set(null);

                component.toggleUserStatus();

                expect(component.currentUser()).toBeNull();
            });
        });

        describe('User Role and Status Methods', () => {
            it('should return correct user role', () => {
                expect(component.getUserRole()).toBeNull();

                component.currentUser.set({
                    id: 1,
                    name: 'Admin User',
                    email: 'admin@example.com',
                    role: 'admin',
                    isActive: true
                });

                expect(component.getUserRole()).toBe('admin');
            });

            it('should return correct user active status', () => {
                expect(component.isUserActive()).toBe(false);

                component.currentUser.set({
                    id: 1,
                    name: 'Active User',
                    email: 'active@example.com',
                    role: 'user',
                    isActive: true
                });

                expect(component.isUserActive()).toBe(true);
            });

            it('should correctly identify admin privileges', () => {
                expect(component.hasAdminPrivileges()).toBe(false);

                component.currentUser.set({
                    id: 1,
                    name: 'Admin User',
                    email: 'admin@example.com',
                    role: 'admin',
                    isActive: true
                });

                expect(component.hasAdminPrivileges()).toBe(true);

                component.currentUser.set({
                    id: 2,
                    name: 'Regular User',
                    email: 'user@example.com',
                    role: 'user',
                    isActive: true
                });

                expect(component.hasAdminPrivileges()).toBe(false);
            });
        });

        describe('Welcome Message Logic', () => {
            it('should show welcome message for active users with last login', () => {
                component.currentUser.set({
                    id: 1,
                    name: 'Test User',
                    email: 'test@example.com',
                    role: 'user',
                    isActive: true,
                    lastLogin: new Date('2024-01-15T10:30:00')
                });

                expect(component.canShowWelcomeMessage()).toBe(true);
            });

            it('should not show welcome message for inactive users', () => {
                component.currentUser.set({
                    id: 1,
                    name: 'Test User',
                    email: 'test@example.com',
                    role: 'user',
                    isActive: false,
                    lastLogin: new Date('2024-01-15T10:30:00')
                });

                expect(component.canShowWelcomeMessage()).toBe(false);
            });

            it('should not show welcome message for users without last login', () => {
                component.currentUser.set({
                    id: 1,
                    name: 'Test User',
                    email: 'test@example.com',
                    role: 'user',
                    isActive: true
                });

                expect(component.canShowWelcomeMessage()).toBe(false);
            });
        });

        describe('Date Formatting', () => {
            it('should format date correctly', () => {
                const testDate = new Date('2024-01-15T10:30:00');
                const formatted = component.formatDate(testDate);
                
                expect(formatted).toMatch(/Jan 15, 2024/);
                expect(formatted).toMatch(/10:30/);
            });
        });
    });

    describe('UserProfileComponent | Testing Behavior (User Perspective)', () => {
        it('should handle complete user workflow with admin user (active with login)', async () => {
            await render(UserProfileComponent);

            // Initial state: no user loaded
            expect(screen.getByText('No user data available. Enter an email to load a profile.')).toBeVisible();
            const toggleButton = screen.getByRole('button', { name: /activate user/i });
            expect(toggleButton).toBeDisabled();

            // User selects and loads admin user
            const userSelect = screen.getByRole('combobox');
            const loadButton = screen.getByRole('button', { name: /load profile/i });
            
            await userEvent.selectOptions(userSelect, 'john@example.com');
            await userEvent.click(loadButton);

            // Loading state
            expect(screen.getByText('Loading user data...')).toBeVisible();

            // User data appears with all admin features
            await waitFor(() => {
                expect(screen.getByText('John Admin')).toBeVisible();
            });

            expect(screen.getByText(/Email: john@example\.com/)).toBeVisible();
            expect(screen.getByText(/Role: admin/)).toBeVisible();
            expect(screen.getByText('Active User')).toBeVisible();
            expect(screen.getByText('Admin Controls')).toBeVisible();
            expect(screen.getByRole('button', { name: /admin action/i })).toBeVisible();
            expect(screen.getByText(/Last login:/)).toBeVisible();
            expect(screen.getByText(/Welcome back, John Admin!/)).toBeVisible();

            // Toggle user status
            const deactivateButton = screen.getByRole('button', { name: /deactivate user/i });
            expect(deactivateButton).toBeEnabled();
            await userEvent.click(deactivateButton);

            expect(screen.getByText('Inactive User')).toBeVisible();
            expect(screen.queryByText('Active User')).not.toBeInTheDocument();
            expect(screen.queryByText(/Welcome back/)).not.toBeInTheDocument();

            // Admin action
            const adminButton = screen.getByRole('button', { name: /admin action/i });
            await userEvent.click(adminButton);

            // Clear user
            const clearButton = screen.getByRole('button', { name: /clear/i });
            await userEvent.click(clearButton);

            expect(screen.getByText('No user data available. Enter an email to load a profile.')).toBeVisible();
            expect(screen.queryByText(/Email:/)).not.toBeInTheDocument();
            expect(userSelect).toHaveValue('');
        });

        it('should handle inactive user without login (guest user)', async () => {
            await render(UserProfileComponent);

            const userSelect = screen.getByRole('combobox');
            const loadButton = screen.getByRole('button', { name: /load profile/i });
            
            // Load guest user (no lastLogin)
            await userEvent.selectOptions(userSelect, 'bob@example.com');
            await userEvent.click(loadButton);

            await waitFor(() => {
                expect(screen.getByText('Bob Guest')).toBeVisible();
            });

            expect(screen.getByText(/Role: guest/)).toBeVisible();
            expect(screen.getByText('Active User')).toBeVisible();
            expect(screen.queryByText('Admin Controls')).not.toBeInTheDocument();
            expect(screen.getByText('Never logged in')).toBeVisible();
            expect(screen.queryByText(/Welcome back/)).not.toBeInTheDocument();

            // Toggle to inactive
            const deactivateButton = screen.getByRole('button', { name: /deactivate user/i });
            await userEvent.click(deactivateButton);

            expect(screen.getByText('Inactive User')).toBeVisible();
            expect(screen.getByRole('button', { name: /activate user/i })).toBeVisible();
        });

        it('should handle inactive user with login (regular user)', async () => {
            await render(UserProfileComponent);

            const userSelect = screen.getByRole('combobox');
            const loadButton = screen.getByRole('button', { name: /load profile/i });
            
            // Load regular user (inactive with lastLogin)
            await userEvent.selectOptions(userSelect, 'jane@example.com');
            await userEvent.click(loadButton);

            await waitFor(() => {
                expect(screen.getByText('Jane User')).toBeVisible();
            });

            expect(screen.getByText(/Role: user/)).toBeVisible();
            expect(screen.getByText('Inactive User')).toBeVisible();
            expect(screen.queryByText('Admin Controls')).not.toBeInTheDocument();
            expect(screen.getByText(/Last login:/)).toBeVisible();
            expect(screen.queryByText(/Welcome back/)).not.toBeInTheDocument(); // inactive users don't get welcome

            // Activate user to see welcome message
            const activateButton = screen.getByRole('button', { name: /activate user/i });
            await userEvent.click(activateButton);

            expect(screen.getByText('Active User')).toBeVisible();
            expect(screen.getByText(/Welcome back, Jane User!/)).toBeVisible();
        });

        it('should handle error scenarios and edge cases', async () => {
            const component = await render(UserProfileComponent);

            const userSelect = screen.getByRole('combobox');
            const loadButton = screen.getByRole('button', { name: /load profile/i });
            
            // Test 1: Load button disabled when no selection
            expect(loadButton).toBeDisabled();
            expect(screen.getByText('No user data available. Enter an email to load a profile.')).toBeVisible();
            
            // Test 2: Test the early return branch in loadUserByEmail when selectedEmail is empty
            await userEvent.selectOptions(userSelect, 'john@example.com');
            await userEvent.selectOptions(userSelect, ''); // Clear selection
            expect(loadButton).toBeDisabled();
            
            // Test 3: Simulate user not found error by manipulating component state
            // This tests the error branch in loadUserByEmail
            const componentInstance = component.fixture.componentInstance;
            componentInstance.selectedEmail = 'nonexistent@example.com';
            componentInstance.loadUserByEmail();
            
            // Wait for the error to appear
            await waitFor(() => {
                expect(screen.getByText('User not found')).toBeVisible();
            });
            
            // Verify error state
            expect(screen.queryByText(/Email:/)).not.toBeInTheDocument();
            expect(screen.queryByText(/Welcome back/)).not.toBeInTheDocument();
            
            // Test the implementation detail methods for full function coverage
            expect(componentInstance.getUserRole()).toBeNull();
            expect(componentInstance.isUserActive()).toBe(false);
            expect(componentInstance.hasAdminPrivileges()).toBe(false);
            expect(componentInstance.canShowWelcomeMessage()).toBe(false);
            
            // Test 4: Clear error by loading valid user
            await userEvent.selectOptions(userSelect, 'jane@example.com');
            await userEvent.click(loadButton);
            
            await waitFor(() => {
                expect(screen.getByText('Jane User')).toBeVisible();
            });
            
            // Error should be cleared
            expect(screen.queryByText('User not found')).not.toBeInTheDocument();
            
            // Test 5: Test formatDate function indirectly by checking date display
            expect(screen.getByText(/Last login:/)).toBeVisible();
            expect(screen.getByText(/Jan \d+, 2024/)).toBeVisible(); // Formatted date
        });
    });
});
