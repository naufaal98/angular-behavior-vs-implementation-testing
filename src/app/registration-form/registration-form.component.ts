import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-container">
      @if (!isSubmitted) {
        <div>
          <h2>Register Account</h2>
          <form #registrationForm="ngForm" (ngSubmit)="onSubmit(registrationForm)">
            <div class="form-field">
              <label for="email">Email</label>
              <input id="email" name="email" type="email" [(ngModel)]="model.email" required email #email="ngModel">
              @if (email.invalid && (email.dirty || email.touched || registrationForm.submitted)) {
                <div class="error-message p-2 text-red-500 text-xs">
                  Please enter a valid email.
                </div>
              }
            </div>
            <div class="form-field">
              <label for="password">Password</label>
              <input id="password" name="password" type="password" [(ngModel)]="model.password" required minlength="8" #password="ngModel">
              @if (password.invalid && (password.dirty || password.touched || registrationForm.submitted)) {
                <div class="error-message p-2 text-red-500 text-xs">
                  Password must be at least 8 characters.
                </div>
              }
            </div>
            <button type="submit">Create Account</button>
          </form>
        </div>
      } @else {
        <div class="success-message" role="alert">
          <h2>Registration Successful!</h2>
          <p>Thank you for registering.</p>
          <button (click)="resetForm()">Register Another Account</button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
      }
      .form-container {
        width: 100%;
        max-width: 420px;
        padding: 2rem;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        border: 1px solid #e5e7eb;
      }
      h2 {
        text-align: center;
        color: #111827;
        margin-bottom: 1.5rem;
        font-size: 1.75rem;
      }
      .form-field {
        margin-bottom: 1.5rem;
      }
      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #374151;
      }
      input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        box-sizing: border-box;
        transition: border-color 0.2s, box-shadow 0.2s;
      }
      input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
      }
      button {
        width: 100%;
        padding: 0.75rem;
        border: none;
        border-radius: 6px;
        background-color: #3b82f6;
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      button:hover {
        background-color: #2563eb;
      }
      .success-message {
        text-align: center;
      }
      .success-message h2 {
        color: #16a34a;
      }
      .success-message p {
        margin-bottom: 1.5rem;
        color: #4b5563;
      }
      .error-message {
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.5rem;
      }
    `,
  ],
})
export class RegistrationFormComponent {
  model = { email: '', password: '' };
  isSubmitted = false;

  onSubmit(form: NgForm) {
    if (form.invalid) {
      // Mark all fields as touched to display validation messages
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    console.log('Form Submitted!', this.model);
    this.isSubmitted = true;
  }

  resetForm() {
    this.model = { email: '', password: '' };
    this.isSubmitted = false;
  }
}
