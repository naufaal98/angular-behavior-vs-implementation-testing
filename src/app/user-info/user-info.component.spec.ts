import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { User, UserInfoComponent } from './user-info.component';
import { render, screen } from '@testing-library/angular';

describe('UserInfoComponent ', () => {
    // A simple host component to test the @Input()
    describe('UserInfoComponent - Implementation Test', () => {
      @Component({
        standalone: true,
        imports: [UserInfoComponent],
        template: `<app-user-info [user]="user"></app-user-info>`,
      })
      class TestHostComponent {
        @Input() user!: User;
      }
    
      let fixture: ComponentFixture<TestHostComponent>;
      let component: TestHostComponent;
    
      beforeEach(async () => {
        await TestBed.configureTestingModule({
          imports: [TestHostComponent],
        }).compileComponents();
    
        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
      });
    
      it('should call ngOnChanges when the user input changes', () => {
        // Get the child component instance to spy on it
        const userInfoComponentInstance = fixture.debugElement.children[0].componentInstance;
        const ngOnChangesSpy = jest.spyOn(userInfoComponentInstance, 'ngOnChanges');
    
        // Set initial data and trigger change detection
        component.user = { name: 'Alice' };
        fixture.detectChanges();
    
        // The first change is detected
        expect(ngOnChangesSpy).toHaveBeenCalledTimes(1);
    
        // Change the input again
        component.user = { name: 'Bob' };
        fixture.detectChanges();
    
        // Expect ngOnChanges to be called a second time
        expect(ngOnChangesSpy).toHaveBeenCalledTimes(2);
      });

      it('should display the welcome message by querying the DOM directly', () => {
        // This test is also fragile. It's coupled to the `p` tag.
        // If a developer changes it to a `div` or `span`, the test breaks.
        component.user = { name: 'Alice' };
        fixture.detectChanges();

        const p = fixture.nativeElement.querySelector('p');
        expect(p.textContent).toContain('Welcome, Alice!');

        // It also requires manual change detection to test updates.
        component.user = { name: 'Bob' };
        fixture.detectChanges();
        expect(p.textContent).toContain('Welcome, Bob!');
      });
    });


    describe('UserInfoComponent - Behavior Test', () => {
        it('should display a welcome message for the user', async () => {
          await render(UserInfoComponent, {
            componentInputs: { user: { name: 'Alice' } },
          });
      
          expect(screen.getByText('Welcome, Alice!')).toBeInTheDocument();
        });
      
        it('should update the welcome message when the user changes', async () => {
          const { rerender } = await render(UserInfoComponent, {
            componentInputs: { user: { name: 'Alice' } },
          });
      
          // Initial message is correct
          expect(screen.getByText('Welcome, Alice!')).toBeInTheDocument();
      
          // Rerender with new props
          await rerender({ componentInputs: { user: { name: 'Bob' } } });
      
          // The message should update to reflect the new user
          expect(screen.getByText('Welcome, Bob!')).toBeInTheDocument();
        });
    });
});
