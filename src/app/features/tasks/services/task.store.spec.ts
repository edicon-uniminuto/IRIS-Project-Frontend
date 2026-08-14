import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { TaskStore } from './task.store';
import { TaskService } from './task.service';

describe('TaskStore', () => {
  let store: TaskStore;
  let api: {
    list: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
    trash: ReturnType<typeof vi.fn>;
    restore: ReturnType<typeof vi.fn>;
    permanentDelete: ReturnType<typeof vi.fn>;
    reorder: ReturnType<typeof vi.fn>;
  };

  const mockTask = {
    id: 't-1', title: 'Task 1', completed: false, dueDate: null, category: 'work' as const, priority: 'medium' as const, position: 0, deletedAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  };

  beforeEach(() => {
    api = {
      list: vi.fn().mockReturnValue(of({ items: [mockTask], total: 1, page: 1, pageSize: 5, totalPages: 1, pendingCount: 1, completedCount: 0 })),
      create: vi.fn().mockReturnValue(of(mockTask)),
      update: vi.fn().mockReturnValue(of({ ...mockTask, completed: true })),
      remove: vi.fn().mockReturnValue(of(void 0)),
      trash: vi.fn().mockReturnValue(of({ items: [mockTask], total: 1, page: 1, pageSize: 5, totalPages: 1 })),
      restore: vi.fn().mockReturnValue(of(mockTask)),
      permanentDelete: vi.fn().mockReturnValue(of(void 0)),
      reorder: vi.fn().mockReturnValue(of(void 0))
    };

    TestBed.configureTestingModule({
      providers: [TaskStore, { provide: TaskService, useValue: api }]
    });

    store = TestBed.inject(TaskStore);
  });

  it('loads tasks and updates counters', () => {
    store.load();
    expect(store.tasks()).toEqual([mockTask]);
    expect(store.total()).toBe(1);
    expect(store.pendingCount()).toBe(1);
    expect(store.completedCount()).toBe(0);
  });

  it('creates a task and reloads list', () => {
    store.create({ title: 'New', category: 'work', priority: 'low', dueDate: null });
    expect(api.create).toHaveBeenCalled();
    expect(api.list).toHaveBeenCalled();
  });

  it('optimistically updates task and handles failure rollback', () => {
    store.tasks.set([mockTask]);
    api.update.mockReturnValueOnce(throwError(() => ({ error: { error: { message: 'Update failed' } } })));

    store.update('t-1', { title: 'Changed' });

    expect(store.error()).toBe('Update failed');
    expect(store.tasks()[0]?.title).toBe('Task 1');
  });

  it('removes task and handles pagination navigation', () => {
    store.tasks.set([mockTask]);
    store.remove('t-1');
    expect(store.tasks()).toEqual([]);

    store.goToPage(2);
    expect(api.list).toHaveBeenCalled();
  });

  it('loads, restores and permanently deletes trash items', () => {
    store.loadTrash();
    expect(store.trash()).toEqual([mockTask]);

    store.restore('t-1');
    expect(api.restore).toHaveBeenCalledWith('t-1');

    store.permanentDelete('t-1');
    expect(api.permanentDelete).toHaveBeenCalledWith('t-1');
  });

  it('reorders tasks locally and triggers API', () => {
    store.tasks.set([mockTask]);
    store.reorder(['t-1']);
    expect(api.reorder).toHaveBeenCalledWith(['t-1']);
  });
});
