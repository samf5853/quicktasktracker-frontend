import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../auth';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  name = signal('');
  username = signal('');
  email = signal('');
  password = signal('');
  error = signal('');

  constructor(
    private router: Router,
    private auth: Auth,
  ) {}

  private validate(): string | null {
    const name = this.name().trim();
    const username = this.username().trim();
    const email = this.email().trim();
    const password = this.password();

    if (name.length < 2 || name.length > 30) return 'Name must be 2–30 characters';
    if (username.length < 4 || username.length > 20) return 'Username must be 4–20 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 50)
      return 'Enter a valid email address';
    if (password.length < 6 || password.length > 40) return 'Password must be 6–40 characters';
    return null;
  }

  signup() {
    const validationError = this.validate();
    if (validationError) {
      this.error.set(validationError);
      return;
    }

    this.auth
      .signup(this.name().trim(), this.username().trim(), this.email().trim(), this.password())
      .subscribe({
        next: () => {
          this.auth.login(this.username().trim(), this.password()).subscribe({
            next: (res) => {
              this.auth.saveToken(res.token);
              this.router.navigate(['/dashboard']);
            },
            error: () => {
              this.error.set('Account created — please log in.');
              this.router.navigate(['/login']);
            },
          });
        },
        error: (err) => {
          this.error.set(typeof err.error === 'string' ? err.error : 'Signup failed');
        },
      });
  }
}
