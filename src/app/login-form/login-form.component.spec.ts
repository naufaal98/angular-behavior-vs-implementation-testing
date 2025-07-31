import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { LoginFormComponent } from './login-form.component';
import { FormBuilder } from '@angular/forms';

describe('Login Form Testing Demo', () => {
    describe('LoginFormComponent | Testing Implementation Details', () => {
        let component: LoginFormComponent;
        let formBuilder: FormBuilder;

        beforeEach(() => {
            formBuilder = new FormBuilder();
            component = new LoginFormComponent(formBuilder);
        });

        describe('Form Validation Methods', () => {
            it('should validate email format correctly', () => {
                expect(component.validateEmail('test@example.com')).toBe(true);
                expect(component.validateEmail('invalid-email')).toBe(false);
                expect(component.validateEmail('')).toBe(false);
            });

            it('should validate password length correctly', () => {
                expect(component.validatePasswordLength('123456')).toBe(true);
                expect(component.validatePasswordLength('12345')).toBe(false);
                expect(component.validatePasswordLength('')).toBe(false);
            });

            it('should return true when email is invalid', () => {
                component.loginForm.get('email')?.setValue('invalid-email');
                component.loginForm.get('email')?.markAsTouched();
                
                expect(component.isEmailInvalid()).toBe(true);
            });

            it('should return true when password is invalid', () => {
                component.loginForm.get('password')?.setValue('123');
                component.loginForm.get('password')?.markAsTouched();
                
                expect(component.isPasswordInvalid()).toBe(true);
            });
        });

        describe('Form State Management', () => {
            it('should set submitAttempted to true when onSubmit is called', () => {
                component.onSubmit();
                expect(component.submitAttempted()).toBe(true);
            });

            it('should set loginSuccess to true when form is valid and submitted', () => {
                component.loginForm.get('email')?.setValue('test@example.com');
                component.loginForm.get('password')?.setValue('password123');
                
                component.onSubmit();
                
                expect(component.loginSuccess()).toBe(true);
            });

            it('should reset form state when resetForm is called', () => {
                component.submitAttempted.set(true);
                component.loginSuccess.set(true);
                
                component.resetForm();
                
                expect(component.submitAttempted()).toBe(false);
                expect(component.loginSuccess()).toBe(false);
                expect(component.loginForm.get('email')?.value).toBe(null);
            });
        });

        describe('Form Validation State', () => {
            it('should mark form as invalid when email is missing', () => {
                component.loginForm.get('email')?.setValue('');
                component.loginForm.get('password')?.setValue('password123');
                
                expect(component.loginForm.invalid).toBe(true);
            });

            it('should mark form as invalid when password is too short', () => {
                component.loginForm.get('email')?.setValue('test@example.com');
                component.loginForm.get('password')?.setValue('123');
                
                expect(component.loginForm.invalid).toBe(true);
            });
        });
    });

    describe('LoginFormComponent | Testing Behavior (User Perspective)', () => {
        it('should show email error when user enters invalid email', async () => {
            await render(LoginFormComponent);
            
            const emailInput = screen.getByLabelText(/email/i);
            
            // User types invalid email and moves away
            await userEvent.type(emailInput, 'invalid-email');
            await userEvent.tab();
            
            // User should see error message
            expect(screen.getByText('Please enter a valid email address')).toBeVisible();
        });

        it('should show password error when user enters short password', async () => {
            await render(LoginFormComponent);
            
            const passwordInput = screen.getByLabelText(/password/i);
            
            // User types short password and moves away
            await userEvent.type(passwordInput, '123');
            await userEvent.tab();
            
            // User should see error message
            expect(screen.getByText('Password must be at least 6 characters long')).toBeVisible();
        });

        it('should show required field errors when user submits empty form', async () => {
            await render(LoginFormComponent);
            
            const emailInput = screen.getByLabelText(/email/i);
            const passwordInput = screen.getByLabelText(/password/i);
            const submitButton = screen.getByRole('button', { name: /login/i });
            
            // User focuses on fields (making them touched) then submits empty form
            await userEvent.click(emailInput);
            await userEvent.click(passwordInput);
            await userEvent.click(submitButton);
            
            // User should see both error messages
            expect(screen.getByText('Email is required')).toBeVisible();
            expect(screen.getByText('Password is required')).toBeVisible();
            expect(screen.getByText('Please fix the errors above before submitting')).toBeVisible();
        });

        it('should clear errors when user corrects invalid input', async () => {
            await render(LoginFormComponent);
            
            const emailInput = screen.getByLabelText(/email/i);
            
            // User enters invalid email
            await userEvent.type(emailInput, 'invalid-email');
            await userEvent.tab();
            
            // Error should be visible
            expect(screen.getByText('Please enter a valid email address')).toBeVisible();
            
            // User corrects the email
            await userEvent.clear(emailInput);
            await userEvent.type(emailInput, 'valid@example.com');
            await userEvent.tab();
            
            // Error should be gone
            expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
        });

        it('should show appropriate error styling on invalid fields', async () => {
            await render(LoginFormComponent);
            
            const emailInput = screen.getByLabelText(/email/i);
            const passwordInput = screen.getByLabelText(/password/i);
            
            // User enters invalid data
            await userEvent.type(emailInput, 'invalid-email');
            await userEvent.type(passwordInput, '123');
            await userEvent.tab();
            
            // Fields should have error styling
            expect(emailInput).toHaveClass('error');
            expect(passwordInput).toHaveClass('error');
        });

        it('should handle complete user workflow from error to success', async () => {
            await render(LoginFormComponent);
            
            const emailInput = screen.getByLabelText(/email/i);
            const passwordInput = screen.getByLabelText(/password/i);
            const submitButton = screen.getByRole('button', { name: /login/i });
            
            // User focuses on fields then tries to submit empty form
            await userEvent.click(emailInput);
            await userEvent.click(passwordInput);
            await userEvent.click(submitButton);
            expect(screen.getByText('Email is required')).toBeVisible();
            expect(screen.getByText('Password is required')).toBeVisible();
            
            // User enters invalid email
            await userEvent.type(emailInput, 'invalid');
            await userEvent.tab();
            expect(screen.getByText('Please enter a valid email address')).toBeVisible();
            
            // User corrects email but enters short password
            await userEvent.clear(emailInput);
            await userEvent.type(emailInput, 'test@example.com');
            await userEvent.type(passwordInput, '123');
            await userEvent.tab();
            expect(screen.getByText('Password must be at least 6 characters long')).toBeVisible();
            
            // User corrects password
            await userEvent.clear(passwordInput);
            await userEvent.type(passwordInput, 'password123');
            
            // User successfully submits
            await userEvent.click(submitButton);
            expect(screen.getByText('Login successful!')).toBeVisible();
            
            // No error messages should be visible
            expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
            expect(screen.queryByText('Password is required')).not.toBeInTheDocument();
            expect(screen.queryByText('Please fix the errors above before submitting')).not.toBeInTheDocument();
        });
    });
});
