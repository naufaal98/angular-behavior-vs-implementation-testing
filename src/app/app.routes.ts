import { Routes } from '@angular/router';
import { CounterComponent } from './counter/counter.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserInfoPageComponent } from './user-info/user-info-page.component';

export const routes: Routes = [
    { path: '', redirectTo: '/counter', pathMatch: 'full' },
    { path: 'counter', component: CounterComponent },
    { path: 'registration', component: RegistrationFormComponent },
    { path: 'users', component: UserListComponent },
    { path: 'user-info', component: UserInfoPageComponent }
];
