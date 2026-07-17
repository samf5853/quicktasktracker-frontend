import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {
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

  onNavMove(e: MouseEvent) {
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const line = el.querySelector('.nav-glow-line') as HTMLElement;
    line.style.setProperty('--x', `${x}%`);
  }

  onNavLeave(e: MouseEvent) {
    const el = e.currentTarget as HTMLElement;
    const line = el.querySelector('.nav-glow-line') as HTMLElement;
    line.style.setProperty('--x', '50%');
  }
}
