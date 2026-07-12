import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { Auth } from '../auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: 'login.scss',
})
export class Login {
  email = signal('');
  password = signal('');

  constructor(
    private router: Router,
    private auth: Auth,
  ) {}

  login() {
    this.auth.login(this.email(), this.password()).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);
        setTimeout(() => this.router.navigate(['/dashboard']), 400);
      },
      error: (err) => {
        console.error('Login failed', err);
      },
    });
  }
}
