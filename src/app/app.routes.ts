import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { Signup } from './signup/signup';

export const routes: Routes = [
    {path:'login', component: Login},
    {path:'dashboard', component: Dashboard},
    {path: 'signup', component: Signup},
];
