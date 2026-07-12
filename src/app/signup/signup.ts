import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../auth';
import { Router, RouterLink } from '@angular/router';

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
  message = signal('');

  constructor(
    private router: Router,
    private auth: Auth,
  ) {}

  signup() {
    this.auth.signup(this.name(), this.username(), this.email(), this.password()).subscribe({
      next: (res) => {
        this.message.set(res);
        setTimeout(() => this.router.navigate(['/']), 1000);
      },
      error: (err) => {
        this.message.set(err.error || 'Signup failed');
      },
    });
  }
}
