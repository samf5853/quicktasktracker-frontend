import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Auth } from './auth';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) =>{
  const auth = inject(Auth);
  const router = inject(Router);
  const token = auth.getToken();

  const authReq = token
    ? req.clone({setHeaders:{Authorization: `Bearer ${token}`}}) : req;

  return next(authReq).pipe(
    catchError((err:HttpErrorResponse) => {
      if(err.status === 401){
        auth.logout();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  )
}
