import { Component, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Title } from '@angular/platform-browser';

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

type FilterState = 'all' | 'active' | 'completed';

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
  filter = signal<FilterState>('all');
  editingTaskId = signal<number | null>(null);
  editTitle = signal('');
  editDescription = signal('');
  pulsingTaskId = signal<number | null>(null);
  pendingDeleteId = signal<number | null>(null);
  pendingDeleteTitle = signal('');
  userMenuOpen = signal(false);

  private deleteTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private swipeStartX = 0;
  private swipeDeltaX = 0;
  private swipeCardWidth = 0;

  onEditTap(e: MouseEvent, task: Task) {
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--px', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty('--py', `${((e.clientY - rect.top) / rect.height) * 100}%`);

    this.pulsingTaskId.set(task.id);
    setTimeout(() => this.pulsingTaskId.set(null), 500);

    this.editingTaskId.set(task.id);
    this.editTitle.set(task.title);
    this.editDescription.set(task.description);
  }

  saveEdit(task: Task) {
    const title = this.editTitle().trim();
    if (!title) {
      this.error.set('Title is required');
      return;
    }

    this.http
      .put<Task>(`${environment.apiUrl}/api/tasks/${task.id}`, {
        title,
        description: this.editDescription().trim(),
      })
      .subscribe({
        next: () => {
          this.editingTaskId.set(null);
          this.loadTasks();
        },
        error: () => this.error.set('Failed to update task'),
      });
  }

  cancelEdit() {
    this.editingTaskId.set(null);
  }

  onSwipeStart(e: TouchEvent, task: Task) {
    if (this.editingTaskId() === task.id) return;
    this.swipeStartX = e.touches[0].clientX;
    this.swipeCardWidth = (e.currentTarget as HTMLElement).getBoundingClientRect().width;
  }

  onSwipeMove(e: TouchEvent, task: Task) {
    if (this.editingTaskId() === task.id) return;

    this.swipeDeltaX = e.touches[0].clientX - this.swipeStartX;
    const card = e.currentTarget as HTMLElement;
    const indicator = card.parentElement!.querySelector('.swipe-indicator') as HTMLElement;

    card.style.transform = `translateX(${this.swipeDeltaX}px)`;
    indicator.style.background =
      this.swipeDeltaX > 0
        ? `rgba(34,197,94, ${Math.min(this.swipeDeltaX / 150, 0.9)})`
        : `rgba(239,68,68, ${Math.min(Math.abs(this.swipeDeltaX) / 150, 0.9)})`;
  }

  onSwipeEnd(e: TouchEvent, task: Task) {
    if (this.editingTaskId() === task.id) return;

    const card = e.currentTarget as HTMLElement;
    const indicator = card.parentElement!.querySelector('.swipe-indicator') as HTMLElement;
    const threshold = this.swipeCardWidth * 0.4; // 40% of the card's width

    if (this.swipeDeltaX > threshold) this.toggleComplete(task);
    else if (this.swipeDeltaX < -threshold) this.confirmDelete(task);

    card.style.transform = 'translateX(0)';
    indicator.style.background = 'transparent';
    this.swipeDeltaX = 0;
  }

  totalCount = computed(() => this.tasks().length);
  completedCount = computed(() => this.tasks().filter((t) => t.completed).length);
  completionPercent = computed(() =>
    this.totalCount() === 0 ? 0 : Math.round((this.completedCount() / this.totalCount()) * 100),
  );

  filteredTasks = computed(() => {
    const current = this.filter();
    const all = this.tasks();
    if (current === 'active') return all.filter((t) => !t.completed);
    if (current === 'completed') return all.filter((t) => t.completed);
    return all;
  });

  constructor(
    private http: HttpClient,
    private auth: Auth,
    private router: Router,
    private titleService: Title,
  ) {
    this.loadUser();
    this.loadTasks();
  }

  ngOnInit() {
    this.titleService.setTitle('Dashboard ─ QuickTaskTracker');
  }

  loadUser() {
    this.http.get<User>(`${environment.apiUrl}/api/users/me`).subscribe({
      next: (res) => this.user.set(res),
      error: (err) => console.error('Failed to load user', err),
    });
  }

  loadTasks() {
    this.http.get<Task[]>(`${environment.apiUrl}/api/tasks`).subscribe({
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

    this.http
      .post<Task>(`${environment.apiUrl}/api/tasks`, {
        title,
        description: this.newDescription().trim(),
      })
      .subscribe({
        next: () => {
          this.newTitle.set('');
          this.newDescription.set('');
          this.error.set('');
          this.loadTasks();
        },
        error: () => this.error.set('Failed to create task'),
      });
  }

  deleteTask(id: number) {
    this.http.delete(`${environment.apiUrl}/api/tasks/${id}`).subscribe({
      next: () => this.loadTasks(),
      error: () => this.error.set('Failed to delete task'),
    });
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
      .put<Task>(`${environment.apiUrl}/api/tasks/${task.id}`, { completed: !task.completed })
      .subscribe({
        next: () => this.loadTasks(),
        error: (err) => console.error('Failed to update task', err),
      });
  }

  logout() {
    this.userMenuOpen.set(false);
    this.auth.logout();
    setTimeout(() => this.router.navigate(['/']), 500);
  }

  formatCreatedAt(iso: string): string {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  setFilter(f: FilterState) {
    this.filter.set(f);
  }

  confirmDelete(task: Task) {
    this.pendingDeleteId.set(task.id);
    this.pendingDeleteTitle.set(task.title);

    this.deleteTimeoutId = setTimeout(() => {
      this.deleteTask(task.id);
      this.pendingDeleteId.set(null);
    }, 4000);
  }

  undoDelete() {
    if (this.deleteTimeoutId) clearTimeout(this.deleteTimeoutId);
    this.pendingDeleteId.set(null);
  }

  toggleUserMenu() {
    this.userMenuOpen.update((open) => !open);
  }
}
