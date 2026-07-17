import { inject, Service, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Service()
export class Auth {
  private http = inject(HttpClient);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  login(username: string, password: string){
    return this.http.post<{token: string}>(
      `${environment.apiUrl}/api/auth/signin`,
      {username, password}
    );
  }

  signup(name:string, username:string, email:string,password:string){
    return this.http.post(
      `${environment.apiUrl}/api/auth/signup`,
      {name, username, email, password},
      {responseType: 'text'}
    );
  }

  saveToken(token: string){
    if(this.isBrowser) localStorage.setItem('token',token);
  }

  getToken():string | null {
    return this.isBrowser ? localStorage.getItem('token') : null;
  }

  logout(){
    if(this.isBrowser) localStorage.removeItem('token');
  }
}
