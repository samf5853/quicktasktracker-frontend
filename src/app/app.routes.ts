import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { Signup } from './signup/signup';
import { authGuard, guestGuard, rootRedirectGuard } from './auth.guard';

export const routes: Routes = [
    {path:'', component: Login, canActivate: [rootRedirectGuard]},
    {path:'login', component: Login, canActivate: [guestGuard]},
    {path:'dashboard', component: Dashboard, canActivate: [authGuard]},
    {path: 'signup', component: Signup, canActivate: [guestGuard]},
];
