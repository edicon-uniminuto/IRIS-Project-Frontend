import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { TaskService } from '../../services/task.service';
import { TaskListComponent } from './task-list.component';

const task = {
  id: '507f191e810c19729de860ea',
  title: 'Preparar entrevista',
  completed: false,
  dueDate: new Date(Date.now() - 86400000).toISOString(),
  category: 'study' as const,
  priority: 'high' as const,
  position: 0,
  deletedAt: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

class MockTaskService {
  list = vi.fn().mockReturnValue(of({ items: [task], page: 1, pageSize: 5, total: 1, totalPages: 1 }));
  create = vi.fn().mockReturnValue(of(task));
  update = vi.fn().mockReturnValue(of({ ...task, completed: true }));
  remove = vi.fn().mockReturnValue(of(void 0));
  trash = vi.fn().mockReturnValue(of({ items: [task], page: 1, pageSize: 5, total: 1, totalPages: 1 }));
  restore = vi.fn().mockReturnValue(of(task));
  permanentDelete = vi.fn().mockReturnValue(of(void 0));
  reorder = vi.fn().mockReturnValue(of(void 0));
}

describe('TaskListComponent', () => {
  let fixture: ComponentFixture<TaskListComponent>;
  let component: TaskListComponent;
  let api: MockTaskService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [provideHttpClient(), provideRouter([]), { provide: TaskService, useClass: MockTaskService }]
    }).compileComponents();
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    api = TestBed.inject(TaskService) as unknown as MockTaskService;
    fixture.detectChanges();
  });

  it('renders initial tasks', () => {
    expect(fixture.nativeElement.textContent).toContain('Preparar entrevista');
  });

  it('adds a non-empty task with enter key and advanced details', () => {
    component.newTitle = '  Nueva tarea  ';
    component.newDueDate = '2026-12-31';
    component.newCategory = 'work';
    component.newPriority = 'high';

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    component.onEnter(enterEvent);

    expect(api.create).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Nueva tarea',
      category: 'work',
      priority: 'high'
    }));
    expect(component.newTitle).toBe('');
  });

  it('does not add whitespace-only task', () => {
    component.newTitle = '   ';
    component.addTask();
    expect(api.create).not.toHaveBeenCalled();
  });

  it('opens edit modal and saves full task modifications', () => {
    component.openEditModal(task);
    expect(component.editingTask()?.id).toBe(task.id);

    component.editTitle = 'Preparar entrevista Senior';
    component.editCategory = 'work';
    component.editPriority = 'high';
    component.editDueDate = '2026-12-31';

    component.saveEditModal();

    expect(api.update).toHaveBeenCalledWith(task.id, expect.objectContaining({
      title: 'Preparar entrevista Senior',
      category: 'work',
      priority: 'high'
    }));
    expect(component.editingTask()).toBeNull();
  });

  it('closes edit modal without saving', () => {
    component.openEditModal(task);
    component.editTitle = 'Cambio no guardado';
    component.closeEditModal();
    expect(component.editingTask()).toBeNull();
  });

  it('handles permanent delete confirmation flow', () => {
    component.confirmPermanentDelete(task);
    expect(component.taskToDeletePermanently()?.id).toBe(task.id);

    component.cancelPermanentDelete();
    expect(component.taskToDeletePermanently()).toBeNull();

    component.confirmPermanentDelete(task);
    component.executePermanentDelete();
    expect(api.permanentDelete).toHaveBeenCalledWith(task.id);
    expect(component.taskToDeletePermanently()).toBeNull();
  });

  it('marks task as completed', () => {
    component.toggle(task);
    expect(api.update).toHaveBeenCalledWith(task.id, { completed: true });
  });

  it('deletes a task', () => {
    component.remove(task);
    expect(api.remove).toHaveBeenCalledWith(task.id);
  });

  it('applies filter, search debounce and clear controls', async () => {
    component.statusFilter = 'pending';
    component.searchText = 'entrevista';
    component.applyFilters();
    expect(api.list).toHaveBeenLastCalledWith('pending', 1, 5, 'entrevista', 'manual');

    component.onSearchChange();
    await new Promise(r => setTimeout(r, 350));

    component.clearFilters();
    expect(component.statusFilter).toBe('all');
    expect(component.searchText).toBe('');
  });

  it('toggles dark and light theme and persists in localStorage', () => {
    component.toggleTheme();
    expect(component.theme()).toBe('dark');
    expect(localStorage.getItem('iris-theme')).toBe('dark');

    component.toggleTheme();
    expect(component.theme()).toBe('light');
  });

  it('calculates due date states accurately', () => {
    expect(component.dueState(task)).toBe('overdue');

    const soonTask = { ...task, dueDate: new Date(Date.now() + 36000000).toISOString() };
    expect(component.dueState(soonTask)).toBe('soon');

    const normalTask = { ...task, dueDate: new Date(Date.now() + 500000000).toISOString() };
    expect(component.dueState(normalTask)).toBe('normal');

    const completedTask = { ...task, completed: true };
    expect(component.dueState(completedTask)).toBeNull();

    expect(component.formatDate(task.dueDate)).toBeTruthy();
    expect(component.formatDate(null)).toBe('');
  });

  it('toggles trash view, restores and permanently deletes items', () => {
    component.toggleTrash();
    expect(component.showTrash()).toBe(true);

    component.store.restore('t-1');
    expect(api.restore).toHaveBeenCalledWith('t-1');

    component.store.permanentDelete('t-1');
    expect(api.permanentDelete).toHaveBeenCalledWith('t-1');

    component.toggleTrash();
    expect(component.showTrash()).toBe(false);
  });

  it('handles drag drop event when enabled', () => {
    expect(component.dragEnabled).toBe(true);
    const dropEvent: any = { previousIndex: 0, currentIndex: 0 };
    component.drop(dropEvent);
    expect(api.reorder).not.toHaveBeenCalled();
  });

  it('shows empty state when no tasks match', () => {
    api.list.mockReturnValueOnce(of({ items: [], page: 1, pageSize: 5, total: 0, totalPages: 1 }));
    component.store.load();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No hay tareas para mostrar');
  });

  it('shows backend error message', () => {
    api.list.mockReturnValueOnce(throwError(() => ({ error: { error: { message: 'Servicio no disponible' } } })));
    component.store.load();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Servicio no disponible');
  });

  it('handles logout action', () => {
    component.logout();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
