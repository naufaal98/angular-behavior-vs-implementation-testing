import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'guest';
    isActive: boolean;
    lastLogin?: Date;
}

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="user-profile">
            <h2>User Profile</h2>
            
            <div class="user-controls">
                <div class="user-selector">
                    <select 
                        [(ngModel)]="selectedEmail" 
                        [disabled]="isLoading()"
                    >
                        <option value="">Select a user to load profile</option>
                        <option value="john@example.com">John (Admin)</option>
                        <option value="jane@example.com">Jane (User)</option>
                        <option value="bob@example.com">Bob (Guest)</option>
                    </select>
                    <button (click)="loadUserByEmail()" [disabled]="!selectedEmail || isLoading()">
                        Load Profile
                    </button>
                </div>
                <button (click)="clearUser()">Clear Profile</button>
                <button (click)="toggleUserStatus()" [disabled]="!currentUser()">
                    @if (currentUser()?.isActive) {
                        Deactivate User
                    } @else {
                        Activate User
                    }
                </button>
            </div>

            @if (isLoading()) {
                <div class="loading">Loading user data...</div>
            }

            @if (error()) {
                <div class="error">{{ error() }}</div>
            }

            @if (currentUser() && !isLoading()) {
                <div class="user-details">
                    <h3>{{ currentUser()!.name }}</h3>
                    <p>Email: {{ currentUser()!.email }}</p>
                    <p>Role: {{ currentUser()!.role }}</p>
                    
                    @if (currentUser()!.isActive) {
                        <div class="status active">
                            <span class="status-indicator"></span>
                            Active User
                        </div>
                    } @else {
                        <div class="status inactive">
                            <span class="status-indicator"></span>
                            Inactive User
                        </div>
                    }

                    @if (currentUser()!.role === 'admin') {
                        <div class="admin-panel">
                            <h4>Admin Controls</h4>
                            <button (click)="performAdminAction()">Admin Action</button>
                        </div>
                    }

                    @if (currentUser()!.lastLogin) {
                        <p class="last-login">
                            Last login: {{ formatDate(currentUser()!.lastLogin!) }}
                        </p>
                    } @else {
                        <p class="never-logged-in">Never logged in</p>
                    }

                    @if (shouldShowWelcomeMessage()) {
                        <div class="welcome-message">
                            Welcome back, {{ currentUser()!.name }}!
                        </div>
                    }
                </div>
            }

            @if (!currentUser() && !isLoading() && !error()) {
                <div class="no-user">No user data available. Enter an email to load a profile.</div>
            }
        </div>
    `,
    styles: [`
        .user-profile {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
        }

        .user-controls {
            margin-bottom: 20px;
        }

        .user-selector {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
            align-items: center;
        }

        .user-selector select {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            background-color: white;
        }

        .user-selector select:disabled {
            background-color: #f5f5f5;
            cursor: not-allowed;
        }

        .user-controls button {
            margin-right: 10px;
            padding: 8px 16px;
            border: 1px solid #007bff;
            background: #007bff;
            color: white;
            border-radius: 4px;
            cursor: pointer;
        }

        .user-controls button:hover:not(:disabled) {
            background: #0056b3;
        }

        .user-controls button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .loading {
            color: #007bff;
            font-style: italic;
        }

        .error {
            color: #dc3545;
            background: #f8d7da;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #f5c6cb;
        }

        .user-details {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 4px;
        }

        .status {
            display: flex;
            align-items: center;
            margin: 10px 0;
        }

        .status-indicator {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 8px;
        }

        .status.active .status-indicator {
            background: #28a745;
        }

        .status.inactive .status-indicator {
            background: #dc3545;
        }

        .admin-panel {
            background: #fff3cd;
            padding: 15px;
            border-radius: 4px;
            border: 1px solid #ffeaa7;
            margin: 15px 0;
        }

        .admin-panel h4 {
            margin-top: 0;
            color: #856404;
        }

        .admin-panel button {
            background: #ffc107;
            border: 1px solid #ffc107;
            color: #212529;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
        }

        .last-login {
            font-size: 14px;
            color: #6c757d;
        }

        .never-logged-in {
            font-size: 14px;
            color: #dc3545;
            font-style: italic;
        }

        .welcome-message {
            background: #d4edda;
            color: #155724;
            padding: 10px;
            border-radius: 4px;
            margin-top: 10px;
        }

        .no-user {
            color: #6c757d;
            font-style: italic;
            text-align: center;
            padding: 40px;
        }
    `]
})
export class UserProfileComponent {
    currentUser = signal<User | null>(null);
    isLoading = signal(false);
    error = signal<string | null>(null);
    selectedEmail = '';

    private mockUsers: User[] = [
        {
            id: 1,
            name: 'John Admin',
            email: 'john@example.com',
            role: 'admin',
            isActive: true,
            lastLogin: new Date('2024-01-15T10:30:00')
        },
        {
            id: 2,
            name: 'Jane User',
            email: 'jane@example.com',
            role: 'user',
            isActive: false,
            lastLogin: new Date('2024-01-10T14:20:00')
        },
        {
            id: 3,
            name: 'Bob Guest',
            email: 'bob@example.com',
            role: 'guest',
            isActive: true
        }
    ];

    loadUserByEmail(): void {
        if (!this.selectedEmail) return;
        
        this.error.set(null);
        this.isLoading.set(true);

        // Simulate API call to fetch user by email
        setTimeout(() => {
            const user = this.mockUsers.find(u => u.email === this.selectedEmail.toLowerCase());
            
            if (user) {
                this.currentUser.set(user);
                this.error.set(null);
            } else {
                this.currentUser.set(null);
                this.error.set('User not found');
            }
            
            this.isLoading.set(false);
        }, 100);
    }

    clearUser(): void {
        this.currentUser.set(null);
        this.error.set(null);
        this.selectedEmail = '';
    }

    toggleUserStatus(): void {
        const user = this.currentUser();
        if (user) {
            this.currentUser.set({
                ...user,
                isActive: !user.isActive
            });
        }
    }

    performAdminAction(): void {
        console.log('Admin action performed');
    }

    formatDate(date: Date): string {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    shouldShowWelcomeMessage(): boolean {
        const user = this.currentUser();
        return !!(user && user.isActive && user.lastLogin);
    }

    // Methods for testing implementation details
    getUserRole(): string | null {
        return this.currentUser()?.role || null;
    }

    isUserActive(): boolean {
        return this.currentUser()?.isActive || false;
    }

    hasAdminPrivileges(): boolean {
        return this.currentUser()?.role === 'admin';
    }

    canShowWelcomeMessage(): boolean {
        return this.shouldShowWelcomeMessage();
    }
}
