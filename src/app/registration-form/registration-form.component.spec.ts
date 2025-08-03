import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { RegistrationFormComponent } from './registration-form.component';

describe('RegistrationFormComponent', () => {
  describe('RegistrationFormComponent | Testing Implementation', () => {
    let component: RegistrationFormComponent;
    let fixture: ComponentFixture<RegistrationFormComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [RegistrationFormComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(RegistrationFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should update the model on input', () => {
      component.model.email = 'test@example.com';
      component.model.password = 'password123';

      expect(component.model.email).toBe('test@example.com');
      expect(component.model.password).toBe('password123');
    });

    it('should set isSubmitted to true on submit', async () => {
      // Arrange: Fill the component model and wait for Angular to update the form state
      component.model.email = 'test@example.com';
      component.model.password = 'password123';
      fixture.detectChanges();
      await fixture.whenStable();

      // Act: Get the form instance from the fixture and call onSubmit
      const formDebugElement = fixture.debugElement.query(By.css('form'));
      const form = formDebugElement.injector.get(NgForm);
      component.onSubmit(form);

      // Assert
      expect(component.isSubmitted).toBe(true);
    });

    it('should display error messages on failed submission', () => {
      // Arrange: Get the form instance
      const formDebugElement = fixture.debugElement.query(By.css('form'));
      const form = formDebugElement.injector.get(NgForm);

      // Act: Manually trigger submission on an invalid form
      component.onSubmit(form);
      fixture.detectChanges(); // Manually trigger change detection to show errors

      // Assert: Check for specific DOM elements and internal state
      const errorMessages = fixture.debugElement.queryAll(By.css('.error-message'));
      expect(errorMessages.length).toBe(2);
      expect(errorMessages[0].nativeElement.textContent).toContain('Please enter a valid email.');
      expect(errorMessages[1].nativeElement.textContent).toContain('Password must be at least 8 characters.');
      expect(component.isSubmitted).toBe(false);
    });
  });

  describe('RegistrationFormComponent | Testing Behavior', () => {
    it('should allow a user to register', async () => {
      await render(RegistrationFormComponent);

      // Find form elements
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const createButton = screen.getByRole('button', { name: /create account/i });

      // Initially, the success message is not visible
      expect(screen.queryByText(/registration successful!/i)).toBeNull();

      // The button is always enabled, so we don't check for a disabled state

      // Simulate user typing
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');

      // Submit the form
      await userEvent.click(createButton);

      // The success message and new button should be visible
      expect(await screen.findByRole('heading', { name: /registration successful!/i })).toBeVisible();
      const resetButton = screen.getByRole('button', { name: /register another account/i });
      expect(resetButton).toBeVisible();

      // The form should be gone
      expect(screen.queryByLabelText(/email/i)).toBeNull();
    });

    it('should show error messages when submitting an empty form', async () => {
      await render(RegistrationFormComponent);

      // Find the button and click it while the form is empty
      const createButton = screen.getByRole('button', { name: /create account/i });
      await userEvent.click(createButton);

      // Assert that the error messages appear
      expect(await screen.findByText(/please enter a valid email/i)).toBeVisible();
      expect(await screen.findByText(/password must be at least 8 characters/i)).toBeVisible();

      // Assert that the success message is NOT shown
      expect(screen.queryByText(/registration successful!/i)).toBeNull();
    });
  })
})
