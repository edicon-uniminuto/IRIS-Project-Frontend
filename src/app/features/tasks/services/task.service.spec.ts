import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { TaskService } from './task.service';
import { environment } from '../../../../environments/environment.generated';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  const mockTask = {
    id: 'task-1', title: 'Test Task', completed: false, dueDate: null, category: 'work' as const, priority: 'high' as const, position: 0, deletedAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('lists tasks with status, page, sort and search query params', () => {
    service.list('pending', 1, 20, 'prueba', 'priority').subscribe(res => {
      expect(res.items).toEqual([mockTask]);
    });

    const req = httpMock.expectOne(r => r.url === `${environment.apiBaseUrl}/tasks` && r.params.get('status') === 'pending' && r.params.get('search') === 'prueba');
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: { items: [mockTask], total: 1, page: 1, pageSize: 20, totalPages: 1 } });
  });

  it('creates a new task', () => {
    service.create({ title: 'New Task', category: 'study', priority: 'medium', dueDate: null }).subscribe(res => {
      expect(res).toEqual(mockTask);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/tasks`);
    expect(req.request.method).toBe('POST');
    req.flush({ success: true, data: mockTask });
  });

  it('updates task', () => {
    service.update('task-1', { completed: true }).subscribe(res => {
      expect(res.completed).toBe(true);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/tasks/task-1`);
    expect(req.request.method).toBe('PATCH');
    req.flush({ success: true, data: { ...mockTask, completed: true } });
  });

  it('removes, restores and permanently deletes tasks', () => {
    service.remove('task-1').subscribe();
    httpMock.expectOne(`${environment.apiBaseUrl}/tasks/task-1`).flush(null);

    service.restore('task-1').subscribe();
    httpMock.expectOne(`${environment.apiBaseUrl}/tasks/task-1/restore`).flush({ success: true, data: mockTask });

    service.permanentDelete('task-1').subscribe();
    httpMock.expectOne(`${environment.apiBaseUrl}/tasks/task-1/permanent`).flush(null);
  });

  it('reorders task list', () => {
    service.reorder(['task-2', 'task-1']).subscribe();
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/tasks/reorder`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ taskIds: ['task-2', 'task-1'] });
    req.flush(null);
  });
});
