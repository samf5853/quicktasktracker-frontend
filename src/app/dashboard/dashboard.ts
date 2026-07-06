import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})


export class Dashboard {
  private x = signal(50);
  private y = signal(50);

  cardGlow = () =>
    `radial-gradient(300px circle at ${this.x()}% ${this.y()}%, rgba(139,92,246,0.6), rgba(38,38,38,1) 40%)`;

  onCardMove(e: MouseEvent) {
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    this.x.set(((e.clientX - rect.left) / rect.width) * 100);
    this.y.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  onCardLeave(){
    this.x.set(50);
    this.y.set(50);
  }
}
