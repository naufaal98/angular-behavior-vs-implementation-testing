import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { UserListComponent } from './user-list.component';
import { UserService } from './user.service';
import { User } from './user';
import { render, screen, waitFor } from '@testing-library/angular';

describe('UserListComponent', () => {
    describe('UserListComponent (Implementation-Detail Test)', () => {
      let component: UserListComponent;
      let fixture: ComponentFixture<UserListComponent>;
      let userService: UserService;
    
      const mockUsers: User[] = [
        { id: 1, name: 'Leanne Graham', email: 'Sincere@april.biz' },
        { id: 2, name: 'Ervin Howell', email: 'Shanna@melissa.tv' },
      ];
    
      beforeEach(async () => {
        await TestBed.configureTestingModule({
          imports: [UserListComponent],
          providers: [UserService, provideHttpClient(), provideHttpClientTesting()]
        }).compileComponents();
    
        fixture = TestBed.createComponent(UserListComponent);
        component = fixture.componentInstance;
        userService = TestBed.inject(UserService);
      });
    
      it('should load users and stop loading on successful fetch', () => {
        jest.spyOn(userService, 'getUsers').mockReturnValue(of(mockUsers));
    
        fixture.detectChanges(); // triggers ngOnInit
    
        expect(component.isLoading).toBe(false);
        expect(component.error).toBeNull();
        expect(component.users).toEqual(mockUsers);
        expect(userService.getUsers).toHaveBeenCalledTimes(1);
      });
    
      it('should set error and stop loading on failed fetch', () => {
        const errorResponse = new HttpErrorResponse({ status: 500, statusText: 'Server Error' });
        jest.spyOn(userService, 'getUsers').mockReturnValue(throwError(() => errorResponse));
        jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress expected error log
    
        fixture.detectChanges(); // triggers ngOnInit
    
        expect(component.isLoading).toBe(false);
        expect(component.error).toBe(errorResponse.message);
        expect(component.users).toEqual([]);
        expect(userService.getUsers).toHaveBeenCalledTimes(1);
      });
    });
    
    describe('UserListComponent (Behavior-Focused Test)', () => {
      const mockUsers: User[] = [
        { id: 1, name: 'Leanne Graham', email: 'Sincere@april.biz' },
        { id: 2, name: 'Ervin Howell', email: 'Shanna@melissa.tv' },
      ];
    
      async function setup() {
        return render(UserListComponent, {
          providers: [UserService, provideHttpClient(), provideHttpClientTesting()],
        });
      }
    
      it('should show loading, then display users on successful fetch', async () => {
        await setup();
        const httpMock = TestBed.inject(HttpTestingController);
    
        // Initially, the loading message should be visible
        expect(screen.getByText('Loading users...')).toBeInTheDocument();
    
        // Mock the HTTP request
        const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
        expect(req.request.method).toBe('GET');
        req.flush(mockUsers);
    
        // After the request is flushed, the user list should be rendered
        await waitFor(() => {
          expect(screen.queryByText('Loading users...')).not.toBeInTheDocument();
          expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
          expect(screen.getByText('Sincere@april.biz')).toBeInTheDocument();
          expect(screen.getByText('Ervin Howell')).toBeInTheDocument();
          expect(screen.getByText('Shanna@melissa.tv')).toBeInTheDocument();
        });
      });
    
      it('should show loading, then display an error message on failed fetch', async () => {
        await setup();
        const httpMock = TestBed.inject(HttpTestingController);
    
        // Initially, the loading message should be visible
        expect(screen.getByText('Loading users...')).toBeInTheDocument();
    
        // Mock a failed HTTP request
        const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
        req.flush('Something went wrong', { status: 500, statusText: 'Server Error' });
    
        // After the request fails, an error message should be displayed
        await waitFor(() => {
          expect(screen.queryByText('Loading users...')).not.toBeInTheDocument();
          expect(screen.getByText('Failed to load users. Please try again later.')).toBeInTheDocument();
        });
      });
    });
})

