import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom, map, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.generated';
import type { ApiResponse, AuthPayload, User } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly _accessToken = signal<string | null>(null);
  private readonly _user = signal<User | null>(null);
  private refreshPromise: Promise<string | null> | null = null;

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._user());
  get accessToken() { return this._accessToken(); }

  login(email: string, password: string) {
    return this.http.post<ApiResponse<AuthPayload>>(`${environment.apiBaseUrl}/auth/login`, { email, password }, { withCredentials: true })
      .pipe(tap(r => this.apply(r.data)));
  }

  register(email: string, password: string, name?: string) {
    return this.http.post<ApiResponse<AuthPayload>>(`${environment.apiBaseUrl}/auth/register`, { email, password, name }, { withCredentials: true })
      .pipe(tap(r => this.apply(r.data)));
  }

  async restoreSession(): Promise<boolean> {
    if (this.accessToken) return true;
    return !!(await this.refreshAccessToken());
  }

  refreshAccessToken(): Promise<string | null> {
    if (this.refreshPromise) return this.refreshPromise;
    this.refreshPromise = firstValueFrom(
      this.http.post<ApiResponse<AuthPayload>>(`${environment.apiBaseUrl}/auth/refresh`, {}, {
        withCredentials: true,
        headers: { 'X-Requested-With': 'XMLHttpRequest', 'X-Skip-Auth-Refresh': 'true' }
      }).pipe(map(r => { this.apply(r.data); return r.data.accessToken; }))
    ).catch(() => { this.clear(); return null; }).finally(() => this.refreshPromise = null);
    return this.refreshPromise;
  }

  logout() {
    return this.http.post<void>(`${environment.apiBaseUrl}/auth/logout`, {}, {
      withCredentials: true,
      headers: { 'X-Requested-With': 'XMLHttpRequest', 'X-Skip-Auth-Refresh': 'true' }
    }).pipe(tap(() => this.clear()));
  }

  private apply(payload: AuthPayload) {
    this._accessToken.set(payload.accessToken);
    this._user.set(payload.user);
  }

  private clear() {
    this._accessToken.set(null);
    this._user.set(null);
  }
}
