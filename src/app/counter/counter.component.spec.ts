import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CounterComponent } from './counter.component';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

describe('Testing Demo', () => {
    describe('CounterComponent | Testing Implementation', () => {
        let component: CounterComponent;
        let fixture: ComponentFixture<CounterComponent>;
        
        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [CounterComponent]
            }).compileComponents();
        });
        
        beforeEach(() => {
            fixture = TestBed.createComponent(CounterComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });
        
        it('should increment the count', () => {
            component.increment();
            expect(component.count).toBe(1);
        });
        
        it('should decrement the count', () => {
            component.decrement();
            expect(component.count).toBe(-1);
        });
    });

    describe('CounterComponent | Testing Behavior', () => {
        it('should increment the count', async () => {
            // Component rendered to the screen
            await render(CounterComponent);

            // User should be able to see the increment button
            const incrementButton = screen.getByRole('button', { 
                name: /increment/i
            });

            // User should be able to see the initial count
            expect(screen.getByText(/counter: 0/i)).toBeVisible();
            expect(incrementButton).toBeInTheDocument();

            // User should be able to click the increment button
            await userEvent.click(incrementButton);

            // User should see the updated count
            expect(screen.getByText(/counter: 1/i)).toBeVisible();
        })

        it('should decrement the count', async () => {
            await render(CounterComponent);

            const decrementButton = screen.getByText('Decrement');

            expect(screen.getByText('Counter: 0')).toBeVisible();
            expect(decrementButton).toBeInTheDocument();

            await userEvent.click(decrementButton);
            expect(screen.getByText(`Counter: -1`)).toBeVisible();
        })
    })
})