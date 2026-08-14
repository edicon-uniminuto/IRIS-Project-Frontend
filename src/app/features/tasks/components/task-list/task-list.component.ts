import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import type { Task, TaskCategory, TaskPriority, TaskSort, TaskStatusFilter } from '../../models/task.model';
import { TaskStore } from '../../services/task.store';

@Component({
  standalone: true,
  imports: [FormsModule, DragDropModule],
  providers: [TaskStore],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  readonly store = inject(TaskStore);
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  newTitle = '';
  newDueDate = '';
  newCategory: TaskCategory = 'other';
  newPriority: TaskPriority = 'medium';
  searchText = '';
  statusFilter: TaskStatusFilter = 'all';
  sort: TaskSort = 'manual';

  // Edit Modal State
  readonly editingTask = signal<Task | null>(null);
  editTitle = '';
  editCategory: TaskCategory = 'other';
  editPriority: TaskPriority = 'medium';
  editDueDate = '';

  // Permanent Delete Confirmation Modal State
  readonly taskToDeletePermanently = signal<Task | null>(null);

  readonly showAdvanced = signal(false);
  readonly showTrash = signal(false);
  readonly theme = signal<'light'|'dark'>((localStorage.getItem('iris-theme') as 'light'|'dark') || 'light');
  private searchTimer?: ReturnType<typeof setTimeout>;

  readonly currentUser = this.auth.user;

  ngOnInit() { this.applyTheme(); this.store.load(); }

  addTask() {
    const title = this.newTitle.trim();
    if (!title) return;
    const dueDate = this.toIsoDueDate(this.newDueDate);
    this.store.create({ title, dueDate, category: this.newCategory, priority: this.newPriority });
    this.newTitle = ''; this.newDueDate = ''; this.newCategory = 'other'; this.newPriority = 'medium';
  }

  onEnter(event: Event) { event.preventDefault(); this.addTask(); }
  toggle(task: Task) { this.store.update(task.id, { completed: !task.completed }); }
  remove(task: Task) { this.store.remove(task.id); }

  applyFilters() { this.store.applyFilters(this.statusFilter, this.searchText, this.sort); }
  onSearchChange() {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.applyFilters(), 300);
  }
  clearFilters() { this.statusFilter = 'all'; this.searchText = ''; this.sort = 'manual'; this.applyFilters(); }

  openEditModal(task: Task) {
    this.editingTask.set(task);
    this.editTitle = task.title;
    this.editCategory = task.category;
    this.editPriority = task.priority;
    this.editDueDate = this.fromIsoDueDate(task.dueDate);
  }

  closeEditModal() {
    this.editingTask.set(null);
  }

  saveEditModal() {
    const current = this.editingTask();
    if (!current) return;
    const title = this.editTitle.trim();
    if (!title) return;

    const dueDate = this.toIsoDueDate(this.editDueDate);
    this.store.update(current.id, {
      title,
      category: this.editCategory,
      priority: this.editPriority,
      dueDate
    });
    this.closeEditModal();
  }

  confirmPermanentDelete(task: Task) {
    this.taskToDeletePermanently.set(task);
  }

  cancelPermanentDelete() {
    this.taskToDeletePermanently.set(null);
  }

  executePermanentDelete() {
    const target = this.taskToDeletePermanently();
    if (target) {
      this.store.permanentDelete(target.id);
      this.taskToDeletePermanently.set(null);
    }
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (!this.dragEnabled || event.previousIndex === event.currentIndex) return;
    const items = [...this.store.tasks()];
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    this.store.reorder(items.map(t => t.id));
  }

  get dragEnabled() { return this.sort === 'manual' && this.statusFilter === 'all' && !this.searchText.trim(); }
  filterLabel() { return ({ all: 'Todas', completed: 'Completadas', pending: 'Pendientes' } as const)[this.statusFilter]; }
  categoryLabel(c: TaskCategory) { return ({ work:'Trabajo', personal:'Personal', study:'Estudio', other:'Otra' } as const)[c]; }
  priorityLabel(p: TaskPriority) { return ({ low:'Baja', medium:'Media', high:'Alta' } as const)[p]; }

  dueState(task: Task): 'overdue'|'soon'|'normal'|null {
    if (!task.dueDate || task.completed) return null;
    const dueMs = new Date(task.dueDate).getTime();
    const nowMs = Date.now();
    const ms = dueMs - nowMs;
    if (ms < 0) return 'overdue';
    if (ms <= 48 * 60 * 60 * 1000) return 'soon';
    return 'normal';
  }

  formatDate(value: string | null) {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeZone: 'UTC' }).format(date);
  }

  private toIsoDueDate(dateStr: string): string | null {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    const year = parseInt(parts[0]!, 10);
    const month = parseInt(parts[1]!, 10);
    const day = parseInt(parts[2]!, 10);
    if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
    return new Date(Date.UTC(year, month - 1, day, 12, 0, 0)).toISOString();
  }

  private fromIsoDueDate(isoStr: string | null): string {
    if (!isoStr) return '';
    const date = new Date(isoStr);
    if (isNaN(date.getTime())) return '';
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  toggleTrash() { this.showTrash.update(v => !v); if (this.showTrash()) this.store.loadTrash(); }
  toggleTheme() { this.theme.update(v => v === 'light' ? 'dark' : 'light'); localStorage.setItem('iris-theme', this.theme()); this.applyTheme(); }
  private applyTheme() { document.documentElement.dataset['theme'] = this.theme(); }
  logout() { this.auth.logout().subscribe({ next: () => void this.router.navigateByUrl('/login'), error: () => void this.router.navigateByUrl('/login') }); }
}
