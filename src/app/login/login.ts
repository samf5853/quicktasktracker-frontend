import { HttpClient } from "@angular/common/http";
import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { response } from "express";

@Component({
    selector: 'app-login',
    imports: [FormsModule],
    templateUrl: './login.html',
    styleUrl: 'login.scss',
})

export class Login{
    email = signal('');
    password = signal('');

    constructor(private router: Router, private http: HttpClient){}

    login(){
      this.http.post('http://localhost8080/api/auth/login',{
        email: this.email(),
        password: this.password(),
      }).subscribe({
        next: (response)=>{
          console.log('Logged in',response);
          this.router.navigate(['/dashboard']);
        },
        error: (err)=>{
          console.error('Login failed', err);
        }
      })


    }
}
