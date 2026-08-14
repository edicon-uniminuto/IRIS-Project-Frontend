import { Injectable, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { TaskService } from './task.service';
import type { CreateTask, Task, TaskSort, TaskStatusFilter, UpdateTask } from '../models/task.model';

@Injectable()
export class TaskStore {
  private readonly api = inject(TaskService);
  readonly tasks = signal<Task[]>([]);
  readonly trash = signal<Task[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly status = signal<TaskStatusFilter>('all');
  readonly search = signal('');
  readonly sort = signal<TaskSort>('manual');
  readonly page = signal(1);
  readonly pageSize = signal(5);
  readonly total = signal(0);
  readonly totalPages = signal(1);
  readonly pendingCount = signal(0);
  readonly completedCount = signal(0);

  load() {
    this.loading.set(true); this.error.set('');
    this.api.list(this.status(), this.page(), this.pageSize(), this.search(), this.sort())
      .pipe(finalize(() => this.loading.set(false))).subscribe({
        next: data => {
          this.tasks.set(data.items);
          this.total.set(data.total);
          this.totalPages.set(data.totalPages);
          if (typeof data.pendingCount === 'number') this.pendingCount.set(data.pendingCount);
          if (typeof data.completedCount === 'number') this.completedCount.set(data.completedCount);
        },
        error: err => this.error.set(err?.error?.error?.message ?? 'No fue posible cargar las tareas.')
      });
    this.loadTrash();
  }

  create(data: CreateTask) {
    if (this.saving()) return;
    this.saving.set(true); this.error.set('');
    this.api.create(data).pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.page.set(1);
        this.load();
      },
      error: e => this.handle(e)
    });
  }

  update(id: string, data: UpdateTask) {
    const currentTask = this.tasks().find(t => t.id === id);
    const currentList = this.tasks();

    if (currentTask && typeof data.completed === 'boolean' && data.completed !== currentTask.completed) {
      if (data.completed) {
        this.pendingCount.update(v => Math.max(0, v - 1));
        this.completedCount.update(v => v + 1);
      } else {
        this.completedCount.update(v => Math.max(0, v - 1));
        this.pendingCount.update(v => v + 1);
      }
    }

    this.tasks.update(items => items.map(t => t.id === id ? { ...t, ...data } as Task : t));
    this.api.update(id, data).subscribe({
      next: updated => this.tasks.update(items => items.map(t => t.id === id ? updated : t)),
      error: e => { this.tasks.set(currentList); this.handle(e); }
    });
  }

  remove(id: string) {
    const target = this.tasks().find(t => t.id === id);
    const currentList = this.tasks();

    if (target) {
      if (target.completed) this.completedCount.update(v => Math.max(0, v - 1));
      else this.pendingCount.update(v => Math.max(0, v - 1));
    }

    this.tasks.update(items => items.filter(t => t.id !== id));
    this.api.remove(id).subscribe({
      next: () => {
        this.total.update(v => Math.max(0, v - 1));
        this.loadTrash();
        if (this.tasks().length === 0 && this.page() > 1) {
          this.page.update(p => Math.max(1, p - 1));
          this.load();
        }
      },
      error: e => { this.tasks.set(currentList); this.handle(e); }
    });
  }

  loadTrash() { this.api.trash().subscribe({ next: data => this.trash.set(data.items), error: e => this.handle(e) }); }
  restore(id: string) { this.api.restore(id).subscribe({ next: () => { this.loadTrash(); this.load(); }, error: e => this.handle(e) }); }
  permanentDelete(id: string) { this.api.permanentDelete(id).subscribe({ next: () => this.loadTrash(), error: e => this.handle(e) }); }

  reorder(taskIds: string[]) {
    const byId = new Map(this.tasks().map(t => [t.id, t]));
    this.tasks.set(taskIds.map(id => byId.get(id)!).filter(Boolean));
    this.api.reorder(taskIds).subscribe({ error: e => { this.handle(e); this.load(); } });
  }

  applyFilters(status: TaskStatusFilter, search: string, sort: TaskSort) {
    this.status.set(status); this.search.set(search); this.sort.set(sort); this.page.set(1); this.load();
  }
  goToPage(page: number) { this.page.set(Math.min(Math.max(page, 1), this.totalPages())); this.load(); }
  private handle(err: any) { this.error.set(err?.error?.error?.message ?? 'No fue posible completar la operación.'); }
}
