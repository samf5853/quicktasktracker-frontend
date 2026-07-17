import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { Signup } from './signup/signup';
import { authGuard, guestGuard, rootRedirectGuard } from './auth.guard';
import { Landing } from './landing/landing';

export const routes: Routes = [
    {path:'', component: Landing, canActivate: [rootRedirectGuard]},
    {path:'login', component: Login, canActivate: [guestGuard]},
    {path:'dashboard', component: Dashboard, canActivate: [authGuard]},
    {path: 'signup', component: Signup, canActivate: [guestGuard]},
];
