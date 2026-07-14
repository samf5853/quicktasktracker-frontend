import { Component, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from '../auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

interface User {
  name: string;
  username: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  user = signal<User | null>(null);
  tasks = signal<Task[]>([]);
  newTitle = signal('');
  newDescription = signal('');
  error = signal('');

  constructor(
    private http: HttpClient,
    private auth: Auth,
    private router: Router,
  ) {
    this.loadUser();
    this.loadTasks();
  }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.auth.getToken()}`);
  }

  loadUser() {
    this.http
      .get<User>('http://localhost:8080/api/users/me', { headers: this.authHeaders() })
      .subscribe({
        next: (res) => this.user.set(res),
        error: (err) => console.error('Failed to load user', err),
      });
  }

  loadTasks() {
    this.http
      .get<Task[]>('http://localhost:8080/api/tasks', { headers: this.authHeaders() })
      .subscribe({
        next: (data) => this.tasks.set(data),
        error: (err) => console.error('Failed to load tasks', err),
      });
  }

  createTask() {
    const title = this.newTitle();
    if (!title) {
      this.error.set('Title is required');
      return;
    }

    this.http.post<Task>(
      'http://localhost:8080/api/tasks',
      {title, description: this.newDescription().trim()},
      {headers: this.authHeaders()}
    ).subscribe({
      next:() => {
        this.newTitle.set('');
        this.newDescription.set('');
        this.error.set('');
        this.loadTasks();
      },
      error: () => this.error.set('Failed to create task'),
    });
  }

  deleteTask(id: number) {
    this.http.delete(`http://localhost:8080/api/tasks/${id}`, { headers: this.authHeaders() })
      .subscribe({
        next: () => this.loadTasks(),
        error: () => this.error.set('Failed to delete task')
      }
    )
  }

  onCardMove(e: MouseEvent) {
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty('--y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }

  onCardLeave(e: MouseEvent) {
    const el = e.currentTarget as HTMLElement;
    el.style.setProperty('--x', '50%');
    el.style.setProperty('--y', '50%');
  }

  toggleComplete(task: Task) {
    this.http
      .put<Task>(
        `http://localhost:8080/api/tasks/${task.id}`,
        { completed: !task.completed },
        { headers: this.authHeaders() },
      )
      .subscribe({
        next: () => this.loadTasks(),
        error: (err) => console.error('Failed to update task', err),
      });
  }

  logout(){
    this.auth.logout();
    setTimeout(() => this.router.navigate(['/']), 500);
  }

  formatCreatedAt(iso: string): string {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }
}
