import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login-form',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    template: `
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <h2>Login Form</h2>
            
            <div class="form-group">
                <label for="email">Email:</label>
                <input 
                    id="email" 
                    type="email" 
                    formControlName="email"
                    [class.error]="isEmailInvalid()"
                    data-testid="email-input"
                />
                @if (isEmailInvalid()) {
                    <div class="error-message" data-testid="email-error">
                        @if (loginForm.get('email')?.errors?.['required']) {
                            Email is required
                        }
                        @if (loginForm.get('email')?.errors?.['email']) {
                            Please enter a valid email address
                        }
                    </div>
                }
            </div>

            <div class="form-group">
                <label for="password">Password:</label>
                <input 
                    id="password" 
                    type="password" 
                    formControlName="password"
                    [class.error]="isPasswordInvalid()"
                    data-testid="password-input"
                />
                @if (isPasswordInvalid()) {
                    <div class="error-message" data-testid="password-error">
                        @if (loginForm.get('password')?.errors?.['required']) {
                            Password is required
                        }
                        @if (loginForm.get('password')?.errors?.['minlength']) {
                            Password must be at least 6 characters long
                        }
                    </div>
                }
            </div>

            <button 
                type="submit" 
                data-testid="submit-button"
            >
                Login
            </button>

            @if (submitAttempted() && loginForm.invalid) {
                <div class="form-error" data-testid="form-error">
                    Please fix the errors above before submitting
                </div>
            }

            @if (loginSuccess()) {
                <div class="success-message" data-testid="success-message">
                    Login successful!
                </div>
            }
        </form>
    `,
    styles: [`
        form {
            max-width: 400px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
        }

        .form-group {
            margin-bottom: 16px;
        }

        label {
            display: block;
            margin-bottom: 4px;
            font-weight: bold;
        }

        input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }

        input.error {
            border-color: #e74c3c;
        }

        .error-message {
            color: #e74c3c;
            font-size: 14px;
            margin-top: 4px;
        }

        .form-error {
            color: #e74c3c;
            font-size: 14px;
            margin-top: 16px;
            text-align: center;
        }

        .success-message {
            color: #27ae60;
            font-size: 14px;
            margin-top: 16px;
            text-align: center;
        }

        button {
            width: 100%;
            padding: 10px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }

        button:disabled {
            background-color: #bdc3c7;
            cursor: not-allowed;
        }

        button:not(:disabled):hover {
            background-color: #2980b9;
        }
    `]
})
export class LoginFormComponent {
    loginForm: FormGroup;
    submitAttempted = signal(false);
    loginSuccess = signal(false);

    constructor(private fb: FormBuilder) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    isEmailInvalid(): boolean {
        const emailControl = this.loginForm.get('email');
        return !!(emailControl?.invalid && (emailControl?.dirty || emailControl?.touched || this.submitAttempted()));
    }

    isPasswordInvalid(): boolean {
        const passwordControl = this.loginForm.get('password');
        return !!(passwordControl?.invalid && (passwordControl?.dirty || passwordControl?.touched || this.submitAttempted()));
    }

    validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePasswordLength(password: string): boolean {
        return password.length >= 6;
    }

    onSubmit(): void {
        this.submitAttempted.set(true);
        
        if (this.loginForm.valid) {
            // Simulate successful login
            this.loginSuccess.set(true);
            console.log('Login successful:', this.loginForm.value);
        }
    }

    resetForm(): void {
        this.loginForm.reset();
        this.submitAttempted.set(false);
        this.loginSuccess.set(false);
    }
}
