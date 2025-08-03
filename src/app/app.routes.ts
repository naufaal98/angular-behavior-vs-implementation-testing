import { Routes } from '@angular/router';
import { CounterComponent } from './counter/counter.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { UserListComponent } from './user-list/user-list.component';

export const routes: Routes = [
    { path: 'counter', component: CounterComponent },
        { path: 'registration', component: RegistrationFormComponent },
    { path: 'users', component: UserListComponent }
];
