import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment.generated';
import type { ApiResponse } from '../../auth/models/auth.models';
import type { CreateTask, PagedTasks, Task, TaskSort, TaskStatusFilter, UpdateTask } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/tasks`;

  list(status: TaskStatusFilter, page: number, pageSize: number, search: string, sort: TaskSort) {
    let params = new HttpParams().set('status', status).set('page', page).set('pageSize', pageSize).set('sort', sort);
    if (search.trim()) params = params.set('search', search.trim());
    return this.http.get<ApiResponse<PagedTasks>>(this.base, { params }).pipe(map(r => r.data));
  }
  trash(page = 1, pageSize = 50) { return this.http.get<ApiResponse<PagedTasks>>(`${this.base}/trash`, { params: { page, pageSize, status: 'all', sort: 'newest' } }).pipe(map(r => r.data)); }
  create(data: CreateTask) { return this.http.post<ApiResponse<Task>>(this.base, data).pipe(map(r => r.data)); }
  update(id: string, data: UpdateTask) { return this.http.patch<ApiResponse<Task>>(`${this.base}/${id}`, data).pipe(map(r => r.data)); }
  remove(id: string) { return this.http.delete<void>(`${this.base}/${id}`); }
  restore(id: string) { return this.http.post<ApiResponse<Task>>(`${this.base}/${id}/restore`, {}).pipe(map(r => r.data)); }
  permanentDelete(id: string) { return this.http.delete<void>(`${this.base}/${id}/permanent`); }
  reorder(taskIds: string[]) { return this.http.patch<void>(`${this.base}/reorder`, { taskIds }); }
}
