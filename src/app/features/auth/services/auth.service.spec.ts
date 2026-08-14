import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { AuthService } from './auth.service';
import { environment } from '../../../../environments/environment.generated';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockPayload = {
    accessToken: 'test-token',
    user: { id: 'user-1', email: 'test@example.com' }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('starts unauthenticated with null token', () => {
    expect(service.user()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.accessToken).toBeNull();
  });

  it('logs in successfully and applies user session', () => {
    service.login('test@example.com', 'Password123!').subscribe(res => {
      expect(res.data).toEqual(mockPayload);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBe(true);
    req.flush({ success: true, data: mockPayload });

    expect(service.user()).toEqual(mockPayload.user);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.accessToken).toBe('test-token');
  });

  it('registers successfully and applies session', () => {
    service.register('test@example.com', 'Password123!').subscribe(res => {
      expect(res.data).toEqual(mockPayload);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    req.flush({ success: true, data: mockPayload });

    expect(service.isAuthenticated()).toBe(true);
  });

  it('restores session when access token exists', async () => {
    service.login('test@example.com', 'Password123!').subscribe();
    httpMock.expectOne(`${environment.apiBaseUrl}/auth/login`).flush({ success: true, data: mockPayload });

    const restored = await service.restoreSession();
    expect(restored).toBe(true);
  });

  it('refreshes access token successfully', async () => {
    const promise = service.refreshAccessToken();
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/refresh`);
    expect(req.request.headers.get('X-Requested-With')).toBe('XMLHttpRequest');
    req.flush({ success: true, data: mockPayload });

    const token = await promise;
    expect(token).toBe('test-token');
    expect(service.accessToken).toBe('test-token');
  });

  it('handles refresh failure by clearing session', async () => {
    const promise = service.refreshAccessToken();
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/refresh`);
    req.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    const token = await promise;
    expect(token).toBeNull();
    expect(service.user()).toBeNull();
  });

  it('logs out and clears session state', () => {
    service.logout().subscribe();
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/logout`);
    req.flush(null);

    expect(service.user()).toBeNull();
    expect(service.accessToken).toBeNull();
  });
});
