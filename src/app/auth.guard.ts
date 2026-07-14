import {inject} from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import {Auth} from './auth';

// Guards the dashboard - no token, no entry
export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if(auth.getToken()){
    return true;
  }
  return router.createUrlTree(['/login'])
};

export const guestGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.getToken()){
    return router.createUrlTree(['/dashboard'])
  }
  return true;
}

export const rootRedirectGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return router.createUrlTree(auth.getToken() ? ['/dashboard'] : ['/login'])
}
