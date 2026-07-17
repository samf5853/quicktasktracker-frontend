import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../auth';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  username = signal('');
  password = signal('');
  error = signal('');

  constructor(
    private router: Router,
    private auth: Auth,
    private titleService: Title,
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Log In ─ QuickTaskTracker');
  }

  private validate(): string | null {
    if (!this.username().trim()) return 'Username is required';
    if (!this.password()) return 'Password is required';
    return null;
  }

  login() {
    const validationError = this.validate();
    if (validationError) {
      this.error.set(validationError);
      return;
    }

    this.auth.login(this.username().trim(), this.password()).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error.set(
          err.status === 401 ? 'Invalid username or password' : 'Login failed — try again',
        );
      },
    });
  }
}
